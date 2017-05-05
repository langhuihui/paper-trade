import express from 'express'
import Config from '../config'
import JPush from 'jpush-sdk'
import amqp from 'amqplib'
import moment from 'moment-timezone'
import singleton from '../common/singleton'
import StockRef from '../getSinaData/stocksRef'
import deal from './deal'
const { mainDB, redisClient, jpushClient } = singleton
var stocksRef = new StockRef()
var orders = new Map()
async function getAllOrder() {
    stocksRef.clear()
    orders.clear()
    let [os] = await mainDB.query("select o.*,a.CommissionLimit,a.CommissionRate from wf_street_practice_order o left join wf_street_practice_account a on o.AccountNo=a.AccountNo where execType=0")
    for (let order of os) {
        stocksRef.addSymbol(Config.getQueryName(order))
    }
}
//除权
async function sendStock({ rate, newPirce, SecuritiesType, SecuritiesNo, time }) {
    let bonus = await singleton.selectMainDB0("wf_street_practice_bonus", { SecuritiesType, SecuritiesNo, Type: 1, RealityTime: time }, null, t)
    if (!singleton.isEMPTY(bonus)) return
    let transaction = await mainDB.transaction();
    let t = { transaction }
    try {
        let [result] = await mainDB.query("select * from wf_street_practice_positionshistory where Positions>0 and Id in (select max(Id) from wf_street_practice_positionshistory where SecuritiesNo=:SecuritiesNo and SecuritiesType=:SecuritiesType and CreateTime <:time group by AccountNO)", { replacements: { SecuritiesType, SecuritiesNo, time } })
        if (result.length) {
            for (let p of result) {
                let { Positions: beforeSendPos, AccountNo, SecuritiesType, SecuritiesNo } = p
                let addP = beforeSendPos * rate
                let { Positions = 0, CostPrice, MemberCode } = await singleton.selectMainDB0("wf_street_practice_positions", { AccountNo, SecuritiesType, SecuritiesNo, Type: 1 })
                if (Positions == 0) {
                    CostPrice = newPirce
                    await singleton.insertMainDB("wf_street_practice_positions", { Positions: addP, CostPrice, SecuritiesType, SecuritiesNo, MemberCode, AccountNo }, { CreateTime: "now()" }, t)
                    await singleton.insertMainDB("wf_street_practice_positionshistory", { MemberCode, AccountNo, OldPositions: Positions, Positions: addP, SecuritiesType, SecuritiesNo, Reason: 1 }, { CreateTime: "now()" }, t)
                } else {
                    CostPrice = CostPrice / (1 + addP / (Positions + addP))
                    await singleton.updateMainDB("wf_street_practice_positions", { Positions: Positions + addP, CostPrice }, null, { AccountNo, SecuritiesType, SecuritiesNo, Type: 1 }, t)
                    await singleton.insertMainDB("wf_street_practice_positionshistory", { MemberCode, AccountNo, OldPositions: Positions, Positions: Positions + addP, SecuritiesType, SecuritiesNo, Reason: 1 }, { CreateTime: "now()" }, t)
                }
            }
        }
        let [short] = await mainDB.query("select * from wf_street_practice_positionshistory_short where Positions>0 and Id in (select max(Id) from wf_street_practice_positionshistory where SecuritiesNo=:SecuritiesNo and SecuritiesType=:SecuritiesType and CreateTime <:time group by AccountNO)", { replacements: { SecuritiesType, SecuritiesNo, time } })
        if (short.length) {
            for (let p of short) {
                let { Positions: beforeSendPos, AccountNo, SecuritiesType, SecuritiesNo } = p
                let addP = beforeSendPos * rate
                let { Positions = 0, CostPrice, MemberCode } = await singleton.selectMainDB0("wf_street_practice_positions", { AccountNo, SecuritiesType, SecuritiesNo, Type: 2 })
                if (Positions == 0) {
                    CostPrice = newPirce
                    await singleton.insertMainDB("wf_street_practice_positions", { Positions: addP, CostPrice, SecuritiesType, SecuritiesNo, MemberCode, AccountNo }, { CreateTime: "now()" }, t)
                    await singleton.insertMainDB("wf_street_practice_positionshistory_short", { MemberCode, AccountNo, OldPositions: Positions, Positions: addP, SecuritiesType, SecuritiesNo, Reason: 1 }, { CreateTime: "now()" }, t)
                } else {
                    CostPrice = CostPrice / (1 + addP / (Positions + addP))
                    await singleton.updateMainDB("wf_street_practice_positions", { Positions: Positions + addP, CostPrice }, null, { AccountNo, SecuritiesType, SecuritiesNo, Type: 2 }, t)
                    await singleton.insertMainDB("wf_street_practice_positionshistory_short", { MemberCode, AccountNo, OldPositions: Positions, Positions: Positions + addP, SecuritiesType, SecuritiesNo, Reason: 1 }, { CreateTime: "now()" }, t)
                }
            }
        }
        await singleton.insertMainDB("wf_street_practice_bonus", { SecuritiesType, SecuritiesNo, Percentage: rate, Type: 1, RealityTime: time }, { CreateTime: "now()" }, t)
        await transaction.commit()
    } catch (ex) {
        console.error(ex)
        await transaction.rollback()
    }
}
//除息
async function bonus({ rate, SecuritiesType, SecuritiesNo, time }) {
    let bonus = await singleton.selectMainDB0("wf_street_practice_bonus", { SecuritiesType, SecuritiesNo, Type: 2, RealityTime: time }, null, t)
    if (!singleton.isEMPTY(bonus)) return
    let [result] = await mainDB.query("select * from wf_street_practice_positionshistory where Id in (select max(Id) from wf_street_practice_positionshistory where SecuritiesNo=:SecuritiesNo and SecuritiesType=:SecuritiesType and CreateTime <:time group by AccountNO)", { replacements: { SecuritiesType, SecuritiesNo, time } })
    if (result.length) {
        let tResult = await singleton.transaction(async t => {
            for (let p of result) {
                let { Positions: beforeSendPos, AccountNo, SecuritiesType, SecuritiesNo, MemberCode } = p
                let addCash = beforeSendPos * rate
                let { Cash } = await singleton.selectMainDB0("wf_street_practice_account", { AccountNo }, null, t)
                await singleton.updateMainDB("wf_street_practice_account", { Cash: Cash + addCash }, null, { AccountNo }, t)
                await singleton.insertMainDB("wf_street_practice_cashhistory", { MemberCode, AccountNo, OldCash: Cash, Cash: Cash + addCash, Reason: 1 }, { CreateTime: "now()" }, t)
            }
            await singleton.insertMainDB("wf_street_practice_bonus", { SecuritiesType, SecuritiesNo, Percentage: rate, Type: 2, RealityTime: time }, { CreateTime: "now()" }, t)
        })
        if (tResult) {
            console.error(tResult)
        }
    }
}
//rabitmq 通讯
async function startMQ() {
    var amqpConnection = await amqp.connect(Config.amqpConn)
    let channel = await amqpConnection.createChannel()
    let ok = await channel.assertQueue('paperTrade')
    await getAllOrder()
    channel.sendToQueue("getSinaData", new Buffer(JSON.stringify({ type: "reset", listener: "paperTrade", symbols: stocksRef.array })))
    channel.consume('paperTrade', msg => {
        let { cmd, data } = JSON.parse(msg.content.toString())
        switch (cmd) {
            case "create":
                if (!orders.has(data.Id)) {
                    let name = Config.getQueryName(data)
                    orders.set(data.Id, data)
                    if (stocksRef.addSymbol(name)) {
                        channel.sendToQueue("getSinaData", new Buffer(JSON.stringify({ type: "add", listener: "paperTrade", symbols: [name] })))
                    }
                }
                break;
            case "cancel":
                if (orders.has(data)) {
                    let name = Config.getQueryName(orders.get(data))
                    if (stocksRef.removeSymbol(name))
                        channel.sendToQueue("getSinaData", new Buffer(JSON.stringify({ type: "remove", listener: "paperTrade", symbols: [name] })))
                }
                break;
            case "sendStock": //派股
                sendStock(data)
                break;
            case "bonus": //分红
                bonus(data)
                break;
        }
        channel.ack(msg)
    })
    await channel.assertExchange("broadcast", "fanout");
    ok = await channel.assertQueue('sinaData_paperTrade');
    ok = await channel.bindQueue('sinaData_paperTrade', 'broadcast', 'fanout');
    channel.consume('sinaData_paperTrade', msg => {
        switch (msg.content.toString()) {
            case "restart": //股票引擎重启信号
                channel.sendToQueue("getSinaData", new Buffer(JSON.stringify({ type: "reset", listener: "paperTrade", symbols: stocksRef.array })))
                break;
        }
        channel.ack(msg)
    })
}
startMQ()

async function sendNotify(order) {
    let description = ""
    switch (order.execType) {
        case 1:
            description = "已经成交"
            break;
        case 3:
            description = "被拒绝:" + [null, "资金不足", "仓位不足", "超时失效"][order.Reason]
            break;
        case 0:
            return
    }
    let JpushRegID = (await mainDB.query('select JpushRegID from wf_im_jpush where MemberCode=:MemberCode', { replacements: order }))[0][0].JpushRegID;
    let SecuritiesName = (await mainDB.query('select SecuritiesName from wf_securities_trade where SecuritiesNo =:SecuritiesNo and SmallType = :SecuritiesType', { replacements: order }))[0][0].SecuritiesName
    let msg = `您${order.Side=="B"?"买入的":"卖出的"}股票${SecuritiesName}（${order.SecuritiesNo}）${description}`
    let title = `您${order.Side=="B"?"买入的":"卖出的"}股票${SecuritiesName}（${order.SecuritiesNo}）${description}`
    jpushClient.push().setPlatform(JPush.ALL).setAudience(JPush.registration_id(JpushRegID))
        //sendno, time_to_live, override_msg_id, apns_production, big_push_duration
        .setOptions(null, null, null, Config.apns_production)
        .setNotification('成交提醒', JPush.ios(msg, 'sound', 0, false, { AlertType: Config.jpushType_paperTrade, SecuritiesName, order }), JPush.android(msg, title, 1, { AlertType: Config.jpushType, SecuritiesName, order }))
        .send(async(err, res) => {
            if (err) {
                if (err instanceof JPush.APIConnectionError) {
                    console.log(err.message)
                } else if (err instanceof JPush.APIRequestError) {
                    console.log(err.message)
                }
            } else {

            }
        })
}
setInterval(async() => {
    let marketIsOpen = await singleton.marketIsOpen()
    for (let order of orders.values()) {
        let { Id, AccountNo, OrdType, Side, OrderQty, Price, SecuritiesType, SecuritiesNo, CommissionRate, CommissionLimit } = order
        //拒绝超时订单
        if (new Date(order.EndTime) > new Date()) {
            let result = await singleton.transaction(async t => {
                await singleton.updateMainDB("wf_street_practice_order", { execType: 3, Reason: 3 }, null, { Id }, t)
                let Type = ((OrdType - 1) / 3 >> 0) + 1 //1，2，3=>1做多；4，5，6=>2做空
                if (Side == "SB" [Type - 1]) {
                    let { TradAble, Id: PositionsId } = await singleton.selectMainDB0("wf_street_practice_positions", { AccountNo, Type })
                    TradAble += OrderQty //修改可交易仓位
                    await singleton.updateMainDB("wf_street_practice_positions", { TradAble }, null, { Id: PositionsId }, t)
                }
            })
            if (result == 0)
                orders.delete(Id)
            else console.error(result)
            sendNotify(order)
            continue
        }
        //未开盘则直接跳过
        if (!marketIsOpen[SecuritiesType]) {
            continue
        }
        let name = Config.getQueryName(order)
        let [, , , price, pre, chg] = await singleton.getLastPrice(name)
        let Commission = Math.max(CommissionRate * OrderQty, CommissionLimit) //佣金
        let delta = OrdType < 4 ? Side == "B" ? -Commission - price * OrderQty : price * OrderQty - Commission : -Commission
        let trigge = false
        switch (OrdType) {
            case 1:
                trigge = true;
                break;
            case 2:
            case 3:
                trigge = Side == "BS" [OrdType - 2] ? (Price >= price) : (Price <= price)
                break;
            case 4:
                trigge = true;
                break;
            case 5:
            case 6:
                trigge = Side == "BS" [6 - OrdType] ? (Price >= price) : (Price <= price)
                break;
        }
        if (trigge) {
            let x = Object.assign(Object.assign({ delta }, order), { Commission, Price: price })
            let result = await deal(x)
            if (result === 0) {
                //处理完毕
                orders.delete(Id)
            } else {
                console.log(new Date(), result)
            }
            sendNotify(order)
        }
    }
}, 10000)