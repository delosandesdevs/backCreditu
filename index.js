if(process.env.NODE_ENV !== 'production') {
 require('dotenv').config()
}


 
const {app} = require('./app')
const { sequelize } = require('./db/db')

const {PORT} = process.env

app.listen(PORT, () => {
  console.log('Server run on Port =>  ' + PORT)
  sequelize.sync({ alter: true })
})


