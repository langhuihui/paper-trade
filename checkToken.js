import Sequelize from 'sequelize'
import Config from './config'
var sequelize = new Sequelize(Config.mysqlconn)

function updateToken(tokenId) {
    sequelize.query({ query: Config.updateTokenSql, values: [new Date(), tokenId] })
}
async function checkToken(token, isLogin) {
    let result = 0
    let memberCode = ""
    let tokenModel = (await sequelize.query({ query: Config.tokenSql, values: [token] }))[0][0]
    if (isLogin) {
        if (tokenModel) {
            memberCode = tokenModel.memberCode
            if (tokenModel.ValidityTime.getTime() + Config.tokenTime * 60 < new Date().getTime()) {
                result = { Status: "40012", Explain: "您还没有登录，请登录后操作" }
            } else if (tokenModel.Status != 1) {
                result = { Status: "40012", Explain: "您的账号已经停用,如有疑问请联系客服!" }
            } else {
                updateToken(tokenModel.TokenID)
            }
        } else {
            result = { Status: "40012", Explain: "您的登录已丢失,请重新登录" }
        }
    } else {
        memberCode = tokenMode.MemberCode
        updateToken(tokenModel.TokenID)
    }
    return { result, memberCode }
}
//token验证中间件

function checkLogin(isLogin) {
    return async function(req, res, next) {
        let result = await checkToken(req.header('Token'), isLogin)
        req.memberCode = result.memberCode
        if (result === 0) next()
        else res.json(result)
    }
}
export default checkLogin