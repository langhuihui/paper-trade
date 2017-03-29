import redis from 'redis'
import request from 'request'
import Config from '../config'
import amqp from 'amqplib'
var sequelize = Config.CreateSequelize();
var redisClient = redis.createClient(Config.redisConfig);
async function startMQ() {
    var amqpConnection = await amqp.connect(Config.amqpConn)
    let channel = await amqpConnection.createChannel()
    await channel.assertExchange("broadcast", "fanout")
    let ok = await channel.assertQueue('sinaData')
    await channel.assertQueue('getSinaData')
    ok = await channel.bindQueue('sinaData', 'broadcast', 'fanout')
    channel.consume('sinaData', msg => {
        switch (msg.content.toString()) {
            case "start": //股票引擎重启信号

                break;
        }
        channel.ack(msg)
    })
    let choiceness = await sequelize.query('select a.Id,a.`Code`,a.Title,a.Details,a.content,a.CoverImage,a.BannerImage,a.Provenance,a.StocksCount,a.State,b.Id SecuritiesId,b.SecuritiesType,b.SecuritiesNo,b.SecuritiesName from wf_choiceness a, wf_choiceness_stock b where a.`Code` = b.ChoiceCode and a.`Status` = 1 order by a.Id desc')
    choiceness = choiceness[0]

    console.log(choiceness)
        //redisClient.mset()
}

var intervalId;

function start() {
    intervalId = setInterval(() => {
        redisClient.getAsync()
    }, 5000)
}

function stop() {
    clearInterval(intervalId)
}

startMQ()
start()