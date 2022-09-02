const User = require('.././models/User')

const getUser = async() =>{
    const users = await User.findAll()
    return users
}

const createUser = async(name, email, hasPlayer, role) =>{
    const createdUser = await User.create({name : name, email: email, hasPLayer: hasPlayer, role:role})
    return createdUser
}


module.exports = {getUser, createUser}