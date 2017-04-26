import sqlstr from '../../common/sqlStr'
import getStockPrice from '../../getSinaData/getPrice'
import singleton from '../../common/singleton'
module.exports = function({ mainDB, mqChannel, ctt, express, config, wrap, redisClient }) {
    function createAccount(data) {
        return mainDB.query(...sqlstr.insert2("wf_street_practice_account", data, { CreateTime: "now()" }))
    }

    function getAccount(memberCode) {
        return mainDB.query("select * from wf_street_practice_account where MemberCode=:memberCode", { replacements: { memberCode } })
    }
    mqChannel.assertQueue('paperTrade');
    const router = express.Router();
    /**创建订单 */
    router.post('/Orders', ctt, wrap(async({ memberCode, body }, res) => {
        let { OrdType, Side, OrderQty, Price, SecuritiesType, SecuritiesNo } = body
        if (OrdType == 1 && !await singleton.marketIsOpen(SecuritiesType)) {
            res.send({ Status: 44003, Explain: "未开盘：" + SecuritiesType })
        }
        let [account] = await getAccount(memberCode)
        if (account.length == 0) {
            await createAccount({ memberCode, TranAmount: config.practiceInitFun, Cash: config.practiceInitFun });
            ([account] = await getAccount(memberCode));
        }
        account = account[0]
        if (account.Status != 1) {
            res.send({ Status: 44002, Explain: "账号已停用" })
            return
        }
        let [postions] = await mainDB.query("select * from wf_street_practice_positions  where MemberCode=:memberCode and SecuritiesType=:SecuritiesType and SecuritiesNo=:SecuritiesNo", { replacements: { memberCode, SecuritiesType, SecuritiesNo } })
        let Positions = postions.length ? postions[0].Positions : 0
        if (Side == "S" && Positions < OrderQty) {
            res.send({ Status: 44004, Explain: "持仓不足:" + Positions + "<" + OrderQty })
            return
        }
        let sinaName = config.getQueryName(body)
        let lastPrice = await redisClient.sismemberAsync("watch_stocks", sinaName) ? JSON.parse("[" + await redisClient.getAsync("lastPrice:" + sinaName) + "]") : (await getStockPrice(sinaName))[sinaName][4]
        if (!lastPrice) {
            res.send({ Status: -1, Explain: lastPrice })
            return
        }
        let commission = OrderQty > 239 ? account.CommissionRate * OrderQty : 2.99 //佣金
        let replacements = Object.assign({ MemberCode: memberCode, Commission: commission }, body)
        replacements.Price = lastPrice
        let delta = Side == "B" ? -commission - lastPrice * OrderQty : lastPrice * OrderQty - commission
        switch (OrdType) {
            case 1: //市价单
                if (account.Cash + delta < 0) {
                    res.send({ Status: 44001, Explain: "资金不足" })
                    return
                } else {
                    let t = await mainDB.transaction();
                    body.execType = 1
                    try {
                        await mainDB.query(sqlstr.insert("wf_street_practice_order", replacements, { CreateTime: "now()", TurnoverTime: "now()" }), { replacements, transaction: t })
                        await mainDB.query(sqlstr.update("wf_street_practice_account", { Cash: account.Cash }, null, "where MemberCode=:memberCode"), { replacements: { Cash: account.Cash + delta, memberCode }, transaction: t })
                        if (Side == "S") {
                            Positions -= OrderQty
                            replacements.Positions = Positions
                            if (Positions > 0)
                                await mainDB.query(sqlstr.update("wf_street_practice_positions", { Positions }, null, "where MemberCode=:memberCode and  SecuritiesType=:SecuritiesType and SecuritiesNo=:SecuritiesNo"), { replacements, transaction: t })
                            else await mainDB.query("delete from wf_street_practice_positions where  MemberCode=:memberCode and  SecuritiesType=:SecuritiesType and SecuritiesNo=:SecuritiesNo", { replacements, transaction: t })
                        } else {
                            if (Positions) {
                                Positions += OrderQty
                                replacements.Positions = Positions
                                await mainDB.query(sqlstr.update("wf_street_practice_positions", { Positions }, null, "where MemberCode=:memberCode and  SecuritiesType=:SecuritiesType and SecuritiesNo=:SecuritiesNo"), { replacements, transaction: t })
                            } else {
                                Object.assign(replacements, { Positions: OrderQty, SecuritiesType, SecuritiesNo })
                                await mainDB.query(sqlstr.insert("wf_street_practice_positions", { Positions, SecuritiesType, SecuritiesNo, MemberCode: memberCode }, { CreateTime: "now()" }), { replacements, transaction: t })
                            }
                        }
                    } catch (ex) {
                        await t.rollback()
                        res.send({ Status: -1, Explain: ex.stack })
                        return
                    }
                    await t.commit()
                    res.send({ Status: 0, Explain: "成功" })
                }
                break;
            case 2: //限价单
                {
                    body.MemberCode = memberCode;
                    body.execType = 0;
                    let [result] = await mainDB.query(...sqlstr.insert2("wf_street_practice_order", body, { CreateTime: "now()" }))
                    body.Id = result.insertId;
                    mqChannel.sendToQueue("paperTrade", new Buffer(JSON.stringify({ cmd: "create", data: body })))
                }
                break;
            case 3: //止损单

                break;
        }


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
        let [result] = await mainDB.query("select * from wf_street_practice_positions  where MemberCode=:memberCode", { replacements: { memberCode } })
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
        let [result] = await getAccount(memberCode)
        res.send({ Status: 0, Explain: "", Data: result });
    }));
    return router
}