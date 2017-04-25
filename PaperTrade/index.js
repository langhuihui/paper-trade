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
async function getAllOrder() {
    stocksRef.clear()
    orders.clear()
    let [os] = await mainDB.query(jpushRegIDSql)
    for (let order of os) {
        stocksRef.addSymbol(Config.getQueryName(order))
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

setInterval(async() => {
    let marketIsOpen = await singleton.marketIsOpen()

}, 10000)