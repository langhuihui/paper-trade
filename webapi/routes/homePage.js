module.exports = function({ mainDB, ctt, express, config, wrap }) {
    const router = express.Router();
    router.get('/Banner', ctt, wrap(async(req, res) => {
        let [result] = await mainDB.query("select Title,ActionType,concat(:picBaseURL,ImageUrl) ImageUrl,(case when ActionType='url' then concat(ActionTarget,'?memberCode=',:memberCode) when ActionType='image' then concat(:adminHost,FocusmapID) when ActionType='H5' then concat(ActionTarget,'?utoken=',:token,'&t=',unix_timestamp(now())) else ActionTarget end) ActionTarget from wf_ad_focusmap where Status=0", { replacements: { picBaseURL: config.picBaseURL, memberCode: req.memberCode, adminHost: config.adminHostURL + "/bannerlink/index.php?FocusmapID=", token: req.token } })
        res.send({ Status: 0, Explain: "", DataList: result });

    }))

    router.get('/AdPush', ctt, wrap(async(req, res) => {
        let result = await mainDB.query("select Id,ActionType,ActionTarget,concat(:picBaseURL,ImageUrl) ImageUrl from wf_ad_push where Status=0", { replacements: { picBaseURL: config.picBaseURL }, type: "SELECT" })
        res.send({ Status: 0, Explain: "", Data: result[0] });
    }))
    return router
}