"use strict";




var mongoose = require('mongoose');
var PushToken = mongoose.model('PushToken');
var jwt = require('jsonwebtoken');



module.exports = function() {

    return function(req, res, next) {
        var configJWT = require(req.ruta + '/localConfig');

        console.log('Run - Token verification');
        //console.log(req);
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token){
            jwt.verify(token, configJWT.jwt.secret, function(err, decoded){
                if (err){
                    console.log(err);
                    res.status(401).json({'ok':'false', error: res.__('AUTHENTICATE_ERROR')});
                    return;
                }
                else{
                    console.log(decoded);
                    req.isOS=true;
                    if(req.isAndroid || res.isiOS){
                        var platforma;

                        if (req.isAndroid){
                            platforma="android";
                        } else{
                            platforma="ios";
                        }
                        var pushToken = new PushToken ({
                            usuarioEmail: decoded.email,
                            platforma: platforma,
                            token: token});

                        pushToken.save(function(err, data){
                            if (err){
                                console.log(err);
                                next();
                            }else {
                                console.log('Token guardado' + data);
                                next();
                            }
                        });


                    }else{
                        next();
                    }
                }
            });
        }else{
            console.log('Token missing');
            res.status(403).json({'ok':'false', error: res.__('TOKEN_MANDATORY')});
            return;
        }




}};

