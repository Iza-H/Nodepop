"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

router.get('/', function (req, res, next){

    console.log("Run GET anuncios");
    var parametros = req.query;


    console.log(JSON.stringify(parametros));
    var query = Anuncio.find();

    //nombre:
    if (parametros.hasOwnProperty("nombre")){
        query.where('nombre').equals(new RegExp('^'+parametros.nombre, "i"));
    }

    //venta:
    if (parametros.hasOwnProperty("venta")){
        if (parametros.venta!=='true' && parametros.venta!=='false'){
            return res.json({ok: false, error : 'Incorrect format of the venta paramter'});
        }else{
            query.where('venta').equals(parametros.venta);
        }
    }

    //tags
    if (parametros.hasOwnProperty("tag")){
        var tags = parametros.tag.split(",");
        query.where('tags').all(tags);
    }

    //id
    if (parametros.hasOwnProperty("id")){
        query.where('_id').equals(parametros.id);
    }

    //foto:
    if (parametros.hasOwnProperty("foto")){
        query.where('foto').equals(new RegExp('^'+parametros.foto, "i"));
    }

    //precio
    if (parametros.hasOwnProperty("precio")){
        var precio = parametros.precio;
        if (precio.match("^[0-9]+-[0-9]+$")){
            var numbers = precio.split("-");
            query.where('precio').gt(numbers[0]).lt(numbers[1]);
        }
        else if (precio.match("^[0-9]+-{1}$")){
            query.where('precio').gt(precio.replace("-",""));
        }else if (precio.match("^\-{1}[0-9]+$")){
            query.where('precio').lt(precio.replace("-",""));
        }else if(!precio.match("^[0-9]+$")){ //algo differente que el numero
            return res.json({ok: false, error : 'Incorrect format of the price paramter'});
        } else{
            query.where('precio').equals(precio);
        }

    }


    //limit
    if (parametros.hasOwnProperty("limit")){
        if (isNaN(parametros.limit) || parametros.limit<=0 || (parametros.limit % 1)!==0){
            return res.json({ok: false, error : 'Incorrect format of the limit paramter'});
        } else{
            query.limit(parametros.limit);
        }
    } else{
        query.limit(1000);
    }

    if (parametros.hasOwnProperty("start")){
        if (isNaN(parametros.start) || parametros.start<0 || (parametros.start % 1)!==0){
            return res.json({ok: false, error : 'Incorrect format of the start paramter'});
        } else{
            query.skip(parametros.start);
        }
    }else {
        query.skip(0);
    }

    //sort
    var sort = parametros.sort || '_id';
    query.sort(sort);

    query.exec(function (err, data){
        console.log(data);
        res.send(data);
        });
    /*console.log(JSON.stringify(parametros));
    Anuncio.find({'precio' : {$gt: 20 } }, function (err, data){
       console.log(data);
        res.send(data);
    });*/

});


router.post('/',function(req, res, next) {
    console.log("Run POST anuncios");

    var nuevoAnuncio = req.body;
    var anuncio = new Anuncio(nuevoAnuncio);

    anuncio.save( function(err, creado) {
        if (err) {
            console.log(err);
            return res.json({ok:false, error: err});
        }

        // devolvemos el resultado
        res.json({ok:true, anuncio: creado});

    });

});



module.exports = router;