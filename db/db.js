const { Sequelize, DataTypes, Op } = require('sequelize')
const {DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT} = process.env
console.log(DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT)

// const sequelize = new Sequelize(`postgres://postgres:R4m1r0.8489@localhost:5432/fyh`, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });

/// const sequelize = new Sequelize(`postgres://postgres:1234@localhost/aws_test`, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });


const sequelize = new Sequelize({
  database: DB_NAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true, // This will help you. But you will see nwe error
      rejectUnauthorized: false // This line will fix new error
    },
    logging: false,
    native: false,
  },
})


sequelize.authenticate()
  .then(() => console.log('Postgres database connected'))
  .catch(error => console.log('Something goes wrong ' + error.message))

module.exports = { sequelize, DataTypes, Op}