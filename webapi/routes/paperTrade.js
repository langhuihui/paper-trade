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
        let Type = ((OrdType - 1) / 3 >> 0) + 1 //1，2，3=>1做多；4，5，6=>2做空
        if (OrdType < 1 || OrdType > 6) { //1市价单、2限价单、3止损单
            return res.send({ Status: -2, Explain: "OrdType 必须是1~6 而当前值为：" + OrdType })
        }
        if (Side != "S" && Side != "B") {
            return res.send({ Status: -2, Explain: "Side 必须是S、B 而当前值为：" + Side })
        }
        if ((OrdType == 1 || OrdType == 4) && !await singleton.marketIsOpen(SecuritiesType)) {
            return res.send({ Status: 44003, Explain: "未开盘：" + SecuritiesType })
        }
        let account = await getAccount(AccountNo)
        if (singleton.isEMPTY(account)) {
            await createAccount({ AccountNo, memberCode, TranAmount: config.practiceInitFun, Cash: config.practiceInitFun, UsableCash: config.practiceInitFun });
            account = await getAccount(AccountNo);
        }
        if (account.Status != 1) {
            return res.send({ Status: 44002, Explain: "账号已停用" })
        }
        let { Positions = 0, TradAble = 0, Id: PositionsId } = await singleton.selectMainDB0("wf_street_practice_positions", { AccountNo, SecuritiesType, SecuritiesNo, Type: ((OrdType - 1) / 3 >> 0) + 1 })
        if (Side == "SB" [Type - 1] && TradAble < OrderQty) {
            return res.send({ Status: 44004, Explain: "可交易仓位不足:" + TradAble + "<" + OrderQty })
        }
        let sinaName = config.getQueryName(body)
        let [, , , lastPrice] = await singleton.getLastPrice(sinaName);
        if (!lastPrice) {
            res.send({ Status: -1, Explain: lastPrice })
            return
        }
        let Commission = Math.max(account.CommissionRate * OrderQty, account.CommissionLimit) //佣金
        let p = (OrdType == 1 || OrdType == 4) ? lastPrice : Price
        let delta = OrdType < 4 ? (Side == "B" ? -Commission - p * OrderQty : p * OrderQty - Commission) : -Commission
        body.MemberCode = memberCode
        if (OrdType > 3) {
            if (Side == "S" && account.UsableCash + delta - p * OrderQty < 0) {
                res.send({ Status: 44001, Explain: "资金不足" })
                return
            }
        } else if (account.UsableCash + delta < 0) {
            res.send({ Status: 44001, Explain: "资金不足" })
            return
        }
        if (OrdType == 2 || OrdType == 3) {
            if (Side == "BS" [OrdType - 2] ? (Price > lastPrice) : (Price < lastPrice)) {
                res.send({ Status: 44005, Explain: "价格设置不正确" })
                return
            }
        } else if (OrdType == 5 || OrdType == 6) {
            if (Side == "BS" [6 - OrdType] ? (Price > lastPrice) : (Price < lastPrice)) {
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
        let result = await singleton.transaction(async transaction => {
            let { insertId } = await singleton.insertMainDB("wf_street_practice_order", Object.assign({ execType: 0, EndTime, Amount: delta, CPrice: Price }, body), { CreateTime: "now()" }, transaction)
            Object.assign(body, { Id: insertId, EndTime, Amount: delta })
            if (Side == "SB" [Type - 1]) {
                TradAble -= OrderQty //修改可交易仓位
                await singleton.updateMainDB("wf_street_practice_positions", { TradAble }, null, { Id: PositionsId }, transaction)
            } else {
                await singleton.updateMainDB("wf_street_practice_account", { UsableCash: account.UsableCash - delta }, null, { Id: account.Id }, transaction)
            }
        })
        if (result != 0) {
            return res.send({ Status: 500, Explain: result })
        }
        body.CommissionLimit = account.CommissionLimit;
        body.CommissionRate = account.CommissionRate;
        mqChannel.sendToQueue("paperTrade", new Buffer(JSON.stringify({ cmd: "create", data: body })));
        res.send({ Status: 0, Explain: "ok" })
    }));
    /**订单状态 */
    router.get('/Orders/:orderID', ctt, wrap(async({ memberCode, params: { orderID } }, res) => {
        orderID = Number(orderID)
        let [result] = await mainDB.query("select * from wf_street_practice_order where Id=:orderID and MemberCode=:memberCode", { replacements: { memberCode, orderID } })
        if (result.length) {
            res.send({ Status: 0, Explain: "", Data: result[0] });
        } else
            res.send({ Status: -1, Explain: "该订单不存在" });
    }));
    /**取消订单 */
    router.delete('/Orders/:orderID', ctt, wrap(async({ memberCode, params: { orderID } }, res) => {
        orderID = Number(orderID)
        let order = await singleton.selectMainDB0("wf_street_practice_order", { Id: orderID }, { execType: "0" })
        if (singleton.isEMPTY(order)) {
            return res.send({ Status: -1, Explain: "该订单不存在" });
        }
        let { Side, OrdType, OrderQty, AccountNo } = order
        let Type = ((OrdType - 1) / 3 >> 0) + 1 //1，2，3=>1做多；4，5，6=>2做空
        let result = await singleton.transaction(async transaction => {
            let updateResult = await singleton.updateMainDB("wf_street_practice_order", { execType: 2 }, null, { Id: orderID })
            if (updateResult.changedRows != 1)
                throw -1
            if (Side == "BS" [Type - 1]) {
                let { TradAble, Id: PositionsId } = await singleton.selectMainDB0("wf_street_practice_positions", { AccountNo, Type })
                TradAble += OrderQty //修改可交易仓位
                await singleton.updateMainDB("wf_street_practice_positions", { TradAble }, null, { Id: PositionsId }, transaction)
            }
        })
        if (result == 0) {
            res.send({ Status: 0, Explain: "" });
            mqChannel.sendToQueue("paperTrade", new Buffer(JSON.stringify({ cmd: "cancel", data: orderID })))
        } else
            res.send({ Status: result, Explain: "失败" });
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
            p.LastPrice = (await singleton.getLastPrice(config.getQueryName(p)))[3]
            p.MarketValue = p.LastPrice * p.Positions
            p.Profit = p.MarketValue - p.CostPrice * p.Positions
            p.ProfitRate = (p.LastPrice - p.CostPrice) * 100 / p.CostPrice
            if (p.Type == 2) {
                p.Profit = -p.Profit
                p.ProfitRate = -p.ProfitRate
            }
            TotalProfit += p.Profit
        }
        res.send({ Status: 0, Explain: "", Positions, TotalProfit });
    }));
    /**今日委托 */
    router.get('/TodayOrders', ctt, ConvertAccountNo, wrap(async({ memberCode, AccountNo }, res) => {
        let result = await mainDB.query(`select * from wf_street_practice_order where MemberCode=:memberCode ${AccountNo} and substr(CreateTime,1,10)=CurDate()`, { replacements: { memberCode }, type: "SELECT" })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    /**今日成交 */
    router.get('/TodayDeals', ctt, ConvertAccountNo, wrap(async({ memberCode, AccountNo }, res) => {
        let result = await mainDB.query(`select *,Price*OrderQty Turnover from wf_street_practice_order where MemberCode=:memberCode ${AccountNo} and substr(TurnoverTime,1,10)=CurDate() and execType=1`, { replacements: { memberCode }, type: "SELECT" })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    /**历史委托 */
    router.get('/Orders/:startDate/:endDate', ctt, ConvertAccountNo, wrap(async({ memberCode, params: { startDate, endDate }, AccountNo }, res) => {
        let result = await mainDB.query(`select * from wf_street_practice_order where MemberCode=:memberCode ${AccountNo} and CreateTime>=startDate and CreateTime<=endDate`, { replacements: { memberCode, startDate, endDate }, type: "SELECT" })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    /**历史成交 */
    router.get('/Deals/:startDate/:endDate', ctt, ConvertAccountNo, wrap(async({ memberCode, params: { startDate, endDate }, AccountNo }, res) => {
        let result = await mainDB.query(`select *,Price*OrderQty Turnover from wf_street_practice_order where MemberCode=:memberCode ${AccountNo} and TurnoverTime>=startDate and TurnoverTime<=endDate and execType=1`, { replacements: { memberCode, startDate, endDate }, type: "SELECT" })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    /**挂单列表 */
    router.get('/Commissions', ctt, ConvertAccountNo, wrap(async({ memberCode, AccountNo }, res) => {
        let result = await mainDB.query(`select * from wf_street_practice_order where MemberCode=:memberCode ${AccountNo} and execType=0`, { replacements: { memberCode }, type: "SELECT" })
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    /**我的账户详情 */
    router.get('/Account', ctt, ConvertAccountNo, wrap(async({ memberCode, AccountNo }, res) => {
        let result = await mainDB.query(`select * from wf_street_practice_account where MemberCode=:memberCode ${AccountNo}`, { replacements: { memberCode }, type: "SELECT" })
        for (let account of result) {
            let Positions = await singleton.selectMainDB("wf_street_practice_positions", { MemberCode: memberCode, AccountNo: account.AccountNo })
            let TotalProfit = 0
            let TotalMarketValue = 0
            for (let p of Positions) {
                p.LastPrice = (await singleton.getLastPrice(config.getQueryName(p)))[3]
                p.MarketValue = p.LastPrice * p.Positions
                p.Profit = p.MarketValue - p.CostPrice * p.Positions
                    //p.ProfitRate = (p.LastPrice - p.CostPrice) * 100 / p.CostPrice
                if (p.Type == 2) {
                    p.Profit = -p.Profit
                        //p.ProfitRate = -p.ProfitRate
                }
                TotalMarketValue += p.MarketValue
                TotalProfit += p.Profit
            }
            account.TotalProfit = TotalProfit
            account.TotalMarketValue = TotalMarketValue
            let daysAgo = 1
                //5点后的开盘时间点
            if (new Date().getHours() >= (account.AccountType == 1 ? 21 : 9)) daysAgo = 0
            let record = await mainDB.query('select TotalAmount from wf_street_practice_asset where AccountNo=:AccountNo and EndDate< DATE_SUB(CurDate(),INTERVAL :daysAgo day) order by EndDate desc limit 1', { replacements: { AccountNo, daysAgo }, type: "SELECT" })
            account.TodayProfit = account.Cash + TotalMarketValue - record.TotalAmount
        }
        res.send({ Status: 0, Explain: "", DataList: result });
    }));
    //用中文搜索股票
    router.get('/SearchStock/:searchword', ctt, wrap(async({ memberCode, params: { searchword } }, res) => {
        searchword = "%" + searchword + "%"
        let result = await mainDB.query("SELECT SecuritiesNo,SecuritiesName,SmallType from wf_securities_trade where Remark='DW' and (UPPER(SecuritiesName) like :searchword or UPPER(PinYin) like UPPER(:searchword) or UPPER(SecuritiesNo) like UPPER(:searchword))", { replacements: { searchword }, type: "SELECT" })
        res.send({ Status: 0, Explain: "", DataList: result })
    }));
    router.get('/Securities4me/:SecuritiesType/:SecuritiesNo/:AccountNo', ctt, ConvertAccountNo, wrap(async({ memberCode, params }, res) => {
        let [, , , LastPrice] = await singleton.getLastPrice(config.getQueryName(params))
        let Positions = await singleton.selectMainDB("wf_street_practice_positions", { MemberCode: memberCode, AccountNo: params.AccountNo, SecuritiesType: params.SecuritiesType, SecuritiesNo: params.SecuritiesNo })
        res.send({ Status: 0, Explain: "", Data: { LastPrice, Positions } })
    }));
    return router
}