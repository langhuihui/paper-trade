import EveryDay from '../everyDay'
import request from 'request-promise'
import Config from '../../config'
import driveWealth from '../driveWealth'
let { urls: dwUrls } = driveWealth
Object.assign(dwUrls, Config.driveWealthHost)
export default new EveryDay('totalAssets', "05:00:00", async({ sequelize }) => {
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
                let totalmtm = positions.reduce((acc, val) => acc + val.mtm, 0) //总的持仓资产
                let totalmtmPL = positions.reduce((acc, val) => acc + val.mtmPL, 0) //总的持仓浮动盈亏
                let replacements = { UserId, MemberCode, accountID, cash, totalmtm, totalAssets: cash + totalmtm, totalmtmPL }
                sequelize.query('insert into wf_drivewealth_practice_asset(UserId,MemberCode,AccountID,Balance,Positions,CreateTime,EndDate,TotalAmount,MtmPL) values(:UserId,:MemberCode,:accountID,:cash,:totalmtm,Now(),CurDate(),:totalAssets,:totalmtmPL)', { replacements })
            }
        } catch (ex) {
            console.error(ex)
            continue;
        }
    }
})