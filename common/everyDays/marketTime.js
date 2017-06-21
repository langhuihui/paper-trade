/**开市时间 */
import EveryDay from '../everyDay'
import singleton from '../singleton'
const { mainDB, redisClient } = singleton
export default new EveryDay("00:00:00", async function() {
    let usResult = await singleton.selectMainDB("wf_system_opendate_bak", { Type: "us" }, { DealDate: "CurDate()" })
    let usResult2 = await singleton.selectMainDB("wf_system_opendate_bak", { Type: "us" }, { DealDate: "DATE_ADD(CURDATE(),INTERVAL 1 day)" })
    let hsResult = await singleton.selectMainDB("wf_system_opendate_bak", { Type: "hs" }, { DealDate: "CurDate()" })
    let hkResult = await singleton.selectMainDB("wf_system_opendate_bak", { Type: "hk" }, { DealDate: "CurDate()" })
    let usTime = [usResult.length > 0 ? new Date(usResult[0].EndTimePM) : false, usResult2.length > 0 ? new Date(usResult2[0].StartTimeAM) : false]
    let hsTime = hsResult.length > 0 ? [new Date(hsResult[0].StartTimeAM), new Date(hsResult[0].EndTimeAM), new Date(hsResult[0].StartTimePM), new Date(hsResult[0].EndTimePM)] : false
    let hkTime = hkResult.length > 0 ? [new Date(hkResult[0].StartTimeAM), new Date(hkResult[0].EndTimeAM), new Date(hkResult[0].StartTimePM), new Date(hkResult[0].EndTimePM)] : false
    let isUsOpen = now => (usTime[0] && now < usTime[0]) || (usTime[1] && now > usTime[1])
    let isHsOpen = now => hsTime && (now > hsTime[0] && now < hsTime[1] || now > hsTime[2] && now < hsTime[3])
    let isHkOpen = now => hkTime && (now > hkTime[0] && now < hkTime[1] || now > hkTime[2] && now < hkTime[3])

    let isUsOpen2 = now => (usTime[0] && now < usTime[0].getTime() + 60 * 1000) || (usTime[1] && now > usTime[1])
    let isHsOpen2 = now => hsTime && (now > hsTime[0] && now < hsTime[1].getTime() + 60 * 1000 || now > hsTime[2] && now < hsTime[3].getTime() + 60 * 1000)
    let isHkOpen2 = now => hkTime && (now > hkTime[0] && now < hkTime[1].getTime() + 60 * 1000 || now > hkTime[2] && now < hkTime[3].getTime() + 60 * 1000)

    this.setRedis = now => {
        let hs = isHsOpen(now)
        let marketIsOpen = { us: isUsOpen(now), hk: isHkOpen(now), sh: hs, sz: hs }
        Object.assign(this, marketIsOpen)
        redisClient.set('marketIsOpen', JSON.stringify(marketIsOpen))
        marketIsOpen = { us: isUsOpen2(now), hk: isHkOpen2(now), sh: isHsOpen2(now), sz: isHsOpen2(now) }
        redisClient.set('marketIsOpen2', JSON.stringify(marketIsOpen))
    }
})