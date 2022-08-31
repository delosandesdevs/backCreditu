const { Sequelize, DataTypes, Op } = require('sequelize');

const {
  DB_USER, DB_PASSWORD, DB_HOST, DATABASE, PORT
} = process.env;
// const sequelize = new Sequelize(`postgres://postgres:R4m1r0.8489@localhost:5432/fyh`, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });
const sequelize = new Sequelize({
    database: DATABASE,
    username: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true, // This will help you. But you will see nwe error
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