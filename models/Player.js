const {sequelize, DataTypes, Op } = require ('../db/db.js')


const Player = sequelize.define('player', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    nickname : {
        type : DataTypes.STRING,
        allowNul : false
    },
    score: {
        type : DataTypes.INTEGER,
        allowNul : false
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
    },
    galeria: {
        type : DataTypes.STRING
    }
    },
    {
        freezeTableName : true 
    })

module.exports = Player