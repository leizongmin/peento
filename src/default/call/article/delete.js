/**
 * Call: article.delete
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (ns, debug) {
  var utils = require('../../../lib/utils');
  return function (params, callback) {
    debug('delete: [%s]', params.id);

    params._get_detail = false;
    ns('app').call('article.get', params, function (err, article) {
      if (err) return callback(err);

      ns('model.article_list').deleteById(article.id, callback);
    });

  }
};
