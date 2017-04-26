import Config from '../config'
import Sequelize from 'sequelize'
import redis from 'redis'
import bluebird from 'bluebird'
import JPush from 'jpush-sdk'
import mongodb from 'mongodb'
import rongcloudSDK from 'rongcloud-sdk'
import getStockPrice from '../getSinaData/getPrice'
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var _mainDB = null;
var _redisClient = null;
var _jpushClient = null;
var _realDB = null;
rongcloudSDK.init(Config.Rong_Appkey, Config.Rong_Secret);
let o = {
    get mainDB() {
        if (!_mainDB)
            _mainDB = new Sequelize(Config.mysqlconn, { timezone: '+08:00', logging: (...arg) => console.log(new Date().format(), ...arg) });
        return _mainDB
    },
    get redisClient() {
        if (!_redisClient)
            _redisClient = redis.createClient(Config.redisConfig);
        return _redisClient
    },
    get jpushClient() {
        if (!_jpushClient)
            _jpushClient = JPush.buildClient(Config.Jpush_Appkey, Config.Jpush_Secret)
        return _jpushClient
    },
    get realDB() {
        return _realDB;
    },
    async getRealDB() {
        if (!_realDB)
            _realDB = await mongodb.MongoClient.connect(Config.mongodbconn)
        return _realDB
    },
    get rongcloud() {
        return rongcloudSDK;
    },
    async marketIsOpen(market) {
        let marketIsOpen = await _redisClient.getAsync("marketIsOpen")
        marketIsOpen = JSON.parse(marketIsOpen)
        return market ? marketIsOpen[market] : marketIsOpen
    },
    async getLastPrice(sinaName) {
        let sp = await _redisClient.hgetAsync("lastPrice", sinaName)
        if (sp)
            sp = JSON.parse("[" + sp + "]")
        else
            sp = (await getStockPrice(sinaName))[sinaName]
        let [, , , price, pre, chg] = sp
        if (!chg) sp[5] = pre ? (price - pre) * 100 / pre : 0
        return sp
    }
}
export default o