"use strict";


var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

router.get('/', function (req, res, next){
    console.log("Run get tags");
    Anuncio.find().distinct('tags', function (error, tags){
        if(error) {
            res.json({ok:false, error: error})
        } else{
            console.log(tags);
            res.json({ok:true, tags: tags})
        }


    })


});

module.exports  = router;