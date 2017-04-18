const sql1 = `
SELECT
	room.*, c.Topic,(case when Status=0 then 'video' else 'live' end) Type,DATE_FORMAT(room.CreateTime,'%Y-%m-%d %H:%i:%s') CreateTime,
	wf_member.HeadImage,wf_member.NickName,concat(:picBaseURL, ImageUrl) ImageUrl
FROM
	wf_liveroom room
LEFT JOIN (
	SELECT
		a.LiveRoomCode,
		GROUP_CONCAT(b.TopicName) AS Topic
	FROM
		wf_live_roomtopic a,
		wf_live_topic b
	WHERE
		a.TopicCode = b.TopicCode
	GROUP BY
		LiveRoomCode
) c ON room.RoomCode = c.LiveRoomCode
LEFT JOIN wf_member ON room.MemberCode=wf_member.MemberCode
WHERE
	Status < 2
ORDER BY
	RoomID DESC;
`
module.exports = function({ sequelize, statistic, ctt, express, config, wrap, redisClient }) {
    const router = express.Router();
    /**直播列表*/
    router.get('/LiveList', wrap(async(req, res) => {
        let [result] = await sequelize.query(sql1, { replacements: { config } })
        for (let item of result) {
            item.MemberNum = Number(await redisClient.getAsync("roommemberrealcount:" + item.RoomCode)) + Number(await redisClient.getAsync("roomrobotcount:" + item.RoomCode))
        }
        res.send({ Status: 0, Explain: "", DataList: result })
    }));
    /**直播列表Banner条 */
    router.get('/LiveBanner', wrap(async(req, res) => {
        let [result] = await sequelize.query("select Title,VideoCode Code,CoverImageUrl Image from wf_video_banner where IsDelete=0 order by SortOrder,Id desc")
        res.send({ Status: 0, Explain: "", DataList: result })
    }));
    /**视频一级列表 */
    router.get('/Home', wrap(async(req, res) => {
        let [Dissertation] = await sequelize.query("select Id,Name,Description,CoverImageUrl Image from wf_video_dissertation where IsDelete=0 order by SortOrder,Id desc")
        let [Column] = await sequelize.query("select Id,Name,CoverImageUrl Image from wf_video_column where IsDelete=0 order by SortOrder,Id desc limit 5")
        let [Latest] = await sequelize.query("select VideoCode Code,VideoName Name,VideoImage Image,TimeLong from wf_live_video where Status=0 order by ShowTime desc limit 5")
        res.send({ Status: 0, Explain: "", Data: { Dissertation, Column, Latest } })
    }));
    /**教学列表 */
    router.get('/Teaching', wrap(async(req, res) => {
        let [result] = await sequelize.query("select *,DATE_FORMAT(ShowTime,'%Y-%m-%d %H:%i:%s') ShowTime from wf_live_video where Backup1=3 and Status=0")
        res.send({ Status: 0, Explain: "", DataList: result })
    }));
    /**热门分类 */
    router.get('/Column', wrap(async(req, res) => {
        let [Column] = await sequelize.query("select Id,Name,CoverImageUrl Image from wf_video_column where IsDelete=0 order by SortOrder,Id desc")
        res.send({ Status: 0, Explain: "", DataList: Column })
    }));
    /**某分类的视频列表 */
    router.get('/Column/:Id', wrap(async(req, res) => {
        let [Column] = await sequelize.query("select VideoCode Code,VideoName Name,VideoImage Image,TimeLong from wf_live_video where Status=0 and ColumnId=:Id order by ShowTime desc", { replacements: req.params })
        res.send({ Status: 0, Explain: "", DataList: Column })
    }));
    return router;
}