require('babel-register')(require('./babelconfig'));
const singleton = require('./common/singleton').default
const JPush = require('jpush-sdk');
const repl = require('repl');
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