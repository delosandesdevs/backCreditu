const Player = require('../../models/Player')
const {Op} = require('../../db/db')
const {NO_PLAYER, INVALID_STATUS} = require('./constants')

const modelPlayer = async (player) => {
  const allPlayers = await Player.findAll({
    order : [['score', 'DESC']]
  })
  return {
    id: player.id,
    nickname: player.nickname,
    avatar: player.avatar,
    status: player.status,
    score: player.score,
    ranking: (allPlayers.findIndex(p => p.id === player.id)) + 1
  }
}

const orderAscDesc = (orderby, count, players) => {
  if(orderby === 'asc'){
    return {total: count, players: players.sort((a, b) => b.ranking - a.ranking)}    
  }else if(orderby === 'desc'){
    return {total: count, players: players.sort((a, b) => a.ranking - b.ranking)}    
  }
}

const searchById = async (id) => {
  const player = await Player.findByPk(id)
    if(player) {
      return {
        total: 1,
        players: [await modelPlayer(player)]
      }
    }else {
      return NO_PLAYER
    }
}

const searchByNameStatus = async (nickname, status, page, size, orderby) => {
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
    return NO_PLAYER
  }
}

const searchByName = async (nickname, page, size, orderby) => {
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
    return NO_PLAYER
  }
}

const filterByStatus = async (status, page, size, orderby) => {
   if(status === 'oro' || status === 'plata' || status === 'bronce'){
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
   }else{
    return INVALID_STATUS
   }
}

const validScore = (score) => {
  if(score > 10000){
   return score = 10000
  }else if(score < 0 || !score){
   return score = 0
  }
  return score
}

module.exports = {
  modelPlayer,
  orderAscDesc,
  searchById,
  searchByNameStatus,
  searchByName,
  filterByStatus,
  validScore
}