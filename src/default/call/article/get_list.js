/**
 * Call: article.get_list
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (ns, debug) {
  var utils = require('../../../lib/utils');
  return function (params, callback) {
    debug('get list');
    var article_list = ns('model.article_list');
    params = utils.cloneObject(params);

    var query = {};
    if (params.author_id > 0) query.author_id = params.author_id;

    if (!params.order) params.order = 'updated_at:desc';
    params.order = 'sort:desc,' + params.order;

    var options = article_list.formatListOptions(params);
    article_list.list(query, options, callback);

  }
};
