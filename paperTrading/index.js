import checkLogin from '../checkToken'
import express from 'express'
import bodyParser from 'body-parser'
import Config from '../config'
import Sequelize from 'sequelize'
import grass from 'nodegrass'

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.post('/orders', [checkLogin(true)], (req, res) => {
    let { ordType, side, symbol, orderQty, price } = req.body
    return res.json({ orderID: "xxx" })
})
app.get('/orders', [checkLogin(true)], async(req, res) => {

})
app.delete('/orders', [checkLogin(true)], (req, res) => {

})
let server = app.listen(process.env.PORT, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log('server listening at %s %d', host, port);
});