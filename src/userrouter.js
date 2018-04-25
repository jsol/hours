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
  }, 24 * 60 * 60 * 1000)

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
To get an overview over times you have registered visit
<p><a href="${config.get('app.url')}/desktop_init.html#${token}">Desktop</a></p>

Open this site in your phone to add times the easy way:
<p><a href="${config.get('app.url')}/mobile_init.html#${token}">Mobile</a></p>
Use "Add To Homescreen" to make the application behave more like a native app.
<p>Both links will remember the token for later visits so it is no longer needed
after the first visit.
</html>`

    const plainmessage = `To get an overview over times you have registered visit 
Desktop: ${config.get('app.url')}/desktop_init.html#${token}

Open this site in your phone to add times the easy way:
Mobile: ${config.get('app.url')}/mobile_init.html#${token}

Both links will remember the token for later visits so it is no longer needed
after the first visit.

Use "Add To Homescreen" to make the application behave more like a native app.`

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
        return res.status(200).json({ email: 'ok' }).end()
      }
    })
  })

  user.get('/verify', (req, res) => {
    res.json({ status: 'ok' }).status(200).end()
  })

  return user
}
