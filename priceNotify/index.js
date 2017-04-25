import express from 'express'
import Config from '../config'
import JPush from 'jpush-sdk'
import amqp from 'amqplib'
import moment from 'moment-timezone'
import singleton from '../common/singleton'
const { mainDB, redisClient, jpushClient } = singleton
const jpushRegIDSql = `
SELECT
	a.*, b.JpushRegID,c.SecuritiesName
FROM
	wf_securities_remind a
LEFT JOIN wf_im_jpush b ON a.MemberCode = b.MemberCode
LEFT JOIN wf_securities_trade c ON a.SecuritiesNo = c.SecuritiesNo and a.SmallType = c.SmallType
WHERE
a.MemberCode not in (select MemberCode from wf_system_setting where PriceNotify = 0)
AND (
	a.IsOpenLower = 1
	OR a.IsOpenUpper = 1
	OR a.IsOpenRise = 1
	OR a.IsOpenFall = 1
);`
const someBodySql = `
SELECT
	a.*, b.JpushRegID,c.SecuritiesName
FROM
	wf_securities_remind a
LEFT JOIN wf_im_jpush b ON a.MemberCode = b.MemberCode
LEFT JOIN wf_securities_trade c ON a.SecuritiesNo = c.SecuritiesNo and a.SmallType = c.SmallType
WHERE
a.MemberCode = :memberCode
AND (
	a.IsOpenLower = 1
	OR a.IsOpenUpper = 1
	OR a.IsOpenRise = 1
	OR a.IsOpenFall = 1
);`
import StockRef from '../getSinaData/stocksRef'
var stocksRef = new StockRef()
var notifies = new Map()

function isAllClose({ IsOpenLower, IsOpenUpper, IsOpenRise, IsOpenFall }) {
    return !(IsOpenLower || IsOpenUpper || IsOpenRise || IsOpenFall)
}
//rabitmq 通讯
async function startMQ() {
    var amqpConnection = await amqp.connect(Config.amqpConn)
    let channel = await amqpConnection.createChannel()
    let ok = await channel.assertQueue('priceNotify')
    await getAllNotify()
    channel.sendToQueue("getSinaData", new Buffer(JSON.stringify({ type: "reset", listener: "priceNotify", symbols: stocksRef.array })))
    channel.consume('priceNotify', msg => {
        let { cmd, data } = JSON.parse(msg.content.toString())
        switch (cmd) {
            case "update":
                console.log("更新股价提醒", data)
                let name = Config.getQueryName(data)
                if (notifies.has(data.RemindId)) {
                    if (isAllClose(data)) {
                        if (stocksRef.removeSymbol(name))
                            channel.sendToQueue("getSinaData", new Buffer(JSON.stringify({ type: "remove", listener: "priceNotify", symbols: [name] })))
                    } else
                        Object.assign(notifies.get(data.RemindId), data)
                } else {
                    if (!isAllClose(data)) {
                        notifies.set(data.RemindId, data)
                        mainDB.query('select JpushRegID from wf_im_jpush where MemberCode=:MemberCode', { replacements: data }).then(result => {
                            if (result[0].length) data.JpushRegID = result[0][0]["JpushRegID"]
                        })
                        if (stocksRef.addSymbol(name)) {
                            mainDB.query('select SecuritiesName from wf_securities_trade where SecuritiesNo =:SecuritiesNo and SmallType = :SmallType', { replacements: data }).then(result => {
                                if (result[0].length) data.SecuritiesName = result[0][0]["SecuritiesName"]
                            })
                            channel.sendToQueue("getSinaData", new Buffer(JSON.stringify({ type: "add", listener: "priceNotify", symbols: [name] })))
                        }
                    }
                }
                break;
            case "changeJpush":
                console.log("更新Jpush", data)
                let { MemberCode, JpushRegID } = data
                for (let notify of notifies.values) {
                    if (notify.MemberCode == MemberCode) notify.JpushRegID = JpushRegID
                }
                break;
            case "turnOff":
                console.log("关闭股价提醒", data.memberCode)
                for (let notify of notifies.values()) {
                    if (notify.MemberCode == data.memberCode) {
                        let name = Config.getQueryName(notify)
                        if (stocksRef.removeSymbol(name)) {
                            channel.sendToQueue("getSinaData", new Buffer(JSON.stringify({ type: "remove", listener: "priceNotify", symbols: [name] })))
                        }
                        notifies.delete(notify.RemindId)
                    }
                }
                break;
            case "turnOn":
                console.log("打开股价提醒", data.memberCode)
                let [ns] = await mainDB.query(someBodySql, { replacements: data })
                for (let n of ns) {
                    Object.convertBuffer2Bool(n, "IsOpenLower", "IsOpenUpper", "IsOpenRise", "IsOpenFall")
                    notifies[n.RemindId] = n
                    stocksRef.addSymbol(Config.getQueryName(n))
                }
                break;
        }
        channel.ack(msg)
    });
    await channel.assertExchange("broadcast", "fanout");
    ok = await channel.assertQueue('sinaData');
    ok = await channel.bindQueue('sinaData', 'broadcast', 'fanout');
    channel.consume('sinaData', msg => {
        switch (msg.content.toString()) {
            case "restart": //股票引擎重启信号
                channel.sendToQueue("getSinaData", new Buffer(JSON.stringify({ type: "reset", listener: "priceNotify", symbols: stocksRef.array })))
                break;
        }
        channel.ack(msg)
    })
}
startMQ()


/**
 * 获取jpushregid和所有提醒数据
 */
async function getAllNotify() {
    notifies.clear()
    stocksRef.clear()
    let [ns] = await mainDB.query(jpushRegIDSql)
    for (let n of ns) {
        Object.convertBuffer2Bool(n, "IsOpenLower", "IsOpenUpper", "IsOpenRise", "IsOpenFall")
        notifies[n.RemindId] = n
        stocksRef.addSymbol(Config.getQueryName(n))
    }
}

function sendNotify(type, notify, price, chg) {
    let title = `${notify.SecuritiesName}(${notify.SecuritiesNo})最新价${price}`
        //您关注的Snapchat(SNAP)于2017-03-11 10:09:11(美东时间)达到21.82，涨幅为7.07%，超过7%了。
    let msg = `您关注的${notify.SecuritiesName}(${notify.SecuritiesNo})于${notify.SmallType=='us'?moment().tz('America/New_York').format('YYYY-MM-DD hh:mm:ss')+"(美东时间)":moment().format("YYYY-MM-DD hh:mm:ss")}达到${price}`
    switch (type) {
        case 0:
            msg += `，低于${notify.LowerLimit}`
            break
        case 1:
            msg += `，超过了${notify.UpperLimit}`
            break
        case 2:
            msg += `，跌幅为${chg.toFixed(2)}%，超过了-${notify.FallLimit.toFixed(2)}%`
            break
        case 3:
            msg += `，涨幅为${chg.toFixed(2)}%，超过了${notify.RiseLimit.toFixed(2)}%`
            break
    }
    if (notify.JpushRegID)
        jpushClient.push().setPlatform(JPush.ALL).setAudience(JPush.registration_id(notify.JpushRegID))
        //sendno, time_to_live, override_msg_id, apns_production, big_push_duration
        .setOptions(null, null, null, Config.apns_production)
        .setNotification('股价提醒', JPush.ios(msg, 'sound', 0, false, { AlertType: Config.jpushType, SmallType: notify.SmallType, SecuritiesNo: notify.SecuritiesNo }), JPush.android(msg, title, 1, { AlertType: Config.jpushType, SmallType: notify.SmallType, SecuritiesNo: notify.SecuritiesNo }))
        .send(async(err, res) => {
            if (err) {
                if (err instanceof JPush.APIConnectionError) {
                    console.log(err.message)
                } else if (err instanceof JPush.APIRequestError) {
                    console.log(err.message)
                }
            } else {
                let replacements = { msg, title, MemberCode: notify.MemberCode, Extension: JSON.stringify({ SmallType: notify.SmallType, SecuritiesNo: notify.SecuritiesNo }) }
                await mainDB.query("insert into wf_message(Type,Content,MemberCode,CreateTime,Title,Status,Extension) values(1,:msg,:MemberCode,now(),:title,0,:Extension)", { replacements });
            }
        })
}

setInterval(async() => {
    let marketIsOpen = await redisClient.getAsync("marketIsOpen")
    marketIsOpen = JSON.parse(marketIsOpen)
        //调用新浪接口
    for (let notify of notifies.values()) {
        if (!marketIsOpen[notify.SmallType]) {
            continue
        }
        let name = Config.getQueryName(notify)
        let sp = await redisClient.getAsync("lastPrice:" + name.toLowerCase())
        let [, , , price, pre, chg] = JSON.parse("[" + sp + "]")
        if (!chg) chg = pre ? (price - pre) * 100 / pre : 0
        chg = Number(chg.toFixed(2))
            //console.log(name, price, chg, notify)
        if (notify.IsOpenLower) {
            if (notify.isLowSent) {
                if (price > notify.LowerLimit) {
                    //恢复状态
                    notify.isLowSent = false
                }
            } else {
                if (price < notify.LowerLimit) {
                    //向下击穿
                    sendNotify(0, notify, price, chg)
                    notify.isLowSent = true
                }
            }
        }
        if (notify.IsOpenUpper) {
            if (notify.isUpperSent) {
                if (price < notify.UpperLimit) {
                    //恢复状态
                    notify.isUpperSent = false
                }
            } else {
                if (price > notify.UpperLimit) {
                    //向上突破
                    sendNotify(1, notify, price, chg)
                    notify.isUpperSent = true
                }
            }
        }
        if (chg < 0) {
            if (notify.IsOpenFall) {
                let target = -Number(notify.FallLimit.toFixed(2))
                if (notify.isFallSent) {
                    if (chg > target) {
                        //恢复状态
                        notify.isFallSent = false
                    }
                } else {
                    if (chg < target) {
                        //向下击穿
                        sendNotify(2, notify, price, chg)
                        notify.isFallSent = true
                    }
                }
            }
        } else {
            if (notify.IsOpenRise) {
                let target = Number(notify.RiseLimit.toFixed(2))
                if (notify.isRiseSent) {
                    if (chg < target) {
                        //恢复状态
                        notify.isRiseSent = false
                    }
                } else {
                    if (chg > target) {
                        //向上突破
                        sendNotify(3, notify, price, chg)
                        notify.isRiseSent = true
                    }
                }
            }
        }
    }
}, 5000);
// let server = app.listen(process.env.PORT, function() {
//     let host = server.address().address;
//     let port = server.address().port;

//     console.log('server listening at %s %d', host, port);
// });