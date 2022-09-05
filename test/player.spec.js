const {app} = require('../app') 
const supertest = require('supertest')  
const { sequelize } = require('../db/db')
const Player  = require('../models/Player')

const api = supertest(app)

const randomScore = Math.floor(Math.random() * Math.floor(10001)) 
  
const initialPlayers = [
   {
     nickname: 'playerOne',
     avatar: "https://drive.google.com/file/d/1V5Duu01gsI0sDWPn4gP4ezY2YtP_Pd7e/view",
     score: randomScore
   },
   {
     nickname: 'playerTwo',
     avatar: "https://drive.google.com/file/d/1V5Duu01gsI0sDWPn4gP4ezY2YtP_Pd7e/view",
     score: randomScore
   },
   {
    nickname: 'playerThree',
    avatar: "https://drive.google.com/file/d/1V5Duu01gsI0sDWPn4gP4ezY2YtP_Pd7e/view",
    score: randomScore
   }
]

beforeEach(async() => {
    await sequelize.sync({ force: true })
})


describe('CRUD Players', ()=>{

   
    describe('Model Player', ()=>{
        test('Must have a prop id, nickname, avatar, score, status, gallery', async() => {
            
               const response = await Player.create({nickname: "florGesell", avatar: "image.png", score: 56})
               const newPlayer = response.dataValues
               expect(newPlayer.nickname).toBeDefined()
               expect(newPlayer.avatar).toBeDefined()
               expect(newPlayer.score).toBeDefined()
               expect(newPlayer.status).toBeDefined()
               expect(newPlayer.gallery).toBeDefined()
        })

    })

   describe('GET /players', () => {

        test('should respond with a 200 status code', async () => {
            await api.get('/players')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
      
      test('should respond with an array players', async () => {
          initialPlayers.forEach(async (p) => await Player.create({nickname: p.nickname, avatar: p.avatar, score: p.score})) 
          const response = await api.get('/players')
          expect(response.body).toBeInstanceOf(Array) 
          expect(response.body).toHaveLength(initialPlayers.length)
       })

       test('must have a player with "playerOne" nickname', async () => {
        initialPlayers.forEach(async (p) => await Player.create({nickname: p.nickname, avatar: p.avatar, score: p.score})) 
        const response = await api.get('/players')
        const nicknames = response.body.map(p => p.nickname)
        expect(nicknames).toContain('playerOne')
     })

     test('if orderby=asc should return a limit of players for page, in order ASC by score', async () => {
            await Player.create({nickname: "florGesell", avatar: "image.png", score: 56})
            await Player.create({nickname: "ramiRama", avatar: "image.png", score: 500})
            await Player.create({nickname: "gianCat", avatar: "image.png", score: 421})
            await Player.create({nickname: "juaniJuano", avatar: "image.png", score: 325})
            await Player.create({nickname: "rodriRo", avatar: "image.png", score: 21})
         const response = await api.get('/players?page=0&size=2&orderby=asc')
         expect(response.body[0].nickname).toBe('rodriRo')
         expect(response.body[1].nickname).toBe('florGesell')
     })

     test('if orderBy=desc should return a limit of players for page, in order DESC by score', async () => {
            await Player.create({nickname: "florGesell", avatar: "image.png", score: 56})
            await Player.create({nickname: "ramiRama", avatar: "image.png", score: 500})
            await Player.create({nickname: "gianCat", avatar: "image.png", score: 421})
            await Player.create({nickname: "juaniJuano", avatar: "image.png", score: 325})
            await Player.create({nickname: "rodriRo", avatar: "image.png", score: 21})
         const response = await api.get('/players?page=0&size=2&orderby=desc')
         expect(response.body[0].nickname).toBe('ramiRama')
         expect(response.body[1].nickname).toBe('gianCat')
      })

      test('if orderby is not "asc" or "desc", must return a list of players order descending by score' , async () => {
         await Player.create({nickname: "florGesell", avatar: "image.png", score: 56})
         await Player.create({nickname: "ramiRama", avatar: "image.png", score: 500})
         await Player.create({nickname: "gianCat", avatar: "image.png", score: 421})
         await Player.create({nickname: "juaniJuano", avatar: "image.png", score: 325})
         await Player.create({nickname: "rodriRo", avatar: "image.png", score: 21})
      const response = await api.get('/players?page=0&size=2&orderby=other')
      expect(response.body[0].nickname).toBe('ramiRama')
      expect(response.body[1].nickname).toBe('gianCat')
   })
  })
  
  describe('GET /players/:id', () => {  // por nickname y ID y status  // cambiar ids
  
     test('should respond with a 200 status code', async () => {
        await api.get('/players')
        .expect(200)
        .expect('Content-Type', /application\/json/)
     })
     
     test('should find a player by ID', async () => {
        const postPlayer = await Player.create({nickname: "florGesell", avatar: "image.png", score: 56})
        const newPlayer = postPlayer.dataValues
        const response = await api.get(`/players/${newPlayer.id}`).send() 
         expect(response.body).toBeInstanceOf(Object) 
         expect(response.body.nickname).toBe('florGesell')
         expect(response.body.avatar).toBe('image.png')
         expect(response.body.score).toBe(56)
      })

      test('should return a status 400 if the player does not exist', async () => {
         const response = await api.get(`/players/fa86408e-7b5f-469b-9c99-98dd4b4c35c4`).send() 
         expect(response.statusCode).toBe(400)
      })
  })
  
  describe('POST /players', () => {
  
        const randomScore = Math.floor(Math.random() * Math.floor(10001)) 
  
        const newPlayer = {
           nickname: 'florGesell',
           avatar: "https://drive.google.com/file/d/1V5Duu01gsI0sDWPn4gP4ezY2YtP_Pd7e/view",
           score: randomScore
        }
  
        test('a valid player can be created', async () => {
            await api.post('/players').send(newPlayer) 
           .expect(200)
           .expect('Content-Type', /application\/json/)
           const response = await api.get('/players')
           const nicknames = response.body.map(p => p.nickname)
           expect(nicknames).toContain(newPlayer.nickname)
        })



        test("a player without score can't be created", async () => {
            const response = await api.post('/players').send({nickname: 'ramiRama', avatar:'imagen.png'}) 
            expect(response.statusCode).toBe(400) 
        })

        test("a player without a nickname can't be created", async () => {
            const response = await api.post('/players').send({avatar:'imagen.png', score: 32}) 
            expect(response.statusCode).toBe(400) 
        })

        test("a player without an avatar can't be created", async () => {
            const response = await api.post('/players').send({nickname: 'ramiRama', score: 54}) 
            expect(response.statusCode).toBe(400) 
        })

        
  })
  
  
  describe('DELETE /players', () => {
  
     test('should respond with a 200 status code', async () => {
        const newPlayers = initialPlayers.map(async (p) => await Player.create({nickname: p.nickname, avatar: p.avatar, score: p.score}))
        const players = await Promise.all(newPlayers)
        await api.delete(`/players/${players[0].dataValues.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
     })
     
     test('should delete the player by ID', async () => {
        const newPlayers = initialPlayers.map(async (p) => await Player.create({nickname: p.nickname, avatar: p.avatar, score: p.score}))
        const players = await Promise.all(newPlayers)
        const playerId = players[0].dataValues.id
        await api.delete(`/players/${playerId}`)
        const response = await api.get(`/players/`)
        const ids = response.body.map(p => p.id)
        expect(ids).not.toContain(playerId)
     })

     test('should return a status 400 if the player does not exist', async () => {
        const response = await api.delete(`/players/650`).send() 
        expect(response.statusCode).toBe(400)
     })
  })
  
  describe('PUT /players', () => {
  
     const modifyPlayer = {
        nickname: 'ramiRama',
        avatar: "newpicture"
     }
  
  
     test('should respond with a 200 status code', async () => {
        const newPlayers = initialPlayers.map(async (p) => await Player.create({nickname: p.nickname, avatar: p.avatar, score: p.score})) 
        const players = await Promise.all(newPlayers)
        const response = await api.put(`/players/${players[0].dataValues.id}`).send(modifyPlayer)
        expect(response.statusCode).toBe(200) 
     })
     
     test('might modify only the player name', async () => {
        const newPlayer = await Player.create({nickname: "florGesell", avatar: "image.png", score: 56})
        await api.put(`/players/${newPlayer.dataValues.id}`).send({nickname: 'ramiRama'})
        const response = await api.get(`/players/${newPlayer.dataValues.id}`).send()
        expect(response.body.avatar).toEqual('image.png')
        expect(response.body.score).toBe(56)
        expect(response.body.nickname).toEqual('ramiRama')
     })

     test('might modify only the player avatar', async () => {
        const newPlayer = await Player.create({nickname: "florGesell", avatar: "image.png", score: 56})
        await api.put(`/players/${newPlayer.dataValues.id}`).send({avatar: 'newImage.jpg'})
        const response = await api.get(`/players/${newPlayer.dataValues.id}`).send()
        expect(response.body.avatar).toEqual('newImage.jpg')
        expect(response.body.score).toBe(56)
        expect(response.body.nickname).toEqual('florGesell')
     })
  
     test('might modify only the player score', async () => {
        const newPlayer = await Player.create({nickname: "florGesell", avatar: "image.png", score: 56})
        await api.put(`/players/${newPlayer.dataValues.id}`).send({score: 4000})
        const response = await api.get(`/players/${newPlayer.dataValues.id}`).send()
        expect(response.body.avatar).toEqual('image.png')
        expect(response.body.score).toBe(4000)
        expect(response.body.nickname).toEqual('florGesell')
     })

  })
  

})

afterAll(() => {
    sequelize.close()
})


