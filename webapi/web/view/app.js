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
        }
    }
}