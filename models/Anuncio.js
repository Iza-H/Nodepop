/**
 * Created by izabela on 28/09/15.
 */
"use strict";

var mongoose = require('mongoose');



var anuncioSchema = mongoose.Schema({
    nombre : {type: String, required: true},
    venta : {type : Boolean, required: true},
    precio :{type: Number,required:true, min:0},
    foto : String,
    tags : {type: [ String ],  validate: [isCorrectValue, 'ErrorTag']}
});


//Validation of tags:
function isCorrectValue (table){
    var isCorrect = true;
    var defaultTags = ['mobile', 'lifestyle', 'motor', 'work'];
    table.forEach( function (value, index){
        //incorrect tag:
        if (defaultTags.indexOf(value)===-1){
            console.log(false);
            isCorrect = false;
        }
    });
    return isCorrect;

}



var Anuncio = mongoose.model('Anuncio', anuncioSchema);



module.exports = Anuncio;

