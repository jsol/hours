const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyparser.json())

app.post('/v1/:user/time', (req, res) => {

})

app.delete('/v1/:user/time/:id', (req, res) => {

})

app.put('/v1/:user/time/:id', (req, res) => {

})

app.get('/v1/:user/time/:id', (req, res) => {

})

app.get('/v1/:user/day/:day', (req, res) => {

})

app.get('/v1/:user/month/:month', (req, res) => {

})

app.post('/v1/:user/login', (req, res) => {

})

app.get('/v1/:user', (req, res) => {

})

app.post('/v1/:user', (req, res) => {

})


app.listen(5000)
