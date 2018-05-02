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

const hashEscaped = new RegExp('/(mobile|desktop)_init.html%23(.*)')

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

app.use((req, res, next) => {
  // Apparantly the # in the url can somehow get escaped in iOs devices,
  // if we receive an URL with an obvious escape-fail, redirect it to the
  // proper url.
  const parts = req.url.match(hashEscaped)
  if (parts) {
    return res.redirect(`/${parts[1]}_init.html#${parts[2]}`)
  }
  res.status(404).end('<html><body>The URL is not valid. Please go to the <a href="/">start page</a> instead.</body></html>')
})

app.listen(config.get('app.port'))
