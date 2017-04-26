import sqlstr from '../../common/sqlStr'
import getStockPrice from '../../getSinaData/getPrice'
import singleton from '../../common/singleton'
import deal from '../../PaperTrade/deal'
module.exports = function({ mainDB, mqChannel, ctt, express, config, wrap, redisClient }) {
    function createAccount(data) {
        return mainDB.query(...sqlstr.insert2("wf_street_practice_account", data, { CreateTime: "now()" }))
    }

    function getAccount(AccountNo) {
        return mainDB.query("select * from wf_street_practice_account where AccountNo=:AccountNo", { replacements: { AccountNo } })
    }
    mqChannel.assertQueue('paperTrade');
    const router = express.Router();
    /**创建订单 */
    router.post('/Orders', ctt, wrap(async({ memberCode, body }, res) => {
        let { AccountNo, OrdType, Side, OrderQty, Price, SecuritiesType, SecuritiesNo } = body
        if (OrdType != 1 && OrdType != 2 && OrdType != 3) { //1市价单、2限价单、3止损单
            return res.send({ Status: -2, Explain: "OrdType 必须是1、2、3 而当前值为：" + OrdType })
        }
        if (Side != "S" && Side != "B") {
            return res.send({ Status: -2, Explain: "Side 必须是S、B 而当前值为：" + Side })
        }
        if (OrdType == 1 && !await singleton.marketIsOpen(SecuritiesType)) {
            return res.send({ Status: 44003, Explain: "未开盘：" + SecuritiesType })
        }
        let [account] = await getAccount(AccountNo)
        if (account.length == 0) {
            await createAccount({ AccountNo, memberCode, TranAmount: config.practiceInitFun, Cash: config.practiceInitFun });
            ([account] = await getAccount(AccountNo));
        }
        account = account[0]
        if (account.Status != 1) {
            res.send({ Status: 44002, Explain: "账号已停用" })
            return
        }
        let [postions] = await mainDB.query("select * from wf_street_practice_positions  where AccountNo=:AccountNo and SecuritiesType=:SecuritiesType and SecuritiesNo=:SecuritiesNo", { replacements: { AccountNo, SecuritiesType, SecuritiesNo } })
        let Positions = postions.length ? postions[0].Positions : 0
        if (Side == "S" && Positions < OrderQty) {
            res.send({ Status: 44004, Explain: "持仓不足:" + Positions + "<" + OrderQty })
            return
        }
        let sinaName = config.getQueryName(body)
        let [, , , , lastPrice] = await singleton.getLastPrice(sinaName)
        if (!lastPrice) {
            res.send({ Status: -1, Explain: lastPrice })
            return
        }
        let Commission = Math.max(account.CommissionRate * OrderQty, account.CommissionLimit) //佣金
        let p = OrdType == 1 ? lastPrice : Price
        let delta = Side == "B" ? -Commission - p * OrderQty : p * OrderQty - Commission
        body.MemberCode = memberCode
        if (account.Cash + delta < 0) {
            res.send({ Status: 44001, Explain: "资金不足" })
            return
        }
        if (OrdType != 1) {
            if (Side == (OrdType == 2 ? "B" : "S") ? (Price > lastPrice) : (Price < lastPrice)) {
                res.send({ Status: 44005, Explain: "价格设置不正确" })
                return
            }
        }
        let [result] = await mainDB.query(...sqlstr.insert2("wf_street_practice_order", Object.assign({ execType: 0 }, body), { CreateTime: "now()" }))
        body.Id = result.insertId;
        body.CommissionLimit = account.CommissionLimit
        body.CommissionRate = account.CommissionRate
        mqChannel.sendToQueue("paperTrade", new Buffer(JSON.stringify({ cmd: "create", data: body })))
        res.send({ Status: 0, Explain: "ok" })
    }));
    /**订单状态 */
    router.get('/Orders/:orderID', ctt, wrap(async({ memberCode, params: { orderID } }, res) => {
        let [result] = await mainDB.query("select * from wf_street_practice_order where Id:orderID and MemberCode=:memberCode", { replacements: { memberCode, orderID } })
        if (result.length) {
            res.send({ Status: 0, Explain: "", Data: result[0] });
        } else
            res.send({ Status: -1, Explain: "该订单不存在" });
    }));
    /**取消订单 */
    router.delete('/Orders/:orderID', ctt, wrap(async({ memberCode, params: { orderID } }, res) => {
        let [result] = await mainDB.query("update wf_street_practice_order(execType) set(2) where Id:orderID and MemberCode=:memberCode", { replacements: { memberCode, orderID } })
        if (result.length) {
            res.send({ Status: 0, Explain: result });
            mqChannel.sendToQueue("paperTrade", new Buffer(JSON.stringify({ cmd: "cancel", data: orderID })))
        } else
            res.send({ Status: -1, Explain: "该订单不存在" });
    }));
    /**持仓 */
    router.get('/Position', ctt, wrap(async({ memberCode }, res) => {
        let [result] = await mainDB.query("select * from wf_street_practice_positions where MemberCode=:memberCode", { replacements: { memberCode } })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    /**今日委托 */
    router.get('/TodayOrders', ctt, wrap(async({ memberCode }, res) => {
        let [result] = await mainDB.query("select * from wf_street_practice_order where MemberCode=:memberCode and substr(CreateTime,1,10)=CurDate()", { replacements: { memberCode } })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    /**今日成交 */
    router.get('/TodayDeals', ctt, wrap(async({ memberCode }, res) => {
        let [result] = await mainDB.query("select * from wf_street_practice_order where MemberCode=:memberCode and substr(TurnoverTime,1,10)=CurDate() and execType=1", { replacements: { memberCode } })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    /**历史委托 */
    router.get('/Orders/:startDate/:endDate', ctt, wrap(async({ memberCode, params: { startDate, endDate } }, res) => {
        let [result] = await mainDB.query("select * from wf_street_practice_order where MemberCode=:memberCode and CreateTime>=startDate and CreateTime<=endDate and execType=1", { replacements: { memberCode, startDate, endDate } })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    /**历史成交 */
    router.get('/Deals/:startDate/:endDate', ctt, wrap(async({ memberCode, params: { startDate, endDate } }, res) => {
        let [result] = await mainDB.query("select * from wf_street_practice_order where MemberCode=:memberCode and TurnoverTime>=startDate and TurnoverTime<=endDate and execType=1", { replacements: { memberCode, startDate, endDate } })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    /**我的账户详情 */
    router.get('/Account', ctt, wrap(async({ memberCode }, res) => {
        let [result] = await mainDB.query("select * from wf_street_practice_account where MemberCode=:memberCode", { replacements: { memberCode } })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    return router
}