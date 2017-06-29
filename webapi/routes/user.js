import sqlstr from '../../common/sqlStr'
import singleton from '../../common/singleton'
import _config from '../config'
const OpenIDField = { qq: "QQOpenID", weixin: "WeixinOpenID", weibo: "WeiboOpenID", alipay: "AlipayOpenID" }
module.exports = function({ config, mainDB, realDB, ctt, express, checkEmpty, mqChannel, redisClient, rongcloud, wrap }) {
    const router = express.Router();
    router.post('/LoginThirdParty', ctt, wrap(async({ body: { LoginType, OpenID, Nickname, ImageFormat, HeadImage, ClientVersion, JpushRegID }, memberCode }, res) => {
        let field = OpenIDField[LoginType]
        if (!field) {
            return res.send({ Status: 40009, Explain: "没有该登录类型" })
        }
        let [user] = await mainDB.query(`select *,(SELECT b.Rank FROM wf_member_rank b where b.UpperValue>=a.RankValue LIMIT 1) as Rank from wf_member a where ${field} ='${OpenID}'`, { type: "SELECT" })
        if (user) {
            if (user.Status != 1) {
                return res.send({ Status: 40007, Explain: "您的账号已被停用" })
            }
        } else {
            await singleton.knex("wf_token").where({ MemberCode: memberCode })
        }
    }));
    return router;
}