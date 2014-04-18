/**
 * Call: user.check_password
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (ns, debug) {
  var utils = require('../../../lib/utils');
  return function (params, callback) {
    debug('check password: [%s] %s', params.email, params.password);

    ns('model.user_list').getByEmail(params.email, function (err, user) {
      if (err) return callback(err);
      callback(null, utils.validatePassword(params.password, user.password));
    });

  }
};
