import singleton from '../common/singleton'
const { mainDB, redisClient } = singleton
var stockInfo = new Map()
    /**获取查询股票的代码sina */
function getQueryName({ QueryUrlCode, SecuritiesNo }) {
    return QueryUrlCode + SecuritiesNo.toLowerCase().replace(".", "$")
}

export default {
    async init(stockRef) {
        function addRankStock(ccss) {
            stockRef.addSymbols(ccss.map(ccs => getQueryName(ccs)))
            for (let ccs of ccss) {
                //css.SecuritiesName = css.SecuritiesName.replace(/'/g, "’");
                stockInfo.set(getQueryName(ccs), ccs)
            }
        }
        //获取中概股
        let [ccss] = await mainDB.query("select * from wf_securities_trade where ShowType='CCS' and Remark='DW'")
        addRankStock(ccss)
            //获取明星股
        let [gss] = await mainDB.query("select * from wf_securities_trade where ShowType='GS' and Remark='DW'")
        addRankStock(gss)
            /**获取ETF */
    },
    updatePrice(stockName, Open, High, Low, LastPrice, Pre, RiseFallRange) {
        if (stockInfo.has(stockName)) {
            let info = stockInfo.get(stockName);
            info.RiseFallRange = RiseFallRange;
            info.LastPrice = LastPrice;
        }
    },
    async insertRank() {
        //获取和设置当前使用的表
        let currentRankTable = await redisClient.getAsync("currentSRT")
        if (!currentRankTable) {
            currentRankTable = "wf_securities_rank_a"
            redisClient.set("currentSRT", "wf_securities_rank_b")
        } else {
            await redisClient.setAsync("currentSRT", currentRankTable == "wf_securities_rank_a" ? "wf_securities_rank_b" : "wf_securities_rank_a")
                //mainDB.query("truncate table " + currentRankTable);
        }
        let collection = (await singleton.getRealDB()).collection(currentRankTable);
        collection.drop((err, reply) => {})
        collection.ensureIndex({ RiseFallRange: 1 })
            //currentRankTable = currentRankTable == "wf_securities_rank_a" ? SecuritiesRankA : SecuritiesRankB
            //currentRankTable.truncate()
        collection.insertMany(stockInfo.values())
    }
}