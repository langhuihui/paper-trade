import { encrypt, decrypt } from '../../common/aes'
import sqlstr from '../../common/sqlStr'
import singleton from '../../common/singleton'
module.exports = function({ config, mainDB, ctt, express, checkEmpty, mqChannel, redisClient, wrap }) {
    const router = express.Router();
    /**创建嘉维真实账户 */
    router.post('/CreateAccount', ctt, wrap(async({ memberCode, body: data }, res) => {
        data.MemberCode = memberCode
        data.password = encrypt(data.password)
        data.phoneHome = encrypt(data.phoneHome)
        data.idNo = encrypt(data.idNo)
        let result = await mainDB.query("select * from wf_drivewealth_account where MemberCode=:MemberCode and UserId=:userID", { replacements: data, type: "SELECT" })
        if (result.length) {
            ([result] = await mainDB.query(...sqlstr.update2("wf_drivewealth_account", data, { AccountId: null, CreateTime: "now()" }, "where AccountId=:AccountId")))
        } else
            ([result] = await mainDB.query(...sqlstr.insert2("wf_drivewealth_account", data, { CreateTime: "now()" })))
        res.send({ Status: 0, Explain: "", Result: result })
    }))
    return router
}