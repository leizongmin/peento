/**
 * CSRF
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (ns, debug) {

  var express = require('express');
  var csurf = require('csurf');

  var router = express.Router();
  router.use(csurf());
  router.use(function (req, res, next) {
    res.context.setLocals('_csrf', req.csrfToken());
    next();
  });

  return router;

};
