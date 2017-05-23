import sqlstr from '../common/sqlStr'
import singleton from '../common/singleton'
const { mainDB } = singleton
export default class Statistic {
    login(data) {
        mainDB.query(...sqlstr.insert2("wf_statistics_login", data, { CreateTime: "now()" }));
    }
    page(data) {
        mainDB.query(...sqlstr.insert2("wf_statistics_page", data, { StartTime: "now()" }));
    }
    stock(data) {
        mainDB.query(...sqlstr.insert2("wf_statistics_stock", data, { StartTime: "now()" }));
    }
    module(data) {
        mainDB.query(...sqlstr.insert2("wf_statistics_module", data, { StartTime: "now()" }));
    }
    pageStay(data) {
        mainDB.query(...sqlstr.insert2("wf_statistics_page", data, {}));
    }
    stockPageStay(data) {
        mainDB.query(...sqlstr.insert2("wf_statistics_stock", data, {}));
    }
}