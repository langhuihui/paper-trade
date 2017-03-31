import checkLogin from '../checkToken'
import express from 'express'
import bodyParser from 'body-parser'
import Config from '../config'
import Sequelize from 'sequelize'
import redis from 'redis'
import bluebird from 'bluebird'
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var sequelize = Config.CreateSequelize();
var redisClient = redis.createClient(Config.redisConfig);
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/System/GetConfig', async(req, res) => {
    let { version } = req.params
    if (!version) res.status(200).send({ Status: 40002, Explain: "没有提供版本号" })
    let config = await sequelize.query("select * from wf_system_appconfig where AppVersion = '" + version + "'")
    config = config[0]
    let setting = {}
    for (let c of config) {
        setting[c.AppKey] = c.AppVersion
    }
    res.status(200).send({ Status: 0, Explain: "", Config: setting })
        //     wf_system_appconfig
        //       `Id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'app配置表',
        //   `AppKey` varchar(128) COMMENT 'Key值',
        //   `AppValue` varchar(128) COMMENT 'Value值',
        //   `AppVersion` varchar(20) COMMENT 'App版本',
        //   `CreateTime` datetime COMMENT '创建时间',
})
app.get('/v2.5/Choiceness/ChoicenessBannerList', async(req, res) => {
    let result = await redisClient.getAsync("cacheResult:bannerChoice")
    return res.status(200).send('{"Status":"0","Explain":"ok","Data":' + result + '}')
        // let page = req.param("page", 0)
        // let size = req.param("size", 10)
        // console.log(page, size)
        // return res.json({ page, size })
})
app.get('/v2.5/Choiceness/ChoicenessList', async(req, res) => {
    let result = await redisClient.getAsync("cacheResult:normalChoice")
    return res.status(200).send('{"Status":"0","Explain":"ok","Data":' + result + '}')
        // let page = req.param("page", 0)
        // let size = req.param("size", 10)
        // let maxId = req.param("maxId")
        // console.log(page, size)
        // return res.json({ page, size, maxId })
})
app.get('/orders', [checkLogin(true)], async(req, res) => {

})
app.delete('/orders', [checkLogin(true)], (req, res) => {

})
let server = app.listen(Config.webapiPort, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log('server listening at %s %d', host, port);
});