require('dotenv').config()
const {app} = require('./app')
const { sequelize } = require('./db/db')

let port = 8080
const {PORT} = process.env

app.listen(PORT, () => {
  console.log('Server run on Port =>  ' + PORT)
  sequelize.sync({ alter: true })
})


