/**
 * Router: sign in & sign up & sign out
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (ns, router) {
  var async = require('async');
  var app = ns('app');
  var csrf = ns('middleware.csrf');
  var multiparty = ns('middleware.multiparty');


  router.get('/signin', function (req, res, next) {
    res.render('sign/signin');
  });


  router.get('/signup', csrf, function (req, res, next) {
    res.render('sign/signup');
  });

  router.post('/signup', multiparty, csrf, function (req, res, next) {
    res.json(req.body);
  });

};
