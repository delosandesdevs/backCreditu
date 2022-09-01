const express = require('express');
const cors = require("cors")
const player = require('./routes/player')

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())



app.use('/', player)


module.exports = {app}