const express = require('express');
const cors = require("cors")
const router = require('./routes/player')
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/', async (req, res)=>{res.send('entry Ok')})
app.use('/', router)

module.exports = {app}