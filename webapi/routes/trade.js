import sqlstr from '../../common/sqlStr'

module.exports = function({ sequelize, ctt, express, checkEmpty, mqChannel, redisClient }) {
    const router = express.Router();
    /**是否开市*/
    router.get('/:type/IsOpen', async(req, res) => {
        let type = req.params.type
        if (type == 'us') {
            let [result] = await sequelize.query("select * from wf_system_opendate_bak where Type=:type and StartTimeAM<Now() and EndTimePM>Now()", { replacements: { type } })
            res.send({ Status: 0, Explain: "", IsOpen: result.length > 0 })
        } else {
            let [result] = await sequelize.query("select * from wf_system_opendate_bak where Type=:type and ((StartTimeAM<Now() and EndTimeAM>Now()) or (StartTimePM<Now() and EndTimePM>Now()))", { replacements: { type } })
            res.send({ Status: 0, Explain: "", IsOpen: result.length > 0 })
        }
    });
    // /**是否已经绑定（创建）嘉维账户 */
    // router.get('/IsDwAccCreated', ctt, async(req, res) => {
    //     let memberCode = req.memberCode
    //     let [result] = await sequelize.query("select userID,username,emailAddress1 from wf_drivewealth_user where MemberCode=:memberCode", { replacements: { memberCode } })

    //     res.send({ Status: 0, Explain: "", IsDwAccCreated: result.length })
    // });
    /**我的每日总资产 */
    router.get('/MyAssetsDaily', checkEmpty("memberCode", "startDate"), async(req, res) => {
        let { memberCode, startDate } = req.query
        startDate = new Date(startDate)
        let [result] = await sequelize.query("select TotalAmount totalAsset,DATE_FORMAT(EndDate,'%Y-%m-%d') as date from wf_drivewealth_practice_asset where MemberCode=:memberCode and EndDate>:startDate", { replacements: { memberCode, startDate } })
        res.send({ Status: 0, Explain: "", DataList: result })
    });
    /**修改股价提醒 */
    router.put('/SetPriceNotify', ctt, async(req, res) => {
        let replacements = req.body
        replacements.MemberCode = req.memberCode
        let [result0] = await sequelize.query("select * from wf_securities_remind where MemberCode=:MemberCode and SecuritiesNo=:SecuritiesNo and SmallType=:SmallType", { replacements })
        if (result0.length) {
            let [{ RemindId }] = result0
            replacements.RemindId = RemindId
            await sequelize.query(sqlstr.update("wf_securities_remind", replacements, { RemindId: null, MemberCode: null, SecuritiesNo: null, SmallType: null }) + "where RemindId=:RemindId", { replacements })
        } else {
            let [result] = await sequelize.query(sqlstr.insert("wf_securities_remind", replacements, { CreateTime: "Now()" }), { replacements })
            let [result1] = await sequelize.query("select last_insert_id() insertId")
            let [{ insertId }] = result1
            replacements.RemindId = insertId
        }
        res.send({ Status: 0, Explain: "" })
        mqChannel.sendToQueue("priceNotify", new Buffer(JSON.stringify({ cmd: "update", data: replacements })))
    });
    /**排行榜 */
    router.get('/RankList/:type', async(req, res) => {
        switch (req.params.type) {
            case "TotalAmount":
                res.send(`{ Status: 0, Explain: "", DataList: ${await redisClient.getAsync("RankList:totalAssets")} }`)
                break
            case "TodayProfit":
                res.send(`{ Status: 0, Explain: "", DataList: ${await redisClient.getAsync("RankList:todayProfit")} }`)
                break
        }
    })
    return router
}