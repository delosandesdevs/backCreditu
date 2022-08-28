const express = require('express');
const cors = require("cors")
const { sequelize } = require('./db/db')
const app = express()
const test = require('./routes/test')
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())
let port = 8080

app.get('/', async (req, res)=>{res.send('entry Ok')})
app.use('/', test)























app.listen(port, () => {
    console.log('Server run on Port =>  ' + port)
    sequelize.sync({ alter: true })
})


