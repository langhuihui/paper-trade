module.exports = function({ mainDB, mqChannel, ctt, express, config, wrap }) {
    mqChannel.assertQueue('paperTrade');
    const router = express.Router();
    /**创建订单 */
    router.post('/Orders', ctt, wrap(async({ memberCode, body: { ordType, side, orderQty, price, SmallType, SecuritiesNo } }, res) => {
        switch (ordType) {
            case 1: //市价单
                break;
            case 2: //限价单
                break;
            case 3: //止损单
                break;
        }
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