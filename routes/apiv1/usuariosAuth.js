"use strict";

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var bcrypt = require('bcrypt');
var i18n = require('i18n');
var jwt = require('jsonwebtoken');



/* Contains all functions of the part 'usuarios' which need an authentification of user */


//Create a new user
//POST apiv1/usuarios/nuevo
router.post("/nuevo", function (req, res){
    if (!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('nombre')|| !req.body.hasOwnProperty('clave') ){
        res.status(400).json({ok: false, error : res.__('MISSING_DATA')});
    }
    Usuario.findOne({email:req.body.email}, function(err, data){
        if (err){
            res.status(500).json({'ok':'false', error:err});
            return;
        }
        if(data){
            res.status(400).json({ok:'false', error: res.__('EMAIL_EXISTS')});
            return;
        }
        var clave = req.body.clave;
        var nombre = req.body.nombre;
        var email = req.body.email;
        createPassForUser(res, clave, nombre, email);

    });



});


function createPassForUser(res, clave, nombre, email){
    bcrypt.genSalt(10, function(err, salt) {
        if (err){
            console.log(err);
            res.json({ok:false, error: err});
            return;
        }
        bcrypt.hash(clave, salt, function(err, hash) {
            if (err){
                console.log(err);
                res.json ({ok:false, error: err});
                return;
            }
            var usuario = new Usuario({nombre: nombre, email: email, clave: hash});
            saveUser(res, usuario);

        });
    });
};


function saveUser(res,user){
    user.save(function(err, saved){
        if (err){
            console.log(err);
            res.status(500).json({ok:false, error: err});
            return;
        }
        console.log('User saved ' +  saved.email);
        res.status(200).json({ok:true, result: res.__('USER_SAVED'), userEmail: saved.email});
        return;
    });
}






module.exports  = router;