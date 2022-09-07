const User = require('../models/User')
const Player = require('../models/Player')

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

const createAuth0 = async(name, email) =>{
  const [createdUser, created] = await User.findOrCreate({
    where : {email : email},
    defaults :{
      name: name,
      email : email,
    }
  })
  if(createdUser.hasPlayer){
    const allPlayers = await Player.findAll({
      order : [['score', 'DESC']]
    })
    const player = await createdUser.getPlayer()
    if(player){
      const ranking = (allPlayers.findIndex(p => p.id === player.id)) + 1
      return {createdUser, player, ranking}
    }
  }
    
  return {createdUser, player: false, ranking: false}
}

const modifyUser = async(name, role, id) =>{
  await User.update({name : name, role : role}, 
    {
      where : {id : id}
    }
  )
  return 'el usuario fue modificado correctamente'
}

const deleteUser = async(id) =>{
  const userFound = await User.findByPk(id)
  if(!userFound) return 'El usuario no existe'
  await User.destroy({where : {id : id}})
  return `El usuario ${userFound.dataValues.name} fue eliminado correctamente`
}


module.exports = {getUser, createAuth0, modifyUser, deleteUser}