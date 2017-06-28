import sqlstr from '../../common/sqlStr'
import singleton from '../../common/singleton'
import _config from '../config'
module.exports = function({ config, mainDB, realDB, ctt, express, checkEmpty, mqChannel, redisClient, rongcloud, wrap }) {
    const router = express.Router();

    return router;
}