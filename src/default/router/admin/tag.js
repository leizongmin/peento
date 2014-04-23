/**
 * Router: Admin Tag Manage
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (ns, router) {
  var async = require('async');
  var app = ns('app');
  var checkSignin = ns('middleware.check_signin');
  var csrf = ns('middleware.csrf');
  var multiparty = ns('middleware.multiparty');


  router.get('/admin/tag', checkSignin, function (req, res, next) {
    res.render('admin/tag/list');
  });


  router.get('/admin/tag/list', checkSignin, function (req, res, next) {
    res.render('admin/tag/list');
    /*async.series([

      function (next) {
        app.call('tag.get_list', req.query, function (err, list) {
          res.setLocals('tags', list);
          next(err);
        });
      },

      function (next) {
        app.call('tag.get_count', req.query, function (err, list) {
          res.setLocals('tag_count', list);
          next(err);
        });
      }

    ], function (err) {
      if (err) return next(err);
      res.render('admin/tag/list');
    });
    */
  });

};
