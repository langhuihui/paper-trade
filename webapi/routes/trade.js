import sqlstr from '../../common/sqlStr'
import singleton from '../../common/singleton'
import _config from '../config'
import allowAccess from '../middles/allowAccess'
module.exports = function({ config, mainDB, realDB, ctt, express, checkEmpty, mqChannel, redisClient, rongcloud, wrap }) {
    const router = express.Router();
    /**是否开市*/
    router.get('/:type/IsOpen', wrap(async({ params: { type } }, res) => {
        res.send({ Status: 0, Explain: "", IsOpen: await singleton.marketIsOpen(type) })
    }));
    // /**是否已经绑定（创建）嘉维账户 */
    // router.get('/IsDwAccCreated', ctt, async(req, res) => {
    //     let memberCode = req.memberCode
    //     let [result] = await mainDB.query("select userID,username,emailAddress1 from wf_drivewealth_user where MemberCode=:memberCode", { replacements: { memberCode } })

    //     res.send({ Status: 0, Explain: "", IsDwAccCreated: result.length })
    // });
    /**获取股价提醒 */
    router.get('/GetPriceNotify/:SmallType/:SecuritiesNo', ctt, async(req, res) => {
        let replacements = req.params
        replacements.MemberCode = req.memberCode
        let [result] = await mainDB.query("select * from wf_securities_remind where MemberCode=:MemberCode and SecuritiesNo=:SecuritiesNo and SmallType=:SmallType limit 1", { replacements })
        if (result.length)
            res.send({ Status: 0, Explain: "", Data: Object.convertBuffer2Bool(result[0], "IsOpenLower", "IsOpenUpper", "IsOpenRise", "IsOpenFall") })
        else res.send({ Status: 0, Explain: "", Data: { IsOpenLower: false, IsOpenUpper: false, IsOpenRise: false, IsOpenFall: false, LowerLimit: 0, UpperLimit: 0, FallLimit: 0, RiseLimit: 0 } })
    });
    /**修改股价提醒 */
    router.put('/SetPriceNotify', ctt, async(req, res) => {
        let replacements = req.body
        replacements.MemberCode = req.memberCode
        let [result] = await mainDB.query("select * from wf_securities_remind where MemberCode=:MemberCode and SecuritiesNo=:SecuritiesNo and SmallType=:SmallType limit 1", { replacements })
        if (result.length) {
            ([{ RemindId: replacements.RemindId }] = result);
            result = await mainDB.query(sqlstr.update("wf_securities_remind", replacements, { RemindId: null, MemberCode: null, SecuritiesNo: null, SmallType: null }) + "where RemindId=:RemindId", { replacements })
        } else {
            result = await mainDB.query(...sqlstr.insert2("wf_securities_remind", replacements, { RemindId: null, CreateTime: "Now()" }));
            replacements.RemindId = result[0].insertId
        }
        res.send({ Status: 0, Explain: "", Result: result })
        mqChannel.sendToQueue("priceNotify", new Buffer(JSON.stringify({ cmd: "update", data: replacements })))
    });
    /**排行榜 */
    router.get('/RankList/:type', allowAccess(), async(req, res) => {
        switch (req.params.type) {
            case "TotalAmount":
                res.set('Content-Type', 'application/json').send(`{ "Status": 0, "Explain": "", "DataList": ${await redisClient.getAsync("RankList:totalAssets")} }`)
                break
            case "TodayProfit":
                res.set('Content-Type', 'application/json').send(`{ "Status": 0, "Explain": "", "DataList": ${await redisClient.getAsync("RankList:todayProfit")} }`)
                break
            case "TotalPrifitV": //炒股大赛总排行
                res.set('Content-Type', 'application/json').send(`{ "Status": 0, "Explain": "", "DataList": ${await redisClient.getAsync("RankList:matchTotalProfit")} }`)
                break
            case "WeekProfitV": //炒股大赛周排行
                res.set('Content-Type', 'application/json').send(`{ "Status": 0, "Explain": "", "DataList": ${await redisClient.getAsync("RankList:matchWeekProfit")} }`)
                break
            default:
                res.send({ Status: 40003, Explain: "未知类型" })
        }
    });
    /**是否可以交易，是否属于嘉维*/
    router.get('/StockCanTrade/:stockcode', async(req, res) => {
        let { stockcode } = req.params
        let [result] = await mainDB.query("select * from wf_securities_trade where remark='DW' and SecuritiesNo=:stockcode", { replacements: { stockcode } })
        res.send({ Status: 0, Explain: "", Result: result.length > 0 })

    });
    /**获取金融指数的名称和h5链接地址 */
    router.get('/FinancialIndex/:type', async(req, res) => {
        let data = _config.FinancialIndex[req.params.type]
        if (data) res.send({ Status: 0, Explain: "", DataList: data })
        else res.send({ Status: 40003, Explain: "未知类型", })
    });
    /**新增股票详情评论 */
    router.post('/AddQuotationComment', ctt, async(req, res) => {
        let replacements = Object.filterProperties(req.body, "StockCode", "StockType", "ParentID", "Content", "IsDelete")
        rongcloud.message.chatroom.publish("999999999", replacements.StockType + replacements.StockCode, "RC:TxtMsg", JSON.stringify({ content: "comment", extra: replacements.Content }), (err, result) => {
            if (err) console.error(err)
            else console.log(result)
        })
        replacements.CreateUser = req.memberCode
        let result = await mainDB.query(sqlstr.insert("wf_quotation_comment", replacements, { Id: null, CreateTime: "Now()", IsDelelte: 0 }), { replacements })
        res.send({ Status: 0, Explain: "", Result: result })
    });
    /**删除评论股票详情评论 */
    router.delete('/DelQuotationComment/:id', ctt, async(req, res) => {
        let [result] = await mainDB.query("update wf_quotation_comment set isdelete=1 where id=:id", { replacements: req.params });
        res.send({ Status: 0, Explain: "", Result: result.length > 0 })
    });
    //获取此股票的所有评论
    router.get('/GetQuotationCommentList/:StockType/:StockCode', async(req, res) => {
        let replacements = req.params
        replacements.picBaseURL = config.picBaseURL
        let [result] = await mainDB.query("select wf_quotation_comment.*,DATE_FORMAT(wf_quotation_comment.CreateTime,'%Y-%m-%d %H:%i:%s') CreateTime,wf_member.NickName,concat(:picBaseURL,wf_member.headimage)HeadImage from wf_quotation_comment left join wf_member on wf_member.membercode=wf_quotation_comment.CreateUser where isdelete=0 and StockCode=:StockCode and StockType=:StockType order by wf_quotation_comment.id desc", { replacements });
        res.send({ Status: 0, Explain: "", DataList: result })
    });
    //查询中概股排行榜
    router.all('/QuotationRank/:type/:order', wrap(async(req, res) => {
        let currentSRT = await redisClient.getAsync("currentSRT")
        let result = await realDB.collection(currentSRT).find({ ShowType: req.params.type }, { _id: 0 }).sort({ RiseFallRange: req.params.order == "desc" ? -1 : 1 }).toArray()
            //let [result] = await mainDB.query("select * from " + currentSRT + " where ShowType=:type order by RiseFallRange " + req.params.order, { replacements: req.params })
        res.send({ Status: 0, Explain: "", DataList: result })
    }));
    //用中文搜索股票
    router.get('/SearchStock/:searchword', wrap(async(req, res) => {
        let searchword = "%" + req.params.searchword + "%"
        let [result] = await mainDB.query("SELECT SecuritiesNo,SecuritiesName from wf_securities_trade where Remark='DW' and (UPPER(SecuritiesName) like :searchword or UPPER(PinYin) like UPPER(:searchword) or UPPER(SecuritiesNo) like UPPER(:searchword))", { replacements: { searchword } })
        res.send({ Status: 0, Explain: "", DataList: result })
    }));
    return router
}