# usage

```
// ES2015 模块引入
import * as webpackNumbers from 'webpack-numbers';
// CommonJS 模块引入
var webpackNumbers = require('webpack-numbers');
// ...
// ES2015 和 CommonJS 模块调用
webpackNumbers.wordToNum('Two');
// ...
// AMD 模块引入
require(['webpackNumbers'], function ( webpackNumbers) {
  // ...
  // AMD 模块调用
  webpackNumbers.wordToNum('Two');
  // ...
});
```

or

```
<html>
...
<script src="https://unpkg.com/webpack-numbers"></script>
<script>
  // ...
  // 全局变量
  webpackNumbers.wordToNum('Five')
  // window 对象中的属性
  window.webpackNumbers.wordToNum('Five')
  // ...
</script>
</html>
```

还可以通过以下配置方式，将 library 暴露：
1. global 对象中的属性，用于 Node.js。
2. this 对象中的属性。


能够实现以下几个目标:

1. 不打包 lodash，而是使用 externals 来 require 用户加载好的 lodash。
2. 设置 library 的名称为 webpack-numbers.
3. 将 library 暴露为一个名为 webpackNumbers的变量。
4. 能够访问其他 Node.js 中的 library。


此外，用户应该能够通过以下方式访问 library：

1. ES2015 模块。例如 import webpackNumbers from 'webpack-numbers'。
2. CommonJS 模块。例如 require('webpack-numbers').
3. 全局变量，当通过 script 脚本引入时


可以通过以下方式暴露 library：

1. 遍历：作为一个全局变量，通过 script 标签来访问（libraryTarget:'var'）。
2. this：通过 this 对象访问（libraryTarget:'this'）。
3. window：通过 window 对象访问，在浏览器中（libraryTarget:'window'）。
4. UMD：在 AMD 或 CommonJS 的 require 之后可访问（libraryTarget:'umd'）。

如果设置了 library 但没设置 libraryTarget，则 libraryTarget 默认为 var





