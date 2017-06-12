import sqlstr from '../../common/sqlStr'
import request from 'request-promise'
import Config from '../../config'
import allowAccess from '../middles/allowAccess'
import { dwUrls } from '../../common/driveWealth'
import singleton from '../../common/singleton'
import JPush from 'jpush-sdk'
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
            await mainDB.query("delete from wf_drivewealth_practice_asset_v where MemberCode=:memberCode", { replacements: { memberCode } })
            await mainDB.query("delete from wf_drivewealth_practice_rank where MemberCode=:memberCode", { replacements: { memberCode } })
            await mainDB.query("delete from wf_drivewealth_practice_rank_v where MemberCode=:memberCode", { replacements: { memberCode } })
            let result = await mainDB.query(...sqlstr.insert2("wf_drivewealth_practice_account", body, { PracticeId: null, CreateTime: "now()", transAmount: null }))
            return body
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
            let [result] = await mainDB.query("select a.HeadImage,case when ISNULL(b.RankValue) or b.RankValue='' or b.RankValue=0 then 10000 else b.RankValue end RankValue,IFNULL(b.Rank,0)Rank from (select * from wf_member where MemberCode=:memberCode)a left join(select * from wf_drivewealth_practice_rank_v where wf_drivewealth_practice_rank_v.type = 11)b on b.MemberCode = a.MemberCode ORDER BY b.RankId desc limit 1", { replacements: { memberCode } })
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
    router.post('/Register/:Token', ctt, allowAccess('POST'), wrap(async({ memberCode, body }, res) => {
        let opendate = "2017-05-08"
        body.MemberCode = memberCode
        let [result] = await mainDB.query("select * from wf_stockcompetitionmember where MemberCode=:memberCode ", { replacements: { memberCode } })
        if (result.length) {
            res.send({ Status: 0, Explain: "", result: false, OpenDate: opendate }) //默认配置
        } else {
            await mainDB.query(...sqlstr.insert2("wf_stockcompetitionmember", body, { CreateTime: "now()" }))
            let [result] = await mainDB.query("select TotalAmount from wf_drivewealth_practice_asset_v where MemberCode=:memberCode order by AssetId desc limit 1", { replacements: { memberCode } })
            if (result.length && result[0].TotalAmount == 10000) {
                res.send({ Status: 0, Explain: "", result: true, OpenDate: opendate })
            } else {
                let result = await CreateParactice(memberCode, "")
                    //await mainDB.query("delete from wf_token where MemberCode=:memberCode ", { replacements: { memberCode } })
                res.send({ Status: 0, Explain: "", result: true, OpenDate: opendate })
                setTimeout(5000)
                let tmpresult = await mainDB.query('select JpushRegID from wf_im_jpush where MemberCode=:MemberCode', { replacements: body, type: "SELECT" })
                let JpushRegID = tmpresult.length ? tmpresult[0].JpushRegID : ""
                if (JpushRegID) {
                    singleton.jpushClient.push().setPlatform(JPush.ALL).setAudience(JPush.registration_id(JpushRegID))
                        .setOptions(null, null, null, Config.apns_production)
                        .setMessage('嘉维账号重置', '', '', { AlertType: "jpush111", UserId: result.userId, username: result.username, password: result.password })
                        .send(async(err, res) => {
                            if (err) {
                                if (err instanceof JPush.APIConnectionError) {
                                    console.log(err.message)
                                } else if (err instanceof JPush.APIRequestError) {
                                    console.log(err.message)
                                }
                            } else {

                            }
                        })
                }

            }
        }
    }));
    /**报名 */
    router.post('/Register', ctt, wrap(async({ memberCode, body }, res) => {

    }));
    /**个人状况 */
    router.get('/MyStatus', ctt, wrap(async({ memberCode }, res) => {

    }));
    /**战队情况 */
    router.get('/TeamStatus/:id', ctt, wrap(async({ memberCode }, res) => {

    }));
    /**创建战队 */
    router.post('/CreateTeam', ctt, wrap(async({ memberCode, body }, res) => {
        //返回邀请码
        res.send({ Status: 0, Explain: "", Code: '1234' })
    }));
    /**申请加入战队 */
    router.post('/JoinTeam', ctt, wrap(async({ memberCode, body }, res) => {

    }));
    /**使用邀请码加入战队 */
    router.post('/JoinTeam/:code', ctt, wrap(async({ memberCode, body }, res) => {

    }));
    /**战队列表 */
    router.get('/TeamList', ctt, wrap(async({ memberCode, query: { searchKey } }, res) => {

    }));
    /**申请列表 */
    router.get('/ApplyList', ctt, wrap(async({ memberCode }, res) => {

    }));
    /**接受申请 */
    router.post('/Accept/:MemberCode', ctt, wrap(async({ memberCode, params: { MemberCode } }, res) => {

    }));
    /**拒绝申请 */
    router.post('/Refuse/:MemberCode', ctt, wrap(async({ memberCode, params: { MemberCode } }, res) => {

    }));
    /**排行榜 */
    router.get('/RankList/:type', ctt, wrap(async({ memberCode, body }, res) => {

    }));
    /**赛事消息 */
    router.get('/Events', ctt, wrap(async({ memberCode, body }, res) => {

    }));
    /**事件详情 */
    router.get('/EventDetail/:id', ctt, wrap(async({ memberCode, body }, res) => {

    }));
    /**公告 */
    router.get('/Notice', ctt, wrap(async({ memberCode, body }, res) => {

    }));
    return router
}