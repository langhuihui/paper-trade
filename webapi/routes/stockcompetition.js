import sqlstr from '../../common/sqlStr'
import request from 'request-promise'
import Config from '../../config'
import allowAccess from '../middles/allowAccess'
import { dwUrls } from '../../common/driveWealth'
import singleton from '../../common/singleton'
import JPush from 'jpush-sdk'
module.exports = function({ express, mainDB, ctt, config, checkEmpty, checkNum, mqChannel, wrap, rongcloud }) {
    var Competition = null
    mainDB.query("select *,CONCAT(:picBaseURL,Image) Image from wf_competition_record order by Id desc limit 1", { replacements: { picBaseURL: Config.picBaseURL }, type: "SELECT" }).then(result => Competition = result[0])

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

    function ThisWeek() {
        let now = new Date()
        let weekDay = now.getDay()
        let result = []
        if (weekDay == 6 && now.getHours() >= 4 || weekDay == 1 && now < new Date(now.format("yyyy-MM-dd") + " 21:30:00") || weekDay == 0) {
            now.setDate(now.getDate() - weekDay + 1 + 7)
            now.setHours(9)
            now.setMinutes(30)
            now.setSeconds(0)
            result[0] = now
            now = new Date()
            now.setDate(now.getDate() - weekDay + 6 + 7)
            now.setHours(4)
            now.setMinutes(0)
            now.setSeconds(0)
            result[1] = now
        } else {
            now.setDate(now.getDate() - weekDay + 1)
            now.setHours(9)
            now.setMinutes(30)
            now.setSeconds(0)
            result[0] = now
            now = new Date()
            now.setDate(now.getDate() - weekDay + 6)
            now.setHours(4)
            now.setMinutes(0)
            now.setSeconds(0)
            result[1] = now
        }
        return result;
    }

    async function sendJpushMessage(MemberCode, ...args) {
        let { JpushRegID } = await singleton.selectMainDB0("wf_im_jpush", { MemberCode })
        if (JpushRegID) {
            singleton.jpushClient.push().setPlatform(JPush.ALL).setAudience(JPush.registration_id(JpushRegID))
                .setOptions(null, null, null, Config.apns_production)
                .setMessage(...args)
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
    async function CanJoin(MemberCode, { Status, Id: TeamId }, ignoreApply) {
        if (Status == 1) return { Status: 45003, Explain: "人数已满" }
        if (TeamCompetitionIsOpen()) return { Status: 45004, Explain: "组队赛已开始" }
        let lastApply = await singleton.selectMainDB0("wf_competition_apply", { MemberCode })
        if (!singleton.isEMPTY(lastApply)) {
            if (new Date() - new Date(lastApply.CreateTime) < 10 * 60 * 1000) {
                return { Status: 45002, Explain: "10分钟内不得再次申请" }
            }
        }
        let you = await singleton.selectMainDB0("wf_competition_team_member", { TeamId, MemberCode })
        if (!singleton.isEMPTY(you)) return { Status: 45001, Explain: "你已经是该战队成员" }
        if (ignoreApply) return 0
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

    //获取最近的比赛
    router.get('/Competition', (req, res) => res.send({ Status: Competition ? 0 : -1, Competition }));
    router.get('/CompetitionState', (req, res) => res.send({ Status: 0, IsOpen: CompetitionIsOpen() }));
    /**组队赛情况 */
    router.get('/TeamCompetitionState', ctt, wrap(async({ memberCode }, res) => {
        let teams = await mainDB.query(`select * from wf_competition_team where Status <>2`, { type: "SELECT" })
        let CanJoinCount = 0;
        let CanCreateCount = 100 - teams.length
        let IsOpen = TeamCompetitionIsOpen()
        let WeekTime = ThisWeek()
        let Team = {}
        let UIState = await (async() => {
            let [{ enterCount, teamCount, TeamId }] = await mainDB.query("select a.cnt enterCount,b.cnt teamCount,b.TeamId from (select count(*) cnt from wf_stockcompetitionmember where MemberCode=:memberCode and CommetitionId=:CommetitionId) a ,(select count(*) cnt,TeamId from wf_competition_team_member where MemberCode=:memberCode) b", { replacements: { memberCode, CommetitionId: Competition.Id }, type: "SELECT" })
            teams.forEach(t => {
                if (t.Id == TeamId) {
                    Team = t
                }
                if (t.Status == 0) CanJoinCount++
            })
            if (enterCount == 0) return IsOpen ? 5 : 1
            if (teamCount == 0) return IsOpen ? 6 : (CanCreateCount ? 2 : 3)
            return IsOpen ? (Team.Status == 0 ? 7 : 8) : 4
        })()
        res.send({ Status: 0, IsOpen, CanJoinCount, CanCreateCount, UIState, OpenTime: WeekTime[0].format(), CloseTime: WeekTime[1].format(), Team })
    }));

    let RegisterHandler = wrap(async({ memberCode, body }, res) => {
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
                sendJpushMessage(memberCode, '嘉维账号重置', '', '', { AlertType: "jpush111", UserId: result.userId, username: result.username, password: result.password })
            }
        }
    })

    router.post('/Register/:Token', ctt, allowAccess('POST'), RegisterHandler)
        /**报名 */
    router.post('/Register', ctt, RegisterHandler);
    /**搜索学校 */
    router.get('/SearchSchool/:str', ctt, wrap(async({ memberCode, params: { str } }, res) => {
        res.send({ Status: 0, result: await mainDB.query(`select * from wf_base_school where SchoolName like '%${str}%'`, { type: "SELECT" }) })
    }));
    /**搜索战队 */
    router.get('/SearchTeam/:str', ctt, wrap(async({ memberCode, params: { str } }, res) => {
        let team_member = await singleton.selectMainDB0("wf_competition_team_member", { MemberCode: memberCode })
        let canJoin = ""
        if (!singleton.isEMPTY(team_member)) {
            canJoin = ",0 CanJoin"
        }
        let result = await mainDB.query(`select * ${canJoin} from wf_competition_team where TeamName like '%${str}%' and Status <>2`, { type: "SELECT" })
        if (!canJoin) {
            await Promise.all(
                result.map(team => CanJoin(memberCode, team).then(result => team.CanJoin = (result == 0 ? 1 : 0)))
            )
        }
        res.send({ Status: 0, result })
    }));
    /**个人状况 */
    router.get('/MyStatus', ctt, wrap(async({ memberCode }, res) => {
        let result = { Status: 0, IsOpen: CompetitionIsOpen(), OpenTime: Competition.StartTime, CloseTime: Competition.EndTime }
        let stockcompetitionmember = await singleton.selectMainDB0("wf_stockcompetitionmember", { MemberCode: memberCode, CommetitionId: Competition.Id });
        ({ TodayProfit: result.Profit, TodayDefeat: result.Defeat, WeekRank: result.WeekRank, TotalRank: result.TotalRank } = await mainDB.query(`select max(case when type = 1 then RankValue else 0 end) TodayProfit,
        max(case when type = 1 then Defeat else 0 end) TodayDefeat,
        max(case when type = 3 then Rank else 0 end) WeekRank,
        max(case when type = 11 then Rank else 0 end) TotalRank
         from wf_drivewealth_practice_rank_v where MemberCode=:memberCode`, { replacements: { memberCode }, type: "SELECT" }));
        result.Title = ((100 - result.Defeat) / 20 >> 0) + 1
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
        result.Events = await mainDB.query("select * from wf_competition_affiche order by Id desc limit 3", { type: "SELECT" })
        res.send({ Status: 0, Explain: "", Data: result })
    }));
    /**战队情况 */
    router.get('/TeamStatus/:TeamId', ctt, wrap(async({ memberCode, params: { TeamId } }, res) => {
        let team = await singleton.selectMainDB0("wf_competition_team", { Id: TeamId })
        if (singleton.isEMPTY(team)) {
            res.send({ Status: -1, Explain: "没有该战队" })
        } else {
            team.Member = await mainDB.query("select a.*,m.NickName,asset.WeekYield,concat(:picBaseURL,case when isnull(m.HeadImage) or m.HeadImage='' then :defaultHeadImage else m.HeadImage end)HeadImage from wf_competition_team_member a left join wf_member m on a.MemberCode=m.MemberCode left join wf_drivewealth_practice_asset_v asset on a.MemberCode=asset.MemberCode and asset.EndDate = curdate() where a.TeamId=:TeamId", { type: "SELECT", replacements: { TeamId, picBaseURL: config.picBaseURL, defaultHeadImage: config.defaultHeadImage } })
            team.CanJoin = (await CanJoin(memberCode, team)) == 0
            team.IsOpen = TeamCompetitionIsOpen()
            team.Role = memberCode == team.MemberCode ? 1 : (team.Member.find(m => m.MemberCode == memberCode) ? 2 : 3)
            team.Status = (() => {
                if (team.Status == 2) return 0
                if (team.Role == 1) return team.IsOpen ? 4 : 3
                if (team.Role == 2) return team.IsOpen ? 6 : 5
                return team.CanJoin ? 2 : 1
            })()
            res.send({ Status: 0, Explain: "", Data: team })
        }
    }));
    /**在线状态 */
    router.get('/OnlineStatus/:TeamId', ctt, wrap(async({ memberCode, params: { TeamId } }, res) => {
        let members = await singleton.selectMainDB("wf_competition_team_member", { TeamId })
        await Promise.all(members.map(m =>
            new Promise((resolve, reject) => rongcloud.user.checkOnline(m.MemberCode, 'json', (err, result) => err ? reject(err) : resolve(JSON.parse(result))))
            .then(result => m.Online = result.status == "1").catch(console.error)
        ))
        res.send({ Status: 0, Explain: "", DataList: members })
    }));
    /**创建战队 */
    router.post('/CreateTeam', ctt, wrap(async({ memberCode, body }, res) => {
        let team = await singleton.selectMainDB0("wf_competition_team", { TeamName: body.TeamName })
        if (!singleton.isEMPTY(team)) {
            return res.send({ Status: 40013, Explain: "战队名称已经存在" })
        }
        let [{ teamCount }] = await mainDB.query("select count(*) teamCount from wf_competition_team where Status<>2", { type: "SELECT" })
        if (teamCount >= 100) {
            return res.send({ Status: 45001, Explain: "战队已满" })
        }
        let [{ Code }] = await mainDB.query("select * from wf_competition_code where State = 0  order by rand() limit 1", { type: "SELECT" })
        await singleton.updateMainDB("wf_competition_code", { State: 1 }, null, { Code })
        let { insertId } = await singleton.insertMainDB("wf_competition_team", Object.assign(body, { Code, MemberCode: memberCode, MemberCount: 1, Status: 0 }), { CreateTime: "now()" })
        await singleton.insertMainDB("wf_competition_team_member", { TeamId: insertId, MemberCode: memberCode, Level: 1, Type: 1 }, { CreateTime: "now()" })
        res.send({ Status: 0, Explain: "", Code, TeamId: insertId })
    }));
    /**申请加入战队 */
    router.post('/JoinTeam/:TeamId', ctt, wrap(async({ memberCode, params: { TeamId } }, res) => {
        let team = await singleton.selectMainDB0("wf_competition_team", { Id: TeamId })
        if (singleton.isEMPTY(team) || team.Status == 2) return res.send({ Status: -1, Explain: "不存在这个战队" })
        let result = await CanJoin(memberCode, team)
        if (result != 0) return res.send(result)
        await singleton.insertMainDB("wf_competition_apply", { TeamId, MemberCode: memberCode, State: 1 }, { CreateTime: "now()" })
        let from = await singleton.selectMainDB0("wf_member", { MemberCode: memberCode })
        sendJpushMessage(team.MemberCode, "收到申请", "", "", { AlertType: config.jpushType_competition, Type: "join", from, team })
        res.send({ Status: 0, Explain: "" })
    }));
    /**使用邀请码加入战队 */
    router.post('/JoinTeamByCode/:Code', ctt, wrap(async({ memberCode: MemberCode, params: { Code } }, res) => {
        let team = await singleton.selectMainDB0("wf_competition_team", { Code })
        if (singleton.isEMPTY(team) || team.Status == 2) return res.send({ Status: -1, Explain: "不存在这个战队" })
        let result = await CanJoin(memberCode, team, true)
        if (result != 0) return res.send(result)
        team.MemberCount++;
        result = await singleton.transaction2(t => {
            singleton.insertMainDB("wf_competition_team_member", { TeamId: team.Id, MemberCode, Level: 2, Type: 2 }, { CreateTime: "now()" }, t)
            mainDB.query("update wf_competition_apply set State=4 where MemberCode=:MemberCode and TeamId<>:TeamId", { replacements: { MemberCode, TeamId: team.Id }, transaction: t.transaction })
            singleton.updateMainDB("wf_competition_team", { Status: team.MemberCount == 3 ? 1 : 0, MemberCount: team.MemberCount })
        })
        if (result == 0) {
            let from = await singleton.selectMainDB0("wf_member", { MemberCode: memberCode })
            sendJpushMessage(team.MemberCode, "通过邀请码加入", "", "", { AlertType: config.jpushType_competition, Type: "joinByCode", from, team })
            res.send({ Status: 0, Explain: "", TeamId: team.Id })
        } else {
            res.send({ Status: 500, Explain: result })
        }
    }));
    /**战队列表 */
    router.get('/TeamList', ctt, wrap(async({ memberCode, query: { searchKey } }, res) => {
        let team_member = await singleton.selectMainDB0("wf_competition_team_member", { MemberCode: memberCode })
        let canJoin = ""
        if (!singleton.isEMPTY(team_member)) {
            canJoin = ",0 CanJoin"
        }
        let teams = await mainDB.query(`select *${canJoin} from wf_competition_team where Status <> 2 order by Id desc`, { type: "SELECT" })
        if (!canJoin) {
            await Promise.all(
                teams.map(team => CanJoin(memberCode, team)).then(result => team.CanJoin = (result == 0 ? 1 : 0))
            )
        }
        res.send({ Status: 0, Explain: "", DataList: teams })
    }));
    /**申请列表 */
    router.get('/ApplyList', ctt, wrap(async({ memberCode }, res) => {
        let team = await singleton.selectMainDB0("wf_competition_team", { MemberCode: memberCode }, "Status<>2")
        if (singleton.isEMPTY(team)) {
            return res.send({ Status: -1, Explain: "你没有创建战队" })
        }
        let applyList = await mainDB.query("select c.*,m.Nickname NickName,concat(:picBaseURL,case when isnull(m.HeadImage) or m.HeadImage='' then :defaultHeadImage else m.HeadImage end)HeadImage from wf_competition_apply c left join wf_member m on c.MemberCode=m.MemberCode  where TeamId=:teamId and c.State<>4", { replacements: { picBaseURL: config.picBaseURL, defaultHeadImage: config.defaultHeadImage, teamId: team.Id }, type: "SELECT" })
        res.send({ Status: 0, Explain: "", DataList: applyList })
    }));
    /**接受申请 */
    router.post('/Accept/:MemberCode', ctt, wrap(async({ memberCode, params: { MemberCode } }, res) => {
        let team = await singleton.selectMainDB0("wf_competition_team", { MemberCode: memberCode }, "Status<>2")
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
        if (team.Status == 1) {
            return res.send({ Status: 45003, Explain: "人数已满" })
        }
        team.MemberCount++;
        let result = await singleton.transaction2(t => {
            singleton.updateMainDB("wf_competition_apply", { State: 2 }, null, { MemberCode, TeamId: team.Id }, t)
            singleton.insertMainDB("wf_competition_team_member", { TeamId: team.Id, MemberCode, Level: 2, Type: 3 }, { CreateTime: "now()" }, t)
            mainDB.query("update wf_competition_apply set State=4 where MemberCode=:MemberCode and TeamId<>:TeamId", { replacements: { MemberCode, TeamId: team.Id }, transaction: t.transaction })
            singleton.updateMainDB("wf_competition_team", { Status: team.MemberCount == 3 ? 1 : 0, MemberCount: team.MemberCount })
        })
        if (result == 0) {
            singleton.insertMainDB("wf_message", { Type: 2, Content: team.TeamName + " 队长已同意您的入队申请!", MemberCode: memberCode, Title: "申请已通过", IsSend: 1 }, { CreateTime: "now()" })
            sendJpushMessage(MemberCode, "同意申请", "", "", { AlertType: config.jpushType_competition, Type: "accept", team })
        }
        res.send({ Status: result == 0 ? 0 : 500, Explain: result })
    }));
    /**拒绝申请 */
    router.post('/Refuse/:MemberCode', ctt, wrap(async({ memberCode, params: { MemberCode } }, res) => {
        let team = await singleton.selectMainDB0("wf_competition_team", { MemberCode: memberCode }, "Status<>2")
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
        singleton.insertMainDB("wf_message", { Type: 2, Content: team.TeamName + " 队长已拒绝您的入队申请！", MemberCode: memberCode, Title: "申请被拒绝", IsSend: 1 }, { CreateTime: "now()" })
        sendJpushMessage(MemberCode, "拒绝申请", "", "", { AlertType: config.jpushType_competition, Type: "refuse", team })
        res.send({ Status: 0, Explain: "" })
    }));
    /**排行榜 */
    router.get('/RankList/:type', ctt, wrap(async({ memberCode, params: { type } }, res) => {
        let [OpenTime, CloseTime] = ThisWeek()
        OpenTime = OpenTime.format()
        CloseTime = CloseTime.format()
        let DataList = null
        switch (type) {
            case "TeamProfit":
                DataList = await mainDB.query("SELECT a.Rank,a.RankValue,b.* from wf_competition_team_rank a left join wf_competition_team b on b.Id=a.TeamId where a.Type=4", { type: "SELECT" })
                res.send({ Status: 0, Explain: "", DataList, OpenTime, CloseTime })
                break
            case "TotalProfit": //炒股大赛总排行
                //缓存炒股大赛总排行
                DataList = await mainDB.query("select a.*,b.NickName,concat(:picBaseURL,case when isnull(b.HeadImage) or b.HeadImage='' then :defaultHeadImage else b.HeadImage end)HeadImage from wf_drivewealth_practice_rank_v a left join wf_member b on a.MemberCode=b.MemberCode where Type=9 order by a.Rank", { replacements: { picBaseURL: config.picBaseURL, defaultHeadImage: config.defaultHeadImage }, type: "SELECT" })
                    //DataList = await mainDB.query("SELECT c.*,wf_member.NickName,concat(:picBaseURL,case when isnull(wf_member.HeadImage) or wf_member.HeadImage='' then :defaultHeadImage else wf_member.HeadImage end)HeadImage FROM (SELECT a.RankValue TotalAmount,b.RankValue TodayProfit,a.MemberCode,a.Rank from wf_drivewealth_practice_rank_v a ,wf_drivewealth_practice_rank_v b where a.MemberCode = b.MemberCode and a.Type = 11 and b.Type = 10 limit 100)c left join wf_member on wf_member.MemberCode=c.MemberCode ORDER BY c.rank ", { replacements: { picBaseURL: config.picBaseURL, defaultHeadImage: config.defaultHeadImage }, type: "SELECT" })
                res.send({ Status: 0, Explain: "", DataList })
                    //res.set('Content-Type', 'application/json').send(`{ "Status": 0, "Explain": "", "DataList": ${await redisClient.getAsync("RankList:matchTotalProfit")} }`)
                break
            case "WeekProfit": //炒股大赛周排行
                //缓存炒股大赛周排行
                DataList = await mainDB.query("select a.*,b.NickName,concat(:picBaseURL,case when isnull(b.HeadImage) or b.HeadImage='' then :defaultHeadImage else b.HeadImage end)HeadImage from wf_drivewealth_practice_rank_v a left join wf_member b on a.MemberCode=b.MemberCode where Type=3 order by a.Rank", { replacements: { picBaseURL: config.picBaseURL, defaultHeadImage: config.defaultHeadImage }, type: "SELECT" })
                    //DataList = await mainDB.query("SELECT c.*,wf_member.NickName,concat(:picBaseURL,case when isnull(wf_member.HeadImage) or wf_member.HeadImage='' then :defaultHeadImage else wf_member.HeadImage end)HeadImage FROM (SELECT a.RankValue TotalAmount,b.RankValue TodayProfit,a.MemberCode,a.Rank from wf_drivewealth_practice_rank_v a ,wf_drivewealth_practice_rank_v b where a.MemberCode = b.MemberCode and a.Type = 3 and b.Type = 4 limit 100)c left join wf_member on wf_member.MemberCode=c.MemberCode ORDER BY c.rank ", { replacements: { picBaseURL: config.picBaseURL, defaultHeadImage: config.defaultHeadImage }, type: "SELECT" })
                res.send({ Status: 0, Explain: "", DataList, OpenTime, CloseTime })
                    //res.set('Content-Type', 'application/json').send(`{ "Status": 0, "Explain": "", "DataList": ${await redisClient.getAsync("RankList:matchWeekProfit")} }`)
                break
            default:
                res.send({ Status: -1, Explain: "没有该类型" })
        }
    }));
    /**赛事消息 */
    router.get('/Events/:page', ctt, wrap(async({ memberCode, params: { page } }, res) => {
        let pagesize = 20
        let result = await mainDB.query("select * from wf_competition_affiche order by Id desc limit :start,:pagesize", { replacements: { start: Number(page) * pagesize, pagesize }, type: "SELECT" })
        res.send({ Status: 0, DataList: result, Explain: "" })
    }));
    /**事件详情 */
    router.get('/EventDetail/:Id', ctt, wrap(async({ memberCode, params: { Id } }, res) => {
        let result = await singleton.selectMainDB0("wf_competition_affiche", { Id })
        res.send({ Status: 0, Data: result, Explain: "" })
    }));
    return router
}