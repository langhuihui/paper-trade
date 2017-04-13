import Vue from 'vue'
import Mu_Table from './table.vue'
export default {
    data() {
        return {
            memberCode: "",
            token: "",
            resultTitle: "",
            resultContent: ""
        }
    },
    methods: {
        getToken() {
            this.$http.get('/test/token/' + this.memberCode).then(res => {
                this.token = res.body
            })
        },
        getConfig() {
            this.$http.get('/test/config').then(res => {
                this.resultTitle = "config"
                this.resultContent = "<pre>" + JSON.stringify(res.body, null, 4) + "</pre>"

            })
        },
        getWebConfig() {
            this.$http.get('/test/webConfig').then(res => {
                this.resultTitle = "webConfig"
                this.resultContent = "<pre>" + JSON.stringify(res.body, null, 4) + "</pre>"
            })
        },
        getPM2List() {
            this.$http.get('/test/pm2/list').then(res => {
                this.resultTitle = "PM2List"
                this.resultContent = "<pm2list/>"
                let _data = res.body.map(({ pid, name, pm_id, pm2_env: { watch }, monit: { memory, cpu } }) => {
                    return { pid, name, pm_id, memory, cpu, watch }
                })
                setTimeout(() => {
                    new Vue({
                        el: 'pm2list',
                        render: h => h(Mu_Table),
                        data: {
                            titles: ["PID", "Name", "PM_ID", "Memory", "CPU", "Watch"],
                            data: _data
                        }
                    })
                }, 1000)

            })
        }
    }
}