/**
 * Peento Plugin
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var fs = require('fs');
var rd = require('rd');
var utils = require('./utils');
var createDebug = require('./debug');

module.exports = exports = Plugin;


function Plugin (name, ns, dir) {
  this.name = name;
  this.ns = ns;
  this.dir = dir;
  this.hooks = {};
  this.filters = {};
  this.models = {};
  this.calls = {};
  this.routers = {};
  this.middlewares = {};
  this.assets = {};
  this.views = {};
  this.debug = createDebug('plugin:' + name);
}

Plugin.prototype.load = function () {
  this.loadHooks();
  this.loadFilters();
  this.loadModels();
  this.loadCalls();
  this.loadRouters();
  this.loadMiddlewares();
  this.loadAssets();
  this.loadViews();
};

Plugin.prototype._dir = function (name) {
  return path.resolve(this.dir, name);
};

Plugin.prototype._dirIsExisis = function (name) {
  var dir = this._dir(name);
  return fs.existsSync(dir);
};

Plugin.prototype._dirLoadEachJsFile = function (name, fn) {
  if (!this._dirIsExisis(name)) return;
  var debug = this.debug;
  var dir = this._dir(name);
  rd.eachFileFilterSync(dir, /\.js$/, function (f, s) {
    var n = utils.filenameToNamespace(dir, f);
    debug('load %s: %s', n, f);
    fn(f, n, require(f));
  });
};

Plugin.prototype._dirFindEachFile = function (name, fn) {
  if (!this._dirIsExisis(name)) return;
  var debug = this.debug;
  var dir = this._dir(name);
  rd.eachFileSync(dir, function (f, s) {
    var n = utils.filenameToRelativePath(dir, f);
    debug('find %s: %s', n, f);
    fn(f, n);
  });
};

Plugin.prototype.loadHooks = function () {
  this.debug('loadHooks');
  var hooks = this.hooks;
  this._dirLoadEachJsFile('hook', function (f, n, m) {
    hooks[n] = m;
  });
};

Plugin.prototype.loadFilters = function () {
  this.debug('loadFilters');
  var filters = this.filters;
  this._dirLoadEachJsFile('filter', function (f, n, m) {
    filters[n] = m;
  });
};

Plugin.prototype.loadModels = function () {
  this.debug('loadModels');
  var models = this.models;
  this._dirLoadEachJsFile('model', function (f, n, m) {
    models[n] = m;
  });
};

Plugin.prototype.loadCalls = function () {
  this.debug('loadCalls');
  var calls = this.calls;
  this._dirLoadEachJsFile('call', function (f, n, m) {
    calls[n] = m;
  });
};

Plugin.prototype.loadRouters = function () {
  this.debug('loadRouters');
  var routers = this.routers;
  this._dirLoadEachJsFile('router', function (f, n, m) {
    routers[n] = m;
  });
};

Plugin.prototype.loadMiddlewares = function () {
  this.debug('loadMiddlewares');
  var middlewares = this.middlewares;
  this._dirLoadEachJsFile('middleware', function (f, n, m) {
    middlewares[n] = m;
  });
};

Plugin.prototype.loadAssets = function () {
  this.debug('loadAssets');
  var assets = this.assets;
  this._dirFindEachFile('asset', function (f, n) {
    assets[n] = f;
  });
};

Plugin.prototype.loadViews = function () {
  this.debug('loadViews');
  var views = this.views;
  this._dirFindEachFile('view', function (f, n) {
    views[n] = f;
  });
};
