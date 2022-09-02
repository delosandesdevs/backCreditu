const { Router } = require('express')
const router = Router();
const {getUser, createUser} = require('../controllers/functionUsers')

router.get('/user', async (req, res) => {
    try {
        res.status(200).send(await getUser())      
        } catch (error) {
            res.status(401).send({
                name : error.name,
                msg : error.message
            })
        }
})

router.post('/user', async (req, res) => {
    const {name, email, hasPlayer, role} = req.body
    try {
        res.status(200).send(await createUser(name, email, hasPlayer, role))      
        } catch (error) {
            res.status(401).send({
                name : error.name,
                msg : error.message
            })
        }
})

module.exports = router