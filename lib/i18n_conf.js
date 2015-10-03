"use strict";

var i18n = require('i18n');


i18n.configure({
    locales: [ 'en', 'es'],
    //defaultLocale: 'es',
    directory: __dirname.replace('lib', '') + '/locales'

});

module.exports = i18n;