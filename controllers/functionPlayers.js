const Player = require('../models/Player')
const User = require('../models/User')
const players = require('../playersDb.json')
const {Op} = require('../db/db')

const chargePlayers = async () => {
        players.forEach(p => createPlayerDB(p.nickname, p.avatar, p.score) )
}

const createPlayerDB = async (nickname, avatar, score) => {
    const newPlayer = await Player.create({nickname: nickname, avatar: avatar, score: score, status: score})
    return newPlayer
}

const getAllPlayers = async (page, size, orderby)=> {  
    const allPlayers = await Player.findAll({
        order : [['score', 'DESC']]
    })
    const { count, rows } = await Player.findAndCountAll({
        limit: Number(size),
        offset: Number(page) * Number(size), 
        order: [['score', orderby === 'desc' ? 'DESC' : 'ASC']]
    })
    const players = rows.map(row => {
        return {
            id: row.id,
            nickname: row.nickname,
            avatar: row.avatar,
            score: row.score,
            status: row.status,
            ranking: (allPlayers.findIndex(p => p.id === row.id)) + 1
        }
    })
    if(orderby === 'asc'){
      return {total: count, players: players.sort((a, b) => b.ranking - a.ranking)}    
    }else if(orderby === 'desc'){
      return {total: count, players: players.sort((a, b) => a.ranking - b.ranking)}    
    }
      
}

const getPlayerById = async (id) => {
    const player = await Player.findByPk(id)
    return player
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

const deletePlayer = async (id)=> {
   const deletedPlayer = await Player.destroy({where: {id: id}})
    return deletedPlayer
}

const modifyPlayer = async (id, nickname, avatar, score, user_id) => {
    const user = await User.findByPk(user_id)
    
    if(user){
         if(user.role === 'admin'){
            const update = await Player.update({nickname: nickname, avatar: avatar, score: score}, { where: { id: id}})
            if(update === 1) return 'Player updated successfully'
            return "Player can't be updated successfully"
        }else if (user.role === 'user'){
            const update = await Player.update({nickname: nickname, avatar: avatar}, { where: { id: id}})
            if(update === 1) return 'Player updated successfully'
            return "Player can't be updated successfully"
        }
    }else{
        return "User does not exist"
    }
}

const searchPlayer = async(nickname, status) => {
    const allPlayers = await Player.findAll({
        order : [['score', 'DESC']]
    })
    ///  --- Si nickname es numero --- 
    if (Number(nickname) == nickname) {
        const player = await Player.findByPk(nickname)
        if(player) {
            return [{
                id: player.id,
                nickname: player.nickname,
                avatar: player.avatar,
                status: player.status,
                score: player.score,
                ranking: (allPlayers.findIndex(p => p.id === player.id)) + 1
            }]
        }else {
            return 'No se encuentra ningun player con el Id indicado'
        }
      // --- Si el nickname es NO es un numero --- 
    }else if(Number(nickname) !== NaN) {
        //---- Si mandan nickname & status ---
        if(nickname && status){
            const foundNicknameStatus = await Player.findAll({
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
        if(foundNicknameStatus.length > 0){
            const playersFound = foundNicknameStatus.map(pf => {
                    const player = {
                        id: pf.id,
                        nickname: pf.nickname,
                        avatar: pf.avatar,
                        status: pf.status,
                        score: pf.score,
                        ranking: (allPlayers.findIndex(p => p.id === pf.id)) + 1
                   
                      }
                  return player
             })
            return playersFound
        }else{
            return 'No se encuentra ninguna coincidencia con ese nickname y status'
        }
        
            //  ---- Si mandan nickname y NO status ----
        }else if (nickname && !status){
            const foundNickname = await Player.findAll({ where : {nickname : {[Op.iLike]: `%${nickname}%`}}})
            if (foundNickname.length > 0){
                const playersFound = foundNickname.map(pf => {
                    const player = {
                        id: pf.id,
                        nickname: pf.nickname,
                        avatar: pf.avatar,
                        status: pf.status,
                        score: pf.score,
                        ranking: (allPlayers.findIndex(p => p.id === pf.id)) + 1
                    }
                    return player
                })
                return playersFound
            }else{
                return 'No se encuentra ningun player con ese nickname'
            }
        }
    }
}

const filterByStatus = async (status) => {
    if(status === 'oro' || status === 'plata' || status === 'bronce' && status){
        const allPlayers = await Player.findAll({
            order : [['score', 'DESC']]
        })
        const players = await Player.findAll({where: {status: status}})

        if(players.length > 0){
            const playersFound = players.map(p => {
                const player = {
                    id: p.id,
                    nickname: p.nickname,
                    avatar: p.avatar,
                    status: p.status,
                    score: p.score,
                    ranking: (allPlayers.findIndex(i => i.id === p.id)) + 1
                }
                return player
            })
            return playersFound
        }
    }else{
        return 'Status no valido'
    }
    
    
}

module.exports = {getAllPlayers, createPlayer, deletePlayer, getPlayerById, modifyPlayer, chargePlayers, searchPlayer, filterByStatus}
    