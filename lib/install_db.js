'use strict';

require('./db');
var mongoose = require('mongoose');
var readLine = require('readline');
var async = require('async');
require('../models/Usuario.js');
require('../models/Anuncio.js');
var fs = require('fs');


mongoose.connection.once('open', function() {

    var rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Are you sure you want to empty DB? (yes/no) ', function(answer) {
        rl.close();
        if (answer.toLowerCase() === 'yes') {
            runInstallScript();
        } else {
            console.log('DB install aborted!');
            return process.exit(0);
        }
    });

});

function runInstallScript() {

    async.series([
        initAnuncios,
        initUsuarios
    ],function (err, results) {
        if (err) {
        console.error('Hubo un error: ', err);
        return process.exit(1);
    }
            console.log('Finish with success');
    return process.exit(0);
}
);

}

function initAnuncios(cb) {
    var Anuncio = mongoose.model('Anuncio');

    //Clean Anucnio collcetion
    Anuncio.remove({}, function(err, data) {
        if (err){
            console.log(err);
            cb(err);
            return;
        }else{
            fs.readFile(__dirname.replace("lib", "") + '/db_data/anuncios.json', {encoding: 'utf8'}, function(err, result){
                if (err){
                    console.log(err);
                    cb(err);
                    return;
                }else{
                    console.log('Save anuncios');
                    var anuncios = JSON.parse(result);
                    anuncios.articulos.forEach(function (entry, index){
                       var anuncio = new Anuncio (entry);
                        anuncio.save(function (err, data){
                            if (err){
                                cb(err);
                                return;
                            }else{
                                console.log('Anuncio nr ' + index + ' saved');

                            }
                        })

                    });
                    cb(null, 'success');
                    return;



                }


            })

        }



    });

}

function initUsuarios(cb) {
    var Usuario = mongoose.model('Usuario');

    // elimino todos
    Usuario.remove({}, function (err, data) {
        if (err){
            console.log(err);
            cb(err);
            return;

        }else{
            fs.readFile(__dirname.replace("lib", "") +'/db_data/usuario.json', {encoding: 'utf8'}, function(err, result){
                if (err){
                    console.log(err);
                    cb(err);
                    return;
                }else{
                    console.log(result);
                    var user = JSON.parse(result);
                    var usuario = new Usuario({nombre: user.nombre, clave: user.clave, email: user.email});
                    //create passowrd and save a user:
                    usuario.createPassForUser(function (err, data){
                        if (err){
                            cb(err);
                            return;
                        }else{

                            cb(null, 'success');
                        }
                    });

                }


            })

        }


    });
}


