const Player = require('../../models/Player')


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

module.exports = {
  modelPlayer,
  orderAscDesc
}