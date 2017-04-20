import { encrypt, decrypt } from '../../common/aes'
import sqlstr from '../../common/sqlStr'

module.exports = function({ config, mainDB, ctt, express, checkEmpty, mqChannel, redisClient }) {
    const router = express.Router();
    /**创建嘉维真实账户 */
    router.post('/CreateAccount', ctt, async(req, res) => {
        let data = req.body
        data.MemberCode = req.memberCode
        data.password = encrypt(data.password)
        data.phoneMobile = encrypt(data.phoneMobile)
        data.idNo = encrypt(data.idNo)
        let [result] = await mainDB.query("select * from wf_drivewealth_account where MemberCode:MemberCode and UserId=:userId", data)
        if (result.length) {
            ([result] = await mainDB.query(...sqlstr.update2("wf_drivewealth_account", data, { AccountId: null, CreateTime: "now()" }, "where AccountId:AccountId")))
        } else
            ([result] = await mainDB.query(...sqlstr.insert2("wf_drivewealth_account", data, { CreateTime: "now()" })))
        res.send({ Status: 0, Explain: "", Result: result })
    })
    router.post('/CreateOrder', ctt, async(req, res) => {
        // await sequelize.query()
    })
    return router
}