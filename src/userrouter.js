const express = require('express')
const email = require('emailjs')
const auth = require('./auth')
const config = require('./config')

const server = email.server.connect(config.get('email'))

module.exports = () => {
  const user = express.Router()

  /*
   * Use blacklists to prevent spamming.
   * If an item is present in the blacklist
   * the request will not be processed.
   * Clearing out the ip blacklist often
   * allows for NAT addresses, but there is
   * no need to send the same email more
   * than once per day.
   */
  const blacklists = {
    ip: {},
    email: {}
  }
  setInterval(() => {
    blacklists.ip = {}
  }, 60 * 1000)

  setInterval(() => {
    blacklists.email = {}
  }, 24* 60 * 60 * 1000)

  user.post('/sendToken', (req, res) => {
    const email = req.body.email
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    if (!email) {
      return res.status(400).end()
    }

    if (blacklists.ip[ip] || blacklists.email[email]) {
      console.log(`Did not send email: ${blacklists.ip[ip] || blacklists.email[email]}`)
      return res.status(429).end()
    }

    blacklists.ip[ip] = ip
    blacklists.email[email] = email

    const token = auth.createToken(email)
    const htmlmessage = `<html>
      i <i>hope</i> this works!
<p><a href="${config.get('app.url')}/desktop.html?token=${token}">Desktop</a></p>
<p><a href="${config.get('app.url')}/mobile.html?token=${token}">Mobile</a></p>
</html>`
    const plainmessage = `i hope this works!
Desktop: ${config.get('app.url')}/desktop.html?token=${token}

Mobile: ${config.get('app.url')}/mobile.html?token=${token}`

    server.send({
      text: plainmessage,
      from: config.get('email.from'),
      to: email,
      subject: config.get('email.subject'),
      attachment:
      [
        {data: htmlmessage, alternative: true}
      ]
    }, (err, message) => {
      console.log(err || message)
      if (err) {
        return res.status(400).end()
      } else {
        return res.status(200).end()
      }
    })
  })
  return user
}
