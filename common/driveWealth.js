export default {
    urls: {
        apiHost: "",
        reportsHost: "",
        /** 创建会话  */
        get createSession() {
            return this.apiHost + "/v1/userSessions"
        },
        /** 持仓和未完成的订单  */
        get position() {
            return this.reportsHost + "/DriveWealth"
        },
        get createPractice() {
            return this.apiHost + "/v1/signups/practice"
        }
    }
}