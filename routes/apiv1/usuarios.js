"use strict";

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


//Autentification of the user (using without token)
//POST /usuarios/authenticate
router.post("/authenticate", function(req, res){
    console.log("Run POST usuarios");
    if (!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('nombre')|| !req.body.hasOwnProperty('clave') ){
        console.log('Missing data');
        res.status(400).json({ok: false, error : res.__('MISSING_DATA')});
        return;
    }
    var emailSearch = req.body.email;
    //var nombreSearch = req.body.nombre;
    var claveSearch = req.body.clave;

    Usuario.findOne({'email':emailSearch}, function(err, data){
        if (err){
            res.status(500).json({'ok':'false', error:err});
            return;
        }
        if(!data){
            res.status(400).json({'ok':'false', error: res.__('USER_NOT_FOUND')});
            return;
        } else{
            checkIfUserCorrect(req, res, claveSearch,  data);
        }
    });


});



//Function used to verification of the user's password
function checkIfUserCorrect(req, res, claveSearch, data){
    var configJWT = require(req.ruta + '/localConfig');
    console.log(claveSearch);
    bcrypt.compare(claveSearch, data.clave, function(err, isMatch) {
        if(err) {
            console.log(err);
            res.json({ok:false, result: err});
            return;
        }
        if (isMatch===true){
            var token = jwt.sign( data, configJWT.jwt.secret, configJWT.jwt.expiresInMinutes);
            console.log('Authentification success ' + data);
            res.status(200).json({ok:true, result: res.__('AUTHENTICATE_SUCCESS'), token : token });
            return;
        } else{
            console.log('Incorrect password' + data);
            res.status(400).json({ok:false, result: res.__('INCORRECT_PASSWORD')});
            return;
        }

    })
}



module.exports  = router;