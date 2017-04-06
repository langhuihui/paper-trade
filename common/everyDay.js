class EveryDay {
    constructor(n, t, f) {
        this.name = n
        this.callback = f
        this.time = t
        this.lastRun = null
        this.todayIsDone = null
    }
    checkTodayIsDone(now) {
        if (this.lastRun) {
            this.todayIsDone = this.lastRun.format("yyyy-MM-dd") == now.format("yyyy-MM-dd")
        } else {
            this.todayIsDone = false
        }
    }
    checkAndRun(now, context) {
        this.checkTodayIsDone(now)
        if (!this.todayIsDone && now > new Date(now.format("yyyy-MM-dd") + " " + this.time)) {
            this.callback(context)
            this.lastRun = now
            this.todayIsDone = true
            return true
        }
        return false
    }
}
export default EveryDay