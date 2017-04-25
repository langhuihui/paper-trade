import sqlstr from '../../common/sqlStr'
module.exports = function({ mainDB, mqChannel, ctt, express, config, wrap, redisClient }) {
    function createAccount(data) {
        return mainDB.query(...sqlstr.insert2("wf_street_practice_account", data, { CreateTime: "now()" }))
    }

    function getAccount(memberCode) {
        return mainDB.query("select * from wf_street_practice_account where MemberCode=:memberCode", { replacements: { memberCode } })
    }
    mqChannel.assertQueue('paperTrade');
    const router = express.Router();
    /**创建订单 */
    //body: { ordType, side, orderQty, price, SecuritiesType, SecuritiesNo } 
    router.post('/Orders', ctt, wrap(async({ memberCode, body }, res) => {
        let { ordType, side, orderQty, price, SecuritiesType, SecuritiesNo } = body
        let account = await getAccount(memberCode)
        let lastPrice = await redisClient.getAsync("lastPrice:" + config.getQueryName(body))
        if (!lastPrice) {

        }
        let commission = account.Commission * lastPrice * orderQty
        if (account.Status) {

        }
        switch (ordType) {
            case 1: //市价单
                if (account.TranAmount - commission - lastPrice * orderQty < 0) {

                }
                break;
            case 2: //限价单
                break;
            case 3: //止损单
                break;
        }

        body.memberCode = memberCode;
        body.execType = 0;

        let [result] = await mainDB.query(...sqlstr.insert2("wf_street_practice_order", body, { CreateTime: "now()" }))
        body.Id = result.insertId;

    }));
    /**订单状态 */
    router.get('/Orders/:orderID', ctt, wrap(async(req, res) => {

    }));
    /**取消订单 */
    router.delete('/Orders/:orderID', ctt, wrap(async(req, res) => {

    }));
    /**持仓 */
    router.get('/Position', ctt, wrap(async(req, res) => {

    }));
    /**今日委托 */
    router.get('/TodayOrders', ctt, wrap(async(req, res) => {

    }));
    /**今日成交 */
    router.get('/TodayDeals', ctt, wrap(async(req, res) => {

    }));
    /**历史委托 */
    router.get('/Orders/:startDate/:endDate', ctt, wrap(async(req, res) => {

    }));
    /**历史成交 */
    router.get('/Deals/:startDate/:endDate', ctt, wrap(async(req, res) => {

    }));
    /**我的账户详情 */
    router.get('/Account', ctt, wrap(async(req, res) => {

    }));
    return router
}