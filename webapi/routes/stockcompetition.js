import sqlstr from '../../common/sqlStr'
import request from 'request-promise'
import Config from '../../config'
import allowAccess from '../middles/allowAccess'
import { dwUrls } from '../../common/driveWealth'
import singleton from '../../common/singleton'
import JPush from 'jpush-sdk'
module.exports = function({ express, mainDB, ctt, config, checkEmpty, checkNum, mqChannel, wrap }) {
    var Competition = null
    mainDB.query("select *,CONCAT(:picBaseURL,Image) Image from wf_competition_record order by Id desc limit 1", { replacements: { picBaseURL: Config.picBaseURL }, type: "SELECT" }).then(result => {
        Competition = result[0]
        if (Competition) {
            Competition.StartTime = new Date(Competition.StartTime).format()
            Competition.EndTime = new Date(Competition.EndTime).format()
        }
    })

    function CompetitionIsOpen() {
        if (Competition) {
            let now = new Date()
            if (now < new Date(Competition.EndTime) && now > new Date(Competition.StartTime)) {
                return true
            }
        }
        return false
    }

    function TeamCompetitionIsOpen() {
        if (Competition) {
            let now = new Date()
            if (now < new Date(Competition.EndTime) && now > new Date(Competition.StartTime) && now.getDay() > 0 && now.getDay() < 6) {
                return true
            }
        }
        return false
    }
    async function CanJoin(MemberCode, TeamId) {
        if (TeamCompetitionIsOpen()) return { Status: 45004, Explain: "组队赛已开始" }
        let lastApply = await singleton.selectMainDB0("wf_competition_apply", { MemberCode })
        if (!singleton.isEMPTY(lastApply)) {
            if (new Date() - new Date(lastApply.CreateTime) < 10 * 60 * 1000) {
                return { Status: 45002, Explain: "10分钟内不得再次申请" }
            }
        }
        let team = await singleton.selectMainDB0("wf_competition_team", { Id: TeamId })
        if (singleton.isEMPTY(team) || team.Status == 2) return { Status: -1, Explain: "不存在这个战队" }
        let team_member = await mainDB.query("select * from wf_competition_team_member where TeamId=:TeamId", { replacements: { TeamId }, type: "SELECT" })
        if (team_member.find(m => m.MemberCode == MemberCode)) return { Status: 45001, Explain: "你已经是该战队成员" }
        if (team_member.length >= 3) return { Status: 45003, Explain: "人数已满" }
        let apply = await singleton.selectMainDB0("wf_competition_apply", { MemberCode, TeamId })
        if (!singleton.isEMPTY(apply)) {
            return { Status: apply.state, Explain: [, "已申请", "已通过", "已拒绝", "已失效"][apply.state] }
        }
        return 0
    }
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
    //获取最近的比赛
    router.get('/Competition', (req, res) => res.send({ Status: Competition ? 0 : -1, Competition }));
    router.get('/CompetitionState', (req, res) => res.send({ Status: 0, IsOpen: CompetitionIsOpen() }));
    router.get('/TeamCompetitionState', ctt, wrap(async({ memberCode }, res) => {
        let teams = await mainDB.query(`
        select a.*,b.MemberCount from wf_competition_team a,(select TeamId,count(*) MemberCount from wf_competition_team_member group by TeamId) b
        where a.Id = b.TeamId and a.Status = 1`, { type: "SELECT" })
        let CanJoinCount = 0;
        let CanCreateCount = 100 - teams.length
        let IsOpen = TeamCompetitionIsOpen()
        let UIState = await (async() => {
            let [{ enterCount, teamCount, TeamId }] = await mainDB.query("select a.cnt enterCount,b.cnt teamCount,b.TeamId from (select count(*) cnt from wf_stockcompetitionmember where MemberCode=:memberCode and CommetitionId=:CommetitionId) a ,(select count(*) cnt,TeamId from wf_competition_team_member where MemberCode=:memberCode) b", { replacements: { memberCode, CommetitionId: Competition.Id }, type: "SELECT" })
            if (enterCount == 0) return IsOpen ? 5 : 1
            if (teamCount == 0) return IsOpen ? 6 : (CanCreateCount ? 2 : 3)
            let myTeamMemberCount = 0
            teams.forEach(t => {
                if (t.Id == TeamId) myTeamMemberCount = t.MemberCount
                if (t.MemberCount < 3) CanJoinCount++
            })
            return IsOpen ? (myTeamMemberCount < 3 ? 7 : 8) : 4
        })()
        res.send({ Status: 0, IsOpen, CanJoinCount, CanCreateCount, UIState })
    }));
    /**报名 */
    router.post('/Register', ctt, wrap(async({ memberCode, body }, res) => {
        body.MemberCode = memberCode
        if (!Competition) {
            return res.send({ Status: -1, Explain: "没有比赛" })
        }
        let stockcompetitionmember = await singleton.selectMainDB0("wf_stockcompetitionmember", { MemberCode: memberCode, CommetitionId: Competition.Id })
        if (!singleton.isEMPTY(stockcompetitionmember)) {
            res.send({ Status: 40013, Explain: "", Competition }) //默认配置
        } else {
            body.CommetitionId = Competition.Id
            body.CreateTime = new Date()
            await singleton.insertMainDB("wf_stockcompetitionmember", body)
            let [drivewealth_practice_asset] = await mainDB.query("select TotalAmount from wf_drivewealth_practice_asset_v where MemberCode=:memberCode order by AssetId desc limit 1", { replacements: { memberCode }, type: "SELECT" })
            if (drivewealth_practice_asset && drivewealth_practice_asset.TotalAmount == Config.practiceInitFun) {
                res.send({ Status: 0, Explain: "", Competition })
            } else {
                return res.send({ Status: 0, Explain: "", Competition })
                let result = await CreateParactice(memberCode, "")
                    //await mainDB.query("delete from wf_token where MemberCode=:memberCode ", { replacements: { memberCode } })

                let { JpushRegID } = await singleton.selectMainDB0("wf_im_jpush", { MemberCode: memberCode })
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
    router.get('/SearchSchool/:str', ctt, wrap(async({ memberCode, params: { str } }, res) => {
        res.send({ Status: 0, result: await mainDB.query(`select * from wf_base_school where SchoolName like '%${str}%'`, { type: "SELECT" }) })
    }));
    /**个人状况 */
    router.get('/MyStatus', ctt, wrap(async({ memberCode }, res) => {
        let result = { Status: 0 }
        let stockcompetitionmember = await singleton.selectMainDB0("wf_stockcompetitionmember", { MemberCode: memberCode, CommetitionId: Competition.Id })
        if (!singleton.isEMPTY(stockcompetitionmember)) {
            //let {TodayProfit} = await singleton.selectMainDB0("wf_drivewealth_practice_asset_v",{MemberCode: memberCode })
            let team_member = await singleton.selectMainDB0("wf_competition_team_member", { MemberCode: memberCode })
            if (singleton.isEMPTY(team_member)) {
                result.Status = 1
            } else {
                result.Status = 1 + team_member.Level
                result.Team = await singleton.selectMainDB0("wf_competition_team", { Id: team_member.TeamId })
            }
        }
        res.send({ Status: 0, Explain: "", Data: result })
    }));
    /**战队情况 */
    router.get('/TeamStatus/:TeamId', ctt, wrap(async({ memberCode, params: { TeamId } }, res) => {
        let team = await singleton.selectMainDB0("wf_competition_team", { Id: TeamId })
        if (singleton.isEMPTY(team)) {
            res.send({ Status: -1, Explain: "没有该战队" })
        } else {
            team.Member = await singleton.selectMainDB("wf_competition_team_member", { TeamId })
            team.CanJoin = (await CanJoin(memberCode, TeamId)) == 0
            team.IsOpen = TeamCompetitionIsOpen()
            team.Role = memberCode == team.MemberCode ? 1 : (team.Member.find(m => m.MemberCode == memberCode) ? 2 : 3)
            team.Status = (() => {
                if (team.Status == 2) return 0
                if (team.Role == 1) return team.IsOpen ? 4 : 3
                if (team.Role == 2) return team.IsOpen ? 6 : 5
                return CanJoin ? 2 : 1
            })()
            res.send({ Status: 0, Explain: "", Data: team })
        }
    }));
    /**创建战队 */
    router.post('/CreateTeam', ctt, wrap(async({ memberCode, body }, res) => {
        let team = await singleton.selectMainDB0("wf_competition_team", { TeamName: body.TeamName })
        if (!singleton.isEMPTY(team)) {
            return res.send({ Status: 40013, Explain: "战队名称已经存在" })
        }
        let [{ teamCount }] = await mainDB.query("select count(*) teamCount from wf_competition_team where Status=1", { type: "SELECT" })
        if (teamCount >= 100) {
            return res.send({ Status: 45001, Explain: "战队已满" })
        }
        body.Status = 1
        let [{ Code }] = await mainDB.query("select * from wf_competition_code where State = 0  order by rand() limit 1", { type: "SELECT" })
        await singleton.updateMainDB("wf_competition_code", { State: 1 }, null, { Code })
        body.Code = Code
        body.MemberCode = memberCode
        let { insertId } = await singleton.insertMainDB("wf_competition_team", body, { CreateTime: "now()" })
        await singleton.insertMainDB("wf_competition_team_member", { TeamId: insertId, MemberCode: memberCode, Level: 1 }, { CreateTime: "now()" })
        res.send({ Status: 0, Explain: "", Code: body.Code })
    }));
    /**申请加入战队 */
    router.post('/JoinTeam/:TeamId', ctt, wrap(async({ memberCode, params: { TeamId } }, res) => {
        let result = await CanJoin(memberCode, TeamId)
        if (result != 0) return res.send(result)
        await singleton.insertMainDB("wf_competition_apply", { TeamId, MemberCode: memberCode, State: 1 }, { CreateTime: "now()" })
        res.send({ Status: 0, Explain: "" })
    }));
    /**使用邀请码加入战队 */
    router.post('/JoinTeamByCode/:Code', ctt, wrap(async({ memberCode, params: { Code } }, res) => {
        let lastApply = await singleton.selectMainDB0("wf_competition_apply", { MemberCode: memberCode })
        if (!singleton.isEMPTY(lastApply)) {
            if (new Date() - new Date(lastApply.CreateTime) < 10 * 60 * 1000) {
                return res.send({ Status: 45002, Explain: "10分钟内不得再次申请" })
            }
        }
        let team = await singleton.selectMainDB0("wf_competition_team", { Code })
        if (singleton.isEMPTY(team) || team.Status == 2) return res.send({ Status: -1, Explain: "不存在这个战队" })
        let team_member = await mainDB.query("select * from wf_competition_team_member where TeamId=:TeamId", { replacements: { TeamId: team.Id }, type: "SELECT" })
        if (team_member.find(m => m.MemberCode == memberCode)) return res.send({ Status: 45001, Explain: "你已经是该战队成员" })
        if (team_member.length >= 3) return res.send({ Status: 45003, Explain: "人数已满" })
        await singleton.insertMainDB("wf_competition_apply", { TeamId: team.Id, MemberCode: memberCode, State: 1 }, { CreateTime: "now()" })
        res.send({ Status: 0, Explain: "" })
    }));
    /**战队列表 */
    router.get('/TeamList', ctt, wrap(async({ memberCode, query: { searchKey } }, res) => {
        let teams = await mainDB.query(`
        select a.*,b.MemberCount from wf_competition_team a,(select TeamId,count(*) MemberCount from wf_competition_team_member group by TeamId) b
        where a.Id = b.TeamId and a.Status = 1`, { type: "SELECT" })
        res.send({ Status: 0, Explain: "", DataList: teams })
    }));
    /**申请列表 */
    router.get('/ApplyList', ctt, wrap(async({ memberCode }, res) => {
        let team = await singleton.selectMainDB0("wf_competition_team", { MemberCode: memberCode, Status: 1 })
        if (singleton.isEMPTY(team)) {
            return res.send({ Status: -1, Explain: "你没有创建战队" })
        }
        let applyList = await mainDB.query("select c.*,m.Nickname NickName from wf_competition_apply c left join wf_member m on c.MemberCode=m.MemberCode  where TeamId=:teamId", { replacements: { teamId: team.Id }, type: "SELECT" })
        res.send({ Status: 0, Explain: "", DataList: applyList })
    }));
    /**接受申请 */
    router.post('/Accept/:MemberCode', ctt, wrap(async({ memberCode, params: { MemberCode } }, res) => {
        let team = await singleton.selectMainDB0("wf_competition_team", { MemberCode: memberCode, Status: 1 })
        if (singleton.isEMPTY(team)) {
            return res.send({ Status: -1, Explain: "你没有创建战队" })
        }
        let apply = await singleton.selectMainDB0("wf_competition_apply", { MemberCode, TeamId: team.Id })
        if (singleton.isEMPTY(apply)) {
            return res.send({ Status: -2, Explain: "没有该人的申请" })
        }
        if (apply.State != 1) {
            return res.send({ Status: apply.State, Explain: [, , "已通过", "已拒绝", "已失效"][apply.State] })
        }
        let [{ memberCount }] = await mainDB.query("select count(*) memberCount from wf_competition_team_member where TeamId=:TeamId", { replacements: { TeamId: team.Id }, type: "SELECT" })
        if (memberCount >= 3) {
            return res.send({ Status: 45003, Explain: "人数已满" })
        }
        let result = await singleton.transaction2(t => {
            singleton.updateMainDB("wf_competition_apply", { State: 2 }, null, { MemberCode, TeamId: team.Id }, t)
            singleton.insertMainDB("wf_competition_team_member", { TeamId: team.Id, MemberCode, Level: 2 }, { CreateTime: "now()" }, t)
            mainDB.query("update wf_competition_apply set State=4 where MemberCode=:MemberCode and TeamId<>:TeamId", { replacements: { MemberCode, TeamId: team.Id }, transaction: t.transaction })
        })
        res.send({ Status: result == 0 ? 0 : 500, Explain: result })
    }));
    /**拒绝申请 */
    router.post('/Refuse/:MemberCode', ctt, wrap(async({ memberCode, params: { MemberCode } }, res) => {
        let team = await singleton.selectMainDB0("wf_competition_team", { MemberCode: memberCode, Status: 1 })
        if (singleton.isEMPTY(team)) {
            return res.send({ Status: -1, Explain: "你没有创建战队" })
        }
        let apply = await singleton.selectMainDB0("wf_competition_apply", { MemberCode, TeamId: team.Id })
        if (singleton.isEMPTY(apply)) {
            return res.send({ Status: -2, Explain: "没有该人的申请" })
        }
        if (apply.State != 1) {
            return res.send({ Status: apply.State, Explain: [, , "已通过", "已拒绝", "已失效"][apply.State] })
        }
        // let [{ memberCount }] = await mainDB.query("select count(*) memberCount from wf_competition_team_member where TeamId=:TeamId", { replacements: { TeamId: team.Id }, type: "SELECT" })
        // if (memberCount >= 3) {
        //     return res.send({ Status: 45003, Explain: "人数已满" })
        // }
        await singleton.updateMainDB("wf_competition_apply", { State: 3 }, null, { MemberCode, TeamId: team.Id })

        res.send({ Status: 0, Explain: "" })
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