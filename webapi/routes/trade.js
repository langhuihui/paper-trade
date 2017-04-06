module.exports = function({ sequelize, ctt, express, checkEmpty }) {
    const router = express.Router();
    router.get('/:type/IsOpen', async(req, res) => {

    })
    router.get('/MyAssetsDaily', checkEmpty("memberCode", "startDate"), async(req, res) => {
        let { memberCode, startDate } = req.query
        startDate = new Date(startDate)
        let [result] = await sequelize.query("select TotalAmount totalAsset,DATE_FORMAT(EndDate,'%Y-%m-%d') as date from wf_drivewealth_practice_asset where MemberCode=:memberCode and EndDate>:startDate", { replacements: { memberCode, startDate } })
        res.send({ Status: 0, Explain: "", DataList: result })
    })
    return router
}