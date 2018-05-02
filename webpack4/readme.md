# webpack 4.x
该文章目前对应的是 webpack 4.2.0

- 新增mode配置,开启后相当于默认设置了几个相应的插件
```
module.exports = {
+ mode: 'development'
- plugins: [
-   new webpack.NamedModulesPlugin(),
-   new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
- ]
}
```

```
module.exports = {
+  mode: 'production',
-  plugins: [
-    new UglifyJsPlugin(/* ... */),
-    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
-    new webpack.optimize.ModuleConcatenationPlugin(),
-    new webpack.NoEmitOnErrorsPlugin()
-  ]
}
```

- 可以直接在引入文件时用inline的方式直接设定loader
`import Styles from 'style-loader!css-loader?modules!./styles.css';`

- 同构合并打包的方式
```
var path = require('path');
var serverConfig = {
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.node.js'
  }
  //…
};

var clientConfig = {
  target: 'web', // <=== can be omitted as default is 'web'
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.js'
  }
  //…
};

module.exports = [ serverConfig, clientConfig ];
```

- 新增webpack-cli
需要多安装一个webpack-cli.
现在可以不需要webpack.config.js文件也能简单打包文件,
会默认打包`./src/index.js`,
输出到`./dist/main.js`中.

相当于默认载入了这个配置
```
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

可以使用`npx webpack`,但是需要npm>=5.2,
npx相当于npm run scripts.

默认识别`./webpack.config.js`配置文件.


- 增加 sideEffects 参数识别副作用代码
具体什么是副作用代码呢,可以参考这篇文章[你的Tree-Shaking并没什么卵用](https://segmentfault.com/a/1190000012794598)

大体来说就是某些代码不能准确的被tree shaking,算是webpack的一个缺陷,可以使用手动的sideEffects来设置哪些是副作用代码.
可以在package.json文件中写,也可以在webpack配置中写.

所有代码都不包含副作用
```
//package.json
{
  "name": "your-project",
  "sideEffects": false
}
```

某些代码含有副作用,特别是使用了类似使用了css-loader的文件..
```
//package.json
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js",
    "*.css"
  ]
}
```

```
//webpack.config.js
module.rules: [
  {
    include: path.resolve("node_modules", "lodash"),
    sideEffects: false
  }
]
```

- hmr里[chunkhash]
并没有支持,看来就是不能这样用吧


## 其他
目前似乎webpack4.x的文档还未全部更新?后续可能还要再看看

4.3 新增的[contenthash]?






