const express = require('express')
const email = require('emailjs')
const auth = require('./auth')
const config = require('./config')

const server = email.server.connect(config.get('email'))

module.exports = db => {
  const user = express.Router()
  user.post('/sendToken', (req, res) => {
    const email = req.body.email
    if (!email) {
      return res.status(400).end()
    }
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
