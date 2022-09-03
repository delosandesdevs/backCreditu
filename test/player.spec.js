const {app} = require('../app') 
const request = require('supertest')  

xdescribe('CRUD Players', ()=>{

   describe('GET /players', () => {

      test('should respond with a 200 status code', async () => {
         const response = await request(app).get('/players').send() 
         expect(response.statusCode).toBe(200) 
      })
      
      test('should respond with an array of objects', async () => {
          const response = await request(app).get('/players').send() 
          expect(response.body).toBeInstanceOf(Array) 
          expect(response.body[0]).toBeInstanceOf(Object)
       })
  })
  
  describe('GET /players/:id', () => {
  
     const randomScore = Math.floor(Math.random() * Math.floor(10001)) 
  
        const newPlayer = {
           nickname: "florGesell",
           avatar: "https://drive.google.com/file/d/1V5Duu01gsI0sDWPn4gP4ezY2YtP_Pd7e/view",
           score: randomScore
        }
  
     test('should respond with a 200 status code', async () => {
        const response = await request(app).get('/players').send() 
        expect(response.statusCode).toBe(200) 
     })
     
     test('should find a player by ID', async () => {
         const player = await request(app).post('/players').send(newPlayer)
         const response = await request(app).get(`/players/${player.body.id}`).send() 
         expect(response.body).toBeInstanceOf(Object) 
           expect(response.body).toEqual(     
               expect.objectContaining(newPlayer)
            )
      })
  })
  
  describe('POST /players', () => {
  
        const randomScore = Math.floor(Math.random() * Math.floor(10001)) 
  
        const newPlayer = {
           nickname: '745',
           avatar: "https://drive.google.com/file/d/1V5Duu01gsI0sDWPn4gP4ezY2YtP_Pd7e/view",
           score: randomScore
        }
  
        test('should respond with a 200 status code', async () => {
           const response = await request(app).post('/players').send(newPlayer) 
           expect(response.statusCode).toBe(200) 
        })

        test('si el nickname es distinto de string status code 400', async () => {
         const response = await request(app).post('/players').send({nickname: 54}) 
         expect(response.statusCode).toBe(400) 
      })
        
        
        test('should respond with the new player', async () => {
           const response = await request(app).post('/players').send(newPlayer) 
           expect(response.body).toBeInstanceOf(Object) 
           expect(response.body).toEqual(     
               expect.objectContaining(newPlayer)
            )
        })
  })
  
  
  describe('DELETE /players', () => {
  
     const randomScore = Math.floor(Math.random() * Math.floor(10001)) 
  
     const newPlayer = {
        nickname: "florGesell",
        avatar: "https://drive.google.com/file/d/1V5Duu01gsI0sDWPn4gP4ezY2YtP_Pd7e/view",
        score: randomScore
     }
  
     test('should respond with a 200 status code', async () => {
        const player = await request(app).post('/players').send(newPlayer) 
        const response = await request(app).delete(`/players/${player.body.id}`).send()
        expect(response.statusCode).toBe(200) 
     })
     
     test('should delete the player by ID', async () => {
        const player = await request(app).post('/players').send(newPlayer) 
          await request(app).delete(`/players/${player.body.id}`).send()
        const response = await request(app).get(`/players/${player.body.id}`).send()
        expect(response.body.id).not.toBeDefined()
     })
  })
  
  describe('PUT /players', () => {
  
     const randomScore = Math.floor(Math.random() * Math.floor(10001)) 
  
     const newPlayer = {
        nickname: "florGesell",
        avatar: "https://drive.google.com/file/d/1V5Duu01gsI0sDWPn4gP4ezY2YtP_Pd7e/view",
        score: randomScore
     }
  
     const modifyPlayer = {
        nickname: 'ramiRama',
        avatar: "newpicture"
     }
  
  
     test('should respond with a 200 status code', async () => {
        const player = await request(app).post('/players').send(newPlayer) 
        const response = await request(app).put(`/players/${player.body.id}`).send(modifyPlayer)
        expect(response.statusCode).toBe(200) 
     })
     
     test('should modify ONLY the player name', async () => {
        const player = await request(app).post('/players').send(newPlayer) 
        await request(app).put(`/players/${player.body.id}`).send({nickname: 'ramiRama'})
        const response = await request(app).get(`/players/${player.body.id}`).send()
        expect(response.body.avatar).toEqual('https://drive.google.com/file/d/1V5Duu01gsI0sDWPn4gP4ezY2YtP_Pd7e/view')
        expect(response.body.nickname).toEqual('ramiRama')
     })
  
     test('should modify ONLY the player avatar', async () => {
        const player = await request(app).post('/players').send(newPlayer) 
        await request(app).put(`/players/${player.body.id}`).send({avatar: "newpicture"})
        const response = await request(app).get(`/players/${player.body.id}`).send()
        expect(response.body.nickname).toEqual('florGesell')
        expect(response.body.avatar).toEqual('newpicture')
     })
  
     test('should modify the player name AND the player avatar', async () => {
        const player = await request(app).post('/players').send(newPlayer) 
        await request(app).put(`/players/${player.body.id}`).send(modifyPlayer)
        const response = await request(app).get(`/players/${player.body.id}`).send()
        expect(response.body.nickname).toEqual('ramiRama')
        expect(response.body.avatar).toEqual('newpicture')
     })
  })
  

})

// describe('CRUD Users',  () => {
//    describe('POST /user', () => {


//    const newUser = {
//       name: "florGesell",
//       email: "fajd@dsja.com",
//       role: "admin"
//    }
//    const numberUser = {
//       name: 545,
//       email: "fajd@dsja.com",
//       role: "admin"
//    }

//    test('should respond with a 200 status code', async () => {
//       const response = await request(app).post('/user').send(newUser) 
//       expect(response.statusCode).toBe(200) 
//    })

//    test('name must be a string', async () => {
//       const response = await request(app).post('/user').send(newUser) 
//       expect(typeof response.body.name).toBe('string')
//    })

//    test('if name is not a string must return a status 400', async () => {
//       const response = await request(app).post('/user').send(numberUser) 
//       expect(response.statusCode).toBe(400) 
//    })
   
//    // test('should delete the player by ID', async () => {
//    //    const player = await request(app).post('/players').send(newPlayer) 
//    //      await request(app).delete(`/players/${player.body.id}`).send()
//    //    const response = await request(app).get(`/players/${player.body.id}`).send()
//    //    expect(response.body.id).not.toBeDefined()
//    // })
// })
// })



