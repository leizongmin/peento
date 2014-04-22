/**
 * Router: Admin Article Manage
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (ns, router) {
  var async = require('async');
  var app = ns('app');
  var checkSignin = ns('middleware.check_signin');

  router.get('/admin/article/list', checkSignin, function (req, res, next) {
    async.series([

      function (next) {
        app.call('article.get_list', req.query, function (err, list) {
          res.setLocals('articles', list);
          next(err);
        });
      },

      function (next) {
        app.call('article.get_count', req.query, function (err, list) {
          res.setLocals('article_count', list);
          next(err);
        });
      }

    ], function (err) {
      if (err) return next(err);
      res.render('admin/article/list');
    });
  });

};
