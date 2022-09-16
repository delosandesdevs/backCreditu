const { Router } = require('express')
const router = Router()
const { getAllPlayers, createPlayer, deletePlayer, modifyPlayer, loadDb, searchPlayer, checkNickname } = require('../controllers/functionPlayers')
const Player = require('../models/Player')


router.get('/loadDb', async (req, res) => {
  try {
    await loadDb()
    res.send('se cargaron correctamente')
  } catch (error) {
    res.status(500).json(error.message)
  }
})

router.get('/players', async (req, res) => {
  let { page = 0, size = 15, orderby = 'desc'} = req.query
  try {
    res.status(200).json(await getAllPlayers(page, size, orderby))      
  } catch (error) {
    res.status(500).json({
      name : error.name,
      msg : error.message
    })
  }
})

router.get('/searchplayer', async(req, res) =>{
  let {nickname, status, page = 0, size = 15, orderby = 'desc'} = req.query
  if(!nickname && !status) return res.status(400).json({message: 'Un nickname o status es requerido'})
  try {
    res.status(200).json(await searchPlayer(nickname, status, page, size, orderby))
  } catch (error) {
    res.status(500).json({
      name : error.name,
      msg : error.message
    })
  }
})


router.get('/checkNickname/:nickname', async (req, res) => {
  const {nickname} = req.params
  try {
    if(nickname){
      return res.status(200).json(await checkNickname(nickname))   
    }else{
      return res.status(400).json('Un nickname es requerido')
    }
  } catch (error) {
    res.status(500).json({
      name : error.name,
      msg : error.message
    })
  }
})

router.post('/players', async (req, res) =>{
  const {nickname, avatar, score, user_id} = req.body
  if(!user_id) return res.status(400).json({message: 'Debe enviar un user_id'})
  if(!nickname || !avatar) return res.status(400).json('El player debe tener un nickname y avatar')
  try {
    const nicknameFound = await checkNickname(nickname)
    if(nicknameFound) return res.status(400).json({message: 'El nickname ya existe'})
    res.status(201).json(await createPlayer(nickname, avatar, score, user_id))  
  } catch (error) {
    res.status(500).json({
      name : error.message,
      msg: error.message
    })
  }
})

router.delete('/players/', async (req, res) => {
  const {playerId, user_id} = req.body
  try {
      return res.status(201).json(await deletePlayer(playerId, user_id))    
  } catch (error) {
    res.status(500).json({
      name : error.name,
      msg : error.message
    })
  }
})

router.put('/players/:id', async (req, res) => {
  const {id} = req.params
  const { nickname, avatar, score, user_id } = req.body
  if(!user_id) return res.status(400).json({message: 'un user_id es requerido'})
  try {
    const players = await Player.findAll()
    const filtered = players.filter(p => parseInt(p.id) !== parseInt(id))
    const nameFound = filtered.find(p => p.dataValues.nickname === nickname)

    if(!nameFound) return res.status(201).json(await modifyPlayer(id, nickname, avatar, score, user_id)) 

    return res.status(400).json({message: 'El nickname ya existe'})    
  } catch (error) {
    res.status(500).json({
      name : error.name,
      msg : error.message
    })
  }
})



module.exports = router
