require('dotenv').config()
const {app} = require('../app') 
const supertest = require('supertest')  
const { sequelize } = require('../db/db')
const Player  = require('../models/Player')
const User = require('../models/User')

const api = supertest(app)
  
const initialPlayers = [
  {
    nickname: 'playerOne',
    avatar: 'img1.png',
    score: 9050,
    status: 9050
  },
  {
    nickname: 'playerTwo',
    avatar: 'img2.png',
    score: 5004,
    status: 5004
  },
  {
    nickname: 'playerThree',
    avatar: 'img3.png',
    score: 421,
    status: 421
  },
  {
    nickname: 'playerFour',
    avatar: 'img4.png',
    score: 325,
    status: 325
  },
  {
    nickname: 'playerFive',
    avatar: 'img5.png',
    score: 21,
    status: 21
  }
]

beforeEach(async() => {
  
  await sequelize.sync({ force: true })
})


describe('CRUD Players', ()=>{

   
  describe('Model Player', ()=>{
    test('Must have a prop id, nickname, avatar, score, status', async() => {
      const response = await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 100, status: 100})
      const newPlayer = response.dataValues
      expect(newPlayer.nickname).toBeDefined()
      expect(newPlayer.avatar).toBeDefined()
      expect(newPlayer.score).toBeDefined()
      expect(newPlayer.status).toBeDefined()
      expect(newPlayer.status).toEqual('bronce')
    })

    test('status must be "oro" if score is >= 9000', async() => {
      const response = await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 9500, status: 9500})
      const newPlayer = response.dataValues
      expect(newPlayer.status).toEqual('oro')
    })

    test('status must be "plata" if score is between 5000 and 8999', async() => {
      const response = await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 6000, status: 6000})
      const newPlayer = response.dataValues
      expect(newPlayer.status).toEqual('plata')
    })

    test('a player must have a nickname', async () => {
      try {
        await Player.create({avatar: 'image.png', score: 6000, status: 6000})
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

    test('a player must have an avatar', async () => {
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
      await Player.bulkCreate(initialPlayers)
      const response = await api.get('/players')
      expect(response.body).toHaveProperty('total', initialPlayers.length)
      expect(response.body).toHaveProperty('players')
      expect(response.body.players).toHaveLength(initialPlayers.length)
    })

    test('must have a player with "playerOne" nickname', async () => {
      await Player.bulkCreate(initialPlayers) 
      const response = await api.get('/players')
      const nicknames = response.body.players.map(p => p.nickname)
      expect(nicknames).toContain('playerOne')
    })

    test('if orderby=asc should return a limit of players for page, in order ASC by score', async () => {
      await Player.bulkCreate(initialPlayers)
      const response = await api.get('/players?page=0&size=2&orderby=asc')
      expect(response.body.players[0].nickname).toBe('playerFive')
      expect(response.body.players[1].nickname).toBe('playerFour')
    })

    test('if orderBy=desc should return a limit of players for page, in order DESC by score', async () => {
      await Player.bulkCreate(initialPlayers)
      const response = await api.get('/players?page=0&size=2&orderby=desc')
      expect(response.body.players[0].nickname).toBe('playerOne')
      expect(response.body.players[1].nickname).toBe('playerTwo')
    })

    test('if there is not queries, must return a list of players order descending by score' , async () => {
      await Player.bulkCreate(initialPlayers)
      const response = await api.get('/players')
      expect(response.body.players[0].nickname).toBe('playerOne')
      expect(response.body.players[1].nickname).toBe('playerTwo')
    })

    

  })
  describe('GET /searchplayer', () => {

    const searchPlayers = [
      {
        nickname: 'florGesell', 
        avatar: 'image.png', 
        score: 9005, 
        status: 9005
      },
      {
        nickname: 'florCreditu', 
        avatar: 'image.png', 
        score: 9845, 
        status: 9845
      },
      {
        nickname: 'ramiRama', 
        avatar: 'image.png', 
        score: 9500, 
        status: 9500
      },
      {
        nickname: 'florencia', 
        avatar: 'image.png', 
        score: 264, 
        status: 264
      }
    ]

    test('should respond with a 200 status code', async () => {
      await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 9005, status: 9005})
      await api.get('/searchplayer?nickname=florGesell')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('should return a status 400 if the nickname AND status is not given', async () => {
      const response = await api.get('/searchplayer')
      expect(response.statusCode).toEqual(400)
    })

    test('should return an array whith the players found by nickname(parcial) AND status', async () => {
      await Player.bulkCreate(searchPlayers)
      const response = await api.get('/searchplayer?nickname=flo&status=oro')
      expect(response.body.players).toHaveLength(2)
      const nicknames = response.body.players.map(p => p.nickname)
      expect(nicknames).toContain('florCreditu', 'florGesell')
      expect(nicknames).not.toContain('florencia')
    })

    test('should return an array whith the players found only by nickname(parcial)', async () => {
      await Player.bulkCreate(searchPlayers)
      const response = await api.get('/searchplayer?nickname=flo')
      expect(response.body.players).toHaveLength(3)
      const nicknames = response.body.players.map(p => p.nickname)
      expect(nicknames).toContain('florCreditu', 'florGesell', 'florencia')
    })


    test('should found a player by id', async () => {
      const player1 = await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 9005, status: 9005})
      await Player.create({nickname: 'florCreditu', avatar: 'image.png', score: 9845, status: 9845})
      const response = await api.get(`/searchplayer?nickname=${player1.dataValues.id}`)
      expect(response.body.players[0].id).toEqual(player1.dataValues.id)
      expect(response.body.players[0].nickname).toEqual('florGesell')
      expect(response.body.players).toHaveLength(1)
    })

    test('should return an array whith the players filter by status if nickname is not specified', async () => {
      await Player.bulkCreate(searchPlayers)
      const response = await api.get('/searchplayer?status=oro')
      expect(response.body.players).toHaveLength(3)
      const nicknames = response.body.players.map(p => p.nickname)
      expect(nicknames).toContain('florCreditu', 'florGesell', 'ramiRama')
      expect(nicknames).not.toContain('florencia')
    })

    test('should return a message if the player is not foud by ID', async () => {
      await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 9005, status: 9005})
      const response = await api.get('/searchplayer?nickname=8')
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

    const newPlayer = {
      nickname: 'florGesell',
      avatar: 'image1.png',
      score: 5481,
      user_id: 1
    }

    test('should respond with a 201 status code', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      await api.post('/players').send(newPlayer) 
        .expect(201)
        .expect('Content-Type', /application\/json/)
    })
  
    test('Only a register user can create a valid user', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      await api.post('/players').send(newPlayer) 
      const response = await api.get('/players')
      const nicknames = response.body.players.map(p => p.nickname)
      expect(nicknames).toContain(newPlayer.nickname)
      expect(response.body.players[0]).toHaveProperty('nickname', newPlayer.nickname)
      expect(response.body.players[0]).toHaveProperty('ranking', 1)
    })

    test('should return a status 400 a user_id is not given', async () => {
      const response = await api.post('/players').send({nickname: 'florGesell', avatar: 'img.png'})
      expect(response.statusCode).toEqual(400)
      expect(response.body.message).toContain('Debe enviar un user_id')
    })

    test('a user cant\'t create more than one player', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      await api.post('/players').send(newPlayer) 
      const response = await api.post('/players').send({nickname: "playerOne", avatar: 'img.png', user_id: 1})
      expect(response.body).toContain('El usuario ya tiene un player')
      const allPlayers = await api.get('/players')
      const nicknames = allPlayers.body.players.map(p => p.nickname)
      expect(nicknames).not.toContain('playerOne')
    })

    test('cant\'t create a player with a nickname that already exists', async() => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      await Player.bulkCreate(initialPlayers)
      const response = await api.post('/players').send({nickname: 'playerOne', avatar: 'img1.png', user_id: 1}) 
      expect(response.statusCode).toEqual(400)
      expect(response.body.message).toContain('El nickname ya existe')
    })

    test('the user hasPlayer property must change to true when a player is created', async () => {
      const userCreated = await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      expect(userCreated.dataValues.hasPlayer).toBe(false)
      await api.post('/players').send(newPlayer)
      const users = await api.get('/user?order=name')
      expect(users.body[0].hasPlayer).toBe(true)
    })


    test('the player created must be related with the user', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      const response = await api.post('/players').send(newPlayer)
      expect(response.body.userId).toBe(1)
    })

    test('a player without a nickname can\'t be created', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      const response = await api.post('/players').send({avatar:'imagen.png', score: 32, user_id: 1}) 
      expect(response.statusCode).toBe(400) 
    })

    test('a player without an avatar can\'t be created', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      const response = await api.post('/players').send({nickname: 'ramiRama', score: 54, user_id: 1}) 
      expect(response.statusCode).toBe(400) 
    })

  })
  
  
  describe('DELETE /players', () => {
  
    test('should respond with a 201 status code', async () => {
      await Player.bulkCreate(initialPlayers)
      await api.delete('/players/').send({playerId: 1})
        .expect(201)
        .expect('Content-Type', /application\/json/)
    })
     
    test('should delete the player by ID', async () => {
      await Player.bulkCreate(initialPlayers)
      await api.delete('/players').send({ playerId: 1 })
      const response = await api.get('/players/')
      const ids = response.body.players.map(p => p.id)
      expect(ids).not.toContain(1)
    })

    test('should return a message if the player does not exist', async () => {
      const response = await api.delete('/players/').send({playerId: 615}) 
      expect(response.body).toBe('el player no existe')
    })
  })
  
  describe('PUT /players', () => {
  
    const modifyPlayer = {
      nickname: 'ramiRama',
      avatar: 'newpicture',
      user_id: 1
    }
    
    test('should respond with a 201 status code', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      await Player.create({nickname: 'florGesell', avatar: 'img.jpg', user_id: 1}) 
      const response = await api.put(`/players/1`).send(modifyPlayer)
      expect(response.statusCode).toBe(201) 
    })
     
    test('A "user" can modify his player name', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      await Player.create({nickname: 'florGesell', avatar: 'image.png', user_id: 1})
      await api.put(`/players/1`).send(modifyPlayer)
      const response = await api.get('/players').send()
      expect(response.body.players[0].avatar).toEqual('newpicture')
      expect(response.body.players[0].nickname).toEqual('ramiRama')
    })

    test('A "user" might modify only the player avatar', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      await Player.create({nickname: 'ramiRama', avatar: 'image.png', score: 56, user_id: 1})
      await api.put(`/players/1`).send(modifyPlayer)
      const response = await api.get('/players').send()
      expect(response.body.players[0].avatar).toEqual('newpicture')
      expect(response.body.players[0].score).toBe(56)
      expect(response.body.players[0].nickname).toEqual('ramiRama')
    })

    test('A "user" can\'t change the score', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 56, user_id: 1})
      await api.put(`/players/1`).send({score: 2000, user_id: 1})
      const response = await api.get('/players').send()
      expect(response.body.players[0].score).toBe(56)
    })
  
    test('Only an "admin"  can change the score', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com', role: 'admin'})
      await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 56, user_id: 1})
      await api.put(`/players/1`).send({score: 4000, user_id: 1})
      const response = await api.get(`/players`).send()
      expect(response.body.players[0].avatar).toEqual('image.png')
      expect(response.body.players[0].score).toBe(4000)
      expect(response.body.players[0].nickname).toEqual('florGesell')
    }) 

    test('A "user" can\'t change the score', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 56, user_id: 1})
      await api.put(`/players/1`).send({score: 2000, user_id: 1})
      const response = await api.get('/players').send()
      expect(response.body.players[0].score).toBe(56)
    })

    test('can\'t change the nickname if already exists', async () => {
      await User.create({name: 'florencia', email: 'florencia@gmail.com'})
      await Player.create({nickname: 'florGesell', avatar: 'image.png', score: 56, user_id: 1})
      await Player.bulkCreate(initialPlayers)
      const response = await api.put(`/players/1`).send({nickname: 'playerOne', user_id: 1})
      expect(response.status).toBe(400)
      expect(response.body.message).toBe('El nickname ya existe')
    })

    test('should return a status 400 if user_id is not pass', async () => {
      const response = await api.put(`/players/1`).send({score: 4000})
      expect(response.statusCode).toBe(400) 
      expect(response.body.message).toEqual('un user_id es requerido')
    })
    

  })
})


afterAll(async () => {
  await sequelize.sync({ force: true })
  sequelize.close()
})


