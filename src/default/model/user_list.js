/**
 * Model: user_list
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (ns, createModel, debug) {

  var model = createModel({
    connection: ns('db'),
    table:      'user_list',
    primary:    'id',
    limit:      ns('config.model.limit'),
    fields: {
      id:           'number',
      email:        'string',
      password:     'string',
      display_name: 'string'
    },
    queryFields: ['email'],
    requiredFields: ['email', 'password', 'display_name']
  });

  return model;

};
