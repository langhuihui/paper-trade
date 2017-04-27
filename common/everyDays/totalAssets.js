import EveryDay from '../everyDay'
import request from 'request-promise'
import Config from '../../config'
import { dwUrls } from '../driveWealth'
import sqlstr from '../sqlStr'
import singleton from '../singleton'
const { mainDB, redisClient } = singleton

export default new EveryDay('totalAssets', "05:00:00", async() => {
    let [result] = await mainDB.query('select * from wf_drivewealth_practice_account')
    for (let { UserId, MemberCode, username, password, emailAddress1 }
        of result) {
        try {
            let [todayAssetResult] = await mainDB.query("select * from wf_drivewealth_practice_asset where EndDate=CurDate() and UserId=:UserId", { replacements: { UserId } })
            if (todayAssetResult.length) continue
            let { sessionKey, accounts } = await request({
                uri: dwUrls.createSession,
                method: "POST",
                body: {
                    "appTypeID": "2000",
                    "appVersion": "0.1",
                    username,
                    "emailAddress": emailAddress1,
                    "ipAddress": "1.1.1.1",
                    "languageID": "zh_CN",
                    "osVersion": "iOS 9.1",
                    "osType": "iOS",
                    "scrRes": "1920x1080",
                    password
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
                let LastDate = ""
                let Positions = positions.reduce((acc, val) => acc + val.mtm, 0) //总的持仓资产
                let MtmPL = positions.reduce((acc, val) => acc + val.mtmPL, 0) //总的持仓浮动盈亏
                let replacements = { UserId, MemberCode, AccountID: accountID, Balance: cash, Positions, TotalAmount: cash + Positions, MtmPL }
                let [result] = await mainDB.query('select TotalAmount from wf_drivewealth_practice_asset where UserId=:UserId and EndDate<CurDate() order by EndDate desc limit 1', { replacements })
                switch (moment().day()) {
                    case 1:
                    case 0: //周日和周一取上周二的数据
                        LastDate = moment().day(-5).format();
                        break;
                    case 2: //周二到周六取本周二的数据
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        LastDate = moment().day(2).format();
                        break;
                }
                let [weekresult] = await mainDB.query('select TotalAmount from wf_drivewealth_practice_asset where UserId=:UserId and EndDate<:LastDate order by EndDate desc limit 1', { replacements: { LastDate, UserId } })
                replacements.TodayProfit = replacements.TotalAmount - (result.length ? result[0].TotalAmount : Config.practiceInitFun)
                replacements.WeekProfit = replacements.TotalAmount - (weekresult.length ? weekresult[0].TotalAmount : Config.practiceInitFun)
                replacements.WeekYield = replacements.WeekProfit / replacements.TotalAmount * 100
                await mainDB.query(sqlstr.insert("wf_drivewealth_practice_asset", replacements, { CreateTime: "now()", EndDate: "curDate()" }), { replacements })
            } else {
                let replacements = { UserId, MemberCode, AccountID: accountID, Balance: cash, Positions: 0, TotalAmount: cash, MtmPL: 0, TodayProfit: 0 }
                await mainDB.query(sqlstr.insert("wf_drivewealth_practice_asset", replacements, { CreateTime: "now()", EndDate: "curDate()" }), { replacements })
            }
        } catch (ex) {
            console.error(new Date(), ex)
            continue;
        }
    }
    //缓存总资产排行
    let [totalAmountResult] = await mainDB.query("select dw.MemberCode,round(dw.TotalAmount) TotalAmount,wf_member.Nickname,concat(:picBaseURL,wf_member.HeadImage) HeadImage from wf_drivewealth_practice_asset as dw left join wf_member on dw.MemberCode=wf_member.MemberCode where dw.EndDate=CurDate() order by dw.TotalAmount desc limit 100", { replacements: { picBaseURL: Config.picBaseURL } })
    redisClient.set("RankList:totalAssets", JSON.stringify(totalAmountResult))
        //缓存日收益排行
    let [todayProfitResult] = await mainDB.query("select dw.MemberCode,round(dw.TodayProfit) TodayProfit,wf_member.Nickname,concat(:picBaseURL,wf_member.HeadImage) HeadImage from wf_drivewealth_practice_asset as dw left join wf_member on dw.MemberCode=wf_member.MemberCode  where dw.EndDate=CurDate() order by dw.TodayProfit desc limit 100", { replacements: { picBaseURL: Config.picBaseURL } })
    redisClient.set("RankList:todayProfit", JSON.stringify(todayProfitResult))
    mainDB.query('CALL PRC_WF_PRACTICE_RANK();')
})