const Player = require('../models/Player')
const players = require('../playersDb.json')
const {Op} = require('../db/db')

const chargePlayers = async () => {
        players.forEach(p => createPlayer(p.nickname, p.avatar, p.score) )
}

const getAllPlayers = async (page, size, orderby)=> {  // agregar orderBy
    const { count, rows } = await Player.findAndCountAll({
        limit: Number(size),
        offset: Number(page) * Number(size), 
        order: [['score', orderby === 'desc' ? 'DESC' : 'ASC']]
    })
     return rows   
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

// const searchPlayer = async(data) => {
//     if(Number(data) == data){
//        let playersFound = Player.findAll({
//             where :{
//                 id : {[Op.eq] : data}
//             }
//         })
//         return playersFound
//     } else if(Number(data) !== NaN){
//         let playersFound =Player.findAll({
//             where :{
//                 [Op.or] : [
//                     {
//                         nickname : {[Op.iLike]: `%${data}%`}
//                     },
//                     {
//                         status : {[Op.iLike]: `%${data}%`}
//                     }
//                 ]
//             }
//         })
//         return playersFound
//     }
// }

const searchPlayer = async(nickname, status) => {
    const playersFound = await Player.findAll({
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
    return playersFound
}

module.exports = {getAllPlayers, createPlayer, deletePlayer, getPlayerById, modifyPlayer, chargePlayers, searchPlayer}
    