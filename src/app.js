/**
 * Peento Application
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var fs = require('fs');
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
var utils = require('./lib/utils');
var debug = require('./lib/debug')('app');


module.exports = function (config) {
  return new PeentoApplication(config);
};


function PeentoApplication (config) {
  debug('new');

  // init global namespace
  var ns = this.ns = createNamespace();
  ns('config', config);
  ns('utils', utils);

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
  this._loadHooks();
}

PeentoApplication.prototype._loadRouters = function () {
  debug('_loadRouters');
  var app = this.express;
  var ns = this.ns;
  var DIR = path.resolve(__dirname, 'router');
  rd.eachFileFilterSync(DIR, /\.js$/, function (f, s) {
    debug(' - %s', f);
    var router = express.Router();
    require(f)(ns, router);
    app.use(router);
  });
};

PeentoApplication.prototype._loadHooks = function () {
  debug('_loadHooks');
  var me = this;
  var ns = this.ns;
  var DIR = path.resolve(__dirname, 'hook');
  rd.eachFileFilterSync(DIR, /\.js$/, function (f, s) {
    debug(' - %s', f);
    var n = utils.filenameToNamespace(DIR, f);
    var m = require(f);
    me._registerHook(n, m);
  });
};

PeentoApplication.prototype.listen = function (port) {
  debug('listen %s', port);
  this.express.listen(port);
};

PeentoApplication.prototype.start = function () {
  debug('start');
  this._initHooks();
  this.listen(this.ns('config.port'));
};

PeentoApplication.prototype.useHook = function (name) {
  debug('useHook %s', name);
  var errs = [];
  var m, filename;

  // try to load from hook/specified path
  try {
    m = require(path.resolve('hook', name));
  } catch (err) {
    errs.push(err);
  }

  // try to load from package
  if (!m) {
    try {
      m = require('peento-hook-' + name);
    } catch (err) {
      errs.push(err);
    }
  }

  if (!m) {
    m = this.ns('hook.' + name);
  }

  if (typeof m !== 'function') {
    throw new Error('Hook ' + name + ' not found');
  }

  this._registerHook(name, m);
};

PeentoApplication.prototype._registerHook = function (name, fn) {
  var hook = {};
  fn(this.ns, hook);
  this.ns('hook.' + name, hook);
};

PeentoApplication.prototype._initHooks = function () {
  
};
