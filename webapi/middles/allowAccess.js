/**设置跨域问题 */
import Config from '../../config'

function allowAccess(method = "GET") {
    return function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", Config.ajaxOrigin);
        res.setHeader("Access-Control-Allow-Methods", method);
        next()
    }
}
export default allowAccess