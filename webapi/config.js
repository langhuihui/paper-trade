let config = {
    port: 10002,
    tokenTime: 14400000,
    clientInitAll: { forceUpdate: 2.4, quotation: { source: "sina" }, dbVersion: 1 }, //所有客户端配置
    clientInitDefault: {

    }, //默认配置
    clientInit: { //特定版本客户端配置
        "2.5": { showTrade: false }
    },
    FinancialIndexBaseURL: "",
    FinancialIndex: {
        hs: [{ Title: "上证指数", URL: "" }, { Title: "深证指数", URL: "" }, { Title: "创业指数", URL: "" }],
        hk: [{ Title: "恒生指数", URL: "" }, { Title: "国企指数", URL: "" }, { Title: "红筹指数", URL: "" }],
        us: [{ Title: "道琼斯", URL: "" }, { Title: "纳斯达克", URL: "" }, { Title: "标普500", URL: "" }],
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
//config.FinancialIndex
export default config