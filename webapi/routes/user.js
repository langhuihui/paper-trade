import sqlstr from '../../common/sqlStr'
import singleton from '../../common/singleton'
import _config from '../config'
import uuid from 'node-uuid'
import gm from 'gm'
const OpenIDField = { qq: "QQOpenID", weixin: "WeixinOpenID", weibo: "WeiboOpenID", alipay: "AlipayOpenID" }
module.exports = function({ config, mainDB, realDB, ctt, express, checkEmpty, mqChannel, redisClient, rongcloud, wrap }) {
    const router = express.Router();
    async function _Login({ body, user }, res) {
        if (user) {
            if (user.Status != 1) {
                return res.send({ Status: 40007, Explain: "您的账号已被停用" })
            } else if (!user.Mobile) {
                return res.send({ Status: -2, Explain: "没有绑定手机号码", MemberCode: user.MemberCode })
            } else {
                body.MemberCode = user.MemberCode
                user.HeadImage = config.picBaseURL + (user.HeadImage ? user.HeadImage : "/UploadFile/Default/default_headerimage.png")
                user.RoomImageUrl = user.Remark1 ? (config.picBaseURL + user.Remark1) : ""
                let { code, token: RongCloudToken } = await new Promise((resolve, reject) => {
                    rongcloud.user.getToken(user.MemberCode, user.Nickname, user.HeadImage, (err, resultText) => {
                        if (err) reject(err)
                        else resolve(JSON.parse(resultText))
                    })
                });
                let [result] = await mainDB.query(`CALL PRC_WF_LOGIN(:MemberCode,:JpushRegID,:JpushIMEI,:JpushDeviceID,:JpushVersion,:JpushPlatform,:ClientVersion,@P_RESULT,@P_TOKEN)`, { replacements: { JpushIMEI: null, JpushDeviceID: null, ClientVersion: null, ...body } })
                mqChannel.sendToQueue("priceNotify", new Buffer(JSON.stringify({ cmd: "changeJpush", data: { MemberCode: user.MemberCode, JpushRegID: body.JpushRegID } })))
                res.send({ Explain: "", RongCloudToken, ...user, ...result, IsAnchor: user.Remark3 == 1, IsAuthor: user.Remark2 == 1, IsBindQQ: user.QQOpenID != null, IsBindWeixin: user.WeixinOpenID != null, IsBindWeibo: user.WeiboOpenID != null, IsBindAlipay: user.AlipayOpenID != null })
            }
        } else {
            //未创建账户
            res.send({ Status: -1, Explain: "没有账户" })
        }
    }
    async function LoginThirdParty({ body, user }, res) {
        let { LoginType, OpenID, Nickname, ImageFormat, HeadImage, JpushRegID } = body
        let field = OpenIDField[LoginType]
        if (!field) {
            return res.send({ Status: 40009, Explain: "没有该登录类型" })
        }
        if (!user) {
            ([user] = await mainDB.query(`select a.*,(SELECT b.Rank FROM wf_member_rank b where b.UpperValue>=a.RankValue LIMIT 1) as Rank from wf_member a where ${field} ='${OpenID}'`, { type: "SELECT" }))
        }
        _Login({ body, user }, res)
    }
    async function Login({ body, user }, res) {
        if (!user) {
            ([user] = await mainDB.query(`select a.*,(SELECT b.Rank FROM wf_member_rank b where b.UpperValue>=a.RankValue LIMIT 1) as Rank from wf_member a where (Mobile=:UserName or Email=:UserName or MemberCode=:UserName) and LoginPwd=:LoginPwd limit 1`, { type: "SELECT", replacements: body }));
        }
        _Login({ body, user }, res)
    }
    router.post('/Login', wrap(Login));
    /**第三方登录 */
    router.post('/LoginThirdParty', wrap(LoginThirdParty));
    /**绑定手机号码——注册账号 */
    router.post('/Register', wrap(async(req, res) => {
        let [result] = await mainDB.query("CALL PRC_WF_CREATE_MEMBER(:DataSource,:PhoneBrand,:PhoneModel,:ImageFormat,:Nickname,:CountryCode, :Mobile, :VerifyCode, :LoginPwd,@P_RESULT)", { replacements: req.body })
        let { P_RESULT, ...user } = result
        switch (P_RESULT) {
            case 0:
                req.user = user
                if (req.body.HeadImage) {
                    let buffer = new Buffer(req.body.HeadImage, "base64")
                    gm(buffer, 'head.' + req.body.ImageFormat).write(config.uploadFilePath + user.HeadImage, function(...arg) {
                        console.log(arg)
                    })
                }
                if (!req.body.LoginType) {
                    Login(req, res)
                } else {
                    let field = OpenIDField[req.body.LoginType]
                    await singleton.updateMainDB("wf_member", {
                        [field]: req.body.OpenID
                    }, null, { MemberCode: user.MemberCode })
                    LoginThirdParty(req, res)
                }
                break
            case 1:
                req.user = user
                if (!user.HeadImage) {
                    if (req.body.HeadImage) {
                        let buffer = new Buffer(req.body.HeadImage, "base64")
                        user.HeadImage = "/images/head/" + user.MemberCode + "." + req.body.ImageFormat
                        gm(buffer, 'head.' + req.body.ImageFormat).write(config.uploadFilePath + user.HeadImage, function(...arg) {
                            console.log(arg)
                        })
                    } else {
                        user.HeadImage = config.defaultHeadImage
                    }
                }
                if (!req.body.LoginType)
                    res.send({ Status: 1 })
                else {
                    let field = OpenIDField[req.body.LoginType]
                    await singleton.updateMainDB("wf_member", {
                        [field]: req.body.OpenID,
                        HeadImage: user.HeadImage
                    }, null, { MemberCode: user.MemberCode })
                    LoginThirdParty(req, res)
                }
                break;
            default:
                res.send({ Status: P_RESULT })
        }

    }));
    return router;
}