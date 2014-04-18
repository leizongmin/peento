/**
 * Call: article.get_count
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (ns, debug) {
  var utils = require('../../../lib/utils');
  return function (params, callback) {
    debug('get count');

    var query = {};
    if (params.author_id > 0) query.author_id = query.author_id;


    ns('model.article_list').count(query, callback);

  }
};
