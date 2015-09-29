"use strict";

var mongoose = require ('mongoose');

var usuarioSchema = mongoose.Schema ({
    nombre : String,
    email : String,
    clave : String
});