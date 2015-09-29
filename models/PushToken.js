"use strict";

var mongoose = require ('mongoose');

var pushTokenSchema = mongoose.Schema({
    platforma : {type: String, enum: ['ios', 'android']},
    token : String,
    usuario : String
});