/**设置跨域问题 */
import Config from '../../config'

function allowAccess(method = "GET") {
    return function(req, res, next) {
        res.set("Access-Control-Allow-Origin", Config.ajaxOrigin);
        //res.set("Access-Control-Allow-Headers", "X-Requested-With");
        res.set("Access-Control-Allow-Methods", method);
        next()
    }
}
export default allowAccess