import express from 'express'
module.exports = function(shareData) {
    const router = express.Router();
    let { sequelize, ctt } = shareData
    router.get('/Detail', async(req, res) => {
        let { code } = req.query
        let [result] = await sequelize.query("select * from wf_imagetext where `Status`=1 and `Code`=:code", { replacements: { code } })
        if (result.length) {
            let [it] = result
            let [commentCount] = await sequelize.query(`select count(*) from wf_imagetext_comment where ITCode=:code`, { replacements: { code } })
            it.CommentCount = commentCount[0]["count(*)"]
            res.status(200).send({ Status: 0, Explain: "", Data: it })
        } else {
            res.status(200).send({ Status: -1, Explain: "该图说不存在!" })
        }
    })
    router.delete('/Delete', [ctt], async(req, res) => {
        let { code } = req.query
        if (!code) {
            res.status(200).send({ Status: '40002', Explain: "Code不能为空!" })
            return
        }
        let memberCode = req.memberCode
        let [result] = await sequelize.query("update wf_imagetext set `Status`=0 where `Status`=1 and `Code`=:code and MemberCode=:memberCode", { replacements: { code, memberCode } })
        res.status(200).send({ Status: 0, Explain: "成功", Data: result })
    })
    return router
}