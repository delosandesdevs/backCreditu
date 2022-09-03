const { Router } = require('express')
const router = Router();
const {getAllPlayers, createPlayer, deletePlayer, getPlayerById, modifyPlayer, chargePlayers, searchPlayer} = require('../controllers/functionPlayers')


router.get('/chargeDb', async (req, res) => {
    try {
       await chargePlayers()
        res.send('se cargaron correctamente')
    } catch (error) {
        res.status(401).json(error.message)
    }
})

router.get('/players', async (req, res) => {
    let { page = 0, size = 15, orderby} = req.query
    try {
    orderby = orderby !== 'asc' && orderby !== 'desc' ? 'desc' : orderby
    res.status(200).json(await getAllPlayers(page, size, orderby))      
    } catch (error) {
        res.status(401).send({
            name : error.name,
            msg : error.message
        })
    }
})

router.get('/seachPlayer', async(req, res) =>{
    const {data} = req.body
    console.log(typeof data)
    try {
        res.status(200).send(await searchPlayer(data))
    } catch (error) {
        res.status(401).send({
            name : error.name,
            msg : error.message
        })
    }
})

router.get('/players/:id', async (req, res) => {
    const {id} = req.params
    try {
        const player = await getPlayerById(id)
        if(player.id){
        return res.status(200).json(player)    
        }else{
            return res.status(400).json('The player does not exist')
        }
    } catch (error) {
        res.status(400).send({
            name : error.name,
            msg : error.message
        })
    }
})

router.post('/players', async (req, res) =>{
    let {nickname, avatar, score} = req.body
    try {
        if(!nickname || !avatar || !score) return res.status(400).json('Player must have a nickname, avatar and score')
        res.status(200).json(await createPlayer(nickname, avatar, score))  
    } catch (error) {
        res.status(401).send({
            name : error.message,
            msg: error.message
        })
    }
})

router.delete('/players/:id', async (req, res) => {
    let {id} = req.params
    try {
        const deletedPlayer = await deletePlayer(id) 
        if(deletedPlayer === 1){
        return res.status(200).json('The player was successfully deleted')    
        }else{
            return res.status(400).json('The player does not exist')
        }     
    } catch (error) {
        res.status(401).send({
            name : error.name,
            msg : error.message
        })
    }
})

router.put('/players/:id', async (req, res) => {
    let {id} = req.params
    let { nickname, avatar, score } = req.body
    try {
        res.status(200).send(await modifyPlayer(id, nickname, avatar, score))      
        } catch (error) {
            res.status(401).send({
                name : error.name,
                msg : error.message
            })
        }
})


module.exports = router
