const {app} = require('./app')
const { sequelize } = require('./db/db')

let port = 8080

app.listen(port, () => {
  console.log('Server run on Port =>  ' + port)
  sequelize.sync({ alter: true })
})


