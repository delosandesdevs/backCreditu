const { Router } = require('express')
const router = Router();
const {test, test2, test3} = require('../controllers/test')

router.get('/test', async (req, res) => {
    try {
    console.log('ok')
    res.status(200).json(await test())      
    } catch (error) {
        res.status(401).send({
            name : error.name,
            msg : error.message
        })
    }
})

router.get('/test2', async (req, res) =>{
    try {
        res.status(200).json(await test2())  
    } catch (error) {
        re.status(401).send({
            name : error.message,
            msg: error.message
        })
    }
})

router.get('/test3', async (req, res) =>{
    try {
        res.status(200).json(await test3())  
    } catch (error) {
        re.status(401).send({
            name : error.message,
            msg: error.message
        })
    }
})
module.exports = router
