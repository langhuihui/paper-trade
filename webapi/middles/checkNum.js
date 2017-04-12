/**检测是否是数字 */
export default (...args) => {
    return (req, res, next) => {
        for (let arg of args) {
            if (req.query[arg] != undefined) {
                if (Number.isNaN(req.query[arg] = Number(req.query[arg]))) {
                    res.send({ Status: 40003, Explain: arg + "参数类型应该是数字，您传的是：" + JSON.stringify(req.query) })
                    return
                }
            }
        }
        next()
    }
}