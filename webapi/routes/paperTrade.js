import sqlstr from '../../common/sqlStr'
import getStockPrice from '../../getSinaData/getPrice'
import singleton from '../../common/singleton'
import deal from '../../paperTrade/deal'

function ConvertAccountNo(req, res, next) {
    let { query: { AccountNo } } = req
    if (AccountNo) AccountNo = "and AccountNo='" + AccountNo + "'"
    else AccountNo = ""
    req.AccountNo = AccountNo
    next()
}
module.exports = function({ mainDB, mqChannel, ctt, express, config, wrap, redisClient }) {
    function createAccount(data) {
        return mainDB.query(...sqlstr.insert2("wf_street_practice_account", data, { CreateTime: "now()" }))
    }

    function getAccount(AccountNo) {
        return singleton.selectMainDB0("wf_street_practice_account", { AccountNo })
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
        let account = await getAccount(AccountNo)
        if (singleton.isEMPTY(account)) {
            await createAccount({ AccountNo, memberCode, TranAmount: config.practiceInitFun, Cash: config.practiceInitFun });
            account = await getAccount(AccountNo);
        }
        if (account.Status != 1) {
            res.send({ Status: 44002, Explain: "账号已停用" })
            return
        }
        let { Positions = 0 } = await singleton.selectMainDB0("wf_street_practice_positions", { AccountNo, SecuritiesType, SecuritiesNo })
        if (Side == "S" && Positions < OrderQty) {
            res.send({ Status: 44004, Explain: "持仓不足:" + Positions + "<" + OrderQty })
            return
        }
        let sinaName = config.getQueryName(body)
        let [, , , , lastPrice] = await singleton.getLastPrice(sinaName);
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
            if (Side == "BS" [OrdType - 2] ? (Price > lastPrice) : (Price < lastPrice)) {
                res.send({ Status: 44005, Explain: "价格设置不正确" })
                return
            }
        }
        let EndTime = new Date()
        let [usResult] = await mainDB.query("select * from wf_system_opendate_bak where Type='us' and DealDate=CurDate()");
        if (usResult.length) {
            let [{ EndTimePM, id }] = usResult
            EndTimePM = new Date(EndTimePM)
            if (EndTime < EndTimePM) {
                EndTime = EndTimePM
            } else {
                id++
                ({ EndTimePM } = await singleton.selectMainDB0("wf_system_opendate_bak", { id }, { Type: "'us'" }));
                EndTime = new Date(EndTimePM)
            }
        } else {
            usResult = await mainDB.query("select * from wf_system_opendate_bak where Type='us' and DealDate>now() order by Id desc limit 1")
            EndTime = new Date(usResult[0][0].EndTimePM)
        }

        let { insertId } = await singleton.insertMainDB("wf_street_practice_order", Object.assign({ execType: 0, EndTime }, body), { CreateTime: "now()" })
        body.Id = insertId;
        body.CommissionLimit = account.CommissionLimit;
        body.CommissionRate = account.CommissionRate;
        mqChannel.sendToQueue("paperTrade", new Buffer(JSON.stringify({ cmd: "create", data: body })));
        res.send({ Status: 0, Explain: "ok" })
    }));
    /**订单状态 */
    router.get('/Orders/:orderID', ctt, wrap(async({ memberCode, params: { orderID } }, res) => {
        let [result] = await mainDB.query("select * from wf_street_practice_order where Id=:orderID and MemberCode=:memberCode", { replacements: { memberCode, orderID } })
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
    router.get('/Position', ctt, wrap(async({ memberCode: MemberCode }, res) => {
        let result = await singleton.selectMainDB("wf_street_practice_positions", { MemberCode })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    /**某个账号的持仓 */
    router.get('/Position/:AccountNo', ctt, wrap(async({ memberCode: MemberCode, params: { AccountNo } }, res) => {
        let Positions = await singleton.selectMainDB("wf_street_practice_positions", { MemberCode, AccountNo })
        let TotalProfit = 0
        for (let p of Positions) {
            p.LastPrice = (await singleton.getLastPrice(config.getQueryName(p)))[4]
            p.Profit = (p.LastPrice - p.CostPrice) * p.Positions
            TotalProfit += p.Profit
        }
        res.send({ Status: 0, Explain: "", Positions, TotalProfit });
    }));
    /**今日委托 */
    router.get('/TodayOrders', ctt, ConvertAccountNo, wrap(async({ memberCode, AccountNo }, res) => {
        let [result] = await mainDB.query(`select * from wf_street_practice_order where MemberCode=:memberCode ${AccountNo} and substr(CreateTime,1,10)=CurDate()`, { replacements: { memberCode } })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    /**今日成交 */
    router.get('/TodayDeals', ctt, ConvertAccountNo, wrap(async({ memberCode, AccountNo }, res) => {
        let [result] = await mainDB.query(`select * from wf_street_practice_order where MemberCode=:memberCode ${AccountNo} and substr(TurnoverTime,1,10)=CurDate() and execType=1`, { replacements: { memberCode } })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    /**历史委托 */
    router.get('/Orders/:startDate/:endDate', ctt, ConvertAccountNo, wrap(async({ memberCode, params: { startDate, endDate }, AccountNo }, res) => {
        let [result] = await mainDB.query(`select * from wf_street_practice_order where MemberCode=:memberCode ${AccountNo} and CreateTime>=startDate and CreateTime<=endDate and execType=1`, { replacements: { memberCode, startDate, endDate } })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    /**历史成交 */
    router.get('/Deals/:startDate/:endDate', ctt, ConvertAccountNo, wrap(async({ memberCode, params: { startDate, endDate }, AccountNo }, res) => {
        let [result] = await mainDB.query(`select * from wf_street_practice_order where MemberCode=:memberCode ${AccountNo} and TurnoverTime>=startDate and TurnoverTime<=endDate and execType=1`, { replacements: { memberCode, startDate, endDate } })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    /**我的账户详情 */
    router.get('/Account', ctt, ConvertAccountNo, wrap(async({ memberCode, AccountNo }, res) => {
        let [result] = await mainDB.query(`select * from wf_street_practice_account where MemberCode=:memberCode ${AccountNo}`, { replacements: { memberCode } })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    return router
}