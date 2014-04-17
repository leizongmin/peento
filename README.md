peento
======

博客系统


插件
=====

目录结构：

```
hook -------------- 钩子目录，xxx.js => hook.xxx
model ------------- 数据模型目录，xxx.js => model.xxx
call -------------- 系统调用程序目录，xxx.js => call.xxx
moddleware -------- 中间件目录，xxx.js => middleware.xxx
view -------------- 模板文件目录，xxx.liquid => view.xxx
asset ------------- 资源文件目录，xxx.xx => asset.xxx.xx
router ------------ 路由处理目录，自由注册
filter ------------ 模板函数目录，自由注册
index.js ---------- 入口文件，初始化插件时调用
```

所有目录数据均为可选，按照载入顺序依次覆盖相同命名空间的数据。



使用方法（未实现）
========

```JavaScript
var peento = require('peento');

// 创建应用
var app = peento();

// 载入配置
app.config(require('./config'));


// 监听端口
app.listen(80);
```


钩子
=====

钩子可以为系统内置、第三方模块和程序hook目录文件。

优先级： hook目录 > 第三方模块 > 系统内置

hook名称为小写，比如执行 `app.useHook('xxx')` 时，先检查运行目录下是否存在
`./hook/xxx.js` 文件，如果不存在则检查是否安装了模块 `peento-hook-xxx` ，如果还
不存在则检查是否存在内置的 'hook.xxx'。

模块输出格式：

```JavaScript
module.exports = function (ns, register, debug) {
  // ns是全局命名空间
  // debug用来输出调试信息

  var options = {};
  options.before = ['abc', 'efg']; // 指定必须在哪些hook之前运行，可选
  options.after = ['jkl'];         // 指定必须在哪些hook之后运行，可选
  // 系统会自动检查冲突，如果有冲突则报错

  // 注册hook: 在get_article_list执行之前， after表示之后
  register('before.get_article_list', options, function (data, next, end) {
    // next();             执行下一个hook
    // next(null, data);   执行下一个hook，更改数据
    // next(err);          出错
    // end();              不再执行后面的hook
    // end(data);          不再执行后面的hook，更改数据
  });
}
```

## 执行机制

+ `app.call('get_blog_detail', params, callback)`
+ 准备执行`hook.call.get_blog_detail`
+ 执行所有`before call.get_blog_detail`的hook
+ 执行 `hook.call.get_blog_detail`
+ 执行所有`after call.get_blog_detail`的hook
+ 执行`callback`



模板
====

模板可以为系统内置、第三方模块和程序views目录文件。

通过 `app.useTheme('xxx')` 来使用指定主题的模板，此时系统会尝试加载
`peento-theme-xxx` 模块，如果没找到则报错。

在渲染 `abc` 模板时，如果运行目录下存在 `./theme/abc.liquid` 文件，则会优先使用
该文件。如果不存在，则从主题`xxx`中查找，若仍然不存在，则检查是否存在内置的模板
`views.abc` ，若仍然不存在，则报错。

模板可以继承。

模块输出格式：

```JavaScript
module.exports = function (ns, theme) {

  // 以其他的主题为基础
  theme.use('xxx');  // 模块 peento-theme-xxx
  theme.use('abc');  // 后面的优先级比前面的高

  // 设置静态资源文件目录
  theme.assetsPath('./assets');

  // 设置模板文件目录
  theme.viewsPath('./views');

  // 注册模板设置界面的选项
  // ....

};
```
