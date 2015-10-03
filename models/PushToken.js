"use strict";

var mongoose = require ('mongoose');

var pushTokenSchema = mongoose.Schema({
    platforma : {type: String, enum: ['ios', 'android'], required:true},
    token : {type: String, required:true},
    usuarioEmail : {type: String, required:true}
});

var PushToken = mongoose.model('PushToken', pushTokenSchema);


module.exports = PushToken;