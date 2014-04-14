/**
 * Peento Application
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
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
var errorhandler = require('./middleware/errorhandler');


module.exports = function (config) {
  return new PeentoApplication(config);
};


function PeentoApplication (config) {

  // init global namespace
  var ns = this.ns = createNamespace();
  ns('config', config);

  // init express
  var app = this.express = express();
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
  app.use(errorhandler());

  this._loadRouters();

}

PeentoApplication.prototype._loadRouters = function () {
  var app = this.express;
  var ns = this.ns;
  var DIR = path.resolve(__dirname, 'router');
  rd.eachFileFilterSync(DIR, /\.js$/, function (f, s) {
    var router = express.Router();
    require(f)(ns, router);
    app.use(router);
  });
};

PeentoApplication.prototype.listen = function (port) {
  this.express.listen(port);
};

PeentoApplication.prototype.start = function () {
  this.listen(this.ns('config.port'));
};
