module.exports = function({ sequelize, ctt, express, config }) {
    const router = express.Router();
    /**图说详情 */
    router.get('/Detail/:code', ctt, async(req, res) => {
        let replacements = req.params
        replacements.memberCode = req.memberCode
        replacements.picBaseURL = config.picBaseURL
        let [result] = await sequelize.query("select *,concat(:picBaseURL,Thumbnail) Composite_Image from wf_imagetext where `Status`=1 and `Code`=:code", { replacements })
        if (result.length) {
            let [it] = result
            //评论数
            let [commentCount] = await sequelize.query(`select count(*) from wf_imagetext_comment where ITCode=:code`, { replacements })
            it.CommentCount = commentCount[0]["count(*)"]
                //点赞数和我是否已经点赞
            let [likeCount] = await sequelize.query(`select count(*),sum(case when CreateUser=:memberCode then 1 else 0 end) myLike from wf_imagetext_likes where ITCode=:code`, { replacements })
            it.LikesCount = likeCount[0]["count(*)"]
            it.IsLikes = Boolean(likeCount[0]["myLike"])
            let [around] = await sequelize.query('select `Code` LastCode,(select `Code` from wf_imagetext where Id<:Id and `Status`=1 order by Id desc limit 1 ) NextCode from wf_imagetext where Id>:Id and `Status`=1 limit 1', { replacements: { Id: it.Id } })
            Object.assign(it, around[0])
            res.send({ Status: 0, Explain: "", Data: it })
        } else {
            res.send({ Status: -1, Explain: "该图说不存在!" })
        }
    });
    /**删除我发布的图说 */
    router.delete('/Delete', ctt, async(req, res) => {
        let { code } = req.query
        if (!code) {
            res.send({ Status: 40002, Explain: "Code不能为空!" })
            return
        }
        let memberCode = req.memberCode
        let [result] = await sequelize.query("update wf_imagetext set `Status`=0 where `Status`=1 and `Code`=:code and MemberCode=:memberCode", { replacements: { code, memberCode } })
        res.send({ Status: 0, Explain: "成功", Data: result })
    })
    return router
}