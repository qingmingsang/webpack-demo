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


## 4.开发
不同的`devtool`配置可以开启不同的`source maps`便于你查看源代码，有不同的[类型](https://webpack.js.org/configuration/devtool/)。其中`eval`是最快的,但是打包时不会根据`sourceMapFilename`生成map文件。

每次要编译代码都手动运行显得很麻烦。
Webpack有几个不同的方式更改代码时自动编译代码：
```
webpack's Watch Mode
webpack-dev-server //相当于一个本地服务+webpack-dev-middleware
//webpack-dev-middleware  //需要额外启动server
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
// webpack.config.js
const webpack = require('webpack');

module.exports = {
  /*...*/
  plugins:[
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0)
    })
  ]
};
```

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
为了弥补入口点的问题，使用`CommonsChunkPlugin`提取公共模块单独打包。

### Dynamic Imports
利用import实现动态加载和懒加载。这里不多介绍。



## 8.高速缓存
[hash] 替换可以用于在文件名中包含一个构建相关(build-specific)的 hash，
可以给所有打包出来的budle加上[hash]名，使文件能不被缓存。
但是因为 webpack 在入口 chunk 中，包含了某些样板(boilerplate)，特别是 runtime 和 manifest，
导致甚至什么没改也可能会改变hash。
可以利用CommonsChunkPlugin来解决这个问题。
新版本中已经解决了这个问题。

如果只是为了hash不在没改动的情况下改变，可以使用 [chunkhash] 替换，
在文件名中包含一个 chunk 相关(chunk-specific)的哈希。

将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中，
也就是所谓的dll。

因为每个 module.id 会基于默认的解析顺序(resolve order)进行增量。
也就是说，当解析顺序发生变化，ID 也会随之改变。
因此，简要概括：
- main bundle 会随着自身的新增内容的修改，而发生变化。
- vendor bundle 会随着自身的 module.id 的修改，而发生变化。
- runtime bundle 会因为当前包含一个新模块的引用，而发生变化。





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


