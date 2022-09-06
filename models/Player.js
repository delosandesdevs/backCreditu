const {sequelize, DataTypes, Op } = require ('../db/db.js')


const Player = sequelize.define('player', {
    nickname : {
        type : DataTypes.STRING,
        allowNull : false
    },
    score: {
        type : DataTypes.INTEGER,
        allowNull : false,
        defaultValue: 0
    },
    status: {
        type : DataTypes.STRING,
        set(value) {
            if (value >= 0 && value < 5000){
                this.setDataValue('status','bronce')
            }else if (value >= 5000 && value < 9000){
                this.setDataValue('status','plata')
            }else if (value >= 9000 && value <= 10000){
                this.setDataValue('status','oro')
            }
          }
    }, 
    avatar: {
        type : DataTypes.STRING,
        allowNull : false
    }
    },
    {
        freezeTableName : true 
    })

module.exports = Player