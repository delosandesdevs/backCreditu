const {sequelize, DataTypes} = require ('../db/db.js')

const User = sequelize.define('users', {
  name : {
    type : DataTypes.STRING,
    allowNull : false
  },
  email : {
    type : DataTypes.STRING,
    allowNull : false,
    unique : true
  },
  hasPlayer : {
    type : DataTypes.BOOLEAN,
    allowNull : false,
    defaultValue : false
  },
  role : {
    type : DataTypes.STRING,
    allowNull : false,
    defaultValue : 'user'
  }

},
{
  freezeTableName : true
}
)

let { users, player } = sequelize.models

users.hasOne(player)
player.belongsTo(users)

module.exports = User