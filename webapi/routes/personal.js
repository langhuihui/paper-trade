import sqlstr from '../../common/sqlStr'
import allowAccess from '../middles/allowAccess'
import _config from '../config'
const myMainListSql = `
SELECT *,CONCAT(:picBaseURL,a.SelectPicture) AS SelectPicture,DATE_FORMAT(ShowTime,'%Y-%m-%d %H:%i:%s') AS ShowTime,
CONCAT(:picBaseURL,case when isnull(a.HeadImage) or a.HeadImage='' then :defaultHeadImage else a.HeadImage end)nHeadImage  FROM 
	(SELECT
		'video' AS Type,
		wf_live_video.VideoCode AS Code,
		wf_live_video.VideoName AS Title,
		wf_live_video.VideoImage AS SelectPicture,
		wf_live_video.TimeLong,
		wf_live_video.ShowTime,
		'' SecuritiesNo,
		'' SecuritiesType,
        -1 ImageTextType,
        wf_member.Nickname,
        wf_member.HeadImage,
        case when ISNULL(vg.MemberCode) OR vg.MemberCode='' then 0 else  1 end as ClickLike,
        wf_live_video.GoodNumber LikesCount,
        wf_live_video.CommentNumber CommentCount
	FROM
		wf_live_video
	LEFT JOIN wf_member ON wf_live_video.MemberCode = wf_member.MemberCode
    LEFT JOIN (select * from wf_video_good where MemberCode=:memberCode)vg on vg.VideoCode=wf_live_video.VideoCode 
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
         -1 ImageTextType,
         wf_member.Nickname,
         wf_member.HeadImage,
          case when ISNULL(nl.CreateUser) OR nl.CreateUser='' then 0 else  1 end as ClickLike,
          wf_news.LikesCount,
          wf_news.CommentCount
	FROM
		wf_News
	LEFT JOIN wf_member ON wf_News.CreateUser = wf_member.MemberCode
    LEFT JOIN (select * from wf_news_likes where CreateUser=:memberCode)nl on nl.NewsCode=wf_News.Code 
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
        wf_imagetext.Type ImageTextType,
        wf_member.Nickname,
        wf_member.HeadImage,
        case when ISNULL(il.CreateUser) or il.CreateUser='' then 0 else 1 end as ClickLike,
        wf_imagetext.LikeCount,
        wf_imagetext.CommentCount
	FROM
		wf_imagetext
	LEFT JOIN wf_member ON wf_imagetext.MemberCode = wf_member.MemberCode
    left join (select * from wf_imagetext_likes where CreateUser=:memberCode)il on wf_imagetext.Code=il.ITCode 
	WHERE
		wf_imagetext.Status = 1
	AND wf_imagetext.MemberCode = :memberCode
) a order by  a.ShowTime DESC;
`

let mainListCache = {}

module.exports = function({ express, mainDB, ctt, config, checkEmpty, checkNum, mqChannel, wrap }) {
    async function mainList({ memberCode, pageNum, pageSize, res }) {
        if (pageSize < 0) pageSize = 10
        if (pageNum < 0) pageNum = 0
        if (pageNum == 0 || !mainListCache[memberCode]) {
            let [result] = await mainDB.query(myMainListSql, { replacements: { memberCode, picBaseURL: config.picBaseURL, defaultHeadImage: config.defaultHeadImage } })
            mainListCache[memberCode] = result
        }
        let result = mainListCache[memberCode].slice(pageNum * pageSize, (pageNum + 1) * pageSize)
        res.send({ Status: 0, Explain: "", DataList: result })
    }
    async function homePage(memberCode, res) {
        let [result] = await mainDB.query("select TotalAmount,TodayProfit,MtmPL from wf_drivewealth_practice_asset where MemberCode=:memberCode order by EndDate desc limit 1", { replacements: { memberCode } })
        let Data = { TotalAmount: config.practiceInitFun, TodayProfit: 0, MtmPL: 0, EveryDayURL: _config.EveryDayURL + memberCode, Unused: true }
        if (result.length) {
            Data.Unused = false
            Object.assign(Data, result[0])
        }
        res.send({ Status: 0, Explain: "", Data })
    }
    const router = express.Router();
    /**个人主页我的发布或者他人主页中的发布列表 */
    router.get('/GetMyMainList', ctt, checkNum('pageNum', 'pageSize'), wrap(({ query: { pageNum = 0, pageSize = 10 }, memberCode }, res) => mainList({ memberCode, pageNum, pageSize, res })));
    /**他人主页 */
    router.get('/GetHeMainList', checkEmpty('memberCode'), checkNum('pageNum', 'pageSize'), wrap(({ query: { pageNum = 0, pageSize = 10, memberCode } }, res) => mainList({ memberCode, pageNum, pageSize, res })));
    router.get('/GetMyHomePage', ctt, wrap(({ memberCode }, res) => homePage(memberCode, res)));
    router.get('/GetHeHomePage/:memberCode', wrap(({ params: { memberCode } }, res) => homePage(memberCode, res)));
    /**我的每日收益 */
    router.get('/MyProfitDaily/:memberCode/:startDate', allowAccess(), wrap(async({ params: { memberCode, startDate } }, res) => {
        startDate = new Date(startDate)
        let [result] = await mainDB.query("select TodayProfit*100/TotalAmount profit,DATE_FORMAT(EndDate,'%Y%m%d') as date from wf_drivewealth_practice_asset where MemberCode=:memberCode and EndDate>:startDate", { replacements: { memberCode, startDate } })
        res.send({ Status: 0, Explain: "", DataList: result })
    }));
    /**我的系统设置 */
    router.get('/Settings', ctt, wrap(async({ memberCode }, res) => {
        let [result] = await mainDB.query("select PriceNotify from wf_system_setting where MemberCode=:memberCode", { replacements: { memberCode } })
        if (result.length)
            res.send({ Status: 0, Explain: "", Data: Object.convertBuffer2Bool(result[0], "PriceNotify") })
        else res.send({ Status: 0, Explain: "", Data: { PriceNotify: true } }) //默认配置
    }))
    router.put('/Settings', ctt, wrap(async({ memberCode, body }, res) => {
        let replacements = { memberCode }
        let [result] = await mainDB.query("select * from wf_system_setting where MemberCode=:memberCode", { replacements })
        Object.assign(replacements, body)
        if (result.length) {
            for (let n in body) {
                if (!result[0].hasOwnProperty(n)) {
                    res.send({ Status: 40003, Explain: "没有该设置项：" + n })
                    return
                }
            }
            let [result2] = await mainDB.query(sqlstr.update("wf_system_setting", replacements, { memberCode: null }) + "where MemberCode=:memberCode", { replacements })
            res.send({ Status: 0, Explain: result2 })
            if (result[0].PriceNotify[0] == 1 && !replacements.PriceNotify) {
                mqChannel.sendToQueue("priceNotify", new Buffer(JSON.stringify({ cmd: "turnOff", data: { memberCode } })))
            } else if (result[0].PriceNotify[0] == 0 && replacements.PriceNotify) {
                mqChannel.sendToQueue("priceNotify", new Buffer(JSON.stringify({ cmd: "turnOn", data: { memberCode } })))
            }
        } else {
            let [result2] = await mainDB.query(...sqlstr.insert2("wf_system_setting", replacements))
            res.send({ Status: 0, Explain: result2 })
            if (!replacements.PriceNotify) {
                mqChannel.sendToQueue("priceNotify", new Buffer(JSON.stringify({ cmd: "turnOff", data: { memberCode } })))
            } else {
                mqChannel.sendToQueue("priceNotify", new Buffer(JSON.stringify({ cmd: "turnOn", data: { memberCode } })))
            }
        }
    }));
    /**获取我的消息列表 */
    router.get('/Messages', ctt, wrap(async({ memberCode }, res) => {
        let [result] = await mainDB.query("select Id,Type,Title,Extension,Content,DATE_FORMAT(CreateTime,'%Y-%m-%d %H:%i:%s') CreateTime from wf_message where (MemberCode=:memberCode or Type=2) and Status=0 order by Id desc", { replacements: { memberCode } })
        for (let msg of result) {
            if (msg.Extension) {
                msg.Extension = JSON.parse(msg.Extension)
            }
        }
        await mainDB.query("delete from wf_message where MemberCode=:memberCode", { replacements: { memberCode } });
        res.send({ Status: 0, Explain: "", DataList: result })
    }))
    return router
}