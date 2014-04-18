
module.exports = function (ns, router) {

  var app = ns('app');

  router.get('/test', function (req, res, next) {
    app.call('get_article_list', Math.random(), function (err, data) {
      if (err) return next(err);
      res.json(data);
    });
  });

  router.get('/test2', function (req, res, next) {
    res.render('test');
  });

};
