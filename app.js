var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next){
    var userAgent = req.get('User-Agent');
    console.log(userAgent);
    req.esAndroid = userAgent.match(/Android/i);
    req.esiOS = false;

    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)){
       req.esiOS = true;
    }
    req.language = req.get('Accept-Language').match(/es/i) ? 'es' : 'en'; //en como idioma por defecto
    next();

});


require('./lib/db');
require('./models/Anuncio.js');
require('./models/Usuario.js');
require('./models/PushToken.js');

app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));
app.use('/apiv1/tags', require('./routes/apiv1/tags'));
app.use('/apiv1/usuarios', require('./routes/apiv1/usuarios'));
app.use('/', routes);
app.use('/users', users);

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
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
