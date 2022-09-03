const User = require('.././models/User')

const getUser = async(order) =>{
    if(order === 'name'){
        const users = await User.findAll({
            order : [
                ['name'],
            ]
        })
        return users
    } else if(order === 'email'){
        const users = await User.findAll({
            order : [
                ['email'],
            ]
        })
        return users
    } else if(order === 'role'){
        const users = await User.findAll({
            order : [
                ['role'],
            ]
        })
        return users
    }else if(order === 'hasPlayer'){
        const users = await User.findAll({
            order : [
                ['hasPlayer'],
            ]
        })
        return users
    } else {
        const users = await User.findAll()
        return users
    }
}

const createUser = async(name, email, hasPlayer, role) =>{
    const createdUser = await User.create({name : name, email: email, hasPLayer: hasPlayer, role:role})
    return createdUser
}

const modifyUser = async(name, role, id) =>{
    await User.update({name : name, role : role}, 
        {
            where : {id : id}
        }
    )
return `user has been updated`
}

const deleteUser = async(id) =>{
    const userFound = await User.findByPk(id)
    if(!userFound) return 'The user does not exist'
    await User.destroy({where : {id : id}})
    return `User ${userFound.dataValues.name} has been delete`
}

const userPagination = async(page, length) =>{
    let option = {
        limit : Number(length),
        offset : Number(page) * Number(length)
    }
    const {count, row} = await User.findAndCountAll(option)
    return {
        status : 'success',
        total : count,
        user : row
    }
}


module.exports = {getUser, createUser, modifyUser, deleteUser}