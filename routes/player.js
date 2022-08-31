const { Router } = require('express')
const router = Router();
const {getAllPlayers, createPlayer, deletePlayer, getPlayerById} = require('../controllers/functionPlayer')

router.get('/players', async (req, res) => {
    try {
    res.status(200).send(await getAllPlayers())      
    } catch (error) {
        res.status(401).send({
            name : error.name,
            msg : error.message
        })
    }
})

router.get('/players/:id', async (req, res) => {
    const {id} = req.params
    let number = parseInt(id)
    try {
        if(typeof number !== 'number') return res.status(400).send('The Id must be a number')
        const player = await getPlayerById(number) 
        if(player.id) return res.status(200).json(player)  
        res.status(400).send('The player does not exist')      
    } catch (error) {
        res.status(401).send({
            name : error.name,
            msg : error.message
        })
    }
})

router.post('/players', async (req, res) =>{
    let {nickname, avatar, score} = req.body
    try {
        res.status(200).json(await createPlayer(nickname, avatar, score))  
    } catch (error) {
        re.status(401).send({
            name : error.message,
            msg: error.message
        })
    }
})

router.delete('/players/:id', async (req, res) => {
    let {id} = req.params
    try {
        res.status(200).send(await deletePlayer(id))      
        } catch (error) {
            res.status(401).send({
                name : error.name,
                msg : error.message
            })
        }
})


module.exports = router
