/**
 * Call: article.get_list
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (ns, debug) {
  var utils = require('../../../lib/utils');
  return function (params, callback) {
    debug('get list');
    params = utils.cloneObject(params);

    var query = {};
    if (params.author_id > 0) query.author_id = query.author_id;

    if (!params.order) params.order = 'updated_at:desc';
    params.order = 'sort:desc|' + params.order;

    ns('model.article_list').list(query, params, callback);

  }
};
