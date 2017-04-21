class ArrayGenerator {
    constructor(array) {
        this.data = array
    }
    getOne() {
        if (!this.data || !this.data.length) return null
        let current = this.data[0]
        this.data.push(this.data.shift())
        return current
    }
}
/**
 * 专栏生成器
 * @constructor
 * @param {Object} allColumns - 所有专栏 */
class ColumnGenerator extends ArrayGenerator {
    constructor(allColumns) {
        super([])
        this.originColumns = allColumns
        this.currentIndex = 0
        this.done = false
    }
    get currentColumn() {
        return this.originColumns[this.currentIndex]
    }

    /**下一轮 */
    gotoNext() {
        if (this.originColumns.length) {
            //if (!this.currentColumn.News.length) {
            if (this.currentColumn.News.length < 4) {
                this.originColumns.splice(this.currentIndex, 1)
                if (!this.originColumns.length) {
                    this.done = true
                    return
                }
            } else {
                this.currentIndex++;
            }
            //循环获取
            if (this.currentIndex >= this.originColumns.length) {
                this.currentIndex = 0
            }
        } else this.done = true
    };
    /**获取一个专栏 */
    getOne() {
        if (this.done) return super.getOne()
        let l = this.currentColumn.News.length
        let c = l >= 4 ? 4 : l
        if (c == 4) {
            var result = Object.assign({}, this.currentColumn)
            result.News = this.currentColumn.News.slice(0, c)
            this.currentColumn.News.splice(0, c)
            this.gotoNext()
            this.data.push(result)
            return result
        }
        this.gotoNext()
        return this.getOne()
    }
}
/**普通资讯生成器 */
class NewsGenerator extends ArrayGenerator {

    constructor(news) {
        super(news)
        console.log("total news:", news.length)
        this.newsPos = 0
        this.empty = false
    }

    getOne() {
        if (this.empty) return null
            /**随机数生成，3~5 */
        let randNo = Math.round(Math.random() * 2 + 3)

        if (this.data.length < this.newsPos + randNo) {
            randNo = this.data.length - this.newsPos
            this.empty = true
            if (!randNo) return null
        }
        //let result = { Type: 0, News: this.news.slice(this.newsPos, this.newsPos + randNo) }
        let result = this.data.slice(this.newsPos, this.newsPos + randNo)
        this.newsPos += randNo
        console.log("剩余：", this.data.length - this.newsPos)
        return result
    }
}
/**书籍生成器 */
class BookGenerator extends ArrayGenerator {
    constructor(books) {
        super(books)
    }
    getOne() {
        if (this.data.length > 4) {
            let child = new Map()
            let childnum = Math.min(20, this.data.length - 1)
            while (child.size < childnum) {
                let c = Object.assign({}, this.data[(Math.random() * this.data.length) >> 0])
                c.Pic = c.Pic2
                delete c.Pic2
                child.set(c.Id, c)
            }
            let result = Object.assign({ Books: Array.from(child.values()) /*去重*/ }, super.getOne())
            delete result.Pic2
            delete result.Author
            delete result.BookName
            return result
        }
        return null
    }
}
export { ArrayGenerator, ColumnGenerator, NewsGenerator, BookGenerator }