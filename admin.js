require('babel-register')(require('./babelconfig'));
const singleton = require('./common/singleton').default
const repl = require('repl');
var replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('resetAllAccount', {
    help: '重置嘉维模拟账号',
    async action(...codes) {
        if (codes.length) {
            codes.forEach(code => singleton.CreateParactice(code, ""))
        } else {
            let users = await singleton.selectMainDB("wf_stockcompetitionmember", { CompetitionId: 1 })
            users.forEach(user => singleton.CreateParactice(user.MemberCode, ""))
        }
    }
});