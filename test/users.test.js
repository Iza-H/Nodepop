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

    it ('should return error when data (email) is missing during the authentication a user', function(done){
        request.post('/apiv1/usuarios/authenticate')
            .send(
            {
                nombre: 'Nombre',
                clave: 'claveSecreta'
            }
        )
        .end(function(err, res){
                expect(res.status).to.equal(400)
                expect(res.body.ok).to.equal(false)
                expect(res.body.error).to.equal("Missing data");
                done();

        })
    })

    it ('should return error when data (nombre) is missing during the authentication a user', function(done){
        request.post('/apiv1/usuarios/authenticate')
            .send(
            {
                clave: 'claveSecreta',
                email : 'some@email.ee'
            }
        )
            .end(function(err, res){
                expect(res.status).to.equal(400)
                expect(res.body.ok).to.equal(false)
                expect(res.body.error).to.equal("Missing data");
                done();

            })
    })

    it ('should return error when data (clave) is missing during the authentication a user', function(done){
        request.post('/apiv1/usuarios/authenticate')
            .send(
            {
                nombre: 'Nombre',
                email : 'some@email.ee'
            }
        )
            .end(function(err, res){
                expect(res.status).to.equal(400)
                expect(res.body.ok).to.equal(false)
                expect(res.body.error).to.equal("Missing data");
                done();

            })
    })

    it ('should return error when user is unknown during the authentication a user', function(done){
        request.post('/apiv1/usuarios/authenticate')
            .send(
            {
                nombre: 'UnknownUser',
                email : 'some@email.ee',
                clave: 'SomeTestPassw'
            }
        )
            .end(function(err, res){
                expect(res.status).to.equal(400)
                expect(res.body.ok).to.equal("false")
                expect(res.body.error).to.equal("User not found");
                done();

            })
    })

    it ('should return success message when the authentification is correct', function(done){
        request.post('/apiv1/usuarios/authenticate')
            .send({
                "nombre": "Test",
                "clave": "claveSecreta",
                "email": "email@test.es"
            })
            .end(function(err, res){
                expect(res.status).to.equal(200)
                expect(res.body.ok).to.equal("true")
                expect(res.body).to.have.a.property('token')
                expect(res.body.result).to.equal("Correct authentication")
                done();

            })
    })

});