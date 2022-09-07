const { Router } = require('express')
const router = Router()
const {getUser, createAuth0, modifyUser, deleteUser} = require('../controllers/functionUsers')

router.get('/user', async (req, res) => {
    const {order} = req.query
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
    const {name, email} = req.body
    if(!name || !email){
        res.status(400).json({message : 'un nombre o email es requerido'})
    } else {
        try {
            res.status(200).send(await createAuth0(name, email))      
        } catch (error) {
            res.status(401).send({
                name : error.name,
                msg : error.message
            })
        }
    }
})

router.put('/user/:user_id', async(req, res) => {
    const {name, role} = req.body
    if(!name && !role) return res.status(400).json({message : 'un nombre de usuario y rol es requerido'})
    try {
        res.status(200).send(await modifyUser(name, role, req.params.user_id))
    } catch (error) {
        res.status(401).send({
            name : error.name,
            msg : error.message
        })
    }
    
})

router.delete('/user', async(req, res) =>{
    const {id} = req.body 
    if(!id) return res.status(400).json({message : 'un id es requerido'})

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