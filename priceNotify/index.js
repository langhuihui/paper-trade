import express from 'express'
import Iconv from 'iconv-lite'
import bodyParser from 'body-parser'
import Config from '../config'
import http from 'http'
import Sequelize from 'sequelize'
import JPush from 'jpush-sdk'
import amqp from 'amqplib'
// var amqpConnection = amqp.connect(Config.amqpConn)
// amqpConnection.then(conn => conn.createChannel()).then(ch => {
//     console.log('amqp ready!')
//     return ch.assertQueue('priceNotify').then(ok => ch.consume('priceNotify', msg => {
//         console.log(msg.content);
//         ch.ack(msg)
//     }))
// }).catch(console.warn);

async function start() {
    var amqpConnection = await amqp.connect(Config.amqpConn)
    let channel = await amqpConnection.createChannel()
    let ok = await channel.assertQueue('priceNotify')
    channel.consume('priceNotify', msg => {
        var data = JSON.parse(Iconv.decode(msg.content, 'utf-8'))

        channel.ack(msg)
    })
}
start()

const jpush = JPush.buildClient(Config.Jpush_Appkey, Config.Jpush_Secret)
var sequelize = new Sequelize(Config.mysqlconn)

let sql = "select a.*,b.JpushRegID from wf_securities_remind a LEFT JOIN wf_im_jpush b on a.MemberCode = b.MemberCode WHERE a.IsOpenLower=1 or a.IsOpenUpper=1 or a.IsOpenRiseFall=1 "

var stocks = {}
var stocksRef = {}
var stocks_name = ""
var notifies = {}
sequelize.query(sql).then(ns => {
    for (let n of ns[0]) {
        n.IsOpenLower = n.IsOpenLower[0] == 1
        n.IsOpenUpper = n.IsOpenUpper[0] == 1
        n.IsOpenRiseFall = n.IsOpenRiseFall[0] == 1
        notifies[n.RemindId] = n
        let name = Config.sina_qmap[n.SmallType] + n.SecuritiesNo
        if (!stocksRef[name]) {
            stocksRef[name] = 1
            if (!stocks_name) stocks_name = name
            else stocks_name += "," + name
        } else stocksRef[name]++
            //console.log(n)
    }
})
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', (req, res) => {
        res.json({ notifies, stocks_name, stocks })
    })
    //添加提醒
app.use('/addNotify', (req, res) => {
    let { SmallType, SecuritiesNo, RemindId } = req.body
    let name = Config.sina_qmap[SmallType] + SecuritiesNo
    notifies[RemindId] = req.body
    if (!stocksRef[name]) {
        stocksRef[name] = 1
        if (!stocks_name) stocks_name = name
        else stocks_name += "," + name
    } else stocksRef[name]++
        res.json({ Status: 0, Explain: "" })
        //res.cookie('user', 'value', { signed: true })
})
app.use('/modifyNotify', (req, res) => {
    let { SmallType, SecuritiesNo, RemindId } = req.body
    let name = Config.sina_qmap[SmallType] + SecuritiesNo
    notifies[RemindId] = req.body
})
app.use('/updateJpushRegID', (req, res) => {
    let { MemberCode, JpushRegID } = req.body
    for (let nid in notifies) {
        let notify = notifies[nid]
        if (notify.MemberCode == MemberCode) notify.JpushRegID = JpushRegID
    }
})

function sendNotify(type, nofity, price) {
    let msg = "沃夫街股价提醒:" + nofity.SecuritiesNo
    switch (type) {
        case 0:
            msg += ` 当前价格 ${price} 已经向下击穿 ${nofity.LowerLimit}`
            break
        case 1:
            msg += ` 当前价格 ${price} 已经向下突破 ${nofity.IsOpenUpper}`
            break
        case 2:
            msg += ` 当前振幅 ${price} 已经超过 ${nofity.RiseFall}`
            break
    }
    jpush.push().setPlatform(JPush.ALL).setAudience(JPush.registration_id(nofity.JpushRegID))
        .setNotification('股价提醒', JPush.ios(msg, 'sound', 0, false, { AlertType: Config.jpushType, SmallType: nofity.SmallType, SecuritiesNo: nofity.SecuritiesNo }), JPush.android(msg, '沃夫街股价提醒', 1, { AlertType: Config.jpushType, SmallType: nofity.SmallType, SecuritiesNo: nofity.SecuritiesNo }))
        .send((err, res) => {
            if (err) {
                if (err instanceof JPush.APIConnectionError) {
                    console.log(err.message)
                } else if (err instanceof JPush.APIRequestError) {
                    console.log(err.message)
                }
            } else {
                console.log('Sendno: ' + res.sendno)
                console.log('Msg_id: ' + res.msg_id)
            }
        })
}
setInterval(() => {
    if (stocks_name) //调用新浪接口
        http.get(Config.sina_realjs + stocks_name, res => {
        var arrBuf = [];
        res.on('data', chunk => arrBuf.push(chunk));
        res.on('end', () => {
            if (!arrBuf.length) {
                return
            }
            let rawData = Iconv.decode(Buffer.concat(arrBuf), 'gb2312')
            let config = Config
            eval(rawData + '  for (let stockName in stocksRef){let q = config.stockPatten.exec(stockName)[1];stocks[stockName] = eval("hq_str_" + stockName).split(",").map(x=>[x[config.lastPriceIndexMap[q]],config.chgFunc[q](x)])}')
            for (let nid in notifies) {
                let notify = notifies[nid]
                let name = Config.sina_qmap[notify.SmallType] + notify.SecuritiesNo
                let price = stocks[name][0]
                let chg = Math.abs(stocks[name][1])
                if (notify.IsOpenLower) {
                    if (notify.isLowSent) {
                        if (price > notify.LowerLimit) {
                            //恢复状态
                            notify.isLowSent = false
                        }
                    } else {
                        if (price < notify.LowerLimit) {
                            //向下击穿
                            sendNotify(0, notify, price)
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
                            sendNotify(1, notify, price)
                            notify.isUpperSent = true
                        }
                    }
                }
                if (notify.IsOpenRiseFall) {
                    if (notify.isChgSent) {
                        if (chg < notify.RiseFall) {
                            //恢复状态
                            notify.isChgSent = false
                        }
                    } else {
                        if (chg > notify.RiseFall) {
                            //向上突破
                            sendNotify(2, notify, chg)
                            notify.isChgSent = true
                        }
                    }
                }
            }
        });
    })
}, 5000)
let server = app.listen(process.env.PORT, function() {
    let host = server.address().address;
    let port = server.address().port;

    console.log('server listening at %s %d', host, port);
});