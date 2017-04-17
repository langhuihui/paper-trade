import sqlstr from '../common/sqlStr'
export default class Statistic {
    constructor(option) {
        Object.assign(this, option)
    }
    login(data) {
        this.sequelize.query(...sqlstr.insert2("wf_statistics_login", data, { CreateTime: "now()" }));
    }
    page(data) {
        this.sequelize.query(...sqlstr.insert2("wf_statistics_page", data, { StartTime: "now()" }));
    }
    stock(data) {
        this.sequelize.query(...sqlstr.insert2("wf_statistics_stock", data, { StartTime: "now()" }));
    }
    module(data) {
        this.sequelize.query(...sqlstr.insert2("wf_statistics_module", data, { StartTime: "now()" }));
    }
}