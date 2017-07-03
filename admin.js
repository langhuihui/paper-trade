require('babel-register')(require('./babelconfig'));
const singleton = require('./common/singleton').default
const repl = require('repl');
var replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('resetDw', {
    help: '重置嘉维模拟账号',
    async action(code) {
        if (code != "all") {
            singleton.CreateParactice(code, "")
        } else {
            let users = await singleton.selectMainDB("wf_stockcompetitionmember", { CompetitionId: 1 })
            users.forEach(user => singleton.CreateParactice(user.MemberCode, ""))
        }
    }
});