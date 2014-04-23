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
      author_id:  'number',
      title:      'string',
      summary:    '*',
      created_at: 'number',
      updated_at: 'number',
      is_removed: 'number',
      sort:       'number'
    },
    queryFields: ['is_removed'],
    requiredFields: ['author_id', 'title'],
    input: function (data, callback, type) {
      if (type === 'add') {
        data.created_at = model.timestamp();
      }
      if (type === 'add' || type === 'update2') {
        data.updated_at = model.timestamp();
      }
      if (type === 'get' || type === 'list' || type === 'count') {
        data.is_removed = 0;
      }
      callback(null, data);
    },
    output: function (item, callback) {
      if (item) {
        item.is_removed = !!item.is_removed;
        item.created_at = new Date(item.created_at * 1000);
        item.updated_at = new Date(item.updated_at * 1000);
      }
      callback(null, item);
    }
  });

  return model;

};
