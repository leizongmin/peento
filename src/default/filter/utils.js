/**
 * Filters: utils
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (ns, registerFilter, debug) {

  registerFilter('test', function () {
    return 'test:' + Math.random();
  });

};
