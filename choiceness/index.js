import request from 'request'
import Config from '../config'
import amqp from 'amqplib'
import singleton from '../common/singleton'
const { mainDB, redisClient } = singleton
async function startMQ() {
    var amqpConnection = await amqp.connect(Config.amqpConn)
    let channel = await amqpConnection.createChannel()
    await channel.assertExchange("broadcast", "fanout")
    let ok = await channel.assertQueue('sinaData_choiceness')
    await channel.assertQueue('getSinaData')
    ok = await channel.bindQueue('sinaData_choiceness', 'broadcast', 'fanout')

    channel.consume('sinaData_choiceness', msg => {
        switch (msg.content.toString()) {
            case "restart": //股票引擎重启信号
                console.log(new Date(), "sina restart")
                getAllChocieness(channel)
                break;
        }
        channel.ack(msg)
    })
    getAllChocieness(channel)
        //redisClient.mset()
}
/**从数据库里读取所有精选信息 */
async function getAllChocieness(channel) {
    console.log("获取所有精选")
    let choiceness = await mainDB.query('select a.Id,a.`Code`,a.Title,a.Details,a.content,a.CoverImage,a.BannerImage,a.Provenance,a.StocksCount,a.State,b.Id SecuritiesId,b.SecuritiesType,b.SecuritiesNo,b.SecuritiesName from wf_choiceness a, wf_choiceness_stock b where a.`Code` = b.ChoiceCode and a.`Status` = 1 order by a.Id desc')
    choiceness = choiceness[0]
    let choicenessMap = {} //按精选Id分组
    bannerChoice = []
    normalChoice = []
    let allStock = []
    for (let c of choiceness) {
        if (!choicenessMap[c.Id]) {
            choicenessMap[c.Id] = { Id: c.Id, Code: c.Code, Title: c.Title, Details: c.Details, StocksCount: c.StocksCount, Stocks: [] }
            choicenessMap[c.Id].Image = Config.picBaseURL + (c.State == 1 ? c.BannerImage : c.CoverImage)
            if (c.State == 1) bannerChoice.push(choicenessMap[c.Id])
            else normalChoice.push(choicenessMap[c.Id])
        }
        let stock = Config.getQueryName(c)
        choicenessMap[c.Id].Stocks.push(stock)
        if (!allStock.contain(stock)) allStock.push(stock)
    }
    channel.sendToQueue("getSinaData", new Buffer(JSON.stringify({ type: "reset", listener: "choiceness", symbols: allStock })))
}
var intervalId;
var bannerChoice;
var normalChoice;

async function caculateAvgDelta(target) {
    let result = []
    for (let c of target) {
        let allDelta = 0;
        for (let s of c.Stocks) {
            let sp = await singleton.getLastPrice(s)
            if (sp[5]) {
                allDelta += sp[5]; //涨跌幅
            } else if (sp[5] !== 0) {
                console.log(sp, s)
            }
        }
        if (c.Stocks.length)
            allDelta = allDelta / c.Stocks.length //平均涨跌幅
        let r = Object.assign({ AvgRiseFallRange: allDelta.toFixed(2) }, c)
        delete r.Stocks
        result.push(r)
    }
    return result
}

function start() {
    intervalId = setInterval(async() => { //计算涨跌幅
        if (bannerChoice) {
            let r = await caculateAvgDelta(bannerChoice)
            redisClient.set("cacheResult:bannerChoice", JSON.stringify(r))
        }
        if (normalChoice) {
            let r = await caculateAvgDelta(normalChoice)
            redisClient.set("cacheResult:normalChoice", JSON.stringify(r))
        }
    }, 5000)
}

function stop() {
    clearInterval(intervalId)
}

startMQ()
start()