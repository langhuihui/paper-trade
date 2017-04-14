import checkToken from './middles/checkToken'
import checkEmpty from './middles/checkEmpty'
import checkNum from './middles/checkNum'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import Config from '../config'
import config from './config'
import amqp from 'amqplib'
import rongcloudSDK from 'rongcloud-sdk'
import sqlstr from '../common/sqlStr'
rongcloudSDK.init(Config.Rong_Appkey, Config.Rong_Secret);
var sequelize = Config.CreateSequelize();
var redisClient = Config.CreateRedisClient();
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
if (Config.test) app.use('/web', express.static(path.resolve(__dirname, 'web', 'dist')))
    /**全局错误处理 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.send({ Status: 500, Explain: err })
})
let shareData = { config: Config, rongcloudSDK, express, checkEmpty, checkNum, sequelize, redisClient, ctt: checkToken(sequelize, true), ctf: checkToken(sequelize, false) } //路由中的共享数据
async function startMQ() {
    var amqpConnection = await amqp.connect(Config.amqpConn)
    let channel = await amqpConnection.createChannel()
    let ok = await channel.assertQueue('priceNotify')
    shareData.mqChannel = channel
    app.use('/v2.5/Home', require('./routes/homePage')(shareData))
    app.use('/v2.5/Trade', require('./routes/trade')(shareData))
    app.use('/v2.5/Personal', require('./routes/personal')(shareData))
    app.use('/v2.5/ImageTalk', require('./routes/imageTalk')(shareData))
    if (Config.test) app.use('/test', require('./routes/admin')(shareData))
}
startMQ();

/**客户端初始化配置 */
app.get('/System/GetConfig', checkEmpty('version'), async(req, res) => {
    let { version, dbVersion, memberCode, UUID, IMEI } = req.query
    let setting = Object.assign({}, version && config.clientInit[version] ? config.clientInit[version] : config.clientInitDefault)
    if (dbVersion) {
        let [dbResult] = await sequelize.query('select * from wf_securities_version where Versions>:dbVersion order by Versions asc', { replacements: { dbVersion } })
        if (dbResult.length) {
            //let maxVersion = dbResult.last.Versions
            dbResult = dbResult.map(x => x.Content)
            setting.updateSQL = dbResult.join('');
        }
    }
    /**埋点*/
    let statistic = { LoginId: memberCode ? memberCode : (UUID ? UUID : IMEI), DataSource: UUID ? "ios" : "android", AppVersion: version, IsLogin: memberCode != null };
    sequelize.query(...sqlstr.insert2("wf_statistics_login", statistic, { CreateTime: "now()" }));
    /**end*/
    res.send({ Status: 0, Explain: "", Config: setting })
});
/**获取精选头部列表 */
app.get('/v2.5/Choiceness/ChoicenessBannerList', async(req, res) => {
    try {
        let result = await redisClient.getAsync("cacheResult:bannerChoice")
        res.send('{"Status":0,"Explain":"ok","Data":' + result + '}')
    } catch (ex) {
        res.send({ Status: 500, Explain: ex })
    }
});
/**获取精选列 */
app.get('/v2.5/Choiceness/ChoicenessList', async(req, res) => {
    try {
        let result = await redisClient.getAsync("cacheResult:normalChoice");
        /**埋点*/
        let statistic = { LoginId: req.memberCode, TypeId: 4, AppVersion: version, IsLogin: memberCode != null };
        sequelize.query(...sqlstr.insert2("wf_statistics_module", statistic, { CreateTime: "now()" }));
        /**end*/
        res.send('{"Status":0,"Explain":"ok","Data":' + result + '}')
    } catch (ex) {
        res.send({ Status: 500, Explain: ex })
    }
})

let server = app.listen(config.port, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log('server listening at %s %d', host, port);
});