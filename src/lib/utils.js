/**
 * Peento Utils
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var utils = module.exports;




utils.filenameToNamespace = function (dir, filename) {
  dir = path.resolve(dir);
  filename = path.resolve(filename);
  var ext = path.extname(filename);
  var name = filename.slice(dir.length + 1, - ext.length);
  return name.replace(/(\\\/)/g, '.');
};

utils.filenameToRelativePath = function (dir, filename) {
  dir = path.resolve(dir);
  filename = path.resolve(filename);
  var name = filename.slice(dir.length + 1);
  return name.replace(/(\\\/)/g, '/');
};

utils.argumentsToArray = function (args) {
  return Array.prototype.slice.call(args, 0);
};

utils.objectEachKey = function (obj, fn) {
  Object.keys(obj).forEach(fn);
};

utils.isString = function (str) {
  return (typeof str === 'string');
};

utils.isInteger = function (str) {
  return (Math.round(str) === Number(str));
};

utils.isNumber = function (str) {
  return (!isNaN(str));
};
