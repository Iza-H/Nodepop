/**
 * Created by izabela on 23/06/16.
 */
var expect = require('chai').expect;
supertest = require('supertest');
request = supertest('http://localhost:3000');

describe('User API', function(){

    it('should return error when post is done without a token', function(done){
       request.post('/apiv1/usuarios/nuevo')
           .send({
            nombre: 'Nombre',
            clave: 'claveSecreta',
            email: 'emailTest@test.es'
           })
           .end(function(err, res){
               expect(res.status).to.equal(403);
               expect(res.body.ok).to.equal("false");
               expect(res.body.error).to.equal("Token is mandatory");
               done();
           });

    });

});