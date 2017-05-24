import redis from 'redis'
import request from 'request-promise'
import Config from '../config'
import singleton from '../common/singleton'
import { dwUrls } from '../common/driveWealth'
import amqp from 'amqplib'
const { mainDB, redisClient } = singleton
var getDataTimeout1 = 10000
var getDataTimeout2 = 15000
var calculateTimeout = 10000
var mdbData = new Map()
const ranka = "wf_ussecurities_rank_a"
const rankb = "wf_ussecurities_rank_b"

function startGetData() {
    setTimeout(async() => {
        let marketIsOpen = await singleton.marketIsOpen2()
        if (marketIsOpen.us) {
            console.log(new Date() + "--------getDataTimeout1=" + getDataTimeout1 + "---------------")
            console.log(new Date() + "--------getDWData1 begin---------------")
            await writetoredis()
            var amqpConnection = await amqp.connect(Config.amqpConn)
            let mqChannel = await amqpConnection.createChannel()
            mqChannel.sendToQueue("calcuateUSStockData", new Buffer(JSON.stringify({ cmd: "getData" })))
            console.log(new Date() + "--------getDWData1 end---------------")
        } else {
            console.log(new Date() + "--------getDataTimeout1=" + getDataTimeout1 + "---------------")
            console.log(new Date() + "--------US STOCK NOT OPEN---------------")
            getDataTimeout1 = 10000
        }
        startGetData()
    }, getDataTimeout1);

}


function startGetData1() {
    setTimeout(async() => {
        let marketIsOpen = await singleton.marketIsOpen2()
        if (marketIsOpen.us) {
            console.log(new Date() + "--------getDataTimeout2=" + getDataTimeout2 + "---------------")
            console.log(new Date() + "--------getDWData2 begin---------------")
            await writetoredis2()
            var amqpConnection = await amqp.connect(Config.amqpConn)
            let mqChannel = await amqpConnection.createChannel()
            mqChannel.sendToQueue("calcuateUSStockData", new Buffer(JSON.stringify({ cmd: "getData" })))
            console.log(new Date() + "--------getDWData2 end---------------")
        } else {
            console.log(new Date() + "--------getDataTimeout2=" + getDataTimeout2 + "---------------")
            console.log(new Date() + "--------US STOCK NOT OPEN---------------")
            getDataTimeout2 = 15000
        }
        startGetData1()
    }, getDataTimeout2);

}

function startcalculateData() {
    setTimeout(async() => {
        let marketIsOpen = await singleton.marketIsOpen2()
        if (marketIsOpen.us) {
            console.log(new Date() + "--------calculateTimeout=" + calculateTimeout + "---------------")
            console.log(new Date() + "--------calculateData begin---------------")
            await calculateData()
            console.log(new Date() + "--------calculateData end---------------")
        } else {
            console.log(new Date() + "--------calculateTimeout=" + calculateTimeout + "---------------")
            console.log(new Date() + "--------US STOCK NOT OPEN---------------")
            calculateTimeout = 10000
        }
        startcalculateData()
    }, calculateTimeout);
}

if (!Config.getDWData) {
    //if (true) {
    (async() => {
        var amqpConnection = await amqp.connect(Config.amqpConn)
        let mqChannel = await amqpConnection.createChannel()
        let ok = await mqChannel.assertQueue('calcuateUSStockData')
        mqChannel.consume('calcuateUSStockData', msg => {
            console.log(new Date() + "getmqinfo and then start to calculateData")
            calculateData()
            console.log(new Date() + "calculateData end ")
            mqChannel.ack(msg)
        })
    })()
}

/**
 * 写入美股最新价格,计算涨跌幅
 */
async function calculateData() {
    console.time('calculateData cost time:');
    addRankStock(await mainDB.query("select * from wf_securities_trade where Remark='DW'", { type: "SELECT" }))
    let result = await redisClient.hgetallAsync("newestUSPrice");
    if (result) {
        await Promise.all(Object.keys(result).map(k => {
            return redisClient.hgetAsync("lastPrice", Config.getQueryName({ SecuritiesType: "us", SecuritiesNo: k })).then(a => {
                if (a) {
                    a = JSON.parse("[" + a + "]")
                    a[3] = result[k]
                    let [, , , price, pre, chg] = a //开，高，低，新,昨收
                    a[5] = pre ? (price - pre) * 100 / pre : 0
                    redisClient.hset("usDWLastPrice", k, a.join(","))
                    if (mdbData.has(k)) {
                        let info = mdbData.get(k);
                        info.RiseFallRange = a[5];
                        info.NewPrice = price;
                        info.hasNewPrice = 1
                    }
                }
            })
        }))

        let currentRankTable = await redisClient.getAsync("currentUSSRT")
        if (!currentRankTable) {
            currentRankTable = ranka
            redisClient.set("currentUSSRT", rankb)
        } else {
            await redisClient.setAsync("currentUSSRT", currentRankTable == ranka ? rankb : ranka)
        }
        let collection = (await singleton.getRealDB()).collection(currentRankTable);
        try { await collection.drop() } catch (ex) {}
        collection.insertMany(Array.from(mdbData.values()))
        console.timeEnd('calculateData cost time:');
    }
}




/**获取查询股票的代码sina */
function getQueryName({ QueryUrlCode, SecuritiesNo }) {
    return SecuritiesNo.toUpperCase().replace(".", "$")
}

/**
 * 将数据插出map对象中,并以stockname为key值
 * @param {key值} ccss 
 */
function addRankStock(ccss) {
    for (let ccs of ccss) {
        mdbData.set(getQueryName(ccs), ccs)
    }
}

/**
 * 将嘉维最新股票数据写入Redis
 */
async function writetoredis() {
    let start = new Date()
    console.time('get dwdata cost time: ');

    let result = await getDWLastPrice()
    result.map(({ symbol, close }) => {
        if (symbol != "" && symbol != undefined && close != "" && close != undefined) redisClient.hmset("newestUSPrice", symbol, close)
    })
    let end = new Date()
    console.timeEnd('get dwdata cost time: ');
    getDataTimeout1 = 2000
    getDataTimeout2 = 2000
}

/**
 * 将嘉维最新股票数据写入Redis
 */
async function writetoredis2() {
    let start = new Date()
    console.time('get dwdata cost time: ');

    let result = await getDWLastPrice2()
    result.map(({ symbol, close }) => {
        if (symbol != "" && symbol != undefined && close != "" && close != undefined) redisClient.hmset("newestUSPrice", symbol, close)
    })
    let end = new Date()
    console.timeEnd('get dwdata cost time: ');
    getDataTimeout1 = 2000
    getDataTimeout2 = 2000
}

/**
 * 从嘉维获取sessionkey
 */
async function getSessionKey() {
    let sessionKey = await redisClient.getAsync("sessionForGetDWData")
    if (!sessionKey) {
        try {
            ({ sessionKey } = await request({
                uri: dwUrls.createSession,
                //uri: "http://api.drivewealth.io/v1/userSessions",
                method: "POST",
                body: {
                    "appTypeID": "2000",
                    "appVersion": "0.1",
                    "username": "16459847",
                    "emailAddress": "16459847@wolfstreet.tv",
                    "ipAddress": "1.1.1.1",
                    "languageID": "zh_CN",
                    "osVersion": "iOS 9.1",
                    "osType": "iOS",
                    "scrRes": "1920x1080",
                    "password": "p16459847"
                },
                json: true
            }))
            await redisClient.setAsync("sessionForGetDWData", sessionKey);
            return sessionKey
        } catch (ex) {
            return getSessionKey()
        }
    }

}
/**
 * 从嘉维获取sessionkey
 */
async function getSessionKey2() {
    let sessionKey = await redisClient.getAsync("sessionForGetDWData2")
    if (!sessionKey) {
        try {
            ({ sessionKey } = await request({
                uri: dwUrls.createSession,
                //uri: "http://api.drivewealth.io/v1/userSessions",
                method: "POST",
                body: {
                    "appTypeID": "2000",
                    "appVersion": "0.1",
                    "username": "12695763282",
                    "emailAddress": "12695763@wolfstreet.tv",
                    "ipAddress": "1.1.1.1",
                    "languageID": "zh_CN",
                    "osVersion": "iOS 9.1",
                    "osType": "iOS",
                    "scrRes": "1920x1080",
                    "password": "p12695763"
                },
                json: true
            }))
            await redisClient.setAsync("sessionForGetDWData2", sessionKey);
            return sessionKey
        } catch (ex) {
            return getSessionKey2()
        }
    }
}
/**
 * 从嘉维获取最新股票价格
 */
async function getDWLastPrice() {
    let sessionKey = await getSessionKey()
    console.log(sessionKey + "33333")
    let result = {}
    try {
        result = await request({
            headers: { 'x-mysolomeo-session-key': sessionKey },
            method: "GET",
            //encoding: null,
            uri: "http://api.drivewealth.net/v1/instruments", //所有股票
            //uri: "http://api.drivewealth.net/v1/instruments?symbols=" + postdata,//单个股票
            json: true
        })
    } catch (ex) {
        console.log(ex.statusCode)
        if (ex.statusCode == 401) {
            await redisClient.delAsync("sessionForGetDWData");
            return getDWLastPrice()
        }
    }
    return result
}

/**
 * 从嘉维获取最新股票价格
 */
async function getDWLastPrice2() {
    let sessionKey = await getSessionKey2()
    console.log(sessionKey)
    let result = {}
    try {
        result = await request({
            headers: { 'x-mysolomeo-session-key': sessionKey },
            method: "GET",
            //encoding: null,
            uri: "http://api.drivewealth.net/v1/instruments", //所有股票
            //uri: "http://api.drivewealth.net/v1/instruments?symbols=" + postdata,//单个股票
            json: true
        })
    } catch (ex) {
        console.log(ex.statusCode)
        if (ex.statusCode == 401) {
            await redisClient.delAsync("sessionForGetDWData2");
            return getDWLastPrice2()
        }
    }
    return result
}

if (Config.getDWData) {
    startGetData()
        //startGetData1()
}
//startGetData1()
//startcalculateData()