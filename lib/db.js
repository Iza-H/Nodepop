"use strict";

var mongoose = require('mongoose');
var conn = mongoose.connection;

conn.on('error', function (err){
    console.log(err);
    process.exit(1);
});

conn.once('open', function(){
    console.info('connected to MongoDB');
});

mongoose.connect('mongodb://localhost/nodepop');


module.export = conn;