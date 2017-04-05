import redis from 'redis'
import request from 'request'
import Config from '../config'
import amqp from 'amqplib'
import Iconv from 'iconv-lite'
var client = Config.CreateRedisClient();
var listenerSymbol = {} //订阅者关注的股票
var stocksRef = {} //所有股票引用次数
var stocks = []
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
        if (!listenerSymbol[listener]) listenerSymbol[listener] = []
        let oldSymbols = listenerSymbol[listener]
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
                listenerSymbol[listener] = symbols
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
        if (needRemove.length) removeSymbols(needRemove)
        if (needAdd.length) addSymbols(needAdd)
        channel.ack(msg)
    })
    ok = await channel.bindQueue('sinaData', 'broadcast', 'fanout')
    console.log(ok, channel.sendToQueue('sinaData', new Buffer("restart")))
}

function removeSymbols(symbols) {
    for (let symbol of symbols) {
        if (stocksRef[symbol]) {
            stocksRef[symbol]--;
            if (stocksRef[symbol] == 0) {
                stocks.remove(symbol)
            }
        }
    }
}

function addSymbols(symbols) {
    for (let symbol of symbols) {
        if (!stocksRef[symbol]) {
            stocksRef[symbol] = 1
            stocks.push(symbol)
        } else stocksRef[symbol]++;
    }
}
var intervalId;

function start() {
    intervalId = setInterval(() => {
        if (stocks.length && client.connected) {
            let l = stocks.length;
            let i = 0
            let stocks_name = ""
            while (l) {
                if (l > 1000) {
                    stocks_name = stocks.slice(i, i + 1000).join(",")
                    l -= 1000
                    i += 1000
                } else {
                    stocks_name = stocks.slice(i, i + l).join(",")
                    l = 0
                }
                request.get({ encoding: null, url: Config.sina_realjs + stocks_name }, (error, response, body) => {
                    let rawData = Iconv.decode(body, 'gb2312')
                    let config = Config
                    let redisClient = client
                    eval(rawData + '  for (let stockName in stocksRef){let q = config.stockPatten.exec(stockName)[1];let x=eval("hq_str_" + stockName).split(",");redisClient.set("lastPrice:"+stockName,x[config.pricesIndexMap[q][0]]+","+x[config.pricesIndexMap[q][1]]+","+x[config.pricesIndexMap[q][2]]+","+x[config.pricesIndexMap[q][3]]+","+x[config.pricesIndexMap[q][4]])}')
                })
            }
        }
    }, 5000)
}

function stop() {
    clearInterval(intervalId)
}

startMQ()
start()