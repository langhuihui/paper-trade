//import Config from '../config'
import totalAssets from './everyDays/totalAssets'
import profitRank from './everyDays/profitRank'
import marketTime from './everyDays/marketTime'
import competition from './everyDays/competition'
import singleton from './singleton'
const { redisClient } = singleton
// import amqp from 'amqplib'

// async function startMQ() {
//     let amqpConnection = await amqp.connect(Config.amqpConn)
//     let channel = await amqpConnection.createChannel()
//     let ok = await channel.assertQueue('common')
//     channel.consume('common', msg => {
//         let data = JSON.parse(msg.content.toString())

//         channel.ack(msg)
//     })
// }
// startMQ()

//每天执行函数
let everyDayFuns = [
    totalAssets, marketTime, profitRank, competition
]
async function initEveryDayFuns() {
    for (let f of everyDayFuns) {
        let flag = await redisClient.hgetAsync('timeRunFlag', f.name)
        if (flag) {
            f.lastRun = new Date(flag)
        }
    }
}
initEveryDayFuns()
setInterval(() => {
    let now = new Date()
    for (let f of everyDayFuns) {
        if (f.checkAndRun(now)) {
            redisClient.hset('timeRunFlag', f.name, now)
        }
    }
    if (marketTime.setRedis) marketTime.setRedis(now)
    else {
        marketTime.callback().then(() => {
            marketTime.setRedis(now)
        })
    }
}, 1000)