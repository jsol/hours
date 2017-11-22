const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
const timeRouter = require('./timerouter')
const userRouter = require('./userrouter')
const path = require('path')
const auth = require('./auth')

const app = express()

const dbPool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'p',
  database: 'hours'
})

function nocache (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.header('Expires', '-1')
  res.header('Pragma', 'no-cache')
  next()
}

app.use(cors())
app.use(nocache)
app.use(bodyparser.json())
app.use('/v1/time', auth.auth, timeRouter(dbPool))
app.use('/v1/user', auth.auth, userRouter(dbPool))

app.post('/v1/authenticate', (req, res) => auth.authenticate(dbPool, req, res))

app.use('/', express.static(path.join(__dirname, '../www')))

app.listen(5500)
