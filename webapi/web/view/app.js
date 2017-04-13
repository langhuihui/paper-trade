export default {
    data() {
        return {
            memberCode: "",
            token: ""
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
                console.log(res.body)
            })
        },
        getWebConfig() {
            this.$http.get('/test/webConfig').then(res => {
                console.log(res.body)
            })
        }
    }
}