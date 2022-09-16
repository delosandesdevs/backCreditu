const Player = require('../models/Player')
const User = require('../models/User')
const players = require('../playersDb.json')
const {Op} = require('../db/db')
const { modelPlayer, orderAscDesc, searchById, searchByNameStatus, searchByName, filterByStatus, validScore } = require('./helpers/helpers')
const {ERROR_PLAYER, PLAYER_EDITED, USER_PLAYER, NO_USER, PLAYER_DELETED} = require('./helpers/constants')

const loadDb = async () => {
  let i = 1
  players.forEach(async (p) => await Player.create({
    nickname: p.nickname+'-'+i++, 
    avatar: p.avatar, 
    score: p.score,
    status: p.score
  }) )
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
  score = validScore(score)
  if(user){
    if(!user.hasPlayer){
      const newPlayer = await Player.create({ nickname, avatar, score, status: score })
      if(newPlayer){        
        user.setPlayer(newPlayer)
        await User.update({hasPlayer: true}, { where: { id: user_id}})
        return newPlayer
      }else{
        return ERROR_PLAYER
      }            
    }else{
      return USER_PLAYER
    }
  }
  return NO_USER
}

const deletePlayer = async (playerId, user_id)=> {
  if(user_id){
    await User.update({hasPlayer: false},{where: {id: user_id}})
  }
  const deletedPlayer = await Player.destroy({where: {id: playerId}})
  if(deletedPlayer === 1){
    return PLAYER_DELETED  
  }else{
    return ERROR_PLAYER
  }    
}

const modifyPlayer = async (id, nickname, avatar, score, user_id) => {
  const user = await User.findByPk(user_id)
  score = validScore(score)
  if(user){
    if(user.role === 'admin'){
      const update = await Player.update({nickname: nickname, avatar: avatar, score: score, status: score}, { where: { id: Number(id)}})
      if(update[0] === 1) return PLAYER_EDITED 
      return ERROR_PLAYER
    }else if (user.role === 'user'){
      const update = await Player.update({nickname: nickname, avatar: avatar}, { where: { id: Number(id)}})
      if(update[0] === 1) return PLAYER_EDITED 
      return ERROR_PLAYER
    }
  }else{
    return NO_USER
  }
}

const checkNickname = async(nickname) => {
  const player = await Player.findOne({where: {nickname : {[Op.iLike]: `${nickname}`}}})
  if(player) return true
  return false
}


const searchPlayer = async(nickname, status, page, size, orderby) => {
  if (nickname && Number(nickname) == nickname) {
   return await searchById(nickname)
  }else if(nickname && Number(nickname) !== NaN) {  // eslint-disable-line
      if( status && status !== 'todos' ){
        return await searchByNameStatus(nickname, status, page, size, orderby)
      }else if (status === 'todos' || !status ){
        return await searchByName(nickname, page, size, orderby)
      }
  }else if (!nickname && status){
    if(status === 'todos') return await getAllPlayers(page, size, orderby)
    return await filterByStatus(status, page, size, orderby)
  }
}


module.exports = {
  getAllPlayers, 
  createPlayer, 
  deletePlayer, 
  modifyPlayer, 
  loadDb, 
  searchPlayer, 
  checkNickname
}
    
