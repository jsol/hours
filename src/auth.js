const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const argon2i = require('argon2-ffi').argon2i

const jwtsecret = process.env.jwtsecret || 'dev'

function checkCredentials (db, user, password, callback) {
  db.query('SELECT password FROM users WHERE userid = ? LIMIT 1', [user], (err, result) => {
    if (err) {
      console.log(err)
      return callback(err)
    }

    if (!result.length) {
      console.log(result)
      return callback(new Error('No such user'))
    }

    argon2i.verify(result[0].password, password).then(correct => {
      if (!correct) {
        return callback(err)
      }
      return callback()
    })
  })
}

function setPassword (db, userid, password, callback) {
  crypto.randomBytes(32, (err, salt) => {
    if (err) {
      return callback(err)
    }
    argon2i.hash(password, salt)
      .then((pwd) => {
        db.query('UPDATE users SET password = ? WHERE userid = ?', [pwd, userid], (err2, result) => {
          if (err2) {
            return callback(err2)
          }
          return callback()
        })
      })
  })
}

function auth (req, res, next) {
  console.log(req.headers.authorization)

  if (!req.headers.authorization || !req.headers.authorization.match(/^Bearer /)) {
    res.status(400).end()
    return
  }

  const token = req.headers.authorization.substr(7)

  jwt.verify(token, jwtsecret, (err, decoded) => {
    if (err) {
      console.log(err)
      res.status(400).end()
      return
    }
    req.user = decoded.userid
    console.log('tmptoken', decoded)

    if (decoded.tokenid) {
      res.status(400).end()
      return
    }
    next()
  })
}

function longToken (db, req, res) {
  console.log(req.body)
  checkCredentials(db, req.body.userid, req.body.password, err => {
    if (err) {
      return setTimeout(() => res.status(400).end(), 500)
    }
    const payload = {
      userid: req.body.userid
    }

    const token = jwt.sign(payload, jwtsecret)
    res.json({
      token: token
    }).end()
  })
}

module.exports = {
  authenticate: longToken,
  auth: auth,
  setPassword: setPassword
}
