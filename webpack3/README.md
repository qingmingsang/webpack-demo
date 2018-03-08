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
可以使用url-loader，将某个limit(byte)内的文件转为Data URL，特别是对图片。
1B（byte，字节）= 8 bit
1KB = 1024B


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

在测试环境最好不要用clean-webpack-plugin。

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
除了webpack本身config的改变，能实时更新页面不需重复刷新。
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
CommonsChunkPlugin可以将多entry的公共依赖模块提取到一个chunk文件。

为了弥补入口点的问题，CommonsChunkPlugin 插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。

### Dynamic Imports
当涉及到动态代码拆分时，webpack 提供了两个类似的技术。对于动态导入，第一种，也是优先选择的方式是，使用符合 ECMAScript 提案 的 import() 语法。第二种，则是使用 webpack 特定的 require.ensure。

import() 调用会在内部用到 promises。如果在旧有版本浏览器中使用 import()，记得使用 一个 polyfill 库（例如 es6-promise 或 promise-polyfill），来 shim Promise。 

如果使用了Babel，将需要添加 syntax-dynamic-import 插件，才能使 Babel 可以正确地解析语法。



## 8.缓存
[hash] 替换可以用于在文件名中包含一个构建相关(build-specific)的 hash，
可以给所有打包出来的budle加上[hash]名，使文件能不被缓存。
但是因为 webpack 在入口 chunk 中，包含了某些样板(boilerplate)，特别是 runtime 和 manifest，导致重新打包时甚至什么没改也可能会改变hash。

如果只是为了防止hash不在重新打包时没改动的情况下改变，可以使用 [chunkhash] 替换，在文件名中包含一个 chunk 相关(chunk-specific)的哈希。
这就是所谓的长缓存
```
-     filename: 'bundle.js',
+     filename: '[name].[chunkhash].js',
```
在新版本中似乎不需要[chunkhash]只用[hash]也没有问题了。。。。

使用CommonsChunkPlugin 能够在每次修改后的构建结果中，将 webpack 的样板(boilerplate)和 manifest 提取出来。
```
    //将 webpack 的样板(boilerplate)和 manifest 提取出来
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    })
```

将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中。
```
    //将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    })
```
另一种提取的方式是dll plugin。

两者同时使用时，vendor要在manifest前面
```
  new webpack.optimize.CommonsChunkPlugin({
    name: "vendor",
    minChunks: function(module){
      return module.context && module.context.includes("node_modules");
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: "manifest",
    minChunks: Infinity
  })
```


因为每个 module.id 会基于默认的解析顺序(resolve order)进行增量。
也就是说，当解析顺序发生变化，ID 也会随之改变。
因此，简要概括：
- main bundle 会随着自身的新增内容的修改，而发生变化。
- vendor bundle 会随着自身的 module.id 的修改，而发生变化。
- manifest bundle 会因为当前包含一个新模块的引用，而发生变化。

为了防止 main变化而改变vendor、manifest，可以尝试使用插件，
第一个插件是 NamedModulesPlugin，将使用模块的路径，而不是数字标识符。虽然此插件有助于在开发过程中输出结果的可读性，然而执行时间会长一些。
第二个选择是使用 HashedModuleIdsPlugin，推荐用于生产环境构建。
不知为何这两种插件实际使用并没用效果。
使用[chunkhash]是有效的。
但是[chunkhash]在hmr模式下不能使用。？
但是可以用在生产打包中？
[chunkhash]必须和manifest一起用。



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

`/* webpackChunkName: "chunkfilename" */`一般来说必须写，否则打出的chunk会没有名字只有id。

默认情况下会将chunk文件的依赖打到chunk文件里。
可以通过CommonsChunkPlugin提取出公共库。

使用懒加载后，每次修改代码vendor会重新打包，暂不知道原因

## 16 css
如果使用了ExtractTextPlugin，则sourceMap失效。
如果其他css相关的loader使用了sourceMap，而且使用了postcss-loader，
则[postcss-loader](https://github.com/postcss/postcss-loader)必须也开启sourceMap;

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

## 管理依赖
require.context
```
require.context(directory, useSubdirectories = false, regExp = /^\.\//)
```
3个参数分别为:
1. 要搜索的文件夹目录
2. 是否还应该搜索它的子目录
3. 一个匹配文件的正则表达式

传递给 require.context 的参数必须是字面量(literal)
```
// （创建了）一个包含了 test 文件夹（不包含子目录）下面的、所有文件名以 `.test.js` 结尾的、能被 require 请求到的文件的上下文。
require.context("./test", false, /\.test\.js$/);

// （创建了）一个包含了父级文件夹（包含子目录）下面，所有文件名以 `.stories.js` 结尾的文件的上下文。
require.context("../", true, /\.stories\.js$/);
```

导出的方法有 3 个属性： resolve, keys, id。
- resolve 是一个函数，它返回请求被解析后得到的模块 id。
- keys 也是一个函数，它返回一个数组，由所有可能被上下文模块处理的请求组成。
- id 是上下文模块里面所包含的模块 id. 它可能在使用 module.hot.accept 的时候被用到。

```
function importAll (r) {
  r.keys().forEach(r);
}

importAll(require.context('../components/', true, /\.js$/));


// 在构建时，所有被 require 的模块都会被存到（上面代码中的）cache 里面。
var cache = {};

function importAll (r) {
  r.keys().forEach(key => cache[key] = r(key));
}

importAll(require.context('../components/', true, /\.js$/));
```


## babel
前端项目用babel-polyfill。
类库开发用babel-plugin-transform-runtime。


## webpack-dev-server
CLI only
```
webpack-dev-server --color
webpack-dev-server --progress
```

```
//一切服务都启用gzip 压缩
compress: true

//当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。一般需要与publicPath一起用。
historyApiFallback: true

//默认是 localhost。如果希望服务器外部可访问，指定如下：
host: "0.0.0.0"

//启用 webpack 的模块热替换特性：
hot: true

//默认情况下，dev-server 通过 HTTP 提供服务。也可以选择带有 HTTPS 的 HTTP/2 提供服务：
https: true

//自动打开浏览器
open: true
//Usage via the CLI
webpack-dev-server --open

//代理：
proxy: {
  "/api": "http://localhost:3000"
}
```

publicPath路径下的打包文件可在浏览器中访问。
假设服务器运行在 `http://localhost:8080` 并且 output.filename 被设置为 bundle.js。默认 publicPath 是 "/"，所以包(bundle)可以通过 `http://localhost:8080/bundle.js` 访问。
可以修改 publicPath，将 bundle 放在一个目录：
`publicPath: "/assets/"`
现在可以通过 `http://localhost:8080/assets/bundle.js` 访问。


contentBase告诉服务器从哪里提供内容。
默认情况下，将使用当前工作目录作为提供内容的目录，但是可以修改为其他目录。
publicPath优先级比contentBase高。
```
contentBase: path.join(__dirname, "public")
```

stats 选项能准确地控制显示哪些包的信息。


## output
```
//output 目录对应一个绝对路径。
path: path.resolve(__dirname, 'dist/assets')

//配置如何暴露 library。
libraryTarget:"var"(默认值)
```

### publicPath
对于按需加载(on-demand-load)或加载外部资源(external resources)（如图片、文件等）来说，output.publicPath 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 404 错误。

此选项指定在浏览器中所引用的「此输出目录对应的公开 URL」。相对 URL(relative URL) 会被相对于 HTML 页面（或 <base> 标签）解析。相对于服务的 URL(Server-relative URL)，相对于协议的 URL(protocol-relative URL) 或绝对 URL(absolute URL) 也可是可能用到的，或者有时必须用到，例如：当将资源托管到 CDN 时。

该选项的值是以 runtime(运行时) 或 loader(载入时) 所创建的每个 URL 为前缀。因此，在多数情况下，此选项的值都会以/结束。

默认值是一个空字符串 ""。

对于一个 chunk 请求，看起来像这样 /assets/4.chunk.js。
```
publicPath: "/assets/",
chunkFilename: "[id].chunk.js"
```

webpack-dev-server 也会默认从 publicPath 为基准，使用它来决定在哪个目录下启用服务，来访问 webpack 输出的文件。

在编译时(compile time)无法知道输出文件的 publicPath 的情况下，可以留空，然后在入口文件(entry file)处使用自由变量(free variable) `__webpack_public_path__`，以便在运行时(runtime)进行动态设置。

```
 __webpack_public_path__ = myRuntimePublicPath
```

### sourceMapFilename
此选项会向硬盘写入一个输出文件，只在 devtool 启用了 SourceMap 选项时才使用。
配置 source map 的命名方式。默认使用 "[file].map"。

### chunkFilename
此选项决定了非入口(non-entry) chunk 文件的名称。
一般与代码分离和懒加载一起使用。

注意这些文件名需要在 runtime 根据 chunk 发送的请求去生成。因此，需要在 webpack runtime 输出 bundle 值时，将 chunk id 的值对应映射到占位符(如 [name] 和 [chunkhash])。这会增加文件大小，并且在任何 chunk 的占位符值修改后，都会使 bundle 失效。

默认使用 [id].js 或从 output.filename 中推断出的值（[name] 会被预先替换为 [id] 或 [id].）


### import()
```
import('path/to/module') -> Promise
```
动态地加载模块。调用 import() 之处，被作为分离的模块起点，意思是，被请求的模块和它引用的所有子模块，会分离到一个单独的 chunk 中。

ES2015 loader 规范 定义了 import() 方法，可以在运行时动态地加载 ES2015 模块。 
```
if ( module.hot ) {
  import('lodash').then(_ => {
    // Do something with lodash (a.k.a '_')...
  })
}
```

import 规范不允许控制模块的名称或其他属性，因为 "chunks" 只是 webpack 中的一个概念。幸运的是，webpack 中可以通过注释接收一些特殊的参数，而无须破坏规定：
```
import(
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  'module'
);

//这两个选项可以组合起来使用
/* webpackMode: "lazy-once", webpackChunkName: "all-i18n-data" */
```

`webpackChunkName`
新 chunk 的名称。[index] and [request] 占位符，分别支持赋予一个递增的数字和实际解析的文件名。

`webpackMode`
指定以不同的模式解析动态导入。
支持以下选项：

- "lazy"（默认）：为每个 import() 导入的模块，生成一个可延迟加载(lazy-loadable) chunk。
- "lazy-once"：生成一个可以满足所有 import() 调用的单个可延迟加载(lazy-loadable) chunk。此 chunk 将在第一次 import() 调用时获取，随后的 import() 调用将使用相同的网络响应。注意，这种模式仅在部分动态语句中有意义，例如 import(`./locales/${language}.json`)，其中可能含有多个被请求的模块路径。
- "eager"：不会生成额外的 chunk，所有模块都被当前 chunk 引入，并且没有额外的网络请求。仍然会返回 Promise，但是是 resolved 状态。和静态导入相对比，在调用 import（）完成之前，该模块不会被执行。
- "weak"：尝试加载模块，如果该模块函数已经以其他方式加载（即，另一个 chunk 导入过此模块，或包含模块的脚本被加载）。仍然会返回 Promise，但是只有在客户端上已经有该 chunk 时才成功解析。如果该模块不可用，Promise 将会是 rejected 状态，并且网络请求永远不会执行。当需要的 chunks 始终在（嵌入在页面中的）初始请求中手动提供，而不是在应用程序导航在最初没有提供的模块导入的情况触发，这对于通用渲染（SSR）是非常有用的。

慎用变量
完全动态的语句（如 import(foo)），因为 webpack 至少需要一些文件的路径信息，而 foo 可能是系统或项目中任何文件的任何路径，因此 foo 将会解析失败。import() 必须至少包含模块位于何处的路径信息，所以打包应当限制在一个指定目录或一组文件中。 

调用 import() 时，包含在其中的动态表达式 request，会潜在的请求的每个模块。例如，import(`./locale/${language}.json`) 会导致 ./locale 目录下的每个 .json 文件，都被打包到新的 chunk 中。在运行时，当计算出变量 language 时，任何文件（如 english.json 或 german.json）都可能会被用到。 



## CommonsChunkPlugin
默认情况下CommonsChunkPlugin可以将多entry的公共依赖模块提取到一个chunk文件。
实际上如果不是多entry，在同一entry系列里的重复引入模块，是不会被webpack重复打包的。

第二个默认行为是如果不是多入口且没有指定打包的库，会打包manifest。

使用CommonsChunkPlugin更主要是为了提取较稳定的库，使不必每次都重复打包，提升编译效率。在生产上可以减少文件的重新下载。

CommonsChunkPlugin的filename默认规则是与output.filename一致的。

分别提取公共库
```
  entry: {
    index: './src/index.js',
    vendor1: ['lodash'],
    vendor2: ['underscore']
  },
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor1', 'vendor2']
    })
```

### minChunks ?
在传入公共chunk(commons chunk) 之前所需要包含的最少数量的 chunks 。
数量必须大于等于2，或者少于等于 chunks的数量
传入 `Infinity` 会马上生成 公共chunk，但里面没有模块。
可以传入一个 `function` ，以添加定制的逻辑（默认是 chunk 的数量）

### chunks 
通过 chunk name 去选择 chunks 的来源。
chunk 必须是  公共chunk 的子模块。
如果被忽略，所有的，所有的 入口chunk (entry chunk) 都会被选择。

### children 
似乎默认是true？
设为 true 时，指定 source chunks 为 children of commons chunk。可以认为是 entry chunks 通过 code split 创建的 children chunks。children 与 chunks不可同时设置（它们都是指定 source chunks 的）。

children 可以用来把 entry chunk 创建的 children chunks 的共用模块合并到自身，但这会导致初始加载时间较长.

### async 
即解决children: true时合并到 entry chunks 自身时初始加载时间过长的问题。async 设为 true 时，commons chunk 将不会合并到自身，而是使用一个新的异步的 commons chunk。当这个 commons chunk 被下载时，自动并行下载相应的共用模块。

如果设置为 `true`，一个异步的  公共chunk 会作为 `options.name` 的子模块，和 `options.chunks` 的兄弟模块被创建。
它会与 `options.chunks` 并行被加载。
Instead of using `option.filename`, it is possible to change the name of the output file by providing
the desired string here instead of `true`.


```
deepChildren: boolean,
// If `true` all descendants of the commons chunk are selected

minSize: number,
// 在 公共chunk 被创建立之前，所有 公共模块 (common module) 的最少大小。
```

这种写法似乎提取不到children里的公共chunk，也可能是默认行为。
如果直接写vendor配置是可以提取到的。
```
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: (module) => {
        return module.context && module.context.includes("node_modules");
      }
    }),
```





