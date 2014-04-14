module.exports = function (ns, hook) {
  // ns是全局命名空间

  hook.before = ['abc', 'efg']; // 指定必须在哪些hook之前运行，可选
  hook.after = ['jkl'];         // 指定必须在哪些hook之后运行，可选
  // 系统会自动检查冲突，如果有冲突则报错

  // hook处理函数
  hook.handler = function (data, next, end) {
    // next();             执行下一个hook
    // next(null, data);   执行下一个hook，更改数据
    // next(err);          出错
    // end();              不再执行后面的hook
    // end(data);          不再执行后面的hook，更改数据
  };
};
