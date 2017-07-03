import sqlstr from '../../common/sqlStr'
import singleton from '../../common/singleton'
import _config from '../config'
import uuid from 'node-uuid'
const OpenIDField = { qq: "QQOpenID", weixin: "WeixinOpenID", weibo: "WeiboOpenID", alipay: "AlipayOpenID" }
module.exports = function({ config, mainDB, realDB, ctt, express, checkEmpty, mqChannel, redisClient, rongcloud, wrap }) {
    const router = express.Router();

    function CreateNewUser() {

    }
    /**第三方登录 */
    router.post('/LoginThirdParty', wrap(async({ body }, res) => {
        let { LoginType, OpenID, Nickname, ImageFormat, HeadImage, JpushRegID } = body
        let field = OpenIDField[LoginType]
        if (!field) {
            return res.send({ Status: 40009, Explain: "没有该登录类型" })
        }
        let [user] = await mainDB.query(`select *,(SELECT b.Rank FROM wf_member_rank b where b.UpperValue>=a.RankValue LIMIT 1) as Rank from wf_member a where ${field} ='${OpenID}'`, { type: "SELECT" })
        if (user) {
            if (user.Status != 1) {
                return res.send({ Status: 40007, Explain: "您的账号已被停用" })
            }
            body.MemberCode = user.MemberCode
            user.HeadImage = config.picBaseURL + (user.HeadImage ? user.HeadImage : "/UploadFile/Default/default_headerimage.png")
            user.RoomImageUrl = user.Remark1 ? (config.picBaseURL + user.Remark1) : ""
            let { code, token: RongCloudToken } = await new Promise((resolve, reject) => {
                rongcloud.user.getToken(user.MemberCode, user.Nickname, user.HeadImage, (err, resultText) => {
                    if (err) reject(err)
                    else resolve(JSON.parse(resultText))
                })
            });
            let [result] = await mainDB.query(`CALL PRC_WF_LOGINTHIRDPARTY(:MemberCode,:JpushRegID,:JpushIMEI,:JpushDeviceID,:JpushVersion,:JpushPlatform,:DataSource,:PhoneBrand,:PhoneModel,:ClientVersion,@P_RESULT,@P_TOKEN)`, { replacements: body })
            mqChannel.sendToQueue("priceNotify", new Buffer(JSON.stringify({ cmd: "changeJpush", data: { MemberCode: user.MemberCode, JpushRegID } })))
            res.send({ Explain: "", RongCloudToken, ...user, ...result, IsAnchor: user.Remark3 == 1, IsAuthor: user.Remark2 == 1, IsBindQQ: user.QQOpenID != null, IsBindWeixin: user.WeixinOpenID != null, IsBindWeibo: user.WeiboOpenID != null, IsBindAlipay: user.AlipayOpenID != null })
        } else {
            //未创建账户
            return res.send({ Status: -1, Explain: "没有账户" })
        }
    }));
    /**绑定手机号码 */
    router.post('/BindMobile', wrap(async({ body }, res) => {
        let { CountryCode, Mobile, VerifyCode, LoginPwd } = body

    }));
    return router;
}