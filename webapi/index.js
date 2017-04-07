import checkToken from './middles/checkToken'
import checkEmpty from './middles/checkEmpty'
import checkNum from './middles/checkNum'
import express from 'express'
import bodyParser from 'body-parser'
import Config from '../config'
import config from './config'
var sequelize = Config.CreateSequelize();
var redisClient = Config.CreateRedisClient();
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
let shareData = { config: Config, express, checkEmpty, checkNum, sequelize, ctt: checkToken(sequelize, true), ctf: checkToken(sequelize, false) } //路由中的共享数据
app.use('/v2.5/Trade', require('./routes/trade')(shareData))
app.use('/v2.5/Personal', require('./routes/personal')(shareData))
app.use('/v2.5/ImageTalk', require('./routes/imageTalk')(shareData))
    /**客户端初始化配置 */
app.get('/System/GetConfig', async(req, res) => {
    let { version } = req.query
    let setting = version && config.clientInit[version] ? config.clientInit[version] : config.clientInitDefault
    res.send({ Status: 0, Explain: "", Config: setting })
});
/**获取精选头部列表 */
app.get('/v2.5/Choiceness/ChoicenessBannerList', async(req, res) => {
    try {
        let result = await redisClient.getAsync("cacheResult:bannerChoice")
        return res.send('{"Status":"0","Explain":"ok","Data":' + result + '}')
    } catch (ex) {
        res.send({ Status: 500, Explain: ex })
    }
    // let page = req.param("page", 0)
    // let size = req.param("size", 10)
    // console.log(page, size)
    // return res.json({ page, size })
});
/**获取精选列 */
app.get('/v2.5/Choiceness/ChoicenessList', async(req, res) => {
    try {
        let result = await redisClient.getAsync("cacheResult:normalChoice")
        return res.send('{"Status":"0","Explain":"ok","Data":' + result + '}')
    } catch (ex) {
        res.send({ Status: 500, Explain: ex })
    }
    // let page = req.param("page", 0)
    // let size = req.param("size", 10)
    // let maxId = req.param("maxId")
    // console.log(page, size)
    // return res.json({ page, size, maxId })
})

let server = app.listen(config.port, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log('server listening at %s %d', host, port);
});