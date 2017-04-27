import singleton from '../common/singleton'
import sqlstr from '../common/sqlStr'
const { mainDB, redisClient, jpushClient } = singleton
export default async({ Id, Commission, delta, AccountNo, OrdType, Side, OrderQty, Price, SecuritiesType, SecuritiesNo, MemberCode }) => {
    let transaction = await mainDB.transaction();
    try {
        let t = { transaction }
        let [{ Cash }] = await singleton.selectMainDB("wf_street_practice_account", { AccountNo }, null, t)
        if (Cash + delta < 0) {
            throw 1
        }
        await singleton.updateMainDB("wf_street_practice_account", { Cash: Cash + delta }, null, { AccountNo }, t)
        let { Positions = 0, CostPrice } = await singleton.selectMainDB0("wf_street_practice_positions", { AccountNo, SecuritiesType, SecuritiesNo }, null, t)
        let OldPositions = Positions
        if (Side == "S") {
            Positions -= OrderQty
            if (Positions > 0)
                await singleton.updateMainDB("wf_street_practice_positions", { Positions }, null, { AccountNo, SecuritiesType, SecuritiesNo }, t)
            else if (Positions == 0) await singleton.deleteMainDB("wf_street_practice_positions", { AccountNo, SecuritiesType, SecuritiesNo }, null, t)
            else {
                throw 2
            }
        } else {
            if (Positions) {
                let Cost = Positions * CostPrice + OrderQty * Price;
                Positions += OrderQty
                CostPrice = Cost / Positions
                await singleton.updateMainDB("wf_street_practice_positions", { Positions, CostPrice }, null, { AccountNo, SecuritiesType, SecuritiesNo }, t)
            } else {
                await singleton.insertMainDB("wf_street_practice_positions", { Positions: OrderQty, CostPrice: Price, SecuritiesType, SecuritiesNo, MemberCode, AccountNo }, { CreateTime: "now()" }, t)
            }
        }
        await singleton.insertMainDB("wf_street_practice_positionshistory", { OrderId: Id, MemberCode, AccountNo, OldPositions, Positions, SecuritiesType, SecuritiesNo }, { CreateTime: "now()" }, t)
        await singleton.insertMainDB("wf_street_practice_cashhistory", { OrderId: Id, MemberCode, AccountNo, OldCash: Cash, Cash: Cash + delta }, { CreateTime: "now()" }, t)
        await singleton.updateMainDB("wf_street_practice_order", { execType: 1, Commission, Price }, { TurnoverTime: "now()" }, { Id }, t)
        await transaction.commit()
        return 0
    } catch (ex) {
        await transaction.rollback()
        switch (ex) {
            case 1:
            case 2:
                await singleton.updateMainDB("wf_street_practice_order", { execType: 3, Reason: ex }, null, { Id }, { transaction })
                return 0
            default:
                return ex
        }
        return ex
    }
}