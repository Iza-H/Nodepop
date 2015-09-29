/**
 * Created by izabela on 28/09/15.
 */
"use strict";

var mongoose = require('mongoose');

var anuncioSchema = mongoose.Schema({
    nombre : String,
    venta : Boolean,
    precio : Number,
    foto : String,
    tags : [ String ]
});


var Anuncio = mongoose.model('Anuncio', anuncioSchema);

/*anuncioSchema.status.list = function(criterios, callback){
    var query = Anuncio.find(criterios);
    query.exec(function (err, rows){
       if (err){
           return callback(err);
       } else{
           return callback(null, rows);
       }
    });



}*/

module.exports = Anuncio;