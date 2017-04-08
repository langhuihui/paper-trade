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

module.exports = function({ express, sequelize, ctt, config, checkEmpty, checkNum }) {
    async function mainList({ memberCode, pageNum, pageSize, res }) {
        if (pageSize < 0) pageSize = 10
        if (pageNum < 0) pageNum = 0
        if (pageNum == 0 || !mainListCache[memberCode]) {
            let [result] = await sequelize.query(myMainListSql, { replacements: { memberCode, picBaseURL: config.picBaseURL } })
            mainListCache[memberCode] = result
        }
        let result = mainListCache[memberCode].slice(pageNum, pageNum + pageSize)
        res.send({ Status: "0", Explain: "", DataList: result })
    }
    async function homePage(memberCode, res) {
        let [result] = await sequelize.query("select TotalAmount,MtmPL from wf_drivewealth_practice_asset where MemberCode=:memberCode order by EndDate desc limit 2", { replacements: { memberCode } })
        let Data = { TotalAmount: 50000, TodayProfit: 0, MtmPL: 0, EveryDayURL: "http://h5.wolfstree.tv/" }
        if (result.length) {
            Object.assign(Data, result[0])
            if (result.length == 2) {
                Data.TodayProfit = result[0].TotalAmount - result[1].TotalAmount
            }
        }
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
    })
    router.get('/Settings', ctt, (req, res) => {
        let [result] = await sequelize.query("select * from wf_system_setting where MemberCode=:memberCode", { replacements: { memberCode: req.memberCode } })
        res.send({ Status: 0, Explain: "", Data: result[0] })
    })
    router.put('/Settings', ctt, (req, res) => {

    })
    return router
}