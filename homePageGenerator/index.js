import Config from '../config'
import Iconv from 'iconv-lite'
import Sequelize from 'sequelize'
import amqp from 'amqplib'
import Rx from 'rxjs'
var sequelize = Config.CreateSequelize();
(async() => {
    var amqpConnection = await amqp.connect(Config.amqpConn)
    let channel = await amqpConnection.createChannel()
    let ok = await channel.assertQueue('homepageGenerate')
    console.log(ok)
    channel.consume('homepageGenerate', msg => {
        //var data = JSON.parse(Iconv.decode(msg.content, 'utf-8'))
        GenerateHomePage()
        channel.ack(msg)
    })
})();

/**
 * 专栏生成器
 * @constructor
 * @param {Object} allColumns - 所有专栏 */
class ColumnGenerator {
    constructor(allColumns) {
        this.currentIndex = 0
        this.allColumns = allColumns
        this.empty = false
    }
    get currentColumn() {
        return this.allColumns[this.currentIndex]
    };
    /**下一轮 */
    gotoNext() {
        if (this.allColumns.length) {
            //if (!this.currentColumn.News.length) {
            if (this.currentColumn.News.length < 4) {
                this.allColumns.splice(this.currentIndex, 1)
                if (!this.allColumns.length) {
                    this.empty = true
                    return
                }
            } else {
                this.currentIndex++;
            }
            //循环获取
            if (this.currentIndex >= this.allColumns.length) {
                this.currentIndex = 0
            }
        } else this.empty = true
    };
    /**获取一个专栏 */
    getOne() {
        if (this.empty) return null
        let l = this.currentColumn.News.length
        let c = l >= 4 ? 4 : l
        if (c == 4) {
            var result = {}
            Object.assign(result, this.currentColumn)
            result.News = this.currentColumn.News.slice(0, c)
            this.currentColumn.News.splice(0, c)
            this.gotoNext()
            return result
        }
        this.gotoNext()
        return this.getOne()
    }
}
/**普通资讯生成器 */
class NewsGenerator {
    constructor(news) {
        this.news = news
        console.log("total news:", news.length)
        this.newsPos = 0
        this.empty = false
    }
    getOne() {
        if (this.empty) return null
        let randNo = getRandomNumber()

        if (this.news.length < this.newsPos + randNo) {
            randNo = this.news.length - this.newsPos
            this.empty = true
            if (!randNo) return null
        }
        //let result = { Type: 0, News: this.news.slice(this.newsPos, this.newsPos + randNo) }
        let result = this.news.slice(this.newsPos, this.newsPos + randNo)
        this.newsPos += randNo
        console.log("剩余：", this.news.length - this.newsPos)
        return result
    }
}
/**随机数生成，3~5 */
function getRandomNumber() {
    return Math.round(Math.random() * 2 + 3)
}
/**首页生成主程序 */
async function GenerateHomePage() {
    //获取最大版本号
    let version = (await sequelize.query("select max(Versions)+1 from wf_homepage"))[0]
    version = version[0]['max(Versions)+1']
    if (!version) version = 1
    let allData = []
    for (let i = 0; i < 5; i++) {
        allData[i] = (await sequelize.query(Config.homePageSqls[i]))[0]
    }
    let columnsMap = {}
    let columns = []
    for (var data1 of allData[1]) {
        if (!columnsMap[data1.ColumnNo]) {
            columnsMap[data1.ColumnNo] = { Type: 1, Id: data1.ColumnNo, Pic: data1.HomePage_Image, Title: data1.ColumnTitle, Des: data1.ColumnDes, News: [] }
            columns.push(columnsMap[data1.ColumnNo])
        }
        columnsMap[data1.ColumnNo].News.push({ Id: data1.Id, Code: data1.Code, Title: data1.Title, Pic: data1.Pic })
    }
    columnsMap = new ColumnGenerator(columns)
    columns = []
        //把专栏全部生成好
    while (true) {
        let column = columnsMap.getOne()
        if (column) columns.push(column)
        else break
    }
    let newsG = new NewsGenerator(allData[0])
    let pageData = []
    let page = 0
    let news = newsG.getOne()
    pageData.push(...news)
    let temp = [columns, allData[2], allData[3], allData[4]]
    let now = new Date()
    while (true) {
        for (let t of temp) {
            pageData.push(t[0])
            t.push(t.shift())
            news = newsG.getOne()
            if (news) pageData.push(...news)
            else break
        }
        if (!news) break
            //生成的json进行一些格式处理
        let content = JSON.stringify(pageData, (key, value) => {
            switch (key) {
                case "ShowTime":
                case "CreateTime": //时间格式
                    return new Date(value).format()
                case "Pic": //加入图片的路径前缀
                    return Config.picBaseURL + value
                case "Details": //截取前100个字符
                    return value.length > 100 ? value.substr(0, 100) : value
                default:
                    return value
            }
        })
        content = content.substr(1, content.length - 2).replace(/\\r\\n/g, "") //去掉回车换行和前后中括号
        await sequelize.query(`insert into wf_homepage(Versions,Page,Content,CreateTime) values(${version},${page},'${content}','${now.format()}')`)
        pageData.length = 0
        page++
    }
    console.log("生成首页完成,共" + page + "页");
    version = (await sequelize.query("select max(Versions) from wf_homepage where CreateTime < CURDATE()"))[0]
    version = version[0]['max(Versions)']
    let delResult = await sequelize.query("delete from wf_homepage where Versions < " + version)
    console.log("已删除旧数据：", delResult[0].affectedRows)
}
//GenerateHomePage()