const express = require('express')
const uuid = require('uuid/v4')

module.exports = db => {
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
      uuid: uuid(),
      userid: 'jenson',
      timestamp: req.body.timestamp,
      shorttime: req.body.shorttime,
      year: req.body.year,
      month: req.body.month,
      day: req.body.day
    }

    try {
      validate(t)

      db.query('INSERT INTO `times` SET ?', t, (error, result) => {
        if (error) {
          console.log(error)
          return res.status(500).end()
        }

        res.json(t).end()
      })

    } catch(err) {
          console.log(err)
      res.status(err.statusCode || 500).end()
    }
  })

  time.delete('/:id', (req, res) => {
    db.query('DELETE FROM `times` WHERE userid = ? AND uuid = ? LIMIT 1', ['jenson', req.params.id], (error, result) => {
      if (error) {
        console.log(error)
        return res.status(500).end()
      }
      return res.status(200).json({
        uuid: req.params.id,
        status: 'removed'
      }).end()
    })
  })

  time.put('/:id', (req, res) => {
    res.status(500).end()
  })

  time.get('/:id', (req, res) => {
    console.log(req.params)
    res.end()
  })

  time.get('/day/:day', (req, res) => {
    if (!req.params.day.match(/^2[0-9]{3}-[0|1][0-9]-[0-9]{2}$/)) {
      return res.status(400).end();
    }
    const parts = req.params.day.split('-')
    if (parts[1] > 12 || parts[1] < 1) {
      return res.status(400).end();
    }
    const query = [ ...parts, 'jenson' ]

    db.query('SELECT `uuid`, `shorttime`, `timestamp`, `year`, `month`, `day` FROM `times` WHERE `year` = ? AND `month` = ? AND `day` = ? AND userid = ? ORDER BY `timestamp`', query, (error, result) => {
      if (error) {
        console.log(error)
        return res.status(500).end()
      }
      res.json(result).end();
    })
  })

  time.get('/month/:month', (req, res) => {
    if (!req.params.month.match(/^2[0-9]{3}-[0|1][0-9]$/)) {
      return res.status(400).end();
    }

    const parts = req.params.month.split('-')
    if (parts[1] > 12 || parts[1] < 1) {
      return res.status(400).end()
    }
    const query = [ ...parts, 'jenson' ]

    db.query('SELECT `uuid`, `shorttime`, `timestamp`, `year`, `month`, `day` FROM `times` WHERE `year` = ? AND `month` = ? AND userid = ? ORDER BY `timestamp`', query, (error, result) => {
      if (error) {
        console.log(error)
        return res.status(500).end()
      }
      const out = {}
      result.forEach(row => {
        if (!out[row.day]) {
          out[row.day] = []
        }
        out[row.day].push(row)
      })
      res.json(out).end()
    })
  })
  return time;
};
