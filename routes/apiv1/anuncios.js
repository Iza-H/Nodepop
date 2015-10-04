"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');



//Send picture
//GET apiv1/foto/
router.get('/foto/:picture', function(req, res, next){
    var picture = req.params.picture;
    var ruta;
    if (picture.indexOf(".")>0){
        ruta = req.ruta + '/public/images/' + picture;
    }else{
        ruta = req.ruta + '/public/images/' + picture + ".jpg"; //default .jpg;
    }

    res.sendFile(ruta, function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).json({ok: false, error : err});
            return;

        } else {
            console.log(res.__('FILE_SENT') + data);
            return;
        }
    });

});


//Search of articles
//GET apiv1/articulos
router.get('/', function (req, res){

    console.log("Run GET anuncios");
    var parametros = req.query;


    var query = Anuncio.find();

    //nombre:
    if (parametros.hasOwnProperty("nombre")){
        query.where('nombre').equals(new RegExp('^'+parametros.nombre, "i"));
    }

    //venta:
    if (parametros.hasOwnProperty("venta")){
        if (parametros.venta!=='true' && parametros.venta!=='false'){
            res.status(400).json({ok: false, error : res.__('VENTA_FORMAT_ERROR') });
            return;
        }else{
            query.where('venta').equals(parametros.venta);
        }
    }

    //tag
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
            res.status(400).json({ok: false, error : res.__('PRECIO_FORMAT_ERROR')});
            return;
        } else{
            query.where('precio').equals(precio);
        }
    }

    //limit
    if (parametros.hasOwnProperty("limit")){
        if (isNaN(parametros.limit) || parametros.limit<0 || (parametros.limit % 1)!==0){
            res.status(400).json({ok: false, error : res.__('LIMIT_FORMAT_ERROR')});
            return;
        } else{
            query.limit(parametros.limit);
        }
    } else{
        query.limit(1000);
    }

    //start
    if (parametros.hasOwnProperty("start")){
        if (isNaN(parametros.start) || parametros.start<0 || (parametros.start % 1)!==0){
            res.status(400).json({ok: false, error : res.__('START_FORMAT_ERROR')});
            return;
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
        if (err){
            console.log(err);
            res.staus(500).json({ok:false, error: err});
            return;
        }else{
            console.log(data);
            //count result:
            if (parametros.hasOwnProperty("includeTotal")){
                Anuncio.count(query._conditions, function(err, count) {
                    if (err){
                        console.log(err);
                        res.status(500).send({ok:false, err: err});

                        return;
                    }
                    console.log(count);
                    res.status(200).send({ok:true, result: data, total:count});

                    return;
                });
            }else{
                res.status(200).send({ok:true, result: data});
                return;
            }


        }
    });


});

//Search of all tags that are in the DB
//Return only distinct values
//GET apiv1/anuncios/tags
router.get('/tags', function (req, res, next){
    console.log("Run GET tags");


    Anuncio.find().distinct('tags', function (error, tags){
        if(error) {
            console.log(err);
            res.json({ok:false, error: error})
            return;
        } else {
            console.log(tags);
            res.json({ok:true, tags: tags})
            return;
        }


    });
});


//Creation of new articules:
//POST apiv1/anuncios
router.post('/',function(req, res) {
    console.log("Run POST anuncios");

    var nuevoAnuncio = req.body;;
    var anuncio = new Anuncio(nuevoAnuncio);

    anuncio.save( function(err, creado) {
        if (err) {
            console.log(err);
            res.status(400).json({ok:false, error: res.__('VALIDATION_ERROR')});
            return;
        }

        // devolvemos el resultado
        res.status(200).json({ok:true, anuncio: creado});
        return;

    });

});



module.exports = router;