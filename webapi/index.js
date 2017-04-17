import checkToken from './middles/checkToken'
import checkEmpty from './middles/checkEmpty'
import checkNum from './middles/checkNum'
import Statistic from './statistic'
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
if (Config.test) app.use('/admin', express.static(path.resolve(__dirname, 'web', 'dist')))
app.use((req, res, next) => {
    if (req.body.Token) delete req.body.Token
    next()
})
const statistic = new Statistic({ sequelize })
const wrap = fn => (...args) => fn(...args).catch(args[2])
let shareData = { config: Config, wrap, rongcloudSDK, statistic, express, checkEmpty, checkNum, sequelize, redisClient, ctt: checkToken(sequelize, true), ctf: checkToken(sequelize, false) } //路由中的共享数据
async function startMQ() {
    var amqpConnection = await amqp.connect(Config.amqpConn)
    let channel = await amqpConnection.createChannel()
    let ok = await channel.assertQueue('priceNotify')
    shareData.mqChannel = channel
    app.use('/v2.5/Home', require('./routes/homePage')(shareData))
    app.use('/v2.5/Trade', require('./routes/trade')(shareData))
    app.use('/v2.5/Personal', require('./routes/personal')(shareData))
    app.use('/v2.5/ImageTalk', require('./routes/imageTalk')(shareData))
    app.use('/v2.5/Choiceness', require('./routes/choiceness')(shareData))
    app.use('/v2.5/DriveWealth', require('./routes/drivewealth')(shareData))
    if (Config.test) app.use('/admin', require('./routes/admin')(shareData))
        /**全局错误处理 */
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.send({ Status: 500, Explain: err })
    })
}
startMQ();

/**客户端初始化配置 */
app.get('/System/GetConfig', checkEmpty('version'), wrap(async(req, res) => {
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
    //埋点
    statistic.login({ LoginId: memberCode ? memberCode : (UUID ? UUID : IMEI), DataSource: UUID ? "ios" : "android", AppVersion: version, IsLogin: memberCode != null })
    res.send({ Status: 0, Explain: "", Config: setting })
}));


let server = app.listen(config.port, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log('server listening at %s %d', host, port);
});