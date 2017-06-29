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
import sqlstr from '../common/sqlStr'
import singleton from '../common/singleton'
const { mainDB, redisClient, rongcloud } = singleton

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('jshtml', require('jshtml-express'));
app.set('view engine', 'jshtml');
app.set('views', path.resolve(__dirname, 'views'))
app.use('/h5', express.static(path.resolve(__dirname, 'assets')))
if (Config.test) app.use('/admin', express.static(path.resolve(__dirname, 'web', 'dist')))
app.use((req, res, next) => {
    if (req.body.Token) delete req.body.Token
    next()
})
const statistic = new Statistic()
const wrap = fn => (...args) => fn(...args).catch(err => args[2] ? args[2](err) : console.error(new Date(), err))
let shareData = { config: Config, wrap, rongcloud, statistic, express, checkEmpty, checkNum, mainDB, redisClient, ctt: checkToken(true), ctf: checkToken(false) } //路由中的共享数据
async function startMQ() {
    var amqpConnection = await amqp.connect(Config.amqpConn)
    let channel = await amqpConnection.createChannel()
    let ok = await channel.assertQueue('priceNotify')
    shareData.mqChannel = channel
    shareData.realDB = await singleton.getRealDB()
    app.use('/v2.5/Home', require('./routes/homePage')(shareData))
    app.use('/v2.5/Trade', require('./routes/trade')(shareData))
    app.use('/v2.5/Personal', require('./routes/personal')(shareData))
    app.use('/v2.5/ImageTalk', require('./routes/imageTalk')(shareData))
    app.use('/v2.5/Choiceness', require('./routes/choiceness')(shareData))
    app.use('/v2.5/DriveWealth', require('./routes/drivewealth')(shareData))
    app.use('/v2.5/Video', require('./routes/video')(shareData))
    app.use('/v2.5/Game', require('./routes/stockcompetition')(shareData))
    app.use('/v2.5/PaperTrade', require('./routes/paperTrade')(shareData))
    app.use('/v2.5/Statistics', require('./routes/statistics')(shareData))
    app.use('/v2.7/User', require('./routes/user')(shareData))
    app.use('/h5', require('./routes/h5')(shareData))
    if (Config.test) app.use('/admin', require('./routes/admin')(shareData))
        /**全局错误处理 */
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.send({ Status: 500, Explain: err.stack })
    })
}
startMQ();

/**客户端初始化配置 */
app.get('/System/GetConfig', checkEmpty('version'), wrap(async({ query: { version, dbVersion, memberCode, UUID, IMEI = "", token } }, res) => {
    let TokenValid = false
    if (token) {
        let { ValidityTime = false } = await singleton.selectMainDB0("wf_token", { TokenValue: token })
        TokenValid = ValidityTime && (Date.parse(ValidityTime) + config.tokenTime * 60 > new Date().getTime())
    }
    let setting = version && config.clientInit[version] ? Object.assign({}, config.clientInit[version]) : Object.assign(Object.assign({}, config.clientInitDefault), config.clientInitAll)
    if (dbVersion) {
        let [dbResult] = await mainDB.query('select * from wf_securities_version where Versions>:dbVersion order by Versions asc', { replacements: { dbVersion } })
        if (dbResult.length) {
            //let maxVersion = dbResult.last.Versions
            dbResult = dbResult.map(x => x.Content)
            setting.updateSQL = dbResult.join('');
        }
    }
    res.send({ Status: 0, Explain: "", Config: setting, TokenValid })
        //埋点
    statistic.login({ LoginId: memberCode ? memberCode : (UUID ? UUID : IMEI), DataSource: UUID ? "ios" : "android", AppVersion: version, IsLogin: memberCode != null })
}));


let server = app.listen(config.port, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log('server listening at %s %d', host, port);
});