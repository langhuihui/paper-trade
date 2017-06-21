import sqlstr from '../../common/sqlStr'
import allowAccess from '../middles/allowAccess'
import _config from '../config'
import singleton from '../../common/singleton'
const myMainListSql = `
SELECT *,case when isnull(a.SelectPicture) or a.SelectPicture='' then '' else CONCAT(:picBaseURL,a.SelectPicture) end AS SelectPicture,DATE_FORMAT(ShowTime,'%Y-%m-%d %H:%i:%s') AS ShowTime,
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
        wf_live_video.CommentNumber CommentCount,
        wf_live_video.MemberCode
	FROM
		wf_live_video
	LEFT JOIN wf_member ON wf_live_video.MemberCode = wf_member.MemberCode
    LEFT JOIN (select * from wf_video_good where MemberCode=:myMemberCode)vg on vg.VideoCode=wf_live_video.VideoCode 
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
          wf_news.CommentCount,
          wf_News.CreateUser MemberCode
	FROM
		wf_News
	LEFT JOIN wf_member ON wf_News.CreateUser = wf_member.MemberCode
    LEFT JOIN (select * from wf_news_likes where CreateUser=:myMemberCode)nl on nl.NewsCode=wf_News.Code 
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
        wf_imagetext.CommentCount,
        wf_imagetext.MemberCode
	FROM
		wf_imagetext
	LEFT JOIN wf_member ON wf_imagetext.MemberCode = wf_member.MemberCode
    left join (select * from wf_imagetext_likes where CreateUser=:myMemberCode)il on wf_imagetext.Code=il.ITCode 
	WHERE
		wf_imagetext.Status = 1
	AND wf_imagetext.MemberCode = :memberCode
) a order by  a.ShowTime DESC;
`

let mainListCache = {}

module.exports = function({ express, mainDB, ctt, config, checkEmpty, checkNum, mqChannel, wrap }) {
    async function mainList({ memberCode, pageNum, pageSize, res, myMemberCode }) {
        if (pageSize < 0) pageSize = 10
        if (pageNum < 0) pageNum = 0
        if (pageNum == 0 || !mainListCache[memberCode]) {
            let [result] = await mainDB.query(myMainListSql, { replacements: { memberCode, picBaseURL: config.picBaseURL, defaultHeadImage: config.defaultHeadImage, myMemberCode } })
            mainListCache[memberCode] = result
        }
        let result = mainListCache[memberCode].slice(pageNum * pageSize, (pageNum + 1) * pageSize)
        res.send({ Status: 0, Explain: "", DataList: result })
    }
    async function homePage(memberCode, res) {
        let [result] = await mainDB.query("select TotalAmount,TodayProfit,MtmPL,case wf_member.ShowPositionList when 1 then 1 else 0 end as ShowPositionList from wf_member left join wf_drivewealth_practice_asset on wf_drivewealth_practice_asset.MemberCode=wf_member.MemberCode where wf_member.MemberCode=:memberCode order by EndDate desc limit 1", { replacements: { memberCode }, type: "SELECT" })
        let resultunused = await mainDB.query("select * from wf_drivewealth_practice_order where MemberCode=:memberCode", { replacements: { memberCode }, type: "SELECT" })
        let Data = { TotalAmount: config.practiceInitFun, TodayProfit: 0, MtmPL: 0, EveryDayURL: _config.EveryDayURL + memberCode, Unused: true }
        if (resultunused.length) {
            Data.Unused = false
        }
        Object.assign(Data, result)
        res.send({ Status: 0, Explain: "", Data })
    }
    const router = express.Router();
    /**个人主页我的发布或者他人主页中的发布列表 */
    router.get('/GetMyMainList', ctt, checkNum('pageNum', 'pageSize'), wrap(({ query: { pageNum = 0, pageSize = 10 }, memberCode }, res) => mainList({ memberCode, pageNum, pageSize, res, myMemberCode: memberCode })));
    /**他人主页 */
    router.get('/GetHeMainList', ctt, checkEmpty('memberCode'), checkNum('pageNum', 'pageSize'), wrap(({ query: { pageNum = 0, pageSize = 10, memberCode }, memberCode: myMemberCode }, res) => mainList({ myMemberCode, memberCode, pageNum, pageSize, res })));
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
        let result = await mainDB.query("select * from (select Id,Type,Title,Extension,Content,case when Type<>1 then SendTime else CreateTime end CreateTime,Target from wf_message where (MemberCode=:memberCode or (Type<>1 and MemberCode is null)) and Status=0 and IsDelete=0 and IsSend<>0) a order by a.CreateTime desc", { replacements: { memberCode }, type: "SELECT" })
        for (let msg of result) {
            if (msg.Extension && msg.Type == 1) {
                msg.Extension = JSON.parse(msg.Extension)
            } else {
                delete msg.Extension
            }
        }
        await mainDB.query("delete from wf_message where MemberCode=:memberCode and Type<>1", { replacements: { memberCode } });
        res.send({ Status: 0, Explain: "", DataList: result })
    }))

    //获取自己的系统消息列表
    /*  router.get('/MessageList', ctt, checkNum('pageNum', 'pageSize'), wrap(async({ query: { pageNum = 0, pageSize = 10, Type } }, res) => {
          if (pageSize < 0) pageSize = 10
          if (pageNum < 0) pageNum = 0
          let result = {}
          if (Type) {
              result = await mainDB.query("select Id,Type,Content,Title,DATE_FORMAT(SendTime,'%Y-%m-%d %H:%i:%s')SendTime,Extension from wf_message where IsDelete=0 and IsSend<>0 and Type=:Type order by SendTime DESC limit :pageStart,:pageSize", { replacements: { Type, pageStart: pageNum * pageSize, pageSize }, type: "SELECT" })
          } else {
              result = await mainDB.query("select Id,Type,Content,Title,DATE_FORMAT(SendTime,'%Y-%m-%d %H:%i:%s')SendTime,Extension from wf_message where IsDelete=0 and IsSend<>0 and Type<>1 order by SendTime DESC limit :pageStart,:pageSize", { replacements: { pageStart: pageNum * pageSize, pageSize }, type: "SELECT" })
          }
          res.send({ Status: 0, Explain: "", DataList: result })
      }))*/


    /*
    Type为1资讯,2为视频,3为街区,4为股票详情,5为投票,6为书籍
     */
    //删除自己的评论
    router.delete('/DeleteComment/:Type/:Id', ctt, wrap(async({ params: { Type, Id }, memberCode }, res) => {
        let result = {}
        switch (Type) {
            case "1": //资讯
                result = await singleton.transaction(async transaction => {
                    let updateResult = await singleton.updateMainDB("wf_news_comment", { IsDelete: 1 }, null, { Id, CreateUser: memberCode }, transaction)
                    if (updateResult.changedRows != 1)
                        throw -1
                    let searchResult = await mainDB.query("select NewsCode from wf_news_comment where Id=:Id ", { replacements: { Id }, type: "SELECT" })
                    updateResult = await mainDB.query("update wf_news set CommentCount=CommentCount-1 where Code=:Code ", { replacements: { Code: searchResult[0].NewsCode }, transaction: transaction.transaction })
                    if (updateResult[0].changedRows != 1)
                        throw -1
                })
                if (result != 0) {
                    return res.send({ Status: 500, Explain: result })
                }
                res.send({ Status: 0, Explain: "ok" })
                break;
            case "2": //视频
                result = await singleton.transaction(async transaction => {
                    let updateResult = await singleton.updateMainDB("wf_video_comment", { IsDelete: 1 }, null, { CommentID: Id, MemberCode: memberCode }, transaction)
                    if (updateResult.changedRows != 1)
                        throw -1
                    let searchResult = await mainDB.query("select VideoCode from wf_video_comment where CommentID=:CommentID ", { replacements: { CommentID: Id }, type: "SELECT" })
                    updateResult = await mainDB.query("update wf_live_video set CommentNumber=CommentNumber-1 where VideoCode=:VideoCode ", { replacements: { VideoCode: searchResult[0].VideoCode }, transaction: transaction.transaction })
                    if (updateResult[0].changedRows != 1)
                        throw -1
                })
                if (result != 0) {
                    return res.send({ Status: 500, Explain: result })
                }
                res.send({ Status: 0, Explain: "ok" })
                break;
            case "3": //街区
                result = await singleton.transaction(async transaction => {
                    let updateResult = await singleton.updateMainDB("wf_imagetext_comment", { IsDelete: 1 }, null, { Id, CreateUser: memberCode }, transaction)
                    if (updateResult.changedRows != 1)
                        throw -1
                    let searchResult = await mainDB.query("select ITCode from wf_imagetext_comment where Id=:Id ", { replacements: { Id }, type: "SELECT" })
                    updateResult = await mainDB.query("update wf_imagetext set CommentCount=CommentCount-1 where Code=:Code ", { replacements: { Code: searchResult[0].ITCode }, transaction: transaction.transaction })
                    if (updateResult[0].changedRows != 1)
                        throw -1
                })
                if (result != 0) {
                    return res.send({ Status: 500, Explain: result })
                }
                res.send({ Status: 0, Explain: "ok" })
                break;
            case "4": //股票详情
                result = 0
                let updateResult = await singleton.updateMainDB("wf_quotation_comment", { IsDelete: 1 }, null, { Id, CreateUser: memberCode })
                if (updateResult.changedRows != 1)
                    result = -1
                if (result != 0) {
                    return res.send({ Status: 500, Explain: result })
                }
                res.send({ Status: 0, Explain: "ok" })
                break;
            case "5": //投票
                result = await singleton.transaction(async transaction => {
                    let updateResult = await singleton.updateMainDB("wf_vote_comment", { IsDelete: 1 }, null, { CommentID: Id, MemberCode: memberCode }, transaction)
                    if (updateResult.changedRows != 1)
                        throw -1
                    let searchResult = await mainDB.query("select VoteCode from wf_vote_comment where CommentID=:Id ", { replacements: { Id }, type: "SELECT" })
                    updateResult = await mainDB.query("update wf_vote set CommentCount=CommentCount-1 where VoteCode=:VoteCode ", { replacements: { VoteCode: searchResult[0].VoteCode }, transaction: transaction.transaction })
                    if (updateResult[0].changedRows != 1)
                        throw -1
                })
                if (result != 0) {
                    return res.send({ Status: 500, Explain: result })
                }
                res.send({ Status: 0, Explain: "ok" })
                break;
            case "6": //书籍
                result = await singleton.transaction(async transaction => {
                    let updateResult = await singleton.updateMainDB("wf_books_comment", { IsDelete: 1 }, null, { Id, CreateUser: memberCode }, transaction)
                    if (updateResult.changedRows != 1)
                        throw -1
                    let searchResult = await mainDB.query("select BookCode from wf_books_comment where Id=:Id ", { replacements: { Id }, type: "SELECT" })
                    updateResult = await mainDB.query("update wf_books set CommentCount=CommentCount-1 where Code=:Code ", { replacements: { Code: searchResult[0].BookCode }, transaction: transaction.transaction })
                    if (updateResult[0].changedRows != 1)
                        throw -1
                })
                if (result != 0) {
                    return res.send({ Status: 500, Explain: result })
                }
                res.send({ Status: 0, Explain: "ok" })
                break;
        }
    }))

    /**
     * 修改个人信息里的学校
     */
    router.put('/UpdateSchoolName', ctt, wrap(async({ memberCode, body }, res) => {
        let updateResult = await singleton.updateMainDB("wf_member", body, null, { MemberCode: memberCode })
        if (updateResult.changedRows != 1)
            res.send({ Status: 500, Explain: "failed" })
        else
            res.send({ Status: 0, Explain: "ok" })
    }));

    /**
     * 修改股票持仓开关
     */
    router.put('/UpdateShowPositionList', ctt, wrap(async({ memberCode, body }, res) => {
        let updateResult = await singleton.updateMainDB("wf_member", body, null, { MemberCode: memberCode })
        console.log(updateResult)
        if (updateResult.changedRows != 1)
            res.send({ Status: 500, Explain: "failed" })
        else
            res.send({ Status: 0, Explain: "ok" })
    }));


    /**
     * 获取他人持仓股票
     */
    router.get('/GetPracticePosition', ctt, wrap(async({ memberCode, query: { OtherMemberCode } }, res) => {
        let result = {}
        if (OtherMemberCode) { //他人的持仓股票
            result = await mainDB.query("select ShowPositionList from wf_member where MemberCode=:MemberCode ", { replacements: { MemberCode: OtherMemberCode }, type: "SELECT" })
            result = Object.convertBuffer2Bool(result[0], "ShowPositionList")
            if (result.ShowPositionList)
                result = await mainDB.query("select symbol,openQty,costBasis,marketValue,side,priorClose,availableForTradingQty,avgPrice,mktPrice,unrealizedPL,unrealizedDayPLPercent,unrealizedDayPL from wf_drivewealth_practice_position where MemberCode=:MemberCode ", { replacements: { MemberCode: OtherMemberCode }, type: "SELECT" })
            else
                result = []
        } else { //自己的持仓股票
            result = await mainDB.query("select symbol,openQty,costBasis,marketValue,side,priorClose,availableForTradingQty,avgPrice,mktPrice,unrealizedPL,unrealizedDayPLPercent,unrealizedDayPL from wf_drivewealth_practice_position where MemberCode=:MemberCode ", { replacements: { MemberCode: memberCode }, type: "SELECT" })
        }
        res.send({ Status: 0, Explain: "", DataList: result })
    }));


    /**
     * 获取他人持仓开关
     */
    router.get('/GetShowPositionListStatus', ctt, wrap(async({ memberCode, query: { OtherMemberCode } }, res) => {
        let result = await mainDB.query("select ShowPositionList from wf_member where MemberCode=:MemberCode ", { replacements: { MemberCode: OtherMemberCode }, type: "SELECT" })
        result = Object.convertBuffer2Bool(result[0], "ShowPositionList")
        res.send({ Status: 0, Explain: "", ShowPositionList: result.ShowPositionList == true ? 1 : 0 })
    }));
    return router
}