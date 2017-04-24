import express from 'express'
import Config from '../config'
import JPush from 'jpush-sdk'
import amqp from 'amqplib'
import moment from 'moment-timezone'
import singleton from '../common/singleton'
import StockRef from '../getSinaData/stocksRef'
const { mainDB, redisClient, jpushClient } = singleton
var stocksRef = new StockRef()
var orders = new Map()
    /**获取查询股票的代码sina */
function getQueryName({ SmallType, SecuritiesNo }) {
    return Config.sina_qmap[SmallType] + SecuritiesNo.toLowerCase().replace(".", "$")
}
async function getAllOrder() {
    stocksRef.clear()
    orders.clear()
    let [os] = await mainDB.query(jpushRegIDSql)
    for (let order of os) {
        stocksRef.addSymbol(getQueryName(order))
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
        let name = getQueryName(data)
        switch (cmd) {
            case "create":
                if (!orders.has(data.Id)) {
                    orders.set(data.Id, data)
                    if (stocksRef.addSymbol(name)) {
                        channel.sendToQueue("getSinaData", new Buffer(JSON.stringify({ type: "add", listener: "paperTrade", symbols: [name] })))
                    }
                }
                break;
            case "cancel":
                if (orders.has(data.Id)) {
                    if (stocksRef.removeSymbol(name))
                        channel.sendToQueue("getSinaData", new Buffer(JSON.stringify({ type: "remove", listener: "paperTrade", symbols: [name] })))
                }
                break;
        }
    })
    await channel.assertExchange("broadcast", "fanout");
    ok = await channel.assertQueue('sinaData');
    ok = await channel.bindQueue('sinaData', 'broadcast', 'fanout');
    channel.consume('sinaData', msg => {
        switch (msg.content.toString()) {
            case "restart": //股票引擎重启信号
                channel.sendToQueue("getSinaData", new Buffer(JSON.stringify({ type: "reset", listener: "paperTrade", symbols: stocksRef.array })))
                break;
        }
        channel.ack(msg)
    })
}
startMQ()