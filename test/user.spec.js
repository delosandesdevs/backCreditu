const {app} = require('../app') 
const request = require('supertest')  

describe('CRUD /user',  ()=>{
    describe('GET /user', ()=>{
                
        test('should respond with a 200 status code', async()=>{
            const response = await request(app).get('/user').send()
            expect(response.statusCode).toBe(200)
        })

        test('should return an array', async()=>{
            const response = await request(app).get('/user').send()
            expect(response.body).toBeInstanceOf(Array)
        })

        test('the model must have a prop called Name and Email', async()=>{
            const response = await request(app).post('/user').send({name : 'd', email : 'aaa@aa.co'})
            expect(response.body.name).toBeDefined()
            expect(response.body.email).toBeDefined()    
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
            const response = await request(app).post('/user').send(newUser)
            expect(response.statusCode).toBe(200)
            
        })
    })

})