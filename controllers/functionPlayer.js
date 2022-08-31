const Player = require('../models/Player')


const getAllPlayers = async ()=> {
    const prueba = await Player.findAll(
    //     {
    //     order: [
    //         ['score', 'DESC']
    //     ]
    // }
    )
    return prueba
}

const createPlayer = async (nickname, avatar, score)=> {
    try {
        const newPlayer = await Player.create({nickname: nickname, avatar: avatar, score: score, status: score})
        return newPlayer
    } catch (error) {
        return error.message
    }
    
}

const deletePlayer = async (id)=> {
    try {
        await Player.destroy({where: {id: id}})
        return 'Player deleted successfully'
    } catch (error) {
        return error.message
    }
    
}


const getPlayerById = async (id) => {
    console.log(typeof id)
    const player = await Player.findByPk(id)
    return player
}

module.exports = {getAllPlayers, createPlayer, deletePlayer, getPlayerById}
    