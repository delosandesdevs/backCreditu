const { Router } = require('express')
const router = Router()
const {getAllPlayers, createPlayer, deletePlayer, getPlayerById, modifyPlayer, chargePlayers, searchPlayer, filterByStatus, checkNickname} = require('../controllers/functionPlayers')


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
    res.status(401).json({
      name : error.name,
      msg : error.message
    })
  }
})

router.get('/searchplayer', async(req, res) =>{
  const {nickname, status} = req.query
  if(!nickname) return res.status(400).json({message: 'Un nickname es requerido'})
  try {
    res.status(200).json(await searchPlayer(nickname, status))
  } catch (error) {
    res.status(401).json({
      name : error.name,
      msg : error.message
    })
  }
})

router.get('/filterByStatus', async(req, res) =>{
  const {status} = req.query
  try {
    res.status(200).json(await filterByStatus(status))
  } catch (error) {
    res.status(401).json({
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
    res.status(400).json({
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
    res.status(400).json({
      name : error.name,
      msg : error.message
    })
  }
})

router.post('/players', async (req, res) =>{
  const {nickname, avatar, score, user_id} = req.body
  try {
    if(!nickname || !avatar || !score) return res.status(400).json('Player must have a nickname, avatar and score')
    res.status(200).json(await createPlayer(nickname, avatar, score, user_id))  
  } catch (error) {
    res.status(401).json({
      name : error.message,
      msg: error.message
    })
  }
})

router.delete('/players/', async (req, res) => {
  const {user_id, playerId} = req.body
  try {
    const deletedPlayer = await deletePlayer(user_id, playerId) 
    if(deletedPlayer === 1){
      return res.status(200).json('The player was successfully deleted')    
    }else{
      return res.status(400).json('The player does not exist')
    }     
  } catch (error) {
    res.status(401).json({
      name : error.name,
      msg : error.message
    })
  }
})

router.put('/players/:id', async (req, res) => {
  const {id} = req.params
  const { nickname, avatar, score, user_id } = req.body
  try {
    if(!user_id) return res.status(400).json({message: 'un user_id es requerido'})
    res.status(200).json(await modifyPlayer(id, nickname, avatar, score, user_id))      
  } catch (error) {
    res.status(401).json({
      name : error.name,
      msg : error.message
    })
  }
})


module.exports = router
