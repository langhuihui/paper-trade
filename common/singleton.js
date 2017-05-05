import Config from '../config'
import Sequelize from 'sequelize'
import redis from 'redis'
import bluebird from 'bluebird'
import JPush from 'jpush-sdk'
import mongodb from 'mongodb'
import rongcloudSDK from 'rongcloud-sdk'
import getStockPrice from '../getSinaData/getPrice'
import sqlStr from './sqlStr'
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var _mainDB = null;
var _redisClient = null;
var _jpushClient = null;
var _realDB = null;
const EMPTY = {};
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
        let marketIsOpen = await this.redisClient.getAsync("marketIsOpen")
        marketIsOpen = JSON.parse(marketIsOpen)
        return market ? marketIsOpen[market] : marketIsOpen
    },
    async marketIsOpen2(market) { //延迟1分钟收盘
        let marketIsOpen = await this.redisClient.getAsync("marketIsOpen2")
        marketIsOpen = JSON.parse(marketIsOpen)
        return market ? marketIsOpen[market] : marketIsOpen
    },
    async getLastPrice(sinaName) {
        let sp = await this.redisClient.hgetAsync("lastPrice", sinaName)
        if (sp)
            sp = JSON.parse("[" + sp + "]")
        else
            sp = (await getStockPrice(sinaName))[sinaName]
        let [, , , price, pre, chg] = sp
        if (!chg) sp[5] = pre ? (price - pre) * 100 / pre : 0
        return sp
    },
    async insertMainDB(table, value, other, option) {
        let [result] = await this.mainDB.query(...sqlStr.insert2(table, value, other, option))
        return result
    },
    async updateMainDB(table, value, other, where = "", option) {
        let [result] = await this.mainDB.query(...sqlStr.update2(table, value, other, where, option))
        return result
    },
    async selectMainDB(table, value, other, option) {
        let [result] = await this.mainDB.query(...sqlStr.select2(table, value, other, option))
        return result
    },
    async selectMainDB0(table, value, other, option) {
        let [result] = await this.mainDB.query(...sqlStr.select2(table, value, other, option))
        return result.length ? result[0] : EMPTY
    },
    async deleteMainDB(table, value, other, option) {
        let [result] = await this.mainDB.query(...sqlStr.delete2(table, value, other, option))
        return result
    },
    isEMPTY(value) {
        return value === EMPTY
    },
    async transaction(action) {
        let transaction = await this.mainDB.transaction();
        try {
            await action({ transaction })
            await transaction.commit();
            return 0
        } catch (ex) {
            await transaction.rollback()
            return ex
        }
    }
}
export default o