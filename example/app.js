/**
 * Peento Example
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var peento = require('../');

var app = peento(require('./config'));


app.start();



//console.log(app);
//console.log(app.ns());

//app.call('get_article_list', Math.random(), console.log);
//app.call('user.check_password', {email: 'test@ucdok.com', password: '1234a56'}, console.log);
function callback (err, data) {
  console.log(err, data);
  process.exit();
}
app.call('user.get_display_name', {email: 'test@ucdok.com'}, callback);
