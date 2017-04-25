module.exports = function({ mainDB, ctt, express, config, wrap }) {
    const router = express.Router();
    router.get('/Banner', ctt, wrap(async(req, res) => {
        let [result] = await mainDB.query("select Title,ActionType,concat(:picBaseURL,ImageUrl) ImageUrl,(case when ActionType='url' then concat(ActionTarget,'?memberCode=',:memberCode) when ActionType='image' then concat(:adminHost,FocusmapID) when ActionType='H5' then concat(ActionTarget,'?utoken=',:token) else ActionTarget end) ActionTarget from wf_ad_focusmap where Status=0", { replacements: { picBaseURL: config.picBaseURL, memberCode: req.memberCode, adminHost: config.adminHostURL + "/bannerlink/index.php?FocusmapID=", token: req.token } })
        res.send({ Status: 0, Explain: "", DataList: result });

    }))
    return router
}