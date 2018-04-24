const express = require('express')
const uuid = require('uuid/v4')

module.exports = db => {
  const add = (item, user) => {
    const validate = entry => {
      Object.keys(entry).forEach(key => {
        if (!entry[key]) {
          const err = new Error(`${key} is not set`)
          err.statusCode = 400
          throw err
        }
      })
      if (entry.type !== 'half' && entry.type !== 'full') {
          const err = new Error('Type is invalid')
          err.statusCode = 400
          throw err
      }
    }

    const t = {
      uuid: uuid(),
      userid: user,
      year: item.year,
      month: item.month,
      day: item.day,
      type: item.type
    }

    return new Promise((resolve, reject) => {
      try {
        validate(t)
      } catch (err) {
        return reject(err)
      }
      db.query('INSERT INTO `holidays` SET ? ON DUPLICATE KEY UPDATE type=?', [t, t.type], (error, result) => {
        if (error) {
          console.log(error)
          return reject(error)
        }
        return resolve(t)
      })
    })
  }

  const holiday = express.Router()

  holiday.post('/import', (req, res) => {
    Promise.all(req.body.map(item => add(item, req.user)))
      .then(items => {
        res.json(items).end()
      })
      .catch(err => {
        res.status(err.statusCode || 500).end()
      })
  })

  holiday.post('/', (req, res) => {
    add(req.body, req.user)
      .then(item => {
        res.json(item).end()
      })
      .catch(err => {
        res.status(err.statusCode || 500).end()
      })
  })

  holiday.delete('/:id', (req, res) => {
    db.query('DELETE FROM `holidays` WHERE userid = ? AND uuid = ? LIMIT 1', [req.user, req.params.id], (error, result) => {
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

  holiday.put('/:id', (req, res) => {
    res.status(500).end()
  })

  holiday.get('/:id', (req, res) => {
    console.log(req.params)
    res.end()
  })

  holiday.get('/day/:day', (req, res) => {
    if (!req.params.day.match(/^2[0-9]{3}-[0|1][0-9]-[0-9]{2}$/)) {
      return res.status(400).end()
    }
    const parts = req.params.day.split('-')
    if (parts[1] > 12 || parts[1] < 1) {
      return res.status(400).end()
    }
    const query = [ ...parts, req.user ]

    db.query('SELECT `uuid`, `type`, `year`, `month`, `day` FROM `holidays` WHERE `year` = ? AND `month` = ? AND `day` = ? AND userid = ?', query, (error, result) => {
      if (error) {
        console.log(error)
        return res.status(500).end()
      }
      res.json(result[0]).end()
    })
  })

  holiday.delete('/day/:day', (req, res) => {
    if (!req.params.day.match(/^2[0-9]{3}-[0|1][0-9]-[0-9]{2}$/)) {
      return res.status(400).end()
    }
    const parts = req.params.day.split('-')
    if (parts[1] > 12 || parts[1] < 1) {
      return res.status(400).end()
    }
    const query = [ ...parts, req.user ]

    db.query('DELETE FROM `holidays` WHERE `year` = ? AND `month` = ? AND `day` = ? AND userid = ?', query, (error, result) => {
      if (error) {
        console.log(error)
        return res.status(500).end()
      }
      res.status(200).end()
    })
  })

  holiday.get('/month/:month', (req, res) => {
    if (!req.params.month.match(/^2[0-9]{3}-[0|1][0-9]$/)) {
      return res.status(400).end()
    }

    const parts = req.params.month.split('-')
    if (parts[1] > 12 || parts[1] < 1) {
      return res.status(400).end()
    }
    const query = [ ...parts, req.user ]

    db.query('SELECT `uuid`, `type`, `year`, `month`, `day` FROM `holidays` WHERE `year` = ? AND `month` = ? AND userid = ? ORDER BY `day`', query, (error, result) => {
      if (error) {
        console.log(error)
        return res.status(500).end()
      }
      const out = {}
      result.forEach(row => {
        out[row.day] = row
      })
      res.json(out).end()
    })
  })
  return holiday
}
