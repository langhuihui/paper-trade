import Config from '../config'
import Sequelize from 'sequelize'
import redis from 'redis'
import bluebird from 'bluebird'
import JPush from 'jpush-sdk'
import mongodb from 'mongodb'
import rongcloudSDK from 'rongcloud-sdk'
import getStockPrice from '../getSinaData/getPrice'
import sqlStr from './sqlStr'
import { dwUrls } from './driveWealth'
import request from 'request-promise'
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var _mainDB = null;
var _redisClient = null;
var _jpushClient = null;
var _realDB = null;
const EMPTY = {};
rongcloudSDK.init(Config.Rong_Appkey, Config.Rong_Secret);
let o = {
    knex: require('knex')({ client: 'mysql', connection: Config.mysqlConfig }),
    get mainDB() {
        if (!_mainDB)
            _mainDB = new Sequelize(Config.mysqlConfig.database, Config.mysqlConfig.user, Config.mysqlConfig.password, {
                dialect: "mysql",
                host: Config.mysqlConfig.host,
                port: Config.mysqlConfig.port,
                dialectOptions: {
                    dateStrings: true,
                    typeCast: Config.mysqlConfig.typeCast
                },
                timezone: '+08:00',
                logging: (...arg) => console.log(new Date().format(), ...arg)
            });
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
    selectMainDB(table, value, other, option) {
        return this.mainDB.query(...sqlStr.select2(table, value, other, option))
    },
    async selectMainDB0(table, value, other, option) {
        let [result = EMPTY] = await this.mainDB.query(...sqlStr.select2(table, value, other, option))
        return result
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
    },
    async transaction2(action) {
        let transaction = await this.mainDB.transaction();
        try {
            action({ transaction })
            await transaction.commit();
            return 0
        } catch (ex) {
            await transaction.rollback()
            return ex
        }
    },
    async sendJpushMessage(MemberCode, ...args) {
        let [result] = await this.knex("wf_im_jpush").select("JpushRegID").where({ MemberCode }).orderBy("JpushLastLoginTime", "desc").limit(1)
        if (result) {
            let { JpushRegID } = result
            this.jpushClient.push().setPlatform(JPush.ALL).setAudience(JPush.registration_id(JpushRegID))
                .setOptions(null, null, null, Config.apns_production)
                .setMessage(...args)
                .send(async(err, res) => {
                    if (err) {
                        if (err instanceof JPush.APIConnectionError) {
                            console.log(err.message)
                        } else if (err instanceof JPush.APIRequestError) {
                            console.log(err.message)
                        }
                    } else {
                        console.log(res)
                    }
                })
        }
    },
    async sendJpushNotify(MemberCode, title, msg, external) {
        let [result] = await this.knex("wf_im_jpush").select("JpushRegID").where({ MemberCode }).orderBy("JpushLastLoginTime", "desc").limit(1)
        if (result) {
            let { JpushRegID } = result
            this.jpushClient.push().setPlatform(JPush.ALL).setAudience(JPush.registration_id(JpushRegID))
                .setOptions(null, null, null, Config.apns_production)
                .setNotification(title, JPush.ios(msg, 'sound', 0, false, external), JPush.android(msg, title, 1, external))
                .send(async(err, res) => {
                    if (err) {
                        if (err instanceof JPush.APIConnectionError) {
                            console.log(err.message)
                        } else if (err instanceof JPush.APIRequestError) {
                            console.log(err.message)
                        }
                    } else {
                        console.log(res)
                    }
                })
        }
    },
    async CreateParactice(memberCode, randNum) {

        let body = {
            wlpID: "DW",
            languageID: "zh_CN",
            firstName: "f" + memberCode,
            lastName: "l" + memberCode,
            emailAddress1: memberCode + "@wolfstreet.tv",
            username: memberCode + randNum,
            password: "p" + memberCode,
            transAmount: 10000
        }
        try {
            ({ userID: body.UserId } = await request({
                uri: dwUrls.createPractice,
                method: "POST",
                body,
                json: true
            }))
            body.MemberCode = memberCode
            body.IsActivate = false
            body.username = memberCode + randNum
            body.tranAmount = 10000
            await this.mainDB.query("CALL PRC_WF_CLEAR_DW(:memberCode)", { replacements: { memberCode } })
            let result = await this.insertMainDB("wf_drivewealth_practice_account", body, { PracticeId: null, CreateTime: "now()", transAmount: null })
            this.sendJpushMessage(memberCode, '嘉维账号重置', '', '', { AlertType: "jpush111", UserId: body.userId, username: body.username, password: body.password })
            return body
        } catch (ex) {
            return this.CreateParactice(memberCode, Math.floor(Math.random() * 1000 + 1))
        }
    }
}
export default o