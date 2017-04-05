import Config from '../config'
import totalAssets from './everyDays/totalAssets'
// import amqp from 'amqplib'
let sequelize = Config.CreateSequelize()
let redisClient = Config.CreateRedisClient();
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
    totalAssets
]
async function initEveryDayFuns() {
    for (let f of everyDayFuns) {
        let flag = await redisClient.getAsync('timeRunFlag:' + f.name)
        if (flag) {
            f.lastRun = new Date(flag)
        }
    }
}
initEveryDayFuns()
setInterval(() => {
    let now = new Date()
    for (let f of everyDayFuns) {
        if (f.checkAndRun(now, { Config, sequelize })) {
            redisClient.set('timeRunFlag:' + f.name, now)
        }
    }
}, 1000)