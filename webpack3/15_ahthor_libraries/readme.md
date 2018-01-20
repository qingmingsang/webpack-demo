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




