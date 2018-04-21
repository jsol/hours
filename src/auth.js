const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const config = require('./config')

const jwtsecret = config.get('jwtsecret')

function auth (req, res, next) {
  console.log(req.headers.authorization)

  let token = false

  if (req.query.token) {
    token = req.query.token
  }

  if (!token) {
    if (!req.headers.authorization || !req.headers.authorization.match(/^Bearer /)) {
      res.status(400).end()
      return
    }

    token = req.headers.authorization.substr(7)
  }

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

function createToken (email) {
  const hash = crypto.createHash('sha256').update(email).digest('base64')

  const payload = {
    userid: hash,
    email: email
  }

  return jwt.sign(payload, jwtsecret)
}

module.exports = {
  createToken: createToken,
  auth: auth
}
