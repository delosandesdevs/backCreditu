const { Router } = require('express')
const router = Router();
const {getUser, createUser, modifyUser, deleteUser} = require('../controllers/functionUsers')

router.get('/user/:order', async (req, res) => {
    const {order} = req.params
    try {
        res.status(200).send(await getUser(order))      
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

router.put('/user/:id', async(req, res) => {
    const {name, role} = req.body
    try {
        res.status(200).send(await modifyUser(name, role, req.params.id))
    } catch (error) {
        res.status(401).send({
            name : error.name,
            msg : error.message
        })
    }
})

router.delete('/user/:id', async(req, res) =>{
    const {id} = req.params
    try {
        res.status(200).send(await deleteUser(id))
    } catch (error) {
        res.status(401).send({
            name : error.name,
            msg : error.message
        })
    }
})  

module.exports = router