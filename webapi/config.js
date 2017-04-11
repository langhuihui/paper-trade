let config = {
    port: 10002,
    tokenTime: 14400000,
    clientInitAll: { forceUpdate: 2.4, quotation: { source: "sina" }, dbVersion: 1 }, //所有客户端配置
    clientInitDefault: {

    }, //默认配置
    clientInit: { //特定版本客户端配置
        "2.5": { showTrade: false }
    },
    FinancialIndexBaseURL: "http://test.wolfstreet.tv/kmap/mark.html",
    FinancialIndex: {
        hs: [{ Title: "上证指数", URL: "?code=0000001&type=hs" }, { Title: "深证指数", URL: "?code=1399001&type=hs" }, { Title: "创业指数", URL: "?code=1399006&type=hs" }],
        hk: [{ Title: "恒生指数", URL: "?code=HSI&type=hk" }, { Title: "国企指数", URL: "?code=HSCEI&type=hk" }, { Title: "红筹指数", URL: "?code=HSCCI&type=hk" }],
        us: [{ Title: "道琼斯", URL: "?code=DOWJONES&type=us" }, { Title: "纳斯达克", URL: "?code=NASDAQ&type=us" }, { Title: "标普500", URL: "?code=SP500&type=us" }],
        get sz() {
            return this.hs
        },
        get sh() {
            return this.hs
        }
    },
    EveryDayURL: "http://sharetest.wolfstreet.tv/kmap/profit.html?memberCode="
}

if (process.env.NODE_ENV === "production") {
    Object.assign(config, require('./pconfig.js'))
}
for (let k in config.clientInit) {
    config.clientInit[k] = Object.assign(Object.assign(Object.assign({}, config.clientInitDefault), config.clientInit[k]), config.clientInitAll)
}
(() => {
    let { hs, hk, us } = config.FinancialIndex;
    [].concat(hs, hk, us).forEach(x => x.URL = config.FinancialIndexBaseURL + x.URL)
})()
export default config