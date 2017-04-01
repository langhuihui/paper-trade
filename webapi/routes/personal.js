import express from 'express'
const myMainListSql = `
SELECT * FROM 
	(SELECT
		'video' AS Type,
		wf_live_video.VideoCode AS Code,
		wf_live_video.VideoName AS Title,
		wf_live_video.VideoImage AS SelectPicture,
		wf_live_video.TimeLong AS TimeLog,
		wf_live_video.ShowTime AS ShowTime,
		'' SecuritiesNo,
		'' SecuritiesType
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
		wf_News.SelectPicture,
		'0' AS TimeLong,
		wf_News.ShowTime AS ShowTime,
		wf_News.SecuritiesNo,
		wf_News.SecuritiesType
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
		'0' AS TimeLong,
		wf_imagetext.CreateTime AS ShowTime,
		'' SecuritiesNo,
		'' SecuritiesType
	FROM
		wf_imagetext
	LEFT JOIN wf_member ON wf_imagetext.MemberCode = wf_member.MemberCode
	WHERE
		wf_imagetext.\`Status\` = 1
	AND wf_imagetext.MemberCode = :memberCode
) a order by  a.ShowTime DESC;
`

let mainListCache = {}

module.exports = function(shareData) {
    const router = express.Router();
    let { sequelize, ctt } = shareData
    router.get('/GetMyMainList', [ctt], async(req, res) => {
        let { pageNum = 0, pageSize = 10 } = req.query
        pageNum = Number(pageNum)
        pageSize = Number(pageSize)
        if (Number.isNaN(pageNum) || Number.isNaN(pageSize)) {
            res.status(200).send({ Status: "40003", Explain: "参数类型应该是整数，您传的是：" + JSON.stringify(req.query) })
        } else {
            if (pageNum == 0 || !mainListCache[req.memberCode]) {
                let [result] = await sequelize.query(myMainListSql, { replacements: { memberCode: req.memberCode } })
                mainListCache[req.memberCode] = result
            }
            res.status(200).send(mainListCache[req.memberCode].slice(pageNum, pageNum + pageSize))
        }

    })
    return router
}