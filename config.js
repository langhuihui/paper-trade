export default {
    Jpush_Appkey: "2857872dca17b28541cde5f0",
    Jpush_Secret: "3a521e1803c5ce64fb226c74",
    sina_realjs: "http://hq.sinajs.cn/list=",
    mysqlconn: "mysql://wftest:WfTestonlytest_20170222@rm-bp157512ad9bic209o.mysql.rds.aliyuncs.com:3306/wolfstreet_test",
    lastPriceIndexMap: { hk: 6, sz: 3, sh: 3, gb_: 1 },
    chgFunc: { gb_: x => x[2], hk: x => x[8], sh: x => (x[3] - x[2]) / x[2], sz: x => (x[3] - x[2]) / x[2] },
    sina_qmap: { us: "gb_", hk: "hk", sh: "sh", sz: "sz" },
    stockPatten: /(gb_|hk|sh|sz).+/,
    jpushType: "jpush108"
}
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