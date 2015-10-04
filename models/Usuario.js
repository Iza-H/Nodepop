

var mongoose = require ('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var usuarioSchema = mongoose.Schema ({
    nombre : {type: String, required: true},
    email : {type: String, required: true, unique:true, index: true},
    clave : {type: String, required: true}
});



//Cretion of the user's password:
//Return a password in a hash form:
usuarioSchema.methods.createPassForUser = function createPassForUser (cb) {
    var pass =  this.clave;
    bcrypt.genSalt(10, function(err, salt) {
        if (err){
            console.log('Error');
            cb(err);
            return;
        } else {
            bcrypt.hash(pass, salt, function (err, hash) {
                if (err) {
                    console.log('error ' + err);
                    cb(err);
                    return;
                }
                return cb(null,hash);
            });
        }
    });

};


//Function used to verification of the user's password
usuarioSchema.methods.checkIfPassCorrect = function(claveSearch, cb){
    var claveDB = this.clave;
    var data = this;
    var configJWT = require( '../localConfig');
    bcrypt.compare(claveSearch, claveDB, function(err, isMatch) {
        if(err) {
            console.log(err);
            cb(err);
            return;
        }
        if (isMatch===true){
            var token = jwt.sign( data, configJWT.jwt.secret, configJWT.jwt.expiresInMinutes);
            console.log('Authentification success ' + data);
            cb(null, {success: 'AUTHENTICATE_SUCCESS', token:token});
            //res.status(200).json({ok:true, result: res.__('AUTHENTICATE_SUCCESS'), token : token });
            return;
        } else{
            console.log('Incorrect password' + data);
            cb({errorMessage:'INCORRECT_PASSWORD'});
            //res.status(400).json({ok:false, result: res.__('INCORRECT_PASSWORD')});
            return;
        }

    })
}




var Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;