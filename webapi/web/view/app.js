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
                let apps = res.body
                let s = `
                <mu-table>
  <mu-thead>
    <mu-tr>
      <mu-th>PID</mu-th>
      <mu-th>Name</mu-th>
      <mu-th>PM_ID</mu-th>
       <mu-th>Memory</mu-th>
        <mu-th>CPU</mu-th>
         <mu-th>WATCH</mu-th>
    </mu-tr>
  </mu-thead>
  <mu-tbody>
                `
                for (let { pid, name, pm_id, pm2_env: { watch }, monit: { memory, cpu } }
                    of apps) {
                    s += ` <mu-tr>
                    <mu-td>${pid}</mu-td>
      <mu-td>${name}</mu-td>
      <mu-td>${pm_id}</mu-td>
        <mu-td>${memory}</mu-td>
      <mu-td>${cpu}</mu-td>
       <mu-td>${watch}</mu-td>
         </mu-tr>
                    `
                }
                this.resultContent = s + `
                  </mu-tbody>
</mu-table>
</template>
                `
            })
        }
    }
}