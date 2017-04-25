import request from 'request'
import Config from '../config'
import Iconv from 'iconv-lite'
export default function() {
    request.get({ encoding: null, url: Config.sina_realjs + stocks_name.toLowerCase() }, (error, response, body) => {

    })
}