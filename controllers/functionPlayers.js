const Player = require('../models/Player')
const players = require('../playersDb.json')


const chargePlayers = async () => {
        players.forEach(p => createPlayer(p.nickname, p.avatar, p.score) )
}

const getAllPlayers = async ()=> {
    const allPlayers = await Player.findAll(
        {
        order: [
            ['score', 'DESC']
        ]
    }
    )
    return allPlayers
}

const getPlayerById = async (id) => {
    const player = await Player.findByPk(id)
    return player
}

const createPlayer = async (nickname, avatar, score)=> {
    const newPlayer = await Player.create({nickname: nickname, avatar: avatar, score: score, status: score})
    return newPlayer
}

const deletePlayer = async (id)=> {
   const deletedPlayer = await Player.destroy({where: {id: id}})
    return deletedPlayer
}

const modifyPlayer = async (id, nickname, avatar, score) => {
    
    const update = await Player.update({nickname: nickname, avatar: avatar, score: score}, { where: { id: id}})
    
    if(update === 1) return 'Player updated successfully'
    return "Player can't be updated successfully"
}

module.exports = {getAllPlayers, createPlayer, deletePlayer, getPlayerById, modifyPlayer, chargePlayers}
    