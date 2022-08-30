const Test = require('../models/modelTest')

module.exports = {
    test : async ()=> {
        const prueba = await Test.findAll()
        return prueba
    },
    test2 : async (data)=> {
        const prueba1 = await Test.create({test : data})
        
        return prueba1
    }
}