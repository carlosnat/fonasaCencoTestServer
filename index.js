require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { PORT } = require('./config/config')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/health', (req, res, next) => {
    res.json({ pid: process.pid, memory: process.memoryUsage(), msg: 'Everything ok :D' })
})

app.listen(PORT, () => {
    console.log(`CORS-enabled web server listening on port ${PORT}`)
})