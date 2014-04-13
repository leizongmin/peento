/**
 * Launch App
 */

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var morgan = require('morgan');
var serveStatic = require('serve-static');
var timeout = require('connect-timeout');
var csurf = require('csurf');
var rd = require('rd');
var createNamespace = require('lei-ns').Namespace;
var errorhandler = require('./lib/middleware/errorhandler');
var config = require('./config');
var db = require('./lib/db');


var ns = createNamespace();

// init express
var app = express();
app.use(morgan());
app.use(bodyParser());
app.use(express.query());
app.use(cookieParser('optional secret string'));
app.use(session({
  keys: ['optional secret string']
}));
app.use('/assets', serveStatic('./assets'));
app.use(csurf());
app.use(timeout(30000));
//app.use(app.router);
app.use(errorhandler());


// init routers
var ROUTER_DIR = path.resolve(__dirname + '/lib/router');
rd.eachFileFilterSync(ROUTER_DIR, /\.js$/, function (f, s) {
  var router = express.Router();
  require(f)(ns, router);
  app.use(router);
});


app.listen(config.port);

