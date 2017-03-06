import express from 'express'
import bodyParser from 'body-parser'
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/addNotify', (req, res) => {
    res.json({ status: 1, name: req.body.name, error: req.body.pwd })
        //res.cookie('user', 'value', { signed: true })
})

let server = app.listen(process.env.PORT, function() {
    let host = server.address().address;
    let port = server.address().port;

    console.log('server listening at %s %d', host, port);
});