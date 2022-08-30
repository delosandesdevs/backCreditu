const {app} = require('../app')
const request = require('supertest');



describe('CRUD Players', ()=>{

    test('GET /players, should return a 200 status code', async ()=>{
    const response = await request(app).get('/players').send() //ojo cambiar la ruta en el get
    expect(response.statusCode).toBe(200)
    });

    test('GET /players, should be an Array', async ()=>{
    const response = await request(app).get('/players').send()
    expect(response.body).toBeInstanceOf(Array)
    });

    test('POST /players, should return a status code 200', async ()=>{
    const response = await request(app).post('/players').send() // ojo cambiar la ruta en el post
    expect(response.statusCode).toBe(200)
    });
    
    test('POST /players should have a content-type - application/json', async ()=>{
    const response = await request(app).post('/players').send() // ojo cambiar la ruta en el post
    expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
    });

    test('POST /players should have an ID in the model', async ()=>{
    const response = await request(app).post('/players').send() // ojo cambiar la ruta en el post
    expect(response.body.id).toBeDefined();
    });

    test('POST /players should have a NAME in the model', async ()=>{
    const response = await request(app).post('/players').send() // ojo cambiar la ruta en el post
    expect(response.body).toBeDefined();
    });

    test('POST /players, ID must be an integer', async ()=>{
    const response = await request(app).post('/players').send() // ojo cambiar la ruta en el post
    expect(typeof response.body.id).toBe('number');
    });
    
    test('POST /players, NAME must be a string', async ()=>{
    const response = await request(app).post('/players').send({test : 'players name'}) // ojo cambiar la ruta en el post
    expect(typeof response.body.test).toBe('string');
    });
   
    // POST /players, should have path /players
    test('POST /players, must have path /players', async () => {
    const response = await request(app).post('/players').send() 
    console.log(response.text);
    console.log(response.req.socket.event);   
    })
    
    // PUT /players, should modify the name
    // PUT /players, should modify the avatar
    // PUT /players, should modify the score

    // DELETE /players, should delete a player

})