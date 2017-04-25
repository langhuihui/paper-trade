import request from 'request-promise'
import Config from '../config'
import Iconv from 'iconv-lite'

export default async function(...stocks) {
    function getStockPrice(stockName, x) {
        let q = Config.stockPatten.exec(stockName)[1];
        let price = Config.pricesIndexMap[q].map(y => Number(x[y]));
        if (Number.isNaN(price[4])) price[4] = 0;
        price[5] = price[4] ? (price[3] - price[4]) * 100 / price[4] : 0;
        return price;
    }
    let stocks_name = stocks.join(",")
    let result = await request({ encoding: null, uri: Config.sina_realjs + stocks_name.toLowerCase() })
    let rawData = Iconv.decode(result, 'gb2312')
    result = {}
    eval(rawData + 'stocks.forEach(stockName=>result[stockName]=getStockPrice(stockName,eval("hq_str_" + stockName).split(",")))')
    return result
}