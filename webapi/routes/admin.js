import sqlstr from '../../common/sqlStr'
import _config from '../config'
import pm2 from 'pm2'
module.exports = function({ config, sequelize, ctt, express, checkEmpty, mqChannel, redisClient, rongcloudSDK }) {
    const router = express.Router();
    router.get('/token/:memberCode', async(req, res) => {
        let [result] = await sequelize.query('select * from wf_token where MemberCode=:memberCode', { replacements: req.params })
        if (result.length)
            res.send(result[0]["TokenValue"])
        else res.send("")
    })
    router.get('/config', (req, res) => {
        res.send(config)
    })
    router.get('/webConfig', (req, res) => {
        res.send(_config)
    })
    router.get('/pm2/list', (req, res) => {
        pm2.connect(err => {
            if (err) {
                res.send("error")
                return
            }
            pm2.list((err2, processDescriptionList) => {
                res.send(processDescriptionList)
                pm2.disconnect()
            })
        })
    })
    return router
}