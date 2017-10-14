const uuid = require('uuid/v4')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const argon2i = require('argon2-ffi').argon2i

const jwtsecret = process.env.jwtsecret || 'dev'

function checkCredentials(db, user, password, callback) {
  db.query('SELECT password FROM users WHERE userid = ? LIMIT 1', [user], (err, result) => {
    if (err) {
      console.log(err)
      return callback(false)
    }

    if (!result) {
      return callback(false)
    }

    argon2i.verify(result[0].password, password, function (err) {
      if (err) {
        console.log(err)
        return callback(false)
      }
      return callback(true)
    })
  })
}

function setPassword(db, userid, password, callback) {

}


function auth (req, res, next) {
  console.log(req.headers.authorization)

  if (!req.headers.authorization.match(/^Bearer /)) {
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
  checkCredentials(db, req.body.userid, req.body.password, res => {
    if (res) {
      const payload = {
        userid: req.body.userid,
        tokenid: uuid()
      }

      const token = jwt.sign(payload, jwtsecret)
      res.json({
        longtermtoken: token
      }).end()
      return
    }
    setTimeout(() => res.status(400).end(), 500)
  })
})

function shortToken(req, res) {
  console.log(req.headers.authorization)

  if (!req.headers.authorization.match(/^Bearer /)) {
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

    console.log('by', decoded)

    const payload = {
      userid: decoded.userid
    }

    const tmptoken = jwt.sign(payload, jwtsecret, {
      expiresIn: '30 minutes'
    })

    res.json({
      tmptoken: tmptoken
    }).end()
  })
})

module.exports = {
  shortToken: shortToken,
  longToken: longToken,
  auth: auth,
  setPassword: setPassword
}
