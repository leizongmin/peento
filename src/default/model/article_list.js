/**
 * Model: article_list
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (ns, createModel, debug) {

  var model = createModel({
    connection: ns('db'),
    table:      'article_list',
    primary:    'id',
    limit:      ns('config.model.limit'),
    fields: {
      id:         'number',
      title:      'string',
      summary:    '*',
      is_removed: 'number'
    },
    queryFields: ['is_removed'],
    requiredFields: ['title'],
    output: function (item, callback) {
      item.is_removed = !!item.is_removed;
      callback(null, item);
    }
  });

  return model;

};
