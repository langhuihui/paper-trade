/**检查参数是否为空 */
function checkEmpty(...args) {
    return function(req, res, next) {
        for (let arg of args) {
            if (req.query[arg] == undefined || req.query[arg] === "") {
                res.send({ Status: 40002, Explain: arg + "不能为空!" })
                return
            }
        }
        next()
    }
}
export default checkEmpty