const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
const timeRouter = require('./timerouter')
const path = require('path')

const app = express()


app.use(cors())
app.use(bodyparser.json())
app.use('/v1/time', timeRouter())

app.post('/v1/login', (req, res) => {

})

app.get('/v1/:user', (req, res) => {

})

app.post('/v1/:user', (req, res) => {

})

app.use('/', express.static(path.join(__dirname, '../www')));

app.listen(5500)
