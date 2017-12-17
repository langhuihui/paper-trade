require('babel-register')(require('./babelconfig'));
const singleton = require('./common/singleton').default
const JPush = require('jpush-sdk');
const repl = require('repl');
const dwUrls = require('./common/driveWealth').default
var replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('resetDw', {
    help: '重置嘉维模拟账号',
    async action(code) {
        if (code != "all") {
            code.split(",").forEach(memberCode => singleton.CreateParactice(memberCode, ""))
        } else {
            let users = await singleton.selectMainDB("wf_stockcompetitionmember", { CompetitionId: 1 })
            users.forEach(user => singleton.CreateParactice(user.MemberCode, ""))
        }
    }
});
replServer.defineCommand('jpushMessage', {
    help: '发送jpushMessage',
    async action(arg) {
        let { MemberCode, apns_production = false, args } = JSON.parse(arg)
        let [result] = await singleton.knex("wf_im_jpush").select("JpushRegID").where({ MemberCode }).orderBy("JpushLastLoginTime", "desc").limit(1)
        if (result) {
            let { JpushRegID } = result
            singleton.jpushClient.push().setPlatform(JPush.ALL).setAudience(JPush.registration_id(JpushRegID))
                .setOptions(null, null, null, Config.apns_production)
                .setMessage(...args)
                .send(async(err, res) => {
                    if (err) {
                        if (err instanceof JPush.APIConnectionError) {
                            console.log(err.message)
                        } else if (err instanceof JPush.APIRequestError) {
                            console.log(err.message)
                        }
                    } else {
                        console.log(res)
                    }
                })
        }
    }
});
replServer.defineCommand('showdw', {
    help: "嘉维模拟账号",
    async action(arg) {
        let oldcode = arg.substr(0, 8)
        let { sessionKey, accounts } = await request({
            uri: dwUrls.createSession,
            method: "POST",
            body: {
                "appTypeID": "2000",
                "appVersion": "0.1",
                username: arg,
                "emailAddress": oldcode + "@wolfstreet.tv",
                "ipAddress": "1.1.1.1",
                "languageID": "zh_CN",
                "osVersion": "iOS 9.1",
                "osType": "iOS",
                "scrRes": "1920x1080",
                password: "p" + oldcode
            },
            timeout: 10000,
            json: true
        })
        console.log(accounts)
        let [{ userID, cash, accountNo, accountID }] = accounts
    }
})