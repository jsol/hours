const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
const timeRouter = require('./timerouter')
const path = require('path')

const app = express()

const dbPool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'muawijhe',
  database: 'hours'
})

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

app.use(cors())
app.use(nocache)
app.use(bodyparser.json())
app.use('/v1/time', timeRouter(dbPool))

app.post('/v1/login', (req, res) => {

})

app.get('/v1/:user', (req, res) => {

})

app.post('/v1/:user', (req, res) => {

})

app.use('/', express.static(path.join(__dirname, '../www')));

app.listen(5500)
