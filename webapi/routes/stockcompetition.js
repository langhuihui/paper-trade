import sqlstr from '../../common/sqlStr'
import request from 'request-promise'
import Config from '../../config'
import allowAccess from '../middles/allowAccess'
import { dwUrls } from '../../common/driveWealth'
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
    router.get('/Login/:Token', ctt, allowAccess(), wrap(async({ memberCode }, res) => {
        let opendate = "2017-05-08"
        let [result] = await mainDB.query("select membercode from wf_stockcompetitionmember where MemberCode=:memberCode", { replacements: { memberCode } })
        if (result.length) {
            let [result] = await mainDB.query("select a.HeadImage,b.RankValue,IFNULL(b.Rank,0)Rank from (select * from wf_member where MemberCode=:memberCode)a left join(select * from wf_drivewealth_practice_rank where wf_drivewealth_practice_rank.type = 11)b on b.MemberCode = a.MemberCode ORDER BY b.RankId desc limit 1", { replacements: { memberCode } })
            if (result.length) {
                result[0].OpenDate = opendate
                if (!result[0].HeadImage) {
                    result[0].HeadImage = "/UploadFile/Default/default_headerimage.png"
                }
                res.send({ Status: 0, Explain: "", result: result[0] })
            } else
                res.send({ Status: 0, Explain: "", result: { Rank: 0, OpenDate: opendate } })
        } else res.send({ Status: 0, Explain: "", result: { Rank: -1, OpenDate: opendate } }) //默认配置
    }))

    /**报名 */
    router.post('/Register/:Token', ctt, allowAccess(), wrap(async({ memberCode, body }, res) => {
        let opendate = "2017-05-08"
        body.MemberCode = memberCode
        try {
            await mainDB.query(...sqlstr.insert2("wf_stockcompetitionmember", body, { CreateTime: "now()" }))
            let [result] = await mainDB.query("select TotalAmount from wf_drivewealth_practice_asset where MemberCode=:memberCode order by AssetId desc limit 1", { replacements: { memberCode } })
            console.log((result[0].TotalAmount == 10000));
            if (result.length && result[0].TotalAmount == 10000) {
                res.send({ Status: 0, Explain: "", result: true, OpenDate: opendate })
            } else {
                let result = await CreateParactice(memberCode, "")
                res.send({ Status: 0, Explain: "", result: true, OpenDate: opendate })
            }
        } catch (ex) {
            res.send({ Status: 0, Explain: "", result: true, OpenDate: opendate }) //默认配置
        }
    }))
    return router
}