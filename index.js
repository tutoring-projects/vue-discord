const express = require('express')
const app = express()
const port = 8081
const api = require('./api')

app.use(express.json())

app.use('/', api)

app.listen(port, () => console.log(`Listening on port ${port}`))