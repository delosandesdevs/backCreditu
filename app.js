const express = require('express');
const cors = require("cors")
const app = express()
const test = require('./routes/test')
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.get('/', async (req, res)=>{res.send('entry Ok')})
app.use('/', test)

module.exports = {app}