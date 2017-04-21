module.exports = function({ mainDB, statistic, ctt, express, config, wrap, redisClient }) {
    const router = express.Router();
    /**获取精选头部列表 */
    router.get('/ChoicenessBannerList', wrap(async(req, res) => {
        let result = await redisClient.getAsync("cacheResult:bannerChoice")
        res.send('{"Status":0,"Explain":"ok","Data":' + result + '}')
    }));
    /**获取精选列 */
    router.get('/ChoicenessList', wrap(async(req, res) => {
        let result = await redisClient.getAsync("cacheResult:normalChoice");
        res.send('{"Status":0,"Explain":"ok","Data":' + result + '}')
    }))
    return router
}