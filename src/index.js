const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
const timeRouter = require('./timerouter')
const holidayRouter = require('./holidayrouter')
const userRouter = require('./userrouter')
const path = require('path')
const auth = require('./auth')
const config = require('./config')

const app = express()

const dbPool = mysql.createPool(config.get('mysql'))

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
app.use('/v1/holiday', auth.auth, holidayRouter(dbPool))
app.use('/v1/user', userRouter(dbPool))

app.use('/', express.static(path.join(__dirname, '../www')))

app.listen(config.get('app.port'))
