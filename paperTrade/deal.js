import singleton from '../common/singleton'
import sqlstr from '../common/sqlStr'
const { mainDB, redisClient, jpushClient } = singleton
export default async({ Id: OrderId, Commission, delta, AccountNo, OrdType, Side, OrderQty, Price, SecuritiesType, SecuritiesNo, MemberCode, Amount }) => {
    let Type = ((OrdType - 1) / 3 >> 0) + 1 //1，2，3=>1做多；4，5，6=>2做空
    let { Cash } = await singleton.selectMainDB0("wf_street_practice_account", { AccountNo })
    let { Positions = 0, TradAble = 0, CostPrice, Id: PositionsId } = await singleton.selectMainDB0("wf_street_practice_positions", { AccountNo, SecuritiesType, SecuritiesNo, Type })
    let result = await singleton.transaction(async t => {
        let OldPositions = Positions
            //做多判断是否是卖，做空判断是否是买
        if (Side == "SB" [Type - 1]) {
            Positions -= OrderQty
            if (Type == 2) delta += OrderQty * (CostPrice - Price)
            if (Positions > 0) {
                await singleton.updateMainDB("wf_street_practice_positions", { Positions }, null, { Id: PositionsId }, t)
            } else if (Positions == 0) {
                await singleton.deleteMainDB("wf_street_practice_positions", { Id: PositionsId }, null, t)
            } else {
                throw 2
            }
        } else {
            if (Positions) {
                let Cost = Positions * CostPrice + OrderQty * Price;
                Positions += OrderQty
                CostPrice = Cost / Positions
                await singleton.updateMainDB("wf_street_practice_positions", { Positions, CostPrice, TradAble: TradAble + OrderQty }, null, { Id: PositionsId }, t)
            } else {
                TradAble = Positions = OrderQty
                await singleton.insertMainDB("wf_street_practice_positions", { Positions, TradAble, CostPrice: Price, SecuritiesType, SecuritiesNo, MemberCode, AccountNo, Type }, { CreateTime: "now()" }, t)
            }
        }
        if (Cash + delta < 0) {
            throw 1
        }
        await singleton.updateMainDB("wf_street_practice_account", { Cash: Cash + delta }, null, { AccountNo }, t)
        await singleton.insertMainDB("wf_street_practice_positionshistory" + (Type == 2 ? "_short" : ""), { OrderId, MemberCode, AccountNo, OldPositions, Positions, SecuritiesType, SecuritiesNo }, { CreateTime: "now()" }, t)
        await singleton.insertMainDB("wf_street_practice_cashhistory", { OrderId, MemberCode, AccountNo, OldCash: Cash, Cash: Cash + delta }, { CreateTime: "now()" }, t)
        await singleton.updateMainDB("wf_street_practice_order", { execType: 1, Commission, Price }, { TurnoverTime: "now()" }, { Id: OrderId }, t)
    })
    switch (result) {
        case 0:
            return 0
        case 1:
        case 2:
            result = await singleton.transaction(async t => {
                await singleton.updateMainDB("wf_street_practice_order", { execType: 3, Reason: result }, null, { Id: OrderId }, t)
                if (Side == "SB" [Type - 1]) {
                    TradAble += OrderQty //修改可交易仓位
                    await singleton.updateMainDB("wf_street_practice_positions", { TradAble }, null, { Id: PositionsId }, t)
                } else {
                    let { Id, UsableCash } = await singleton.selectMainDB0("wf_street_practice_account", { AccountNo })
                    await singleton.updateMainDB("wf_street_practice_account", { UsableCash: UsableCash + Amount }, null, { Id }, t)
                }
            })
            return result
        default:
            return result
    }
}