import EverDay from '../everyDay'
import request from 'request'
import { urls as dwUrls } from '../driveWealth'
export default new EveryDay('totalAssets', "08:00:00", async({ Config, sequelize }) => {
    let [result] = await sequelize.query('select * from wf_drivewealth_practice_account')
    for (let account of result) {
        request.post(Config.driveWealthHost.apiHost + dwUrls.createSession, (error, response, body) => {

        })
    }
})