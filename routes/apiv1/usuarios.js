"use strict";

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var bcrypt = require('bcrypt');


router.post("/authenticate", function(req, res){
    console.log("Run POST usuarios");
    if (!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('nombre')|| !req.body.hasOwnProperty('clave') ){
        res.json({ok: false, error : 'Missing data'});
    }
    var emailSearch = req.body.email;
    var nombreSearch = req.body.nombre;
    var claveSearch = req.body.clave;

    Usuario.findOne({'email':emailSearch}, function(err, data){
        if (err){
            res.json({'ok':'false', error:err});
            return;
        }
        if(!data){
            res.json({'ok':'false', error:'USER not found'});
            return;
        } else{
            checkIfUserCorrect(res, claveSearch, emailSearch, nombreSearch, data);
        }
    });


});



router.post("/nuevo", function (req, res){
    if (!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('nombre')|| !req.body.hasOwnProperty('clave') ){
        res.json({ok: false, error : 'Missing data'});
    }
    Usuario.findOne({email:req.body.email}, function(err, data){
        if (err){
            res.json({'ok':'false', error:err});
            return;
        }
        if(data){
            res.json({ok:'false', error:'Email exists'});
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
            res.json({ok:false, error: err});
        }
        bcrypt.hash(clave, salt, function(err, hash) {
            if (err){
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
            res.json({ok:false, error: err});
            return;
        }
        res.json({ok:true, result: 'User saved'});
    });
}

function checkIfUserCorrect(res, claveSearch, emailSearch, nombreSearch, data){
    console.log(claveSearch);
    bcrypt.compare(claveSearch, data.clave, function(err, isMatch) {
        if(err) {
            res.json({ok:false, result: err});
            return;
        }

        if (isMatch===true){
            res.json({ok:true, result: 'Authenticate success'});
            return;
        }else{
            res.json({ok:false, result: 'Incorrect password'});
        }

    })
}


/*Bcrypt.compare(pass, hash, function(err, isMatch) {
    if(err) {
        return console.error(err);
    }

    console.log('do they match?', isMatch);
});*/




module.exports  = router;