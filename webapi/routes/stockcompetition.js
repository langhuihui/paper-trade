import Config from '../../config'
import allowAccess from '../middles/allowAccess'
import singleton from '../../common/singleton'
module.exports = function({ express, mainDB, ctt, config, checkEmpty, checkNum, mqChannel, wrap, rongcloud }) {
    var Competition = null
    var TeamCompetitionRange = null
    updateCompetition()
    async function updateCompetition() {
        let result = await mainDB.query("select *,CONCAT(:picBaseURL,Image) Image,CONCAT(:picBaseURL,OriginalImage) OriginalImage from wf_competition_record order by Id desc limit 1", { replacements: { picBaseURL: Config.picBaseURL }, type: "SELECT" })
        Competition = result[0]
        result = await singleton.redisClient.getAsync("teamCompetitionTimetable")
        TeamCompetitionRange = result ? result.split(',').map(x => new Date(x)) : null
        mqChannel.sendToQueue("common", new Buffer(JSON.stringify({ type: "call", func: "competition.checkRange" })))
    }

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
            let week = ThisWeek()
            if (now < new Date(Competition.EndTime) && now > new Date(Competition.StartTime) && now > week[0] && now < week[1]) {
                return true
            }
        }
        return false
    }

    function ThisWeek() {
        if (TeamCompetitionRange) {
            return TeamCompetitionRange
        }
        let addDay = CompetitionIsOpen() ? 0 : 7

        function checkPoint() {
            return CompetitionIsOpen() ? new Date() : new Date(Competition.StartTime)
        }
        let now = checkPoint()
        let weekDay = now.getDay()
        let result = []
        if (weekDay == 6 && now.getHours() >= 4 || weekDay == 1 && now < new Date(now.format("yyyy-MM-dd") + " 21:30:00") || weekDay == 0) {
            now.setDate(now.getDate() - weekDay + 1 + 7)
            now.setHours(21)
            now.setMinutes(30)
            now.setSeconds(0)
            result[0] = now
            now = checkPoint()
            now.setDate(now.getDate() - weekDay + 6 + 7)
            now.setHours(4)
            now.setMinutes(0)
            now.setSeconds(0)
            result[1] = now
        } else {
            now.setDate(now.getDate() - weekDay + 1 + addDay)
            now.setHours(21)
            now.setMinutes(30)
            now.setSeconds(0)
            result[0] = now
            now = checkPoint()
            now.setDate(now.getDate() - weekDay + 6 + addDay)
            now.setHours(4)
            now.setMinutes(0)
            now.setSeconds(0)
            result[1] = now
        }
        return result;
    }


    async function CanJoin(MemberCode, { Status, Id: TeamId }, ignoreApply) {
        if (Status == 1) return { Status: 45003, Explain: "人数已满" }
        if (TeamCompetitionIsOpen()) return { Status: 45004, Explain: "组队赛已开始" }
        let you = await singleton.selectMainDB0("wf_competition_team_member", { TeamId, MemberCode })
        if (!singleton.isEMPTY(you)) return { Status: 45001, Explain: "你已经是该战队成员" }
        if (ignoreApply) return 0
        let lastApply = await mainDB.query("select * from wf_competition_apply where MemberCode=:MemberCode order by CreateTime desc", { replacements: { MemberCode }, type: "SELECT" })
        if (lastApply.length) {
            // if (new Date() - new Date(lastApply[0].CreateTime) < 10 * 60 * 1000) {
            //     return { Status: 45002, Explain: "10分钟内不得再次申请" }
            // } else {
            let apply = lastApply.find(x => x.TeamId == TeamId)
            if (apply)
                return { Status: apply.state, Explain: [, "已申请", "已通过", "已拒绝", "已失效"][apply.state] }
                // }
        }
        return 0
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
    router.get('/ClearAll', (req, res) => {
        mainDB.query("CALL WF_CLEAR_COMPETITION()")
        res.end()
    });
    router.get('/UpdateCompetition', async(req, res) => {
        await updateCompetition()

        res.send(Competition)
    });
    router.get('/Banner', wrap(async(req, res) => {
        let result = await singleton.selectMainDB("wf_competition_banner", { Status: 1, State: 1 })
        res.send({ Status: 0, Explain: "", DataList: result })
    }));
    //获取最近的比赛
    router.get('/Competition', (req, res) => res.send({ Status: Competition ? 0 : -1, Competition }));
    router.get('/CompetitionState', (req, res) => res.send({ Status: 0, IsOpen: CompetitionIsOpen() }));
    /**组队赛情况 */
    router.get('/TeamCompetitionState', ctt, wrap(async({ memberCode }, res) => {
        let teams = await mainDB.query(`select * from wf_competition_team where Status <2`, { type: "SELECT" })
        let CanJoinCount = 0;
        let CanCreateCount = 100 - teams.length
        let IsOpen = TeamCompetitionIsOpen()
        let WeekTime = ThisWeek()
        let Team = {}
        let UIState = await (async() => {
            let [{ enterCount, teamCount, TeamId }] = await mainDB.query("select a.cnt enterCount,b.cnt teamCount,b.TeamId from (select count(*) cnt from wf_stockcompetitionmember where MemberCode=:memberCode and CompetitionId=:CompetitionId) a ,(select count(*) cnt,TeamId from wf_competition_team_member where MemberCode=:memberCode and Status=1) b", { replacements: { memberCode, CompetitionId: Competition.Id }, type: "SELECT" })
            teams.forEach(t => {
                if (t.Id == TeamId) {
                    Team = t
                }
                if (t.Status == 0) CanJoinCount++
            });
            ({ Rank: Team.Rank, RankValue: Team.Profit } = await singleton.selectMainDB0("wf_competition_team_rank", { Type: 4, TeamId }))
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
        let stockcompetitionmember = await singleton.selectMainDB0("wf_stockcompetitionmember", { MemberCode: memberCode, CompetitionId: Competition.Id })
        if (!singleton.isEMPTY(stockcompetitionmember)) {
            res.send({ Status: 40013, Explain: "", Competition }) //默认配置
        } else {
            body.CompetitionId = Competition.Id
            body.CreateTime = new Date()
            await singleton.insertMainDB("wf_stockcompetitionmember", body)
            await singleton.updateMainDB("wf_member", { SchoolName: body.CollegeName }, null, { MemberCode: memberCode })
            if (CompetitionIsOpen()) singleton.CreateParactice(memberCode, "")
            return res.send({ Status: 0, Explain: "", Competition })
        }
    })

    router.post('/Register/:Token', ctt, allowAccess('POST'), RegisterHandler)
        /**报名 */
    router.post('/Register', ctt, RegisterHandler);
    /**搜索学校 */
    router.get('/SearchSchool/:str', allowAccess(), wrap(async({ params: { str } }, res) => {
        res.send({ Status: 0, result: await mainDB.query(`select * from wf_base_school where SchoolName like '%${str}%'`, { type: "SELECT" }) })
    }));
    router.get('/SearchSchool', allowAccess(), wrap(async(req, res) => {
        res.send({ Status: 0, result: await mainDB.query(`select * from wf_base_school`, { type: "SELECT" }) })
    }));
    /**搜索战队 */
    router.get('/SearchTeam/:str', ctt, wrap(async({ memberCode, params: { str } }, res) => {
        let team_member = await singleton.selectMainDB0("wf_competition_team_member", { MemberCode: memberCode, Status: 1 })
        let canJoin = ""
        if (!singleton.isEMPTY(team_member)) {
            canJoin = ",0 CanJoin"
        }
        let result = await mainDB.query(`select * ${canJoin} from wf_competition_team where TeamName like '%${str}%' and Status <>2`, { type: "SELECT" })
        if (!canJoin) {
            await Promise.all(
                result.map(team => CanJoin(memberCode, team).then(result => team.CanJoin = (result == 0 ? 1 : (result.Status == 1 ? 2 : 0))))
            )
        }
        res.send({ Status: 0, result })
    }));
    /**个人状况 */
    router.get('/MyStatus', ctt, wrap(async({ memberCode }, res) => {
        let result = { Status: 0, IsOpen: CompetitionIsOpen(), OpenTime: Competition.StartTime, CloseTime: Competition.EndTime }
        let stockcompetitionmember = await singleton.selectMainDB0("wf_stockcompetitionmember", { MemberCode: memberCode, CompetitionId: Competition.Id });
        ([{ TodayProfit: result.Profit, TodayDefeat: result.Defeat, WeekRank: result.WeekRank, TotalRank: result.TotalRank }] = await mainDB.query(`select max(case when type = 1 then RankValue else 0 end) TodayProfit,
        max(case when type = 1 then Defeat else 0 end) TodayDefeat,
        max(case when type = 3 then Rank else 0 end) WeekRank,
        max(case when type = 11 then Rank else 0 end) TotalRank
         from wf_drivewealth_practice_rank_v where MemberCode=:memberCode`, { replacements: { memberCode }, type: "SELECT" }));
        if (result.Profit == null) result.Defeat = result.TotalRank = result.WeekRank = result.TodayDefeat = result.Profit = 0
        result.Title = ((100 - result.Defeat) / 20 >> 0) + 1
        if (!singleton.isEMPTY(stockcompetitionmember)) {
            //let {TodayProfit} = await singleton.selectMainDB0("wf_drivewealth_practice_asset_v",{MemberCode: memberCode })
            let team_member = await singleton.selectMainDB0("wf_competition_team_member", { MemberCode: memberCode, Status: 1 })
            if (singleton.isEMPTY(team_member)) {
                result.Status = 1
            } else {
                result.Status = 1 + team_member.Level
                result.Team = await singleton.selectMainDB0("wf_competition_team", { Id: team_member.TeamId })
            }
        }
        result.Events = await mainDB.query("select *,CONCAT(:picBaseURL,'/api/h5/Article/',Id) ContentURL from wf_competition_affiche where id in (select max(id) from wf_competition_affiche where State=9 group by Type)", { replacements: { picBaseURL: config.picBaseURL }, type: "SELECT" })
        res.send({ Status: 0, Explain: "", Data: result })
    }));
    /**战队情况 */
    router.get('/TeamStatus/:TeamId', ctt, wrap(async({ memberCode, params: { TeamId } }, res) => {
        let [team] = await mainDB.query("select a.Rank,a.RankValue Profit,b.* from wf_competition_team b left join wf_competition_team_rank a on b.Id=a.TeamId and a.Type=4 where b.Id=:TeamId", { replacements: { TeamId }, type: "SELECT" })
        if (!team) {
            res.send({ Status: -1, Explain: "没有该战队" })
        } else {
            team.Member = await mainDB.query("select a.*,m.NickName,asset.WeekYield,concat(:picBaseURL,case when isnull(m.HeadImage) or m.HeadImage='' then :defaultHeadImage else m.HeadImage end)HeadImage from wf_competition_team_member a left join wf_member m on a.MemberCode=m.MemberCode left join wf_drivewealth_practice_asset_v asset on a.MemberCode=asset.MemberCode and asset.EndDate = curdate() where a.TeamId=:TeamId", { type: "SELECT", replacements: { TeamId, picBaseURL: config.picBaseURL, defaultHeadImage: config.defaultHeadImage } })
            team.CanJoinStatus = await CanJoin(memberCode, team)
            if (team.CanJoinStatus != 0) team.CanJoinStatus = team.CanJoinStatus.Status
            team.CanJoin = team.CanJoinStatus == 0
            team.IsOpen = TeamCompetitionIsOpen()
            team.Role = memberCode == team.MemberCode ? 1 : (team.Member.find(m => m.MemberCode == memberCode) ? 2 : 3)
            team.Status = (() => {
                if (team.Status == 2) return 0
                if (team.Role == 1) return team.IsOpen ? 4 : 3
                if (team.Role == 2) return team.IsOpen ? 6 : 5
                return team.CanJoin ? 2 : 1
            })()
            team.ProfitURL = "http://share.wolfstreet.tv/kmap/teamprofit.html?memberCode=" + TeamId
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
        if (TeamCompetitionIsOpen()) return res.send({ Status: -4, Explain: "比赛已开始" })
        let [{ P_RESULT: Status, P_CODE: Code, P_TEAMID: TeamId }] = await mainDB.query("CALL PRC_WF_CREATETEAM(:memberCode, :TeamName,:Manifesto,@P_RESULT,@P_CODE,@P_TEAMID)", { replacements: {...body, memberCode } })
            //let [{ p_result: Status, Code, TeamId }] = await mainDB.query("select @P_RESULT p_result,@P_CODE Code,@P_TEAMID TeamId", { type: "SELECT" })
        switch (Status) {
            case 0:
                return res.send({ Status, Explain: "", Code, TeamId })
            case 45005:
                return res.send({ Status, Explain: "您已经创建了战队" })
            case 45006:
                return res.send({ Status, Explain: "您已经是某个战队的队员" })
            case 45001:
                return res.send({ Status, Explain: "战队已满" })
            case 43001:
                return res.send({ Status, Explain: "战队名称已经存在" })
            case 500:
                return res.send({ Status, Explain: "服务器错误" })
        }
        res.send({ Status, Explain: "" });
        // let [team] = await mainDB.query("select * from wf_competition_team where (TeamName=:TeamName or MemberCode=:memberCode) and Status<>2", { replacements: { TeamName: body.TeamName, memberCode }, type: "SELECT" })
        // if (team) {
        //     if (team.TeamName == body.TeamName)
        //         return res.send({ Status: 40013, Explain: "战队名称已经存在" })
        //     else {
        //         return res.send({ Status: 45005, Explain: "您已经创建了战队", team })
        //     }
        // }
        // let [{ teamCount }] = await mainDB.query("select count(*) teamCount from wf_competition_team where Status<>2", { type: "SELECT" })
        // if (teamCount >= 100) {
        //     return res.send({ Status: 45001, Explain: "战队已满" })
        // }
        // let [{ Code }] = await mainDB.query("select * from wf_competition_code where State = 0 order by rand() limit 1", { type: "SELECT" })
        // await singleton.updateMainDB("wf_competition_code", { State: 1 }, null, { Code })
        // let { insertId } = await singleton.insertMainDB("wf_competition_team", Object.assign(body, { Code, MemberCode: memberCode, MemberCount: 1, Status: 0 }), { CreateTime: "now()" })
        // await singleton.insertMainDB("wf_competition_team_member", { TeamId: insertId, MemberCode: memberCode, Level: 1, Type: 1, Status: 1 }, { CreateTime: "now()" })
        // res.send({ Status: 0, Explain: "", Code, TeamId: insertId })
    }));
    /**申请加入战队 */
    router.post('/JoinTeam/:TeamId', ctt, wrap(async({ memberCode, params: { TeamId } }, res) => {
        let team = await singleton.selectMainDB0("wf_competition_team", { Id: TeamId })
        if (singleton.isEMPTY(team) || team.Status == 2) return res.send({ Status: -1, Explain: "不存在这个战队" })
        let result = await CanJoin(memberCode, team)
        if (result != 0) return res.send(result)
        await singleton.insertMainDB("wf_competition_apply", { TeamId, MemberCode: memberCode, State: 1 }, { CreateTime: "now()" })
        let [from] = await mainDB.query("select MemberCode,Nickname from wf_member where MemberCode=:memberCode", { replacements: { memberCode }, type: "SELECT" })
        singleton.sendJpushNotify(team.MemberCode, "入队申请", from.Nickname + "申请加入你的战队", { AlertType: config.jpushType_competition, Type: "join", from, team })
        singleton.insertMainDB("wf_message", { Target: TeamId, Type: 11, Content: from.Nickname + "申请加入你的战队", MemberCode: team.MemberCode, Sender: from.MemberCode, Status: 0, Title: "收到入队申请", IsSend: 1 }, { CreateTime: "now()", SendTime: "now()" })
            //singleton.sendJpushMessage(team.MemberCode, "收到申请", "", "", { AlertType: config.jpushType_competition, Type: "join", from, team })
        res.send({ Status: 0, Explain: "" })
    }));
    /**使用邀请码加入战队 */
    router.post('/JoinTeamByCode/:Code', ctt, wrap(async({ memberCode: MemberCode, params: { Code } }, res) => {
        let team = await singleton.selectMainDB0("wf_competition_team", { Code })
        if (singleton.isEMPTY(team) || team.Status == 2) return res.send({ Status: -1, Explain: "不存在这个战队" })
        let result = await CanJoin(MemberCode, team, true)
        if (result != 0) return res.send(result)
        team.MemberCount++;
        result = await singleton.transaction2(t => {
            singleton.insertMainDB("wf_competition_team_member", { TeamId: team.Id, MemberCode, Level: 2, Type: 2, Status: 1 }, { CreateTime: "now()" }, t)
            mainDB.query("update wf_competition_apply set State=4 where MemberCode=:MemberCode and TeamId<>:TeamId", { replacements: { MemberCode, TeamId: team.Id }, transaction: t.transaction })
            singleton.updateMainDB("wf_competition_team", { Status: team.MemberCount == 3 ? 1 : 0, MemberCount: team.MemberCount }, null, { Id: team.Id }, t)
        })
        if (result == 0) {
            let [from] = await mainDB.query("select MemberCode,Nickname from wf_member where MemberCode=:MemberCode", { replacements: { MemberCode }, type: "SELECT" })
            singleton.sendJpushNotify(team.MemberCode, "有人成功入队", from.Nickname + "通过邀请码成功加入了你的战队", { AlertType: config.jpushType_competition, Type: "joinByCode", from, team })
            singleton.insertMainDB("wf_message", { Target: team.Id, Type: 11, Content: from.Nickname + "通过邀请码成功加入了你的战队", MemberCode: team.MemberCode, Sender: MemberCode, Status: 0, Title: "有人成功加入您的队伍", IsSend: 1 }, { CreateTime: "now()", SendTime: "now()" })
                //singleton.sendJpushMessage(team.MemberCode, "通过邀请码加入", "", "", { AlertType: config.jpushType_competition, Type: "joinByCode", from, team })
            res.send({ Status: 0, Explain: "", TeamId: team.Id })
        } else {
            res.send({ Status: 500, Explain: result })
        }
    }));
    /**战队列表 */
    router.get('/TeamList', ctt, wrap(async({ memberCode, query: { searchKey } }, res) => {
        let team_member = await singleton.selectMainDB0("wf_competition_team_member", { MemberCode: memberCode, Status: 1 })
        let canJoin = ""
        if (!singleton.isEMPTY(team_member)) {
            canJoin = ",0 CanJoin"
        }
        let teams = await mainDB.query(`select *${canJoin} from wf_competition_team where Status < 2 order by Id desc`, { type: "SELECT" })
        if (!canJoin) {
            await Promise.all(
                teams.map(team => CanJoin(memberCode, team).then(result => {
                    team.CanJoin = (result == 0 ? 1 : (result.Status == 1 ? 2 : 0))
                }))
            )
        }
        res.send({ Status: 0, Explain: "", DataList: teams })
    }));
    /**申请列表 */
    router.get('/ApplyList', ctt, wrap(async({ memberCode }, res) => {
        let team = await singleton.selectMainDB0("wf_competition_team", { MemberCode: memberCode }, "Status<2")
        if (singleton.isEMPTY(team)) {
            return res.send({ Status: -1, Explain: "你没有创建战队" })
        }
        let applyList = await mainDB.query("select c.*,m.Nickname NickName,concat(:picBaseURL,case when isnull(m.HeadImage) or m.HeadImage='' then :defaultHeadImage else m.HeadImage end)HeadImage from wf_competition_apply c left join wf_member m on c.MemberCode=m.MemberCode  where TeamId=:teamId and c.State<>4", { replacements: { picBaseURL: config.picBaseURL, defaultHeadImage: config.defaultHeadImage, teamId: team.Id }, type: "SELECT" })
        res.send({ Status: 0, Explain: "", DataList: applyList })
    }));
    /**接受申请 */
    router.post('/Accept/:MemberCode', ctt, wrap(async({ memberCode, params: { MemberCode } }, res) => {
        // let team = await singleton.selectMainDB0("wf_competition_team", { MemberCode: memberCode }, "Status<>2")
        // if (singleton.isEMPTY(team)) {
        //     return res.send({ Status: -1, Explain: "你没有创建战队" })
        // }
        // if (team.Status == 1) {
        //     return res.send({ Status: 45003, Explain: "人数已满" })
        // }
        // team = await singleton.selectMainDB0("wf_competition_team_member", { MemberCode, Status: 1 })
        // if (!singleton.isEMPTY(team)) {
        //     return res.send({ Status: -3, Explain: "TA已在别的战队中" })
        // }
        // let apply = await singleton.selectMainDB0("wf_competition_apply", { MemberCode, TeamId: team.Id })
        // if (singleton.isEMPTY(apply)) {
        //     return res.send({ Status: -2, Explain: "没有该人的申请" })
        // }
        // if (apply.State != 1) {
        //     return res.send({ Status: apply.State, Explain: [, , "已通过", "已拒绝", "已失效"][apply.State] })
        // }
        // team.MemberCount++;
        // let result = await singleton.transaction2(t => {
        //     singleton.updateMainDB("wf_competition_apply", { State: 2 }, null, { MemberCode, TeamId: team.Id }, t)
        //     singleton.insertMainDB("wf_competition_team_member", { TeamId: team.Id, MemberCode, Level: 2, Type: 3, Status: 1 }, { CreateTime: "now()" }, t)
        //     mainDB.query("update wf_competition_apply set State=4 where MemberCode=:MemberCode and TeamId<>:TeamId", { replacements: { MemberCode, TeamId: team.Id }, transaction: t.transaction })
        //     singleton.updateMainDB("wf_competition_team", { Status: team.MemberCount == 3 ? 1 : 0, MemberCount: team.MemberCount }, null, { Id: team.Id }, t)
        // })
        if (TeamCompetitionIsOpen()) return res.send({ Status: -4, Explain: "比赛已开始" })
        let [{ P_RESULT, P_TEAMID: Id, P_TEAMNAME: TeamName }] = await mainDB.query("CALL PRC_WF_ACCEPT_JOINTEAM(:memberCode,:MemberCode, @P_RESULT,@P_TEAMID,@P_TEAMNAME)", { replacements: { memberCode, MemberCode } })
            // if (p_result == 0) {
            //     singleton.insertMainDB("wf_message", { Type: 2, Content: team.TeamName + " 队长已同意您的入队申请!", MemberCode, Title: "申请已通过", IsSend: 1 }, { CreateTime: "now()", SendTime: "now()" })
            // } else {
        switch (P_RESULT) {
            case 0:
                singleton.sendJpushMessage(MemberCode, "同意申请", "", "", { AlertType: config.jpushType_competition, Type: "accept", team: { Id, TeamName } })
                return res.send({ Status: 0, Explain: "" })
            case -1:
                return res.send({ Status: -1, Explain: "你没有创建战队" })
            case -2:
                return res.send({ Status: -2, Explain: "没有该人的申请" })
            case -3:
                return res.send({ Status: -3, Explain: "TA已在别的战队中" })
            default:
                return res.send({ Status: p_result, Explain: [, , "已通过", "已拒绝", "已失效"][P_RESULT] })
        }
        // }
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
        singleton.insertMainDB("wf_message", { Type: 2, Content: team.TeamName + " 队长已拒绝您的入队申请！", MemberCode, Title: "申请被拒绝", IsSend: 1 }, { CreateTime: "now()", SendTime: "now()" })
        singleton.sendJpushMessage(MemberCode, "拒绝申请", "", "", { AlertType: config.jpushType_competition, Type: "refuse", team })
        res.send({ Status: 0, Explain: "" })
    }));
    /**排行榜 */
    router.get('/RankList/:type', ctt, wrap(async({ memberCode, params: { type } }, res) => {
        let [OpenTime, CloseTime] = ThisWeek()
        OpenTime = OpenTime.format()
        CloseTime = CloseTime.format()
        let DataList = []

        switch (type) {
            case "TeamProfit":
                if (TeamCompetitionIsOpen())
                    DataList = await mainDB.query("SELECT 1 IsOpen, a.Rank,a.RankValue,b.*,(case when b.Status=0 then '未参赛' when b.Status=1 then '比赛中' end) StatusStr from wf_competition_team_rank a left join wf_competition_team b on b.Id=a.TeamId where a.Type=4 limit 100", { type: "SELECT" })
                else
                    DataList = await mainDB.query("select 0 IsOpen, TeamName,(case when Status=0 then '组队中' when Status=1 then '已满员' end) StatusStr from wf_competition_team where Status<2", { type: "SELECT" })
                res.send({ Status: 0, Explain: "", DataList, OpenTime, CloseTime })
                break
            case "TotalProfit": //炒股大赛总排行
                if (CompetitionIsOpen())
                //缓存炒股大赛总排行
                    DataList = await mainDB.query("select 1 Status,1 IsOpen, a.*,b.NickName,concat(:picBaseURL,case when isnull(b.HeadImage) or b.HeadImage='' then :defaultHeadImage else b.HeadImage end)HeadImage from wf_drivewealth_practice_rank_v a left join wf_member b on a.MemberCode=b.MemberCode where Type=9 order by a.Rank limit 100", { replacements: { picBaseURL: config.picBaseURL, defaultHeadImage: config.defaultHeadImage }, type: "SELECT" })
                else
                    DataList = await mainDB.query("select 0 Status,0 IsOpen,a.*,b.NickName,concat(:picBaseURL,case when isnull(b.HeadImage) or b.HeadImage='' then :defaultHeadImage else b.HeadImage end)HeadImage from (select * from wf_stockcompetitionmember where CompetitionId=:CompetitionId) a left join wf_member b on a.MemberCode=b.MemberCode", { replacements: { CompetitionId: Competition.Id, picBaseURL: config.picBaseURL, defaultHeadImage: config.defaultHeadImage }, type: "SELECT" })
                    //DataList = await mainDB.query("SELECT c.*,wf_member.NickName,concat(:picBaseURL,case when isnull(wf_member.HeadImage) or wf_member.HeadImage='' then :defaultHeadImage else wf_member.HeadImage end)HeadImage FROM (SELECT a.RankValue TotalAmount,b.RankValue TodayProfit,a.MemberCode,a.Rank from wf_drivewealth_practice_rank_v a ,wf_drivewealth_practice_rank_v b where a.MemberCode = b.MemberCode and a.Type = 11 and b.Type = 10 limit 100)c left join wf_member on wf_member.MemberCode=c.MemberCode ORDER BY c.rank ", { replacements: { picBaseURL: config.picBaseURL, defaultHeadImage: config.defaultHeadImage }, type: "SELECT" })
                res.send({ Status: 0, Explain: "", DataList })
                    //res.set('Content-Type', 'application/json').send(`{ "Status": 0, "Explain": "", "DataList": ${await redisClient.getAsync("RankList:matchTotalProfit")} }`)
                break
            case "WeekProfit": //炒股大赛周排行
                if (CompetitionIsOpen())
                //缓存炒股大赛周排行
                    DataList = await mainDB.query("select 1 Status,1 IsOpen, a.*,b.NickName,concat(:picBaseURL,case when isnull(b.HeadImage) or b.HeadImage='' then :defaultHeadImage else b.HeadImage end)HeadImage from wf_drivewealth_practice_rank_v a left join wf_member b on a.MemberCode=b.MemberCode where Type=3 order by a.Rank limit 100", { replacements: { picBaseURL: config.picBaseURL, defaultHeadImage: config.defaultHeadImage }, type: "SELECT" })
                else
                    DataList = await mainDB.query("select 0 Status,0 IsOpen,a.*,b.NickName,concat(:picBaseURL,case when isnull(b.HeadImage) or b.HeadImage='' then :defaultHeadImage else b.HeadImage end)HeadImage from (select * from wf_stockcompetitionmember where CompetitionId=:CompetitionId) a left join wf_member b on a.MemberCode=b.MemberCode", { replacements: { CompetitionId: Competition.Id, picBaseURL: config.picBaseURL, defaultHeadImage: config.defaultHeadImage }, type: "SELECT" })
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
        let result = await mainDB.query("select *,CONCAT(:picBaseURL,'/api/h5/Article/',Id) ContentURL from wf_competition_affiche order by Id desc limit :start,:pagesize", { replacements: { start: Number(page) * pagesize, pagesize, picBaseURL: config.picBaseURL }, type: "SELECT" })
        res.send({ Status: 0, DataList: result, Explain: "" })
    }));
    /**事件详情 */
    router.get('/EventDetail/:Id', ctt, wrap(async({ memberCode, params: { Id } }, res) => {
        let result = await singleton.selectMainDB0("wf_competition_affiche", { Id })
        result.ContentURL = config.picBaseURL + '/api/h5/Article/' + Id
        res.send({ Status: 0, Data: result, Explain: "" })
    }));
    /**收益曲线 */
    router.get('/ProfitDaily/:memberCode/:startDate', allowAccess(), wrap(async({ params: { memberCode, startDate } }, res) => {
        startDate = new Date(startDate)
        let result = await mainDB.query("select TodayProfit*100/TotalAmount profit,DATE_FORMAT(EndDate,'%Y%m%d') as date from wf_drivewealth_practice_asset_v where MemberCode=:memberCode and EndDate>:startDate", { replacements: { memberCode, startDate }, type: "SELECT" })
        res.send({ Status: 0, Explain: "", DataList: result })
    }));
    /**团队收益曲线 */
    router.get('/TeamProfitDaily/:TeamId', allowAccess(), wrap(async({ params: { TeamId } }, res) => {
        let result = await mainDB.query("select AvgYield profit,DATE_FORMAT(EndDate,'%Y%m%d') as date from wf_competition_team_asset where TeamId=:TeamId ", { replacements: { TeamId }, type: "SELECT" })
        res.send({ Status: 0, Explain: "", DataList: result })
    }))
    return router
}