import checkToken from '../checkToken'
import express from 'express'
import bodyParser from 'body-parser'
import Config from '../config'
import Sequelize from 'sequelize'
import grass from 'nodegrass'
//token验证中间件
async function checkLogin(req, res, next) {
    let result = await checkToken(req.header('Token'), true)
    req.memberCode = result.memberCode
    if (result === 0) next()
    else res.json(result)
}
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.post('/orders', [checkLogin], (req, res) => {
    let { ordType, side, symbol, orderQty, price } = req.body
    return res.json({ orderID: "xxx" })
})
app.get('/orders', [checkLogin], (req, res) => {

})
app.delete('/orders/', [checkLogin], (req, res) => {

})
let server = app.listen(process.env.PORT, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log('server listening at %s %d', host, port);
});