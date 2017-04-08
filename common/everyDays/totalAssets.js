import EveryDay from '../everyDay'
import request from 'request-promise'
import Config from '../../config'
import driveWealth from '../driveWealth'
import sqlstr from '../sqlStr'
let { urls: dwUrls } = driveWealth
Object.assign(dwUrls, Config.driveWealthHost)
export default new EveryDay('totalAssets', "05:00:00", async({ sequelize, redisClient }) => {
    let [result] = await sequelize.query('select * from wf_drivewealth_practice_account')
    for (let { UserId, MemberCode, username, password, emailAddress1 }
        of result) {
        try {
            let [todayAssetResult] = await sequelize.query("select * from wf_drivewealth_practice_asset where EndDate=CurDate()")
            if (todayAssetResult.length) continue
            let { sessionKey, accounts } = await request({
                uri: dwUrls.createSession,
                method: "POST",
                body: {
                    "appTypeID": "2000",
                    "appVersion": "0.1",
                    "username": username,
                    "emailAddress": emailAddress1,
                    "ipAddress": "1.1.1.1",
                    "languageID": "zh_CN",
                    "osVersion": "iOS 9.1",
                    "osType": "iOS",
                    "scrRes": "1920x1080",
                    "password": password
                },
                json: true
            })
            let [{ cash, accountNo, accountID }] = accounts
            let { positions } = await request({
                headers: { 'x-mysolomeo-session-key': sessionKey },
                qs: {
                    sessionKey,
                    ReportName: "PositionRestingOrder",
                    ReportFormat: "JSON",
                    AccountNumber: accountNo
                },
                uri: dwUrls.position,
                method: "POST",
                json: true
            })
            if (positions) {
                let Positions = positions.reduce((acc, val) => acc + val.mtm, 0) //总的持仓资产
                let MtmPL = positions.reduce((acc, val) => acc + val.mtmPL, 0) //总的持仓浮动盈亏
                let replacements = { UserId, MemberCode, AccountID: accountID, Balance: cash, Positions, TotalAmount: cash + Positions, MtmPL }
                let [result] = await sequelize.query('select TotalAmount from wf_drivewealth_practice_asset where UserId=:UserId and EndDate<CurDate() order by EndDate desc limit 1', { replacements })
                if (result.length) {
                    replacements.TodayProfit = replacements.TotalAmount - result[0].TotalAmount
                } else
                    replacements.TodayProfit = Config.practiceInitFun - replacements.TotalAmount
                await sequelize.query(sqlstr.insert("wf_drivewealth_practice_asset", replacements, { CreateTime: "now()", EndDate: "curDate()" }), { replacements })
            }
        } catch (ex) {
            console.error(ex)
            continue;
        }
    }
    //缓存总资产排行
    let [totalAmountResult] = await sequelize.query("select dw.MemberCode,round(dw.TotalAmount) TotalAmount,wf_member.Nickname,concat(:picBaseURL,wf_member.HeadImage) HeadImage from wf_drivewealth_practice_asset as dw left join wf_member on dw.MemberCode=wf_member.MemberCode where dw.EndDate=CurDate() order by dw.TotalAmount desc limit 100", { replacements: { picBaseURL: Config.picBaseURL } })
    redisClient.set("RankList:totalAssets", JSON.stringify(totalAmountResult))
        //缓存日收益排行
    let [todayProfitResult] = await sequelize.query("select dw.MemberCode,round(dw.TodayProfit) TodayProfit,wf_member.Nickname,concat(:picBaseURL,wf_member.HeadImage) HeadImage from wf_drivewealth_practice_asset as dw left join wf_member on dw.MemberCode=wf_member.MemberCode  where dw.EndDate=CurDate() order by dw.TodayProfit desc limit 100", { replacements: { picBaseURL: Config.picBaseURL } })
    redisClient.set("RankList:todayProfit", JSON.stringify(todayProfitResult))
})