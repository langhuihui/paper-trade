module.exports = function({ sequelize, ctt, express, checkEmpty }) {
    const router = express.Router();
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
    })
    return router
}