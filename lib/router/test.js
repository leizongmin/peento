
module.exports = function (ns, router) {

  router.get('/test', function (req, res, next) {
    res.end('just for test');
  });

};
