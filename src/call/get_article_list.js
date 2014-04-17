/**
 * Call: get_article_list
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (ns, debug) {
  return function (params, callback) {

    debug('call: %s', params);
    callback(null, params);

  }
};
