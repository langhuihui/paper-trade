/**开市时间 */
import EveryDay from '../everyDay'
import singleton from '../singleton'
const { mainDB, redisClient } = singleton
export default new EveryDay('marketTime', "00:00:00", async function() {
    let [usResult] = await mainDB.query("select * from wf_system_opendate_bak where Type='us' and DealDate=CurDate()")
    let [usResult2] = await mainDB.query("select * from wf_system_opendate_bak where Type='us' and DealDate=DATE_ADD(CURDATE(),INTERVAL 1 day)")
    let [hsResult] = await mainDB.query("select * from wf_system_opendate_bak where Type='hs' and DealDate=CurDate()")
    let [hkResult] = await mainDB.query("select * from wf_system_opendate_bak where Type='hk' and DealDate=CurDate()")
    let isUsOpen = now => (usResult.length > 0 && now < usResult[0].EndTimePM) || (usResult2.length > 0 && now > usResult2[0].StartTimeAM)
    let isHsOpen = now => hsResult.length > 0 && (now > hsResult[0].StartTimeAM && now < hsResult[0].EndTimeAM || now > hsResult[0].StartTimePM && now < hsResult[0].EndTimPM)
    let isHkOpen = now => hkResult.length > 0 && (now > hkResult[0].StartTimeAM && now < hkResult[0].EndTimeAM || now > hkResult[0].StartTimePM && now < hkResult[0].EndTimPM)
    this.setRedis = now => {
        let hs = isHsOpen(now)
        redisClient.set('marketIsOpen', JSON.stringify({ us: isUsOpen(now), hk: isHkOpen(now), sh: hs, sz: hs }))
    }
})