let config = {
    test: true,
    Jpush_Appkey: "2857872dca17b28541cde5f0",
    Jpush_Secret: "3a521e1803c5ce64fb226c74",
    Rong_Appkey: "82hegw5uhhjix",
    Rong_Secret: "zpKgSmbS28gUh",
    sina_realjs: "http://hq.sinajs.cn/list=",
    netease_realjs: "http://api.money.126.net/data/feed/",
    jssdk_appId: "wxa2598b6baa4cc41e",
    jssdk_appSecret: "e89d6dc75c6a7ea85e39c835da86af14",
    mysqlconn: "mysql://wftest:WfTestonlytest_20170222@rm-bp157512ad9bic209o.mysql.rds.aliyuncs.com:3306/wolfstreet_test",
    mysqlConfig: {
        host: "rm-bp157512ad9bic209o.mysql.rds.aliyuncs.com",
        port: "3306",
        user: "wftest",
        password: "WfTestonlytest_20170222",
        database: "wolfstreet_test",
        typeCast(field, next) {
            if (field.type === "BIT" && field.length === 1) {
                var bit = field.string();
                return (bit === null) ? null : (bit.charCodeAt(0) === 1);
            }
            return next();
        }
    },
    // mysqlconn: "mysql://program_admin:!P%402%23dh%254%5e5Y%26g*4@rm-bp157512ad9bic209o.mysql.rds.aliyuncs.com:3306/wolfstreet",
    // mysqlConfig: {
    //     host: "rm-bp157512ad9bic209o.mysql.rds.aliyuncs.com",
    //     port: "3306",
    //     user: "program_admin",
    //     password: "!P@2#dh%4^5Y&g*4",
    //     database: "wolfstreet",
    //     typeCast(field, next) {
    //         if (field.type === "BIT" && field.length === 1) {
    //             var bit = field.string();
    //             return (bit === null) ? null : (bit.charCodeAt(0) === 1);
    //         }
    //         return next();
    //     }
    // },
    amqpConn: "amqp://dexter:Wolfstreet%2A%2306%23@testmq.wolfstreet.tv:10001/test",
    redisConfig: { host: "testapi.wolfstreet.tv", port: 7788, password: "`1qaz2wsx3EDC", db: 1 },
    mongodbconn: "mongodb://wftest:%23W%40f!1189747acd@106.14.155.223:22222/wolfstreet_test",
    //mongodbconn: "mongodb://wftest:%23W%40f!1189747acd@118.178.88.67:22222/wolfstreet_test",
    // redisConfig: { host: "api.wolfstreet.tv", port: 7788, password: "`1qaz2wsx3EDC" },
    // amqpConn: "amqp://dexter:Wolfstreet%2A%2306%23@mq.wolfstreet.tv:10001",
    // mysqlconn: "mysql://program_admin:!P%402%23dh%254%5e5Y%26g*4@rm-bp157512ad9bic209o.mysql.rds.aliyuncs.com:3306/wolfstreet",
    lastPriceIndexMap: { hk: 6, sz: 3, sh: 3, gb_: 1 },
    pricesIndexMap: { hk: [2, 4, 5, 6, 3], sz: [1, 4, 5, 3, 2], sh: [1, 4, 5, 3, 2], gb_: [5, 6, 7, 1, 26] }, //开，高，低，新,昨收
    //chgFunc: { gb_: x => x[2], hk: x => x[8], sh: x => (x[3] - x[2]) / x[2], sz: x => (x[3] - x[2]) / x[2] },
    sina_qmap: { us: "gb_", hk: "hk", sh: "sh", sz: "sz" },
    getQueryName({ SecuritiesType, SmallType, SecuritiesNo }) {
        return this.sina_qmap[SmallType || SecuritiesType] + SecuritiesNo.toLowerCase().replace(".", "$")
    },
    stockPatten: /(gb_|hk|sh|sz).+/,
    jpushType: "jpush108",
    jpushType_paperTrade: "jpush110",
    jpushType_competition: "jpush112",
    jpushType_sendLetter: "jpush113",
    ajaxOrigin: "*", //跨域访问
    apns_production: false, //ios JPUSH配置
    picBaseURL: "http://apitest.wolfstreet.tv",
    adminHostURL: "http://admin.wolfstreet.tv",
    shareHostURL: "http://sharetest.wolfstreet.tv",
    defaultHeadImage: "/UploadFile/Default/default_headerimage.png",
    driveWealthHost: {
        apiHost: "https://api.drivewealth.net",
        appsHost: "https://apps.drivewealth.com",
        reportsHost: "https://reports.drivewealth.net"
    },
    uploadFilePath: "/",
    practiceInitFun: 10000, //模拟交易起始资金
    randmax: 1, //每日增长系数
    getDWData: true, //是否获取嘉维数据
    calDWData: true, //是否监听嘉维数据获取情况，并计算排名
    ptTest: true //模拟交易测试，忽略是否开盘状态
        //  mysqlconn: "mysql://wfadmin:123456@192.168.2.205:3306/wolfstreet_test",
}
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "production") {
    Object.assign(config, require('./pconfig.js'))
}
export default config;
/**过滤属性（只保留某些属性) */
Object.filterProperties = function(obj, ...args) {
    for (let n of Object.keys(obj)) {
        if (args.indexOf(n) == -1) delete obj[n]
    }
    return obj
};
/**批量删除对象属性 */
Object.deleteProperties = function(obj, ...args) {
    for (let n of args) {
        if (obj.hasOwnProperty(n)) {
            delete obj[n]
        }
    }
    return obj
};
Array.prototype.remove = function(...item) {
    let _this = this;
    item.forEach(i => {
        let index = _this.indexOf(i)
        if (index != -1)
            _this.splice(index, 1)
    })
}
Array.prototype.contain = function(item) {
    return this.indexOf(item) != -1
}
Array.prototype.clear = function() {
    this.splice(0, this.length)
}
Array.prototype.__defineGetter__('last', function() {
    return this.length ? this[this.length - 1] : null
})
Array.prototype.__defineSetter__('last', function(value) {
    if (this.length) this[this.length - 1] = value
})
Date.prototype.format = function(fmt = "yyyy-MM-dd hh:mm:ss") { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
/*
沪深股示例：
浦发银行（名称）,16.520(今开),16.480（昨收）,16.510（最新）,16.550（最高）,16.500（最低）,16.510（买入）,16.520（卖出）,1072269（成交量）,17717924.000（成交额）,78694（买一手数）,16.510（买一价）,129637（买二手数）,16.500（买二价）,419400（买三手数）,16.490（买三价）,326300（买四手数）,16.480（买四价）,188800（买五手数）,16.470（买五价）,151545（卖一手数）,16.520（卖一价）,69357（卖二手数）,16.530（卖二价）,193950（卖三手数）,16.540（卖三价）,242522（卖四手数）,16.550（卖四价）,113570（卖五手数）,16.560（卖五价）,2016-09-29（日期）,10:03:33,00(时间)

港股示例：
CHEUNG KONG,长和（名称）,98.000（今开）,98.000（昨收）,98.400（最高价）,95.050(最低价),95.200（最新价）,-2.800（涨跌额）,-2.857（涨跌幅）,95.200（买入）,95.250（卖出）,1015890698（成交额）,10537356（成交量）,11.615（市盈率）,2.679,109.500（52周最高）,80.600（52周最低）,2016/10/11（日期）,14:15（时间）

美股示例：
苹果（名称）,116.05（最新价）,1.74（涨跌幅）,2016-10-11 08:19:28（时间）,1.99（涨跌额）,115.02（今开）,116.75（最高价）,114.72（最低价）,123.82（52周最高）,89.47（52周最低）,36235956（成交量）,28211541（成交额）,625509500000（市值）,8.58（每股收益）,13.53（市盈率）,0.00,1.55（贝塔系数）,2.18（股息）,1.90（收益率）,5390000000（股本）,58.00,116.36（"盘后"）,0.27（"盘后涨跌幅"）,0.31（"盘后涨跌额"）,Oct 10 08:00PM EDT（"盘后日期"）,Oct 10 04:00PM EDT（"日期"）,114.06（昨收）,642204.00（"盘后成交量"）
*/
// var Notify = sequelize.define('wf_securities_remind', {
//     RemindId: Sequelize.BIGINT,
//     MemberCode: Sequelize.STRING,
//     SmallType: Sequelize.STRING,
//     SecuritiesNo: Sequelize.STRING,
//     LowerLimit: Sequelize.DECIMAL,
//     IsOpenLower: Sequelize.BOOLEAN,
//     UpperLimit: Sequelize.DECIMAL,
//     IsOpenUpper: Sequelize.BOOLEAN,
//     RiseFall: Sequelize.DECIMAL,
//     IsOpenRiseFall: Sequelize.BOOLEAN,
//     CreateTime: Sequelize.DATE
// })
// var WfJPush = sequelize.define('wf_im_jpush', {
//     JpushID: Sequelize.BIGINT,
//     MemberCode: Sequelize.STRING,
//     JpushRegID: Sequelize.STRING,
//     JpushIMEI: Sequelize.STRING,
//     JpushDeviceID: Sequelize.STRING,
//     JpushVersion: Sequelize.STRING,
//     JpushPlatform: Sequelize.STRING,
//     JpushLastLoginTime: Sequelize.DATE,
//     CreateTime: Sequelize.DATE
// })