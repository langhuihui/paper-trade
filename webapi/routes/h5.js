import singleton from '../../common/singleton'
import Wechat from 'wechat-jssdk'
const reg_iOS = /\(i[^;]+;( U;)? CPU.+Mac OS X/
module.exports = function({ mainDB, ctt, express, config, wrap }) {
    const router = express.Router();
    const wx = new Wechat({ wechatRedirectUrl: "", wechatToken: "", appId: config.jssdk_appId, appSecret: config.jssdk_appSecret });
    router.get('/Article/:Id', async function({ params: { Id }, headers }, res) {
        Id = Number(Id)
        let article = await singleton.selectMainDB0("wf_competition_affiche", { Id })
        res.locals = {
            adminHost: config.adminHostURL,
            content: article.Content.replace(/(src=\"[^\"]+\")/g, "src=\"http://share.wolfstreet.tv/wffenxiang/img/LOGO@3x.png\" d$1")
        };
        if (reg_iOS.exec(headers['user-agent']))
            res.render('articleIOS');
        else
            res.render('articleAndroid');
    });
    router.get('/get-signature', function(req, res) {
        console.log(req)
        wx.jssdk.getSignature(req.url).then(function(signatureData) {
            res.json(signatureDate);
        });
    });
    router.get('/BattleReport/:Id', wrap(async(req, res) => {
        let { url, protocol, originalUrl, params: { Id }, headers } = req
        Id = Number(Id)
        let Data = await singleton.selectMainDB0("wf_competition_report", { Id });
        let startDate = new Date(new Date("2017-7-4 00:00:00").setDate(4 + (Data.Period - 1) * 7));
        let endDate = new Date(new Date("2017-7-4 00:00:00").setDate(4 + Data.Period * 7));
        Data.ProfitDaily = await mainDB.query("select WeekYield profit,DATE_FORMAT(EndDate,'%Y%m%d') as date from wf_drivewealth_practice_asset_v where MemberCode=:MemberCode and  EndDate between :startDate and :endDate", { replacements: { MemberCode: Data.MemberCode, startDate, endDate }, type: "SELECT" })
        if (Data.ProfitDaily[Data.ProfitDaily.length - 1].profit > Data.ProfitDaily[Data.ProfitDaily.length - 2].profit) {
            Data.ProfitTitle = "华尔街上人密集，常有散户较高低，当年小白勤练习，而今成为老司机"
        } else
            Data.ProfitTitle = "枯藤老树昏鸦，空调wifi西瓜，以为轻松会发，不料自己眼瞎"
        if (Data.TeamId) {
            Data.Member = await mainDB.query("select NickName,WeekYield,concat(:picBaseURL,case when isnull(HeadImage) or HeadImage='' then :defaultHeadImage else HeadImage end)HeadImage from wf_competition_report where TeamId=:TeamId and Period=:Period order by WeekYield desc", { type: "SELECT", replacements: { TeamId: Data.TeamId, Period: Data.Period, picBaseURL: config.picBaseURL, defaultHeadImage: config.defaultHeadImage } })
            Data.TeamProfitDaily = await mainDB.query("select AvgYield profit,DATE_FORMAT(EndDate,'%Y%m%d') as date from wf_competition_team_asset where TeamId=:TeamId ", { replacements: { TeamId: Data.TeamId }, type: "SELECT" })
        }
        if (Data.HeadImage) {
            Data.HeadImage = config.picBaseURL + Data.HeadImage
        } else {
            Data.HeadImage = config.defaultHeadImage
        }
        res.locals = Data
        var fullUrl = protocol + '://' + req.get('host') + originalUrl;
        let signatureData = await wx.jssdk.getSignature(fullUrl);
        signatureData.appId = config.jssdk_appId;
        signatureData.title = "测试标题";
        signatureData.description = "测试描述";
        signatureData.imgUrl = "https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=209550616,2032489593&fm=80&w=179&h=119&img.JPEG";
        signatureData.link = fullUrl;
        res.locals.signatureData = signatureData;
        res.render('battleReport');
    }))
    return router
}