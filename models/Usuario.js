"use strict";

var mongoose = require ('mongoose');

var usuarioSchema = mongoose.Schema ({
    nombre : {type: String, required: true},
    email : {type: String, required: true, unique:true},
    clave : {type: String, required: true}
});

var Usuario = mongoose.model('Usuario', usuarioSchema);


module.exports = Usuario;