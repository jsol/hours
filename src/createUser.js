const auth = require('./auth')
const mysql = require('mysql')

const dbPool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'p',
  database: 'hours'
})

const userid = process.argv[2]
const pwd = process.argv[3] || 'p'

console.log(`Creating user ${userid}`)

dbPool.query('INSERT INTO `users` SET ?', {
  userid: userid,
  timezone: 0,
  password: ''
}, (err, res) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  auth.setPassword(dbPool, userid, pwd, (err2, res2) => {
    if (err2) {
      console.log(err2)
      process.exit(2)
    }
    console.log('User created')
    process.exit(0)
  })
})

