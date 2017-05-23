import sqlstr from '../../common/sqlStr'
import singleton from '../../common/singleton'
import _config from '../config'

module.exports = function({ mainDB, statistic, ctt, express, config, wrap }) {
    const router = express.Router();
    /**页面停留时间埋点 */
    router.post('/PageStatistics/:TypeId/:PageId', ctt, wrap(async({ memberCode, body, params: { TypeId, PageId } }, res) => {
        body.TypeId = TypeId
        body.PageId = PageId
        body.LoginId = memberCode
        body.IsLogin = 1
        statistic.pageStay(body)
        res.send({ Status: 0, Explain: "" })
    }));
    /**股票详情页面埋点 */
    router.post('/StockStatistics/:StockType/:StockNo', ctt, wrap(async({ params: { StockType, StockNo }, body, memberCode }, res) => {
        body.StockType = StockType
        body.StockNo = StockNo
        body.LoginId = memberCode
        body.IsLogin = 1
        statistic.stockPageStay(body)
        res.send({ Status: 0, Explain: "" })
    }));
    return router
}