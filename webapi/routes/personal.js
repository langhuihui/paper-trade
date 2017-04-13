import sqlstr from '../../common/sqlStr'
import _config from '../config'
const myMainListSql = `
SELECT *,CONCAT(:picBaseURL,a.SelectPicture) AS SelectPicture,DATE_FORMAT(ShowTime,'%Y-%m-%d %H:%i:%s') AS ShowTime FROM 
	(SELECT
		'video' AS Type,
		wf_live_video.VideoCode AS Code,
		wf_live_video.VideoName AS Title,
		wf_live_video.VideoImage AS SelectPicture,
		wf_live_video.TimeLong,
		wf_live_video.ShowTime,
		'' SecuritiesNo,
		'' SecuritiesType,
		'' LikeCount,
		'' CommentCount
	FROM
		wf_live_video
	LEFT JOIN wf_member ON wf_live_video.MemberCode = wf_member.MemberCode
	WHERE
		wf_live_video.\`Status\` = '0'
	AND wf_live_video.MemberCode = :memberCode
	UNION
	SELECT
		'news' AS Type,
		wf_News.\`Code\`,
		wf_News.Title,
		wf_News.SelectPicture AS SelectPicture,
		'' AS TimeLong,
		wf_News.ShowTime,
		wf_News.SecuritiesNo,
		wf_News.SecuritiesType,
		'' LikeCount,
		'' CommentCount
	FROM
		wf_News
	LEFT JOIN wf_member ON wf_News.CreateUser = wf_member.MemberCode
	WHERE
		Type = '9'
	AND NOW() > ShowTime
	AND IsStartNews = '0'
	AND wf_News.CreateUser = :memberCode
	UNION
	SELECT
		'imageTalk' AS Type,
		wf_imagetext.\`Code\`,
		wf_imagetext.Details AS Title,
		wf_imagetext.Thumbnail AS SelectPicture,
		'' AS TimeLong,
		wf_imagetext.CreateTime AS ShowTime,
		'' SecuritiesNo,
		'' SecuritiesType,
		wf_imagetext.LikeCount,
		wf_imagetext.CommentCount
	FROM
		wf_imagetext
	LEFT JOIN wf_member ON wf_imagetext.MemberCode = wf_member.MemberCode
	WHERE
		wf_imagetext.\`Status\` = 1
	AND wf_imagetext.MemberCode = :memberCode
) a order by  a.ShowTime DESC;
`

let mainListCache = {}

module.exports = function({ express, sequelize, ctt, config, checkEmpty, checkNum, mqChannel }) {
    async function mainList({ memberCode, pageNum, pageSize, res }) {
        if (pageSize < 0) pageSize = 10
        if (pageNum < 0) pageNum = 0
        if (pageNum == 0 || !mainListCache[memberCode]) {
            let [result] = await sequelize.query(myMainListSql, { replacements: { memberCode, picBaseURL: config.picBaseURL } })
            mainListCache[memberCode] = result
        }
        let result = mainListCache[memberCode].slice(pageNum * pageSize, (pageNum + 1) * pageSize)
        res.send({ Status: 0, Explain: "", DataList: result })
    }
    async function homePage(memberCode, res) {
        let [result] = await sequelize.query("select TotalAmount,TodayProfit,MtmPL from wf_drivewealth_practice_asset where MemberCode=:memberCode order by EndDate desc limit 1", { replacements: { memberCode } })
        let Data = { TotalAmount: config.practiceInitFun, TodayProfit: 0, MtmPL: 0, EveryDayURL: _config.EveryDayURL + memberCode }
        Object.assign(Data, result[0])
        res.send({ Status: 0, Explain: "", Data })
    }
    const router = express.Router();
    /**个人主页我的发布或者他人主页中的发布列表 */
    router.get('/GetMyMainList', ctt, checkNum('pageNum', 'pageSize'), (req, res) => {
        let { pageNum = 0, pageSize = 10 } = req.query
        let memberCode = req.memberCode
        mainList({ memberCode, pageNum, pageSize, res })
    })
    router.get('/GetHeMainList', checkEmpty('memberCode'), checkNum('pageNum', 'pageSize'), (req, res) => {
        let { pageNum = 0, pageSize = 10, memberCode } = req.query
        mainList({ memberCode, pageNum, pageSize, res })
    })
    router.get('/GetMyHomePage', ctt, (req, res) => {
        homePage(req.memberCode, res)
    })
    router.get('/GetHeHomePage/:memberCode', (req, res) => {
        homePage(req.params.memberCode, res)
    });
    /**我的每日收益 */
    router.get('/MyProfitDaily/:memberCode/:startDate', async(req, res) => {
        res.setHeader("Access-Control-Allow-Origin", config.ajaxOrigin);
        res.setHeader("Access-Control-Allow-Methods", "GET");
        let { memberCode, startDate } = req.params
        startDate = new Date(startDate)
        let [result] = await sequelize.query("select TodayProfit*100/TotalAmount profit,DATE_FORMAT(EndDate,'%Y%m%d') as date from wf_drivewealth_practice_asset where MemberCode=:memberCode and EndDate>:startDate", { replacements: { memberCode, startDate } })
        res.send({ Status: 0, Explain: "", DataList: result })
    });
    /**我的系统设置 */
    router.get('/Settings', ctt, async(req, res) => {
        let [result] = await sequelize.query("select PriceNotify from wf_system_setting where MemberCode=:memberCode", { replacements: { memberCode: req.memberCode } })
        res.send({ Status: 0, Explain: "", Data: Object.convertBuffer2Bool(result[0], "PriceNotify") })
    })
    router.put('/Settings', ctt, async(req, res) => {
        let [result] = await sequelize.query("select * from wf_system_setting where MemberCode=:memberCode", { replacements: { memberCode: req.memberCode } })
        let replacements = Object.assign({ memberCode: req.memberCode }, req.body)
        if (result.length) {
            for (let n in req.body) {
                if (!result[0].hasOwnProperty(n)) {
                    res.send({ Status: 40003, Explain: "没有该设置项：" + n })
                    return
                }
            }
            let [result2] = await sequelize.query(sqlstr.update("wf_system_setting", replacements, { memberCode: null }) + "where MemberCode=:memberCode", { replacements })
            res.send({ Status: 0, Explain: result2 })
            if (result[0].PriceNotify[0] == 1 && !replacements.PriceNotify) {
                mqChannel.sendToQueue("priceNotify", new Buffer(JSON.stringify({ cmd: "turnOff", data: { memberCode: req.memberCode } })))
            }
        } else {
            let [result2] = await sequelize.query(sqlstr.insert("wf_system_setting", replacements, { MemberCode: "memberCode" }), { replacements })
            res.send({ Status: 0, Explain: result2 })
            if (!replacements.PriceNotify) {
                mqChannel.sendToQueue("priceNotify", new Buffer(JSON.stringify({ cmd: "turnOff", data: { memberCode: req.memberCode } })))
            }
        }
    });
    /**获取我的消息列表 */
    router.get('/Messages', ctt, async(req, res) => {
        let [result] = await sequelize.query("select Id,Type,Title,Extension,Content,DATE_FORMAT(CreateTime,'%Y-%m-%d %H:%i:%s') CreateTime from wf_message where (MemberCode=:memberCode or Type=2) and Status=0", { replacements: { memberCode: req.memberCode } })
        for (let msg of result) {
            if (msg.Extension) {
                msg.Extension = JSON.parse(msg.Extension)
            }
        }
        await sequelize.query("delete from wf_message where MemberCode=:memberCode", { replacements: { memberCode: req.memberCode } });
        res.send({ Status: 0, Explain: "", DataList: result })
    })
    return router
}