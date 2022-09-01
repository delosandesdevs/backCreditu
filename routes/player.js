const { Router } = require('express')
const router = Router();
const {getAllPlayers, createPlayer, deletePlayer, getPlayerById, modifyPlayer} = require('../controllers/functionPlayers')

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
    try {
    res.status(200).send(await getPlayerById(id))      
    } catch (error) {
        res.status(401).send({
            name : error.name,
            msg : error.message
        })
    }
})

router.post('/players', async (req, res) =>{
    let {nickname, avatar, score} = req.body
    console.log(typeof nickname)
    try {
        if (typeof nickname !== 'string') return res.status(400).send('invalid nickname')
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

router.put('/players/:id', async (req, res) => {
    let {id} = req.params
    let { nickname, avatar } = req.body
    try {
        res.status(200).send(await modifyPlayer(id, nickname, avatar))      
        } catch (error) {
            res.status(401).send({
                name : error.name,
                msg : error.message
            })
        }
})


module.exports = router
