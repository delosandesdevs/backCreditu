const { Sequelize, DataTypes, Op } = require('sequelize')

const {DB_NAME, 
  DB_USERNAME, 
  DB_PASSWORD, 
  DB_HOST, 
  DB_PORT , 
  DB_NAME_LOCAL, 
  DB_USERNAME_LOCAL, 
  DB_PASSWORD_LOCAL, 
  DB_HOST_LOCAL, 
  DB_PORT_LOCAL} = process.env

//
const sequelize = new Sequelize({
  database: process.env.NODE_ENV === 'production' ? DB_NAME : DB_NAME_LOCAL,
  username: process.env.NODE_ENV === 'production' ? DB_USERNAME : DB_USERNAME_LOCAL,
  password: process.env.NODE_ENV === 'production' ? DB_PASSWORD : DB_PASSWORD_LOCAL,
  host: process.env.NODE_ENV === 'production' ? DB_HOST : DB_HOST_LOCAL,
  port: process.env.NODE_ENV === 'production' ? DB_PORT : DB_PORT_LOCAL,
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    logging: false,
    native: false,
  },
  ssl: {
    require: true, // This will help you. But you will see nwe erro
    rejectUnauthorized: false // This line will fix new error
  }
})


sequelize.authenticate()
  .then(() => console.log('Postgres database connected'))
  .catch(error => console.log('Something goes wrong ' + error.message))

module.exports = { sequelize, DataTypes, Op}