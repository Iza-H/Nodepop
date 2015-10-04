

var mongoose = require ('mongoose');
var bcrypt = require('bcrypt');

var usuarioSchema = mongoose.Schema ({
    nombre : {type: String, required: true},
    email : {type: String, required: true, unique:true},
    clave : {type: String, required: true}
});




usuarioSchema.methods.createPassForUser = function createPassForUser (cb) {
    var pass =  this.clave;
    var name = this.nombre;
    var email = this.email;
    bcrypt.genSalt(10, function(err, salt) {
        if (err){

            console.log('Error');
            cb(err);
            //res.json({ok:false, error: err});
            return;
        } else {
            bcrypt.hash(pass, salt, function (err, hash) {
                if (err) {
                    console.log('error ' + err);
                    //res.json ({ok:false, error: err});
                    cb(err);
                    return;
                }

                var usuario = new Usuario({nombre: name, email: email, clave: hash});
                saveUser(usuario, function (err, data){
                    if (err){
                        return cb(err);
                    }else{
                        return cb(null,data );
                    }
                });

            });
        }
    });

};

function saveUser(user, cb){
    user.save(function(err, saved){
        if (err){
            console.log(err);
            //res.status(500).json({ok:false, error: err});
            cb(err);
            return;
        }
        console.log('User saved ' +  saved.email);
        cb(null,'USER_SAVED' );
        //res.status(200).json({ok:true, result: res.__('USER_SAVED'), userEmail: saved.email});
        return;
    });
}



var Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;