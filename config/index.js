/**
 * 系统配置
 */

var config = exports;


// 数据库配置
config.mysql = {
  host: '127.0.0.1',
  port: 3306,
  user: 'peento',
  password: 'peento:ooxx=fuck',
  database: 'peento',
  pool: 5
};

// 监听端口
config.port = 3009;

// Passport
config.passport = {};
// Github
config.passport.github = {
  clientID:     '1f201f78d8e6261d384d',
  clientSecret: '6a9b5ab271be0cc87481479a3d8c9f40ff7dd7dd'
};
