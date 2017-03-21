import checkToken from '../checkToken'
import express from 'express'
import bodyParser from 'body-parser'
import Config from '../config'
import Sequelize from 'sequelize'
import grass from 'nodegrass'

async function checkLogin(req, res, next) {
    let result = await checkToken(req.header('Token'), true)
    if (result === 0) next()
    else res.json(result)
}
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', [checkLogin], (req, res) => {
    res.json({ notifies, stocks_name, stocks })
})

let server = app.listen(process.env.PORT, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log('server listening at %s %d', host, port);
});