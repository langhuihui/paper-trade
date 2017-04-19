const sql1 = `
SELECT
	room.RoomCode,room.RoomTitle,room.MemberCode,room.SecretType,room.City,room.CreateTime, c.Topic,(case when room.Status=0 then 'video' else 'live' end) Type,DATE_FORMAT(room.CreateTime,'%Y-%m-%d %H:%i:%s') CreateTime,
	wf_member.HeadImage,wf_member.NickName,concat(:picBaseURL, ImageUrl) ImageUrl
FROM
	(Select * from wf_liveroom where Status < 2 order by RoomId Desc LIMIT :page,20) room
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
`
module.exports = function({ sequelize, statistic, ctt, express, config, wrap, redisClient }) {
    const router = express.Router();
    /**直播列表*/
    router.get('/LiveList/:page', wrap(async(req, res) => {
        let replacements = { page: Number(req.params.page), picBaseURL: config.picBaseURL }
        let [result] = await sequelize.query(sql1, { replacements })
        let roomCodes = result.map(i => i.RoomCode)
        roomCodes = await redisClient.mgetAsync(...roomCodes.map(i => "roommemberrealcount:" + i.RoomCode).concat(roomCodes.map(i => "roomrobotcount:" + i.RoomCode)))
        let count = result.length;
        for (let i = 0; i < count; i++) {
            result[i].MemberNum = Number(roomCodes[i]) + Number(roomCodes[count + i])
        }
        // for (let item of result) {
        //     item.MemberNum = Number(await redisClient.getAsync("roommemberrealcount:" + item.RoomCode)) + Number(await redisClient.getAsync("roomrobotcount:" + item.RoomCode))
        // }
        res.send({ Status: 0, Explain: "", DataList: result })
    }));
    /**直播列表Banner条 */
    router.get('/LiveBanner', wrap(async(req, res) => {
        let [result] = await sequelize.query("select Title,VideoCode Code,concat(:picBaseURL, CoverImageUrl) Image from wf_video_banner where IsDelete=0 order by SortOrder,Id desc", { replacements: config })
        res.send({ Status: 0, Explain: "", DataList: result })
    }));
    /**视频一级列表 */
    router.get('/Home', wrap(async(req, res) => {
        let replacements = config;
        let [Dissertation] = await sequelize.query("select Id,Name,Description,concat(:picBaseURL, CoverImageUrl) Image from wf_video_dissertation where IsDelete=0 order by SortOrder,Id desc", { replacements })
        let [Column] = await sequelize.query("select Id,Name,concat(:picBaseURL, CoverImageUrl) Image from wf_video_column where IsDelete=0 order by SortOrder,Id desc limit 5", { replacements })
        let [Latest] = await sequelize.query("select VideoCode Code,VideoName Name,concat(:picBaseURL, VideoImage)  Image,TimeLong from wf_live_video where Status=0 order by ShowTime desc limit 5", { replacements })
        res.send({ Status: 0, Explain: "", Data: { Dissertation, Column, Latest } })
    }));
    /**教学列表 */
    router.get('/Teaching/:page', wrap(async(req, res) => {
        let [result] = await sequelize.query("select VideoCode Code,VideoName Title,concat(:picBaseURL, VideoImage)  Image,TimeLong ,DATE_FORMAT(ShowTime,'%Y-%m-%d %H:%i:%s') ShowTime from wf_live_video where Backup1=3 and Status=0 limit :page,20", { replacements: { page: Number(req.params.page), picBaseURL: config.picBaseURL } })
        res.send({ Status: 0, Explain: "", DataList: result })
    }));
    /**热门分类 */
    router.get('/Column', wrap(async(req, res) => {
        let [Column] = await sequelize.query("select Id,Name from wf_video_column where IsDelete=0 order by SortOrder,Id desc", { replacements: config })
        if (Column.length) {
            let columnId = Column[0].Id
            let [FirstColumn] = await sequelize.query("select VideoCode Code,VideoName Title,concat(:picBaseURL, VideoImage)  Image,TimeLong,DATE_FORMAT(ShowTime,'%Y-%m-%d %H:%i:%s') ShowTime from wf_live_video where Status=0 and ColumnId=:Id order by ShowTime desc limit 20", { replacements: { picBaseURL: config.picBaseURL, Id: columnId } })
            res.send({ Status: 0, Explain: "", DataList: Column, FirstColumn })
        } else res.send({ Status: 0, Explain: "无数据", DataList: Column })
    }));
    /**某分类的视频列表 */
    router.get('/Column/:Id/:page', wrap(async(req, res) => {
        let [Column] = await sequelize.query("select VideoCode Code,VideoName Title,concat(:picBaseURL, VideoImage) Image,TimeLong,DATE_FORMAT(ShowTime,'%Y-%m-%d %H:%i:%s') ShowTime from wf_live_video where Status=0 and ColumnId=:Id order by ShowTime desc limit :page,20", { replacements: { page: Number(req.params.page), picBaseURL: config.picBaseURL, Id: Number(req.params.Id) } })
        res.send({ Status: 0, Explain: "", DataList: Column })
    }));
    /**某专题视频列表*/
    router.get('/Dissertation/:Id/:page', wrap(async(req, res) => {
        let [Dissertation] = await sequelize.query("select VideoCode Code,VideoName Title,concat(:picBaseURL, VideoImage)  Image,TimeLong,DATE_FORMAT(ShowTime,'%Y-%m-%d %H:%i:%s') ShowTime from wf_live_video where Status=0 and DissertationId=:Id order by ShowTime desc limit :page,20", { replacements: { page: Number(req.params.page), picBaseURL: config.picBaseURL, Id: Number(req.params.Id) } })
        res.send({ Status: 0, Explain: "", DataList: Dissertation })
    }));
    /**最新视频列表 */
    router.get('/Lastest/:page', wrap(async(req, res) => {
        let [result] = await sequelize.query("select VideoCode Code,VideoName Title,concat(:picBaseURL, VideoImage) Image,TimeLong,DATE_FORMAT(ShowTime,'%Y-%m-%d %H:%i:%s') ShowTime from wf_live_video where Status=0 order by ShowTime desc limit :page,20", { replacements: { page: Number(req.params.page), picBaseURL: config.picBaseURL } })
        res.send({ Status: 0, Explain: "", DataList: result })
    }));
    return router;
}