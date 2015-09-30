"use strict";


var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

router.get('/', function (req, res, next){
    console.log("Run GET tags");

    //Buscamos elemntos de tags en los anuncios
    // Sacamos solo los valores distinct:

    Anuncio.find().distinct('tags', function (error, tags){
        if(error) {
            res.json({ok:false, error: error})
        } else {
            console.log(tags);
            res.json({ok:true, tags: tags})
        }


    });


});

module.exports  = router;