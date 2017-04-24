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
    /**持仓和未完成的订单 */
    router.get('/Report', ctt, wrap(async(req, res) => {

    }));
    return router
}