import Config from '../config'
import totalAssets from './everyDays/totalAssets'
import profitRank from './everyDays/profitRank'
import marketTime from './everyDays/marketTime'
import competition from './everyDays/competition'
import singleton from './singleton'
const { redisClient } = singleton
import amqp from 'amqplib'
//每天执行函数
let everyDayFuns = {
    totalAssets,
    marketTime,
    profitRank,
    competition
}
async function startMQ() {
    let amqpConnection = await amqp.connect(Config.amqpConn)
    let channel = await amqpConnection.createChannel()
    let ok = await channel.assertQueue('common')
    channel.consume('common', msg => {
        let data = JSON.parse(msg.content.toString())
        switch (data.type) {
            case "call":
                let func = data.func.split('.')
                if (data.args)
                    everyDayFuns[func[0]][func[1]](...data.args)
                else everyDayFuns[func[0]][func[1]]()
                break
        }
        channel.ack(msg)
    })
}
startMQ()


async function initEveryDayFuns() {
    for (let f in everyDayFuns) {
        let flag = await redisClient.hgetAsync('timeRunFlag', f)
        if (flag) {
            everyDayFuns[f].lastRun = new Date(flag)
        }
    }
}
initEveryDayFuns()
setInterval(() => {
    let now = new Date()
    for (let f in everyDayFuns) {
        if (everyDayFuns[f].checkAndRun(now)) {
            redisClient.hset('timeRunFlag', f, now)
        }
    }
    if (marketTime.setRedis) marketTime.setRedis(now)
    else {
        marketTime.callback().then(() => {
            marketTime.setRedis(now)
        })
    }
}, 1000)