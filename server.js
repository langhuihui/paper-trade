import express from 'express'
import Iconv from 'iconv-lite'
import bodyParser from 'body-parser'
import Config from './config'
import http from 'http'
import Sequelize from 'sequelize'
import JPush from 'jpush-sdk'
const jpush = JPush.buildClient(Config.Jpush_Appkey, Config.Jpush_Secret)
var sequelize = new Sequelize(Config.mysqlconn)
var Notify = sequelize.define('wf_securities_remind', {
    RemindId: Sequelize.BIGINT,
    MemberCode: Sequelize.STRING,
    SmallType: Sequelize.STRING,
    SecuritiesNo: Sequelize.STRING,
    LowerLimit: Sequelize.DECIMAL,
    IsOpenLower: Sequelize.BOOLEAN,
    UpperLimit: Sequelize.DECIMAL,
    IsOpenUpper: Sequelize.BOOLEAN,
    RiseFall: Sequelize.DECIMAL,
    IsOpenRiseFall: Sequelize.BOOLEAN,
    CreateTime: Sequelize.DATE
})
var WfJPush = sequelize.define('wf_im_jpush', {
    JpushID: Sequelize.BIGINT,
    MemberCode: Sequelize.STRING,
    JpushRegID: Sequelize.STRING,
    JpushIMEI: Sequelize.STRING,
    JpushDeviceID: Sequelize.STRING,
    JpushVersion: Sequelize.STRING,
    JpushPlatform: Sequelize.STRING,
    JpushLastLoginTime: Sequelize.DATE,
    CreateTime: Sequelize.DATE
})
var stocks = {}
var stocksRef = {}
var stocks_name = ""
var notifies = {}
Notify.findAll({ where: { $or: { IsOpenLower: true, IsOpenUpper: true, IsOpenRiseFall: true } }, include: [{ model: WfJPush, as: 'Jpush', where: { MemberCode: Sequelize.col('wf_securities_remind.MemberCode') }, order: "JpushLastLoginTime DESC" }] }).then(ns => {
    for (let n of ns) {
        notifies[n.RemindId] = n
    }
})
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', (req, res) => {
        res.json({ notifies })
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
        res.json({ status: 0 })
        //res.cookie('user', 'value', { signed: true })
})
app.use('/modifyNotify', (req, res) => {
    let { SmallType, SecuritiesNo, RemindId } = req.body
    let name = Config.sina_qmap[SmallType] + SecuritiesNo
    notifies[RemindId] = req.body
})

function sendNotify(type, nofity, price) {
    jpush.push().setPlatform(JPush.ALL).setAudience(JPush.ALL)
        .setNotification('Hi, JPush', JPush.ios('ios alert', 'sound', 0, false, {}), JPush.android('android alert', 'title', 1, {}))
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

            eval(rawData + '  for (let stockName in stocksRef)let q = Config.stockPatten.exec(stockName).$1;stocks[stockName] = eval("hq_str_" + stockName).split(",").map(x=>[x[Config.lastPriceIndexMap[q]],Config.chgFunc[q](x)])')
            for (let nid in notifies) {
                let notify = notifies[nid]
                let name = Config.sina_qmap[SmallType] + SecuritiesNo
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