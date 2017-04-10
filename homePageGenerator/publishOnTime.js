/**定时发布工具 */
class PublishOnTime {
    constructor(f) {
        this.timeoutIds = []
        this.callback = f
    }
    clear() {
        for (let id of this.timeoutIds) {
            clearTimeout(id)
        }
        this.timeoutIds.clear()
    }

    reset(datas, propName = "ShowTime") {
        this.clear()
        let timeMap = {}
        let now = new Date()
        let normals = []
        for (let data of datas) {
            let showTime = new Date(data[propName])
            if (!timeMap[showTime]) {
                timeMap[showTime] = showTime - now
                if (timeMap[showTime] > 0)
                    this.timeoutIds.push(setTimeout(this.callback, timeMap[showTime]))
            }
            if (timeMap[showTime] < 0) normals.push(data)
        }
        return normals
    }
}
export default PublishOnTime