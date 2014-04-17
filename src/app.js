/**
 * Peento Application
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var fs = require('fs');
var path = require('path');
var async = require('async');
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
var MySQLPool = require('lei-mysql');
var MySQLModel = require('lei-mysql-model');
var Pipe = require('lei-pipe');
var errorhandler = require('./middleware/errorhandler');
var utils = require('./lib/utils');
var createDebug = require('./lib/debug');
var debug = require('./lib/debug')('app');


module.exports = function (config) {
  return new PeentoApplication(config);
};


function PeentoApplication (config) {
  debug('new');

  // init global namespace
  var ns = this.ns = createNamespace();
  ns('app', this);
  ns('config', config);
  ns('utils', utils);
  ns('debug', createDebug);

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

  this._initDb();
  this._loadModels();
  this._loadCalls();
  this._loadRouters();
  this._loadHooks();
}

PeentoApplication.prototype.listen = function (port) {
  debug('listen %s', port);
  this.express.listen(port);
};

PeentoApplication.prototype.start = function () {
  debug('start');
  this.listen(this.ns('config.port'));
};

PeentoApplication.prototype._initDb = function () {
  debug('_initDb');
  var ns = this.ns;
  var db = new MySQLPool(ns('config.mysql'));
  this.db = db;
  ns('db', db);
};

PeentoApplication.prototype._loadModels = function () {
  debug('_loadModels');
  var me = this;
  var ns = this.ns;
  var DIR = path.resolve(__dirname, 'model');
  rd.eachFileFilterSync(DIR, /\.js$/, function (f, s) {
    debug(' - %s', f);
    var n = utils.filenameToNamespace(DIR, f);
    var m = require(f);
    me._registerModel(n, m);
  });
};

PeentoApplication.prototype._registerModel = function (n, fn) {
  var ns = this.ns;
  var m = fn(ns, MySQLModel.create, createDebug('model:' + n));
  ns('model.' + n, m);
};

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

PeentoApplication.prototype._loadCalls = function () {
  debug('_loadCalls');
  var me = this;
  var ns = me.ns;
  var DIR = path.resolve(__dirname, 'call');
  rd.eachFileFilterSync(DIR, /\.js$/, function (f, s) {
    debug(' - %s', f);
    var n = utils.filenameToNamespace(DIR, f);
    var m = require(f)(ns, createDebug('call:' + n));
    ns('call.' + n, m);
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
  var me = this;
  var ns = me.ns;
  var hook = {};
  ns('hook.' + name, hook);
  fn(ns, function register (call, options, handler) {
    var pipe = me._getCallPipe(call);
    var args = utils.argumentsToArray(arguments);
    args[0] = name;
    pipe.add.apply(pipe, args);
    hook[call] = args;
  }, createDebug('hook.' + name));
};

PeentoApplication.prototype._getCallPipe = function (name) {
  this._callPipes = this._callPipes || {};
  this._callPipes[name] = this._callPipes[name] || new Pipe();
  return this._callPipes[name];
};

PeentoApplication.prototype.call = function (name, params, callback) {
  var me = this;
  var ns = me.ns;

  var call = ns('call.' + name);
  if (typeof call !== 'function') {
    return callback(new TypeError('Cannot call ' + name));
  }

  async.series([

    // before.xxxx
    function (next) {
      debug('call: before %s', name);
      var before = me._getCallPipe('before.' + name);
      before.start(params, function (err, data) {
        params = data;
        next(err);
      });
    },

    // xxxx
    function (next) {
      debug('call: %s', name);
      call(params, function (err, data) {
        params = data;
        next(err);
      });
    },

    // after.xxx
    function (next) {
      debug('call: after %s', name);
      var after = me._getCallPipe('after.' + name);
      after.start(params, function (err, data) {
        params = data;
        next(err);
      });
    }

  ], function (err) {
    callback(err, params);
  });
};
