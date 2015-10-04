"use strict";

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');




/* Contains all functions of the part 'usuarios' which need an authentification of user */


//Create a new user
//POST apiv1/usuarios/nuevo
router.post("/nuevo", function (req, res){
    if (!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('nombre')|| !req.body.hasOwnProperty('clave') ){
        res.status(400).json({ok: false, error : res.__('MISSING_DATA')});
        return;
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

        var newUser= new Usuario({nombre: req.body.nombre, clave: req.body.clave, email: req.body.email});
        newUser.createPassForUser(function (err, result){
            if (err){
                res.status(500).json({ok:false, error: err});
                return;
            }else{
                newUser.clave = result;
                saveUser(res, newUser);
            }
        })

    });



});



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