require('dotenv').config()
const {app} = require('../app') 
const supertest = require('supertest')  
const { sequelize } = require('../db/db')
const Player  = require('../models/Player')
const User = require('../models/User')

const api = supertest(app)

const randomScore = Math.floor(Math.random() * Math.floor(10001)) 
  
const initialPlayers = [
  {
    nickname: 'playerOne',
    avatar: 'https://drive.google.com/file/d/1V5Duu01gsI0sDWPn4gP4ezY2YtP_Pd7e/view',
    score: randomScore
  },
  {
    nickname: 'playerTwo',
    avatar: 'https://drive.google.com/file/d/1V5Duu01gsI0sDWPn4gP4ezY2YtP_Pd7e/view',
    score: randomScore
  },
  {
    nickname: 'playerThree',
    avatar: 'https://drive.google.com/file/d/1V5Duu01gsI0sDWPn4gP4ezY2YtP_Pd7e/view',
    score: randomScore
  }
]

beforeEach(async() => {
  
  await sequelize.sync({ force: true })
})


describe('CRUD Players', ()=>{

   
  describe('Model Player', ()=>{
    test('Must have a prop id, nickname, avatar, score, status', async() => {
      const response = await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 56, status: 100})
      const newPlayer = response.dataValues
      expect(newPlayer.nickname).toBeDefined()
      expect(newPlayer.avatar).toBeDefined()
      expect(newPlayer.score).toBeDefined()
      expect(newPlayer.status).toBeDefined()
      expect(newPlayer.status).toEqual('bronce')
    })

    test('status must be "oro" if score is >= 9000', async() => {
      const response = await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 56, status: 9500})
      const newPlayer = response.dataValues
      expect(newPlayer.status).toEqual('oro')
    })

    test('status must be "plata" if score is between 5000 and 8999', async() => {
      const response = await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 56, status: 6000})
      const newPlayer = response.dataValues
      expect(newPlayer.status).toEqual('plata')
    })

    test('a player must have a nickname', async () => {
      try {
        await Player.create({avatar: 'image.png', score: 56, status: 6000})
      } catch (error) {
        expect(error.message).toBeDefined()
      }
    }) 

    test('a player must have a score', async () => {
      try {
        await Player.create({nickname: 'florGesell', avatar: 'image.png', status: 6000})
      } catch (error) {
        expect(error.message).toBeDefined()
      }
    }) 

    test('a player must have a avatar', async () => {
      try {
        await Player.create({nickname: 'florGesell', score: 6000, status: 6000})
      } catch (error) {
        expect(error.message).toBeDefined()
      }
    }) 

  })

  describe('GET /players', () => {

    test('should respond with a 200 status code', async () => {
      await api.get('/players')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
      
    test('should respond an object with the total of players', async () => {
      initialPlayers.forEach(async (p) => await Player.create({nickname: p.nickname, avatar: p.avatar, score: p.score})) 
      const response = await api.get('/players')
      expect(response.body).toHaveProperty('total', initialPlayers.length)
      expect(response.body).toHaveProperty('players')
      expect(response.body.players).toHaveLength(initialPlayers.length)
    })

    test('must have a player with "playerOne" nickname', async () => {
      initialPlayers.forEach(async (p) => await Player.create({nickname: p.nickname, avatar: p.avatar, score: p.score})) 
      const response = await api.get('/players')
      const nicknames = response.body.players.map(p => p.nickname)
      expect(nicknames).toContain('playerOne')
    })

    test('if orderby=asc should return a limit of players for page, in order ASC by score', async () => {
      await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 56})
      await Player.create({nickname: 'ramiRama', avatar: 'image.png', score: 500})
      await Player.create({nickname: 'gianCat', avatar: 'image.png', score: 421})
      await Player.create({nickname: 'juaniJuano', avatar: 'image.png', score: 325})
      await Player.create({nickname: 'rodriRo', avatar: 'image.png', score: 21})
      const response = await api.get('/players?page=0&size=2&orderby=asc')
      expect(response.body.players[0].nickname).toBe('rodriRo')
      expect(response.body.players[1].nickname).toBe('florGesell')
    })

    test('if orderBy=desc should return a limit of players for page, in order DESC by score', async () => {
      await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 56})
      await Player.create({nickname: 'ramiRama', avatar: 'image.png', score: 500})
      await Player.create({nickname: 'gianCat', avatar: 'image.png', score: 421})
      await Player.create({nickname: 'juaniJuano', avatar: 'image.png', score: 325})
      await Player.create({nickname: 'rodriRo', avatar: 'image.png', score: 21})
      const response = await api.get('/players?page=0&size=2&orderby=desc')
      expect(response.body.players[0].nickname).toBe('ramiRama')
      expect(response.body.players[1].nickname).toBe('gianCat')
    })

    test('if there is not queries, must return a list of players order descending by score' , async () => {
      await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 56})
      await Player.create({nickname: 'ramiRama', avatar: 'image.png', score: 500})
      await Player.create({nickname: 'gianCat', avatar: 'image.png', score: 421})
      await Player.create({nickname: 'juaniJuano', avatar: 'image.png', score: 325})
      await Player.create({nickname: 'rodriRo', avatar: 'image.png', score: 21})
      const response = await api.get('/players')
      expect(response.body.players[0].nickname).toBe('ramiRama')
      expect(response.body.players[1].nickname).toBe('gianCat')
    })

    

  })
  //nickname, status
  describe('GET /searchplayer', () => {

    test('should return a status 200 and return an array whith the players found by nickname AND status', async () => {
      await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 9005, status: 9005})
      await Player.create({nickname: 'florCreditu', avatar: 'image.png', score: 9845, status: 9845})
      await Player.create({nickname: 'ramiRama', avatar: 'image.png', score: 9500, status: 9500})
      await Player.create({nickname: 'florencia', avatar: 'image.png', score: 264, status: 264})
      const response = await api.get('/searchplayer?nickname=flo&status=oro')
      expect(response.statusCode).toEqual(200)
      expect(response.headers['content-type']).toMatch(/application\/json/)
      expect(response.body.players).toHaveLength(2)
      const nicknames = response.body.players.map(p => p.nickname)
      expect(nicknames).toContain('florCreditu', 'florGesell')
      expect(nicknames).not.toContain('florencia')
    })

    test('should return an array whith the players found only by nickname ', async () => {
      await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 9005, status: 9005})
      await Player.create({nickname: 'florCreditu', avatar: 'image.png', score: 9845, status: 9845})
      await Player.create({nickname: 'ramiRama', avatar: 'image.png', score: 9500, status: 9500})
      await Player.create({nickname: 'florencia', avatar: 'image.png', score: 264, status: 264})
      const response = await api.get('/searchplayer?nickname=flo')
      expect(response.body.players).toHaveLength(3)
      const nicknames = response.body.players.map(p => p.nickname)
      expect(nicknames).toContain('florCreditu', 'florGesell', 'florencia')
    })

    test('should return a status 400 if the nickname AND status is not given', async () => {
      await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 9005, status: 9005})
      const response = await api.get('/searchplayer')
      expect(response.statusCode).toEqual(400)
    })

    test('should found a player by id', async () => {
      const player1 = await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 9005, status: 9005})
      await Player.create({nickname: 'florCreditu', avatar: 'image.png', score: 9845, status: 9845})
      const response = await api.get(`/searchplayer?nickname=${player1.dataValues.id}&status=oro`)
      expect(response.body.players[0].id).toEqual(player1.dataValues.id)
      expect(response.body.players[0].nickname).toEqual('florGesell')
      expect(response.body.players).toHaveLength(1)
    })

    test('should return a message if the player is not foud by ID', async () => {
      await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 9005, status: 9005})
      const response = await api.get('/searchplayer?nickname=5')
      expect(response.body).toContain('No se encuentra ningun player con el Id indicado')
    })

    test('should return a message if the player is not foud by nickname', async () => {
      await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 9005, status: 9005})
      const response = await api.get('/searchplayer?nickname=ramiro')
      expect(response.body).toContain('No se encuentra ningun player con el nickname indicado')
    })

    test('should return a message if the player is not foud by nickaname AND status', async () => {
      await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 9005, status: 9005})
      const response = await api.get('/searchplayer?nickname=florGesell&status=bronce')
      expect(response.body).toContain('No se encuentra ninguna coincidencia con ese nickname y status')
    })

  })
  
  
  
  describe('POST /players', () => {
  
    const randomScore = Math.floor(Math.random() * Math.floor(10001)) 
  
    const newPlayer = {
      nickname: 'florGesell',
      avatar: 'https://drive.google.com/file/d/1V5Duu01gsI0sDWPn4gP4ezY2YtP_Pd7e/view',
      score: randomScore,
      user_id: 1
    }
  
    test('a valid player can be created', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      await api.post('/players').send(newPlayer) 
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const response = await api.get('/players')
      const nicknames = response.body.players.map(p => p.nickname)
      expect(nicknames).toContain(newPlayer.nickname)
      expect(response.body.players[0]).toHaveProperty('nickname', newPlayer.nickname)
      expect(response.body.players[0]).toHaveProperty('ranking', 1)
    })


    test('a player without a nickname can\'t be created', async () => {
      const response = await api.post('/players').send({avatar:'imagen.png', score: 32}) 
      expect(response.statusCode).toBe(400) 
    })

    test('a player without an avatar can\'t be created', async () => {
      const response = await api.post('/players').send({nickname: 'ramiRama', score: 54}) 
      expect(response.statusCode).toBe(400) 
    })

  })
  
  
  describe('DELETE /players', () => {
  
    test('should respond with a 200 status code', async () => {
      const newPlayers = initialPlayers.map(async (p) => await Player.create({nickname: p.nickname, avatar: p.avatar, score: p.score}))
      const players = await Promise.all(newPlayers)
      await api.delete('/players/').send({playerId: players[0].dataValues.id})
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
     
    test('should delete the player by ID', async () => {
      const newPlayers = initialPlayers.map(async (p) => await Player.create({nickname: p.nickname, avatar: p.avatar, score: p.score}))
      const players = await Promise.all(newPlayers)
      const playerId = players[0].dataValues.id
      await api.delete('/players').send({playerId:playerId})
      const response = await api.get('/players/')
      const ids = response.body.players.map(p => p.id)
      expect(ids).not.toContain(playerId)
    })

    test('should return a status 400 if the player does not exist', async () => {
      const response = await api.delete('/players/').send({playerId: 615}) 
      expect(response.statusCode).toBe(400)
    })
  })
  
  describe('PUT /players', () => {
  
    const modifyPlayer = {
      nickname: 'ramiRama',
      avatar: 'newpicture',
      user_id: 1
    }

    
    test('should respond with a 200 status code', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      const player1 = await Player.create({nickname: 'florGesell', avatar: 'img.jpg', user_id: 1}) 
      const response = await api.put(`/players/${player1.dataValues.id}`).send(modifyPlayer)
      expect(response.statusCode).toBe(200) 
    })
     
    test('A "user" might modify only the player name', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      const newPlayer = await Player.create({nickname: 'florGesell', avatar: 'image.png', user_id: 1})
      await api.put(`/players/${newPlayer.dataValues.id}`).send({nickname: 'ramiRama', user_id: 1})
      const response = await api.get('/players').send()
      expect(response.body.players[0].avatar).toEqual('image.png')
      expect(response.body.players[0].nickname).toEqual('ramiRama')
    })

    test('A "user" might modify only the player avatar', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      const newPlayer = await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 56, user_id: 1})
      await api.put(`/players/${newPlayer.dataValues.id}`).send({avatar: 'newImage.jpg', user_id: 1})
      const response = await api.get('/players').send()
      expect(response.body.players[0].avatar).toEqual('newImage.jpg')
      expect(response.body.players[0].score).toBe(56)
      expect(response.body.players[0].nickname).toEqual('florGesell')
    })

    test('A "user" can\'t change the score', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      const newPlayer = await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 56, user_id: 1})
      await api.put(`/players/${newPlayer.dataValues.id}`).send({score: 2000, user_id: 1})
      const response = await api.get('/players').send()
      expect(response.body.players[0].score).toBe(56)
    })
  
    test('Only an "admin" user can change the score', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com', role: 'admin'})
      const newPlayer = await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 56, user_id: 1})
      await api.put(`/players/${newPlayer.dataValues.id}`).send({score: 4000, user_id: 1})
      const response = await api.get(`/searchplayer?nickname=dasdas`).send()
      expect(response.body.players[0].avatar).toEqual('image.png')
      expect(response.body.players[0].score).toBe(4000)
      expect(response.body.players[0].nickname).toEqual('florGesell')
    })

    test('a user cant change the score', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      const newPlayer = await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 56, user_id: 1})
      const response = await api.put(`/players/${newPlayer.dataValues.id}`).send({score: 4000, user_id: 1})
      expect(response.body).toContain('teting')
    })
    

    test('should return a status 400 if user_id is not pass', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com', role: 'admin'})
      const newPlayer = await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 56, user_id: 1})
      const response = await api.put(`/players/${newPlayer.dataValues.id}`).send({score: 4000})
      expect(response.statusCode).toBe(200) 
      expect(response.body.message).toEqual('un user_id es requerido')
    })
    // errro 400 si no se pas

  })
})

describe('CATCH errors', () => {

  // test('must catch an error on /players', async()=>{
  //   try {
  //     const response = await api.get('/players/')
  //     response.end()
  //   } catch (error) {
  //     console.log(error.message)
  //     expect(error.message).toBeDefined()
  //   }
  // })

  // test('must catch an error on /searchplayer', async()=>{
  //   try {
  //     await sequelize.close()
  //     await api.get('/searchplayer')
  //   } catch (error) {
  //     console.log(error.message)
  //     expect(error.message).toBeDefined()
  //   }
  // })

})


afterAll(async () => {
  await sequelize.sync({ force: true })
  sequelize.close()
})


