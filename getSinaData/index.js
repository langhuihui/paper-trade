import redis from 'redis'
import request from 'request'
import Config from '../config'
import amqp from 'amqplib'
import Iconv from 'iconv-lite'
import StockRef from './stocksRef'
import sqlstr from '../common/sqlStr'
import stockRank from './stockRank'
import singleton from '../common/singleton'
const { mainDB, redisClient } = singleton

var stockRef = new StockRef()
var listenerSymbol = new Map() //订阅者关注的股票

/**rabbitmq 通讯 */
async function startMQ() {
    var amqpConnection = await amqp.connect(Config.amqpConn)
    let channel = await amqpConnection.createChannel()
    await channel.assertExchange("broadcast", "fanout")
    let ok = await channel.assertQueue('sinaData')
    ok = await channel.assertQueue("getSinaData")
    channel.consume('getSinaData', msg => {
        var { symbols, listener, type } = JSON.parse(msg.content.toString())
        if (!symbols) symbols = []
        if (!listenerSymbol.has(listener)) listenerSymbol.set(listener, [])
        let oldSymbols = listenerSymbol.get(listener)
        let needAdd = [] //需要增加的股票
        let needRemove = [] //需要删除的股票
        switch (type) {
            case "reset": //重置该订阅者所有股票
                console.log(listener, type)
                if (oldSymbols) {
                    needRemove = oldSymbols.concat() //复制一份
                    for (let s of symbols) { //查找已有的和没有的
                        if (needRemove.contain(s)) { //已经存在
                            needRemove.remove(s) //不进入移除列表
                        } else {
                            needAdd.push(s)
                        }
                    }
                } else {
                    needAdd = symbols
                }
                listenerSymbol.set(listener, symbols)
                break
            case "add":
                while (symbols.length) {
                    let symbol = symbols.pop()
                    if (oldSymbols.contain(symbol)) {
                        continue
                    } else {
                        needAdd.push(symbol)
                        oldSymbols.push(symbol)
                    }
                }
                break
            case "remove":
                while (symbols.length) {
                    let symbol = symbols.pop()
                    if (oldSymbols.contain(symbol)) {
                        needRemove.remove(symbol)
                        oldSymbols.push(symbol)
                    } else {
                        continue
                        needAdd.push(symbol)
                    }
                }
                break
        }
        if (needRemove.length) stockRef.removeSymbols(needRemove)
        if (needAdd.length) stockRef.addSymbols(needAdd)
        channel.ack(msg)
    })
    ok = await channel.bindQueue('sinaData', 'broadcast', 'fanout')
    console.log(ok, channel.sendToQueue('sinaData', new Buffer("restart")))

}

var intervalId;
var pageSize = 1000;


function start() {
    intervalId = setInterval(async() => {
        let marketIsOpen = await redisClient.getAsync("marketIsOpen")
        marketIsOpen = JSON.parse(marketIsOpen)
        let stocks = []
            //筛选出当前在开盘的股票
        for (var market in marketIsOpen) {
            if (marketIsOpen[market])
                stocks.push(...stockRef[market])
        }
        let l = stocks.length;
        if (l && redisClient.connected) {
            let i = 0
            let stocks_name = ""

            while (l) {
                if (l > pageSize) {
                    stocks_name = stocks.slice(i, i + pageSize).join(",")
                    l -= pageSize
                    i += pageSize
                } else {
                    stocks_name = stocks.slice(i, i + l).join(",")
                    l = 0
                }
                request.get({ encoding: null, url: Config.sina_realjs + stocks_name.toLowerCase() }, (error, response, body) => {
                    let rawData = Iconv.decode(body, 'gb2312')

                    function getStockPrice(stockName, x) {
                        let q = Config.stockPatten.exec(stockName)[1];
                        let price = Config.pricesIndexMap[q].map(y => Number(x[y]));
                        if (Number.isNaN(price[4])) price[4] = 0;
                        price[5] = price[4] ? (price[3] - price[4]) * 100 / price[4] : 0;
                        redisClient.set("lastPrice:" + stockName, price.join(","));
                        if (marketIsOpen.us) stockRank.updatePrice(stockName, ...price)
                    }
                    eval(rawData + 'stocks.forEach(stockName=>getStockPrice(stockName,eval("hq_str_" + stockName).split(",")))')
                    if (marketIsOpen.us) stockRank.insertRank()
                })
            }
        }
    }, 5000)
}

function stop() {
    clearInterval(intervalId)
}
stockRank.init(stockRef)
startMQ()
start()