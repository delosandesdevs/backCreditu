const {app} = require('../app') 
const supertest = require('supertest')  
const { sequelize } = require('../db/db')
const api = supertest(app)


beforeEach(async() => {
    await sequelize.sync({ force: true })
})

describe('CRUD /user',  ()=>{
    describe('GET /user', ()=>{
                
        test('should respond with a 200 status code', async()=>{
            const response = await api.get('/user/name').send()
            expect(response.statusCode).toBe(200)
        })

        test('should return an array', async()=>{
            const response = await api.get('/user/name').send()
            expect(response.body).toBeInstanceOf(Array)
        })

        test('the model must have a prop called Name and Email', async()=>{
            const response = await api.post('/user').send({name : 'd', email : 'aaa@aa.co'})
            expect(response.body[0].name).toBeDefined()
            expect(response.body[0].email).toBeDefined()    
        })
    })
    describe('POST /user', () =>{

        const newUser = {
            name : 'ramiro',
            email : 'ramiro@gmail.com',
            hasPlayer : false,
            role : 'admin'
        }


        test('should return a status 200 with corect post', async()=>{
            const response = await api.post('/user').send(newUser)
            expect(response.statusCode).toBe(200)
            
        })
    })

})

afterAll(() => {
    sequelize.close()
})