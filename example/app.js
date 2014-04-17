/**
 * Peento Example
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var peento = require('../');

var app = peento(require('./config'));


app.start();



console.log(app);
console.log(app.ns());

app.call('get_article_list', Math.random(), console.log);
