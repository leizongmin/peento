/**
 * Filters: utils
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (ns, registerFilter, debug) {
  var utils = require('../../lib/utils');

  registerFilter('gravatar', function (email) {
    return '//www.gravatar.com/avatar/' + utils.md5(email || '');
  });

};
