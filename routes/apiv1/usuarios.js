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
    var email = req.body.email;
    var nombre = req.body.nombre;
    var clave = req.body.clave;

    Usuario.findOne({'nombre':nombre, 'email':email, 'clave':clave}, function(err, data){
        if (err){
            res.json({'ok':'false', error:err});
            return;
        }
        if(!data){
            res.json({'ok':'false', error:'USER not found'});
            return;
        } else{

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

        createPassForUser(req, res);



    });



});

var createPassForUser = function (req, res){
    bcrypt.genSalt(10, function(err, salt) {
        if (err){
            res.json( {ok:false, error: err});
        }
        bcrypt.hash(req.body.clave, salt, function(err, hash) {
            if (err){
                return {ok:false, error: err};
            }
            var usuario = new Usuario({nombre: req.body.nombre, email: req.body.email, clave: hash});
            saveUser(usuario,res);

        });
    });
}

var saveUser = function(user){
    user.save(function(err, saved){
        if (err){
            console.log(err);
            return {ok:false, error: err};
        }
        return {ok:true, result: 'User saved'};
    });
}


/*Bcrypt.compare(pass, hash, function(err, isMatch) {
    if(err) {
        return console.error(err);
    }

    console.log('do they match?', isMatch);
});*/




module.exports  = router;