import driveWealth from '../../common/driveWealth'
import sqlstr from '../../common/sqlStr'
import request from 'request-promise'
import _config from '../config'
let { urls: dwUrls } = driveWealth


module.exports = function({ express, mainDB, ctt, config, checkEmpty, checkNum, mqChannel, wrap }) {


    async function CreateParactice(memberCode, randNum) {

        let body = {
            wlpID: "DW",
            languageID: "zh_CN",
            firstName: "f" + memberCode,
            lastName: "l" + memberCode,
            emailAddress1: memberCode + "@wolfstreet.tv",
            username: memberCode + randNum,
            password: "p" + memberCode,
            transAmount: 10000
        }

        try {
            ({ userID: body.UserId } = await request({
                uri: dwUrls.createPractice,
                method: "POST",
                body,
                json: true
            }))
            body.MemberCode = memberCode
            body.IsActivate = false
            body.username = memberCode + randNum
            body.tranAmount = 10000
            await mainDB.query("delete from wf_drivewealth_practice_account where MemberCode=:memberCode", { replacements: { memberCode } })
            await mainDB.query("delete from wf_drivewealth_practice_asset where MemberCode=:memberCode", { replacements: { memberCode } })
            let result = await mainDB.query(...sqlstr.insert2("wf_drivewealth_practice_account", body, { PracticeId: null, CreateTime: "now()", transAmount: null }))
            return result
        } catch (ex) {
            return CreateParactice(memberCode, Math.floor(Math.random() * 1000 + 1))
        }
    }

    const router = express.Router();
    /**打开首页判断是否登录过,如果登录过则显示排名信息 */
    router.get('/Login', ctt, wrap(async({ memberCode }, res) => {
        let [result] = await mainDB.query("select membercode from wf_stockcompetitionmember where MemberCode=:memberCode", { replacements: { memberCode } })
        if (result.length) {
            let [result] = await mainDB.query("select Rank from wf_drivewealth_practice_rank where MemberCode=:memberCode order by RankId desc ", { replacements: { memberCode } })
            if (result.length)
                res.send({ Status: 0, Explain: "", Rank: result })
            else
                res.send({ Status: 0, Explain: "", Rank: 0 })
        } else res.send({ Status: 0, Explain: "", Data: { Login: false } }) //默认配置
    }))

    /**报名 */
    router.post('/Register', ctt, wrap(async({ memberCode, body }, res) => {
        body.MemberCode = memberCode
        try {
            await mainDB.query(...sqlstr.insert2("wf_stockcompetitionmember", body, { CreateTime: "now()" }))
            let result = await CreateParactice(memberCode, "")
            res.send({ Status: 0, Explain: "", Data: true })
        } catch (ex) {
            res.send({ Status: 0, Explain: "", Data: false }) //默认配置
        }
    }))
    return router

}