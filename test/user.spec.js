const {app} = require('../app') 
const supertest = require('supertest')  
const { sequelize } = require('../db/db')
const api = supertest(app)
const User = require('../models/User')


const newUsers = [
  {name : 'rama', email : 'amar@example.com'},
  {name : 'florchu', email : 'uhcrolf@example.com'},
  {name : 'juano', email : 'onauj@example.com'},
  {name : 'giancin', email : 'nicnaig@example.com'},
  {name : 'rodra', email : 'ardor@example.com'},

]
beforeEach(async() => {
  await sequelize.sync({ force: true })
    
})


describe('CRUD /user',  ()=>{
  describe('GET /user', ()=>{
                
    test('should respond with a 200 status code', async()=>{
      const response = await api.get('/user?order=name').send()
      expect(response.statusCode).toBe(200)
      // expect(response.headers['content-type']).toMatch(/application\/json/)
    })

    test('should return an array of objects', async()=>{
      await User.bulkCreate(newUsers)
      const response = await api.get('/user?order=name').send()
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body[0]).toBeInstanceOf(Object)
    })

    test('the model must have a prop called Name and Email', async()=>{
      await User.bulkCreate(newUsers)
      const response = await api.get('/user?order=name').send()
      expect(response.status).toBe(200)
      expect(response.body[0].name).toBeDefined()
      expect(response.body[0].email).toBeDefined()    
    })

    test('the response must have all the info from database', async ()=>{
      await User.bulkCreate(newUsers)
      const response = await api.get('/user?order=name').send()
      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(newUsers.length)
    })

    test('must return the users ordered by name if receive a query called name', async () => {
      await User.bulkCreate(newUsers)
      const response = await api.get('/user?order=name').send()
      expect(response.body[0].name).toBe('florchu')
      expect(response.body[1].name).toBe('giancin')
      expect(response.body[2].name).toBe('juano')
      expect(response.body[3].name).toBe('rama')
      expect(response.body[4].name).toBe('rodra')
    })

    test('must return the users ordered by email if receive a query called email', async () => {
      await User.bulkCreate(newUsers)
      const response = await api.get('/user?order=email').send()
      expect(response.body[0].name).toBe('rama')
      expect(response.body[1].name).toBe('rodra')
      expect(response.body[2].name).toBe('giancin')
      expect(response.body[3].name).toBe('juano')
      expect(response.body[4].name).toBe('florchu')
    })
  })
  describe('POST /user', () =>{

    const newUser = {
      id: 1,
      name : 'ramiro',
      email : 'ramiro@gmail.com',
      hasPlayer : false,
      role : 'user'
    }

    test('should return a status 200 with corect post', async()=>{
      await api.post('/user').send(newUser)
        .expect(200)
        .expect('content-type', /application\/json/)
    })

    test('an user cant be created without an email', async()=>{
      await api.post('/user').send({name: 'rami'})
        .expect(400)
    })
    test('an user cant be created without an name', async()=>{
      await api.post('/user').send({email: 'rami@example.com'})
        .expect(400)
    })

    test('when a user is created, should return the user created', async()=>{
      await api.post('/user').send(newUser)
      const response = await api.get('/user?order=name').send()
      expect(response.body[0]).toHaveProperty('email', newUser.email)
      expect(response.body[0]).toHaveProperty('name', newUser.name)
      expect(response.body[0]).toHaveProperty('role', newUser.role)
      expect(response.body[0]).toHaveProperty('hasPlayer', newUser.hasPlayer)
    })
  })

  describe('PUT /user', () =>{
    const modifiedUser = {
      name : 'John',
      role : 'guest'
    }

    test('should response with a status 200', async() =>{
      await User.bulkCreate(newUsers)
      const user = await api.get('/user?order=name')
      const response = await api.put(`/user/${user.body[0].id}`).send(modifiedUser)
      expect(response.status).toBe(200)
    })

    test('should modify an user name', async () => {
      await User.bulkCreate(newUsers)
      const user = await api.get('/user?order=name')
      const response = await api.put(`/user/${user.body[0].id}`).send({name : 'John'})
      const newUser = await api.get('/user?order=name')
      expect(response.status).toBe(200)
      const userNames = newUser.body.map(user => user.name)
      expect(userNames).toContain('John')
    })

    test('should modify an user role', async () => {
      await User.bulkCreate(newUsers)
      const user = await api.get('/user?order=name')
      const response = await api.put(`/user/${user.body[0].id}`).send({role : 'admin'})
      const newUser = await api.get('/user?order=name')
      expect(response.status).toBe(200)
      expect(newUser.body[0].role).toEqual('admin')
    })

    test('if a name and role is not specified, send a status code 400', async () => {
      await User.bulkCreate(newUsers)
      const user = await api.get('/user?order=name')
      const response = await api.put(`/user/${user.body[0].id}`).send({})
      expect(response.status).toBe(400)
      expect(response.body.message).toEqual('un nombre de usuario y rol es requerido')
    })
  })

  describe('DELETE /user', () =>{

    test('should response with a status 200 when user is delete', async()=>{
      await User.bulkCreate(newUsers)
      const user = await api.get('/user?order=name')
      await api.delete('/user').send({id : user.body[0].id})
        .expect(200)
    })

    test('should delete a user by Id', async () =>{
      await User.bulkCreate(newUsers)
      const user = await api.get('/user?order=name')
      const userId = user.body[0].id
      await api.delete('/user').send({id : user.body[0].id})
      const response = await api.get('/user?order=name')
      const playerId = response.body.map(p => p.id)
      expect(userId).not.toContain(playerId)
    })

    test('if Id user does not exist, must return a status 400 and a message', async () => {
      await User.bulkCreate(newUsers)
      const response = await api.delete('/user').send()
      expect(response.status).toBe(400)
      // expect(response.body.message).toEqual('the user does not exist')


    })

    test('validate is database is not connected', async()=>{
      try {
        await sequelize.close()
        await User.create({name : 'fff', email : '9dd'})
      } catch (error) {
        console.log(error.message)
        expect(error.message).toBeDefined()
      }

    })
  })

})

afterAll(() => {
  sequelize.close()
})