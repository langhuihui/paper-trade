import singleton from '../../common/singleton'
const reg_iOS = /\(i[^;]+;( U;)? CPU.+Mac OS X/
module.exports = function({ mainDB, ctt, express, config, wrap }) {
    const router = express.Router();
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
    return router
}