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
    var nombreSearch = req.body.nombre;
    var claveSearch = req.body.clave;
    console.log(req.body.clave);
    Usuario.findOne({'email':emailSearch, 'nombre':nombreSearch}, function(err, data){
        if (err){
            res.status(500).json({'ok':'false', error:err});
            return;
        }
        if(!data){
            res.status(400).json({'ok':'false', error: res.__('USER_NOT_FOUND')});
            return;
        } else{
            checkUser(req, res, claveSearch, data);
        }
    });


});



//Function used to verification of the user's password
//and assign token
function checkUser(req, res, claveSearch, data){
    data.checkIfPassCorrect(claveSearch, function (err, result){
        if (err){
            if(err.errorMessage){
                res.status(400).json({'ok':'false', error: res.__(err.errorMessage)});
                return;
            }else{
                res.status(500).json({'ok':'false', error:err});
                return;
            }

        }
        else{
            //succes:
            res.status(200).json({'ok':'true', result: res.__(result.success), token :result.token});
            return;
        }

    }
    );

}



module.exports  = router;