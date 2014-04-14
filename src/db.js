/**
 * 数据库连接
 */

var MySQLPool = require('lei-mysql');
var config = require('../config');

var db = new MySQLPool(config.mysql);

module.exports = db;
