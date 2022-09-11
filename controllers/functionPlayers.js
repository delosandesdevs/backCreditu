const Player = require('../models/Player')
const User = require('../models/User')
const players = require('../playersDb.json')
const {Op} = require('../db/db')
const { modelPlayer, orderAscDesc } = require('./helpers/helpers')

const chargePlayers = async () => {
  players.forEach(p => createPlayerDB(p.nickname, p.avatar, p.score) )
}
// function db
const createPlayerDB = async (nickname, avatar, score) => {
  const newPlayer = await Player.create({nickname: nickname, avatar: avatar, score: score, status: score})
  return newPlayer
}

const getAllPlayers = async (page, size, orderby)=> {  
  const { count, rows } = await Player.findAndCountAll({
    limit: Number(size),
    offset: Number(page) * Number(size), 
    order: [['score', orderby === 'desc' ? 'DESC' : 'ASC']]
  })
  const allPlayers = rows.map(async row => {
    const player = await modelPlayer(row)
    return player
  })
  const players = await Promise.all(allPlayers)
  return orderAscDesc(orderby, count, players)     
}


const createPlayer = async (nickname, avatar, score, user_id)=> {
  const user = await User.findByPk(user_id)
  if(user){
    if(!user.hasPlayer){
      const [newPlayer, created] = await Player.findOrCreate({
        where: {nickname},
        defaults: {
          nickname,
          avatar,
          score,
          status: score
        }
      })
      if(created){
        user.setPlayer(newPlayer)
        await User.update({hasPlayer: true}, { where: { id: user_id}})
        return newPlayer
      }else{
        return 'El nickname ya existe'
      }
            
    }else{
      return 'El usuario ya tiene un player'
    }
  }
  return 'El usuario no existe'
}

const deletePlayer = async (playerId, user_id)=> {
  if(user_id){
    await User.update({hasPlayer: false},{where: {id: user_id}})
  }
  const deletedPlayer = await Player.destroy({where: {id: playerId}})
  return deletedPlayer
}

const modifyPlayer = async (id, nickname, avatar, score, user_id) => {
  const user = await User.findByPk(user_id)
  if(user){
    if(user.role === 'admin'){
      const update = await Player.update({nickname: nickname, avatar: avatar, score: score, status: score}, { where: { id: id}})
      if(update[0] === 1) return 'Player modificado correctamente'
      return 'El player no pudo ser modificado'
    }else if (user.role === 'user'){
      const update = await Player.update({nickname: nickname, avatar: avatar}, { where: { id: Number(id)}})
      if(update[0] === 1) return 'Player modificado correctamente'
      return 'El player no pudo ser modificado'
    }
  }else{
    return 'User does not exist'
  }
}

const checkNickname = async(nickname) => {
  const player = await Player.findOne({where: {nickname : {[Op.iLike]: `${nickname}`}}})
  if(player) return true
  return false
}

const searchPlayer = async(nickname, status, page, size, orderby) => {
  //  --- Busqueda por ID --- 
  if (nickname && Number(nickname) == nickname) {
    const player = await Player.findByPk(nickname)
    if(player) {
      return {
        total: 1,
        players: [await modelPlayer(player)]
      }
    }else {
      return 'No se encuentra ningun player con el Id indicado'
    }
    
    // --- Busqueda por nombre o status --- 
  }else if(nickname && Number(nickname) !== NaN) {
    //---- busqueda combinada entre name y status(oro, bronce, plata) ---
    if( status && status !== 'todos' ){
      const {count, rows} = await Player.findAndCountAll(
        {
          limit: Number(size),
          offset: Number(page) * Number(size) ,
          order: [['score', orderby === 'desc' ? 'DESC' : 'ASC']],
          where :{
            [Op.and] :[
              {
                nickname : {[Op.iLike]: `%${nickname}%`}
              },
              {
                status : {[Op.iLike]: `%${status}%`}
              }
            ]
          }
        })
      if(rows.length > 0){
        const playersFound = rows.map(async pf => {
          const player = await modelPlayer(pf)
          return player
        })
        const players = await Promise.all(playersFound)
        return orderAscDesc(orderby, count, players)
      }else{
        return 'No se encuentra ninguna coincidencia con ese nickname y status'
      }
        
      //  ---- busqueda en toda la base por nombre ----
    }else if (status === 'todos' || !status ){
      const {count, rows} = await Player.findAndCountAll(
      {
        limit: Number(size),
        offset: Number(page) * Number(size), 
        order: [['score', orderby === 'desc' ? 'DESC' : 'ASC']], 
        where : {nickname : {[Op.iLike]: `%${nickname}%`}}
      }
      )
      if (rows.length > 0){
        const playersFound = rows.map(async pf => {
          const player = await modelPlayer(pf)
          return player
        })
        const players = await Promise.all(playersFound)
        return orderAscDesc(orderby, count, players)
      }else{
        return 'No se encuentra ningun player con el nickname indicado'
      }
    }
    /// --- all players filter by status ----
  }else if (!nickname && status){
      if(status === 'todos'){
        const allPlayers = await getAllPlayers(page, size, orderby)
        return allPlayers
      }else{
        const {count, rows} = await Player.findAndCountAll({
          limit: Number(size),
          offset: Number(page) * Number(size), 
          order: [['score', orderby === 'desc' ? 'DESC' : 'ASC']],
          where: {status: status}
        })
        if(rows.length > 0){
          const playersFound = rows.map(async (p) => {
            const player = await modelPlayer(p)
            return player
          })
          const players = await Promise.all(playersFound)
          return orderAscDesc(orderby, count, players)
        }
      }
    }else{
      return 'Status no valido'
    }
  
}


module.exports = {
  getAllPlayers, 
  createPlayer, 
  deletePlayer, 
  modifyPlayer, 
  chargePlayers, 
  searchPlayer, 
  checkNickname
}
    
