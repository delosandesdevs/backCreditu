const {sequelize, DataTypes, Op } = require ('../db/db.js')

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
hasPLayer : {
    type : DataTypes.BOOLEAN,
    allowNull : false,
    defaultValue : false
},
role : {
    type : DataTypes.STRING,
    allowNull : false,
    defaultValue : 'guest'
}

},
{
    freezeTableName : true
}
)

module.exports = User