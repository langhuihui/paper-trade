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

app.get('/Choiceness/ChoicenessBannerList', async(req, res) => {
    let result = await redisClient.getAsync("cacheResult:bannerChoice")
    return res.send(200, result)
        // let page = req.param("page", 0)
        // let size = req.param("size", 10)
        // console.log(page, size)
        // return res.json({ page, size })
})
app.get('/Choiceness/ChoicenessList', async(req, res) => {
    let result = await redisClient.getAsync("cacheResult:normalChoice")
    return res.send(200, result)
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