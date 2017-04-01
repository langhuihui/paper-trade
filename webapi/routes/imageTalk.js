import express from 'express'
module.exports = function(shareData) {
    const router = express.Router();
    let { sequelize, checkToken } = shareData
    router.get('/Detail', async(req, res) => {
        let { code } = req.query
        let [result] = await sequelize.query("select * from wf_imagetext where `Status`=1 && `Code`='" + code + "'")
        if (result.length) {
            let [it] = result
            let [commentCount] = await sequelize.query(`select count(*) from wf_imagetext_comment where ITCode='${code}'`)
            it.CommentCount = commentCount[0]["count(*)"]
            res.status(200).send({ Status: 0, Explain: "", Data: it })
        } else {
            res.status(200).send({ Status: -1, Explain: "该图说不存在!" })
        }
    })
    return router
}