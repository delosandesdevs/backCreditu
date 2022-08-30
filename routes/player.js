const { Router } = require('express')
const router = Router();
const {getAllPlayers, createPlayer, deletePlayer} = require('../controllers/functionPlayer')

router.get('/players', async (req, res) => {
    console.log('ruta get')
    try {
    res.status(200).send(await getAllPlayers())      
    } catch (error) {
        res.status(401).send({
            name : error.name,
            msg : error.message
        })
    }
})

router.post('/players', async (req, res) =>{
    console.log('ruta')
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
