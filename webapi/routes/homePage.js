module.exports = function({ sequelize, ctt, express, config }) {
    const router = express.Router();
    router.get('/Banner', ctt, async(req, res) => {
        let [result] = await sequelize.query("select Title,ActionType,concat(:picBaseURL,ImageUrl) ImageUrl,(case when ActionType='url' then concat(ActionTarget,'?memberCode=',:memberCode) when ActionType='image' then concat(:adminHost,FocusmapID) else ActionTarget end) ActionTarget from wf_ad_focusmap where Status=0", { replacements: { picBaseURL: config.picBaseURL, memberCode: req.memberCode, adminHost: config.adminHostURL + "/bannerlink/index.php?FocusmapID=" } })
        res.send({ Status: 0, Explain: "", DataList: result });

    })
    return router
}