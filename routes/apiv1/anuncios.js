"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

router.get('/', function (req, res, next){

    Anuncio.find({}, function (err, data){
       console.log(data);
        res.send(data);
    });

});


router.post('/',function(req, res, next) {

    var nuevoAnuncio = req.body;


    var anuncio = new Anuncio(nuevoAnuncio);

    anuncio.save( function(err, creado) {
        if (err) {
            console.log(err);
            return res.json({ok:false, error: err});
        }

        // devolver una confirmación
        res.json({ok:true, anuncio: creado});

    });

});



module.exports = router;