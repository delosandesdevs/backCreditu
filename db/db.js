const { Sequelize, DataTypes, Op } = require('sequelize');
// const sequelize = new Sequelize(`postgres://postgres:password@localhost:5432/dbname`, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });
const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true, // This will help you. But you will see new error
        rejectUnauthorized: false // This line will fix new error
      },
      logging: false,
      native: false,
    },
  });

sequelize.authenticate()
.then(() => console.log('Postgres database connected'))
.catch(err => console.log('Something goes wrong ' + err))

module.exports = { sequelize, DataTypes, Op}