/**
 * Call: get_article_list
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (ns, debug) {
  return function (params, callback) {

    // console.log('get_article_list', params);
    ns('model.article_list').list({is_removed: 0}, {}, function (err, data) {
      // console.log(data);
      callback(err, data);
    });

  }
};
