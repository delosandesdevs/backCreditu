const User = require('./User')
const Player = require('./Player')

User.hasOne(Player)
Player.belongsTo(User)