# webpack3 快速施法

[完整示例](https://github.com/qingmingsang/helloWebpack/tree/master/webpack3)
可查看对应的例子，`npm start`运行。

## 1.安装
[安装nodejs](https://nodejs.org/en/)

执行
```
 npm init -y //快速创建package.json
 npm i webpack -g
 npm i webpack -D//不装有时会有问题
```
值得一提的是现在webpack2+支持ES6的module了。



## 2.静态资源管理
```
npm install --save-dev css-loader style-loader//用于加载css文件
npm install --save-dev file-loader//用于加载图片与字体文件
//npm install --save-dev csv-loader xml-loader //不太用的上
```


## 3.输出管理
entry可以引入几个不同的文件,output里的finename的[name]，就代表的在entry里定义的文件的名称。输出后会生成不同的打包文件。

安装`html-webpack-plugin`插件可以帮助我们自动生成html模板，模板里会自动将生成的多个bundle加入html中。
```
npm install --save-dev html-webpack-plugin
```

如果希望每次打包前将dist文件自动清空可以安装这个插件。
```
npm install clean-webpack-plugin --save-dev
```

chunkFilename，它决定非入口 chunk 的名称。

## 4.开发
不同的`devtool`配置可以开启不同的`source maps`便于你查看源代码，有不同的[类型](https://webpack.js.org/configuration/devtool/)。其中`eval`是最快的,但是打包时不会根据`sourceMapFilename`生成map文件。

每次要编译代码都手动运行显得很麻烦。
Webpack有几个不同的方式更改代码时自动编译代码：
```
//webpack's Watch Mode
webpack-dev-server //相当于一个本地服务

server + webpack-dev-middleware = webpack-dev-server
```

### watch模式
在script里加入
```
"watch": "webpack --watch"
```
缺点是需要手动刷新浏览器.


### webpack-dev-server
相当于启了一个本地服务(socket)在上面热更新，默认`http://localhost:8080/`  ,一般开发时推荐用这个。
```
npm install --save-dev webpack-dev-server
```


## 5.Hot Module Replacement(HMR)
HMR不适用于生产。随附webpack，通过配置启用hmr。
module.hot只有module.hot.accept监听的相应文件变化了才会触发。
相比webpack-dev-server，他在html模板加载文件的顺序是按照entry的顺序。
```
// webpack.config.js
const webpack = require('webpack');

module.exports = {
  /*...*/
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true ,
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  }
};
```


## 6.生产
### 自动方式
直接执行进行生产方式打包。
```
webpack -p

等效

webpack --optimize-minimize --define process.env.NODE_ENV="'production'"
```

#### 压缩代码
`--optimize-minimize`相当于开启了UglifyJsPlugin。
UglifyJs是给生产环境用的，他无法直接识别ES6+的语法。
```
  //避免在生产中使用 inline-*** 和 eval-***，
  //因为它们会增加 bundle 大小，并降低整体性能。
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    //将 process.env.NODE_ENV 设置为 "production"
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
```
生产环境也是可以开启sourceMap的

#### node 环境变量
`--define process.env.NODE_ENV="'production'"`相当于开启了DefinePlugin。
```
  plugins:[
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
```

### 手动方式
创建两个webpack.config文件，一个`webpack.dev.js`,开发用，一个`webpack.prod.js`生产用。
根据`env`参数的不同调用不同配置。
```
"scripts": {
    "dev": "webpack-dev-server --env=dev --open",
    "prod": "webpack --env=prod --progress --profile --colors",
}
```

也可以用`cross-env`，但是读的是`process.env.NODE_ENV`。
```
"scripts": {
    "dev": "cross-env NODE_ENV=dev webpack-dev-server --open",
    "prod": "cross-env NODE_ENV=prod webpack --progress --profile --colors"
}
```

### 高级方式
用`webpack-merge`合并公共的webpack配置文件。
示例为高级方式。



## 7.代码分割
一般有三种代码分割的方法：
```
Entry Points:  使用entry配置手动拆分代码。
Prevent Duplication: 使用CommonsChunkPlugin重复数据删除和拆分块。
Dynamic Imports: 通过模块内部函数调用分割代码。
```
### 入口点
在前面的代码里我们可以看到，entry不同的文件将会生成不同的bundle。
缺点是不同模块引入的相同模块会被重复打包进bundle里。

### CommonsChunkPlugin
为了弥补入口点的问题，CommonsChunkPlugin 插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。

### Dynamic Imports
当涉及到动态代码拆分时，webpack 提供了两个类似的技术。对于动态导入，第一种，也是优先选择的方式是，使用符合 ECMAScript 提案 的 import() 语法。第二种，则是使用 webpack 特定的 require.ensure。

import() 调用会在内部用到 promises。如果在旧有版本浏览器中使用 import()，记得使用 一个 polyfill 库（例如 es6-promise 或 promise-polyfill），来 shim Promise。 



## 8.缓存
[hash] 替换可以用于在文件名中包含一个构建相关(build-specific)的 hash，
可以给所有打包出来的budle加上[hash]名，使文件能不被缓存。
但是因为 webpack 在入口 chunk 中，包含了某些样板(boilerplate)，特别是 runtime 和 manifest，
导致甚至什么没改也可能会改变hash。
可以利用CommonsChunkPlugin来解决这个问题。
新版本中已经解决了这个问题。

如果只是为了防止hash不在没改动的情况下改变，可以使用 [chunkhash] 替换，在文件名中包含一个 chunk 相关(chunk-specific)的哈希。

CommonsChunkPlugin 能够在每次修改后的构建结果中，将 webpack 的样板(boilerplate)和 manifest 提取出来。

将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中，也就是所谓的dll？。
如果要用vendor chunk，顺序必须在manifest前面。

因为每个 module.id 会基于默认的解析顺序(resolve order)进行增量。
也就是说，当解析顺序发生变化，ID 也会随之改变。
因此，简要概括：
- main bundle 会随着自身的新增内容的修改，而发生变化。
- vendor bundle 会随着自身的 module.id 的修改，而发生变化。
- manifest bundle 会因为当前包含一个新模块的引用，而发生变化。

为了防止 main变化而改变vendor、manifest，可以尝试使用插件，
第一个插件是 NamedModulesPlugin，将使用模块的路径，而不是数字标识符。虽然此插件有助于在开发过程中输出结果的可读性，然而执行时间会长一些。第二个选择是使用 HashedModuleIdsPlugin，推荐用于生产环境构建。
不知为何这两种插件实际使用并没用效果。
但是使用[chunkhash]是有效的。
但是[chunkhash]在wepack-dev-server中不能使用。

```
module.exports = {
	entry: {
		app: './app.js',
		vendor: ['react', 'react-dom', 'moment' /*等等其他的模块*/]
	},
	//其他配置
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        })
	]
}
```



## 9.文件引入
html中引入的外部文件，可以通过设置externals，在文件中引入。
在文件目录较深时，可以通过设置alias，在文件中直接引入别名文件。
使用extensions可以设置直接省略的后缀。



## 10.webpack 与 grunt
安装[grunt-webpack](https://github.com/webpack-contrib/grunt-webpack)可以在grunt中执行webpack。

```
npm i webpack grunt-webpack --save-dev
```


## 11.webpack 与 gulp
安装[webpack-stream](https://github.com/shama/webpack-stream)可以在gulp中执行webpack。
```
 npm i webpack-stream -D
```
暂时也只能打包js，webpack的plugins也都会报错，css打包也不成功。
没有详细的文档与demo，暂时不愿意踩这个坑，作了解即可。



## 12.webpack 与 react
安装react
```
npm i react react-dom -S
```

为了打包react与es6语法，需要安装babel
注意babel-cli的版本同步问题
```
npm i babel-cli -g
npm i babel-cli -D
npm i babel-loader -D
npm i babel-preset-env babel-preset-react -D
```

.babelrc文件配置
```
{
  "presets": [
    "env",
    "react"
  ]
}
```

## 13 tree shaking
tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块系统中的静态结构特性，例如 import 和 export。这个术语和概念实际上是兴起于 ES2015 模块打包工具 rollup。

webpack 2 内置支持 ES2015 模块（别名 harmony modules），并能检测出未使用的模块导出。

目前是通过uglifyjs-webpack-plugin实现的。

## 14 懒加载
懒加载或者按需加载，是一种很好的优化网页或应用的方式。这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载。

一般和代码分割是关联的。

## 17 shimming

shim 是一个库(library)，它将一个新的 API 引入到一个旧的环境中，而且仅靠旧的环境中已有的手段实现。polyfill 就是一个用在浏览器 API 上的 shim。我们通常的做法是先检查当前浏览器是否支持某个 API，如果不支持的话就加载对应的 polyfill。然后新旧浏览器就都可以使用这个 API 了。 

可以通过ProvidePlugin将常规的模块注入到全局中。
可以通过imports-loader改变全局变量。
可通过exports-loader将某个不是模块的js文件export到全局？
可通过entry将某些需要全局import的文件全局引入。

需要注意的是不同的 devtool 的设置，会导致不同的性能差异。
- "eval" 具有最好的性能，但并不能帮助你转译代码。
- 如果你能接受稍差一些的 mapping 质量，可以使用 cheap-source-map 选项来提高性能
- 使用 eval-source-map 配置进行增量编译。
- 在大多数情况下，cheap-module-eval-source-map 是最好的选择。

webpack 提供一个全局变量`__webpack_public_path__`
可以用来设置Public Path

entry可以设置多入口，可以通过entry导入全局变量。

```
filename: "bundle.js", // string
filename: "[name].js", // 用于多个入口点(entry point)（出口点？）
filename: "[chunkhash].js", // 用于长效缓存

publicPath: "/assets/", // string
publicPath: "",
publicPath: "https://cdn.example.com/",//可以通过publicPath设置cdn
// 输出解析文件的目录，url 相对于 HTML 页面

devtool: "source-map", // enum
devtool: "inline-source-map", // 嵌入到源文件中
devtool: "eval-source-map", // 将 SourceMap 嵌入到每个模块中
devtool: "hidden-source-map", // SourceMap 不在源文件中引用
devtool: "cheap-source-map", // 没有模块映射(module mappings)的 SourceMap 低级变体(cheap-variant)
devtool: "cheap-module-source-map", // 有模块映射(module mappings)的 SourceMap 低级变体
devtool: "eval", // 没有模块映射，而是命名模块。以牺牲细节达到最快。
// 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
// 牺牲了构建速度的 `source-map' 是最详细的。


devServer: {
  proxy: { // proxy URLs to backend development server
    '/api': 'http://localhost:3000'
  },
  contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
  compress: true, // enable gzip compression
  historyApiFallback: true, // true for index.html upon 404, object for multiple paths
  hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
  https: false, // true for self-signed, object for cert authority
  noInfo: true, // only errors & warns on hot reload
  // ...
},
```

module.noParse 不编译某些文件









