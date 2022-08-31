const {app} = require('../app')
const request = require('supertest');



describe('CRUD Players', ()=>{

    describe('GET /players', ()=>{
        test('should return a 200 status code', async ()=>{
            console.log('test get')
            const response = await request(app).get('/players').send() //ojo cambiar la ruta en el get
            expect(response.statusCode).toBe(200)
        });

        test('should be an Array', async ()=>{
            const response = await request(app).get('/players').send()
            expect(response.body).toBeInstanceOf(Array)
         });
    })

    describe('POST /players', () => {

        const randomScore = Math.floor(Math.random() * Math.floor(10001)) 
  
        const newPlayer = {
           nickname: "florGesell",
           avatar: "https://drive.google.com/file/d/1V5Duu01gsI0sDWPn4gP4ezY2YtP_Pd7e/view",
           score: randomScore
        }

        test('should return a status code 200', async ()=>{
            const response = await request(app).post('/players').send() // ojo cambiar la ruta en el post
            expect(response.statusCode).toBe(200)
        });
        
        test('hould have a content-type - application/json', async ()=>{
            const response = await request(app).post('/players').send() // ojo cambiar la ruta en el post
            expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
        });

        test('hould have an ID in the model', async ()=>{
            const response = await request(app).post('/players').send(newPlayer) // CUANDO LE PASO UN OBJETO SI LO CREA
            
            expect(response.body.id).toBeDefined();
        });

        test('hould have a NAME in the model', async ()=>{
            const response = await request(app).post('/players').send() // ojo cambiar la ruta en el post
            expect(response.body.nickname).toBeDefined();
        });

        test('ID must be an integer', async ()=>{
            const response = await request(app).post('/players').send() // ojo cambiar la ruta en el post
            expect(typeof response.body.id).toBe('number');
        });
        
        test('NAME must be a string', async ()=>{
            const response = await request(app).post('/players').send({test : 'players name'}) // ojo cambiar la ruta en el post
            expect(typeof response.body.nickname).toBe('string');
        });
    
        // should have path /players
        test('must have path /players', async () => {
            const response = await request(app).post('/players').send() 
            console.log(response.text);
            console.log(response.req.socket.event);   
        })
    })

    
    
    // PUT /players, should modify the name
    // PUT /players, should modify the avatar
    // PUT /players, should modify the score

    // DELETE /players, should delete a player

})