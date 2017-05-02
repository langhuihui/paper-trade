import moment from 'moment-timezone'
import EveryDay from '../everyDay'
import Config from '../../config'
import sqlstr from '../sqlStr'
import singleton from '../singleton'
const { mainDB, redisClient } = singleton
const weekDay = 2

async function getProfitInfo(daysAgo, AccountNo, TotalAmount) {
    let [record] = await mainDB.query('select TotalAmount from wf_street_practice_asset where AccountNo=:AccountNo and EndDate< DATE_SUB(CurDate(),INTERVAL :daysAgo day) order by EndDate desc limit 1', { replacements: { AccountNo, daysAgo } })
    let amount = (record.length ? record[0].TotalAmount : Config.practiceInitFun)
    let profit = TotalAmount - amount
    return { profit, yield: profit * 100 / amount }
}
export default new EveryDay('profitRank', "05:00:00", async() => {
    let accounts = await singleton.selectMainDB("wf_street_practice_account", { Status: 1 })
    for (let { MemberCode, AccountNo, Cash, TranAmount }
        of accounts) {
        try {
            let assets = await singleton.selectMainDB0("wf_street_practice_asset", { AccountNo }, { EndDate: "curDate()" })
            if (singleton.isEMPTY(assets)) {
                let positions = await singleton.selectMainDB("wf_street_practice_positions", { AccountNo })
                if (positions.length) {
                    let MtmPL = 0
                    let TotalAssets = 0
                    for (let p of positions) {
                        p.LastPrice = (await singleton.getLastPrice(Config.getQueryName(p)))[4]
                        if (p.Type == 1) {
                            p.Mtm = p.LastPrice * p.Positions
                            p.Profit = (p.LastPrice - p.CostPrice) * p.Positions
                            MtmPL += p.Profit
                            TotalAssets += p.Mtm
                        } else if (p.Type == 2) { //空单仓
                            p.Profit = (p.CostPrice - p.LastPrice) * p.Positions
                            MtmPL += p.Profit
                            TotalAssets += p.Profit
                        }
                    }
                    let TotalAmount = Cash + TotalAssets
                    let newRecord = {
                        MemberCode,
                        AccountNo,
                        Balance: Cash,
                        TotalAmount,
                        TotalYield: TotalAmount * 100 / TranAmount,
                        MtmPL,
                        Positions: TotalAssets
                    };

                    async function setProfit(daysAgo, type) {
                        if (daysAgo)
                            ({ profit: newRecord[type + "Profit"], yield: newRecord[type + "Yield"] } = await getProfitInfo(daysAgo, AccountNo, TotalAmount));
                        else
                            ({ TodayProfit: newRecord[type + "Profit"], TodayYield: newRecord[type + "Yield"] } = newRecord);
                    }
                    ({ profit: newRecord.TodayProfit, yield: newRecord.TodayYield } = await getProfitInfo(0, AccountNo, TotalAmount));
                    let yestoday = moment().subtract(1, 'days'); //昨天相当于美股的今天
                    let promises = []
                    promises.push(setProfit(yestoday.day() ? yestoday.day() - 1 : 6, "Week"))
                    promises.push(setProfit(yestoday.date() - 1, "Month"))
                    promises.push(setProfit(yestoday.dayOfYear() - 1, "Year"))
                    await Promise.all(promises)
                        // let daysAgo = yestoday.day() ? yestoday.day() - 1 : 6
                        // if (daysAgo)
                        //     ({ profit: newRecord.WeekProfit, yield: newRecord.WeekYield } = getProfitInfo(daysAgo, AccountNo, TotalAmount));
                        // else
                        //     ({ TodayProfit: newRecord.WeekProfit, TodayYield: newRecord.WeekYield } = newRecord);
                        // daysAgo = yestoday.date() - 1
                        // if (daysAgo)
                        //     ({ profit: newRecord.MonthProfit, yield: newRecord.MonthYield } = getProfitInfo(daysAgo, AccountNo, TotalAmount));
                        // else
                        //     ({ TodayProfit: newRecord.MonthProfit, TodayYield: newRecord.MonthYield } = newRecord);
                        // daysAgo = yestoday.dayOfYear() - 1
                        // if (daysAgo)
                        //     ({ profit: newRecord.YearProfit, yield: newRecord.YearYield } = getProfitInfo(daysAgo, AccountNo, TotalAmount));
                        // else
                        //     ({ TodayProfit: newRecord.YearProfit, TodayYield: newRecord.YearYield } = newRecord);
                    singleton.insertMainDB("wf_street_practice_asset", newRecord, { CreateTime: "now()", EndDate: "curDate()" })
                } else {
                    singleton.insertMainDB("wf_street_practice_asset", { MemberCode, AccountNo, Balance: Cash, TotalAmount: Cash }, { CreateTime: "now()", EndDate: "curDate()" })
                }
            }
        } catch (ex) {
            console.error(new Date(), ex)
            continue;
        }
    }
})