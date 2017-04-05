import EverDay from '../everyDay'
import request from 'request-promise'
import { urls as dwUrls } from '../driveWealth'
export default new EveryDay('totalAssets', "08:00:00", async({ Config, sequelize }) => {
    let [result] = await sequelize.query('select * from wf_drivewealth_practice_account')
    for (let account of result) {
        try {
            let session = await request({
                uri: Config.driveWealthHost.apiHost + dwUrls.createSession,
                method: "POST",
                body: {
                    "appTypeID": "2000",
                    "appVersion": "0.1",
                    "username": account.username,
                    "emailAddress": account.emailAddress1,
                    "ipAddress": "1.1.1.1",
                    "languageID": "zh_CN",
                    "osVersion": "iOS 9.1",
                    "osType": "iOS",
                    "scrRes": "1920x1080",
                    "password": account.password
                },
                json: true
            })
            let { sessionKey, accounts } = session
            let [{ cash, positions }] = accounts

        } catch (ex) {
            console.error(ex)
            continue;
        }
    }
})