const express = require('express')
const uuid = require('uuid/v4')

module.exports = () => {
  const time = express.Router()

  time.post('/', (req, res) => {
    const validate = entry => {
      Object.keys(entry).forEach(key => {
        if (!entry[key]) {
          const err = new Error(`${key} is not set`)
          err.statusCode = 400
          throw err;
        }
      })
    }

    const t = {
      id: uuid(),
      timestamp: req.body.timestamp,
      shorttime: req.body.shorttime,
      year: req.body.year,
      month: req.body.month,
      day: req.body.day
    }

    try {
      validate(t)

      res.json(t).end()
    } catch(err) {
      res.status(err.statusCode || 500).end()
    }
  })

  time.delete('/:id', (req, res) => {
    res.status(500).end()
  })

  time.put('/:id', (req, res) => {
    res.status(500).end()
  })

  time.get('/:id', (req, res) => {
    console.log(req.params)
    res.end()
  })

  time.get('/day/:day', (req, res) => {
    if (!req.params.month.match(/^2[0-9]{3}-[0|1][0-9]-[0-9]{2}$/)) {
      return res.status(400).end();
    }
    res.status(500).end()
  })

  time.get('/month/:month', (req, res) => {
    if (!req.params.month.match(/^2[0-9]{3}-[0|1][0-9]$/)) {
      return res.status(400).end();
    }
    res.json({
      13: [
        {
          id: "cd553a51-031f-4731-9eaf-cb2da6dec2bd"
          day: 13
          month: 10
          shorttime: "22:57"
          timestamp: 1507928220000
          year: 2017
        },
      ]
    }).end()
  })
  return time;
};
