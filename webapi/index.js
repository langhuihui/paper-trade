import checkLogin from '../checkToken'
import express from 'express'
import bodyParser from 'body-parser'
import Config from '../config'
import Sequelize from 'sequelize'

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/Choiceness/ChoicenessBannerList', (req, res) => {
    let page = req.param("page", 0)
    let size = req.param("size", 10)
    console.log(page, size)
    return res.json({ page, size })
})
app.get('/Choiceness/ChoicenessList', (req, res) => {
    let page = req.param("page", 0)
    let size = req.param("size", 10)
    let maxId = req.param("maxId")
    console.log(page, size)
    return res.json({ page, size, maxId })
})
app.get('/orders', [checkLogin(true)], async(req, res) => {

})
app.delete('/orders', [checkLogin(true)], (req, res) => {

})
let server = app.listen(Config.webapiPort, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log('server listening at %s %d', host, port);
});