var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var i18n = require('./lib/i18n_conf');
var jwt = require('jsonwebtoken');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Take configuration:
app.use(function(req, res, next) {
    // default: using 'accept-language' header to guess language settings
    i18n.init(req, res);
    req.ruta = __dirname;
    var userAgent = req.get('User-Agent');
    console.log(userAgent);
    req.isAndroid = userAgent.match(/Android/i);
    req.isiOS = false;
    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/Apple/i)){
        req.isiOS = true;
    }

    next();

});

//Conncetion to the DB:
require('./lib/db');

//User authentification (without token):
require('./models/Usuario.js');
app.use('/apiv1/usuarios', require('./routes/apiv1/usuarios'));

//Authentification:
require('./models/PushToken.js');
var jwtAuth = require(__dirname  + '/lib/tokenAuth');
app.use(jwtAuth());


//Other User operetions allowed to use after the successed autentification:
app.use('/apiv1/usuarios', require('./routes/apiv1/usuariosAuth'));



require('./models/Anuncio.js');
require('./models/PushToken.js');

//Tags part:
//app.use('/apiv1/tags', require('./routes/apiv1/tags'));

//Anuncios part:
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));


//ERRORS:

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
      res.json({ok:false, error: err});
      return;
    /*res.render('error', {
      message: err.message,
      error: err
    });*/
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
    res.json({ok:false, error: err});
  /*res.render('error', {
    message: err.message,
    error: {}
  });*/
});


module.exports = app;
