该文章目前对应的是 webpack 4.12.1
[v4.0.0 changelog](https://github.com/webpack/webpack/releases/tag/v4.0.0)

## 新增webpack-cli
需要多安装一个[webpack-cli](https://github.com/webpack/webpack-cli).
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

## 新增mode配置,开启后相当于默认设置了几个相应的插件
必须选择一个模式,默认值是`'production'`,可以设置为`mode:'none'`关闭警告.

production
```
module.exports = {
  mode: 'production'
}

//相当于
module.exports = {
  performance: {
    hints: 'warning',
    maxAssetSize: 250000, //单文件超过250k，命令行告警
    maxEntrypointSize: 250000, //首次加载文件总和超过250k，命令行告警
  }
  plugins: [
    //默认添加NODE_ENV为production
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") })
  ],
  optimization: {
    minimize: true, //取代 new UglifyJsPlugin(/* ... */)
    providedExports: true,
    usedExports: true,
    //识别package.json中的sideEffects以剔除无用的模块，用来做tree-shake
    //依赖于optimization.providedExports和optimization.usedExports
    sideEffects: true,
    //取代 new webpack.optimize.ModuleConcatenationPlugin()
    concatenateModules: true,
    //取代 new webpack.NoEmitOnErrorsPlugin()，编译错误时不打印输出资源。
    noEmitOnErrors: true
  }
}
//默认关闭：in-memory caching
```

development
```
module.exports = {
  mode: 'development'
}

//相当于
module.exports = {
  //开发环境下默认启用cache，在内存中对已经构建的部分进行缓存
  //避免其他模块修改，但是该模块未修改时候，重新构建，能够更快的进行增量构建
  //属于空间换时间的做法
  cache: true, 
  output: {
    pathinfo: true //输入代码添加额外的路径注释，提高代码可读性
  },
  devtools: "eval", //sourceMap为eval类型
  plugins: [
    //默认添加NODE_ENV为development
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
  ],
  optimization: {
    namedModules: true, //取代插件中的 new webpack.NamedModulesPlugin()
    namedChunks: true
  }
}
//默认关闭：optimization.minimize
```

其他的一些默认值:
```
module.exports = {
  context: process.cwd()
  entry: './src',
  output: {
    path: 'dist',
    filename: '[name].js'
  },
  rules: [
    {
      type: "javascript/auto",
      resolve: {}
    },
    {
      test: /\.mjs$/i,
      type: "javascript/esm",
      resolve: {
        mainFields:
        options.target === "web" ||
        options.target === "webworker" ||
        options.target === "electron-renderer"
          ? ["browser", "main"]
          : ["main"]
      }
    },
    {
      test: /\.json$/i,
      type: "json"
    },
    {
      test: /\.wasm$/i,
      type: "webassembly/experimental"
    }
  ]
}
```
[完整详细的webpack4默认配置](https://github.com/webpack/webpack/blob/master/lib/WebpackOptionsDefaulter.js)

## 可以直接在引入文件时用inline的方式直接设定loader
`import Styles from 'style-loader!css-loader?modules!./styles.css';`

## 同构合并打包的方式
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


## 增加 sideEffects 参数识别副作用代码
影响tree shaking的根本原因在于side effects（副作用），其中最广为人知的一条side effect就是动态引入依赖的问题。
可以参考这篇文章[你的Tree-Shaking并没什么卵用](https://segmentfault.com/a/1190000012794598)

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

## hmr里[chunkhash]
并没有支持,看来就是不能这样用吧

## 插件变更
extract-text-webpack-plugin很可能不会支持webpack4.3以上版本.可以用[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)替代

html-webpack-plugin 配置可能需要微调
```
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  plugins:[
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      hash: true,
      chunksSortMode: 'none' //如果使用webpack4将该配置项设置为'none'
    })
  ]
}
```

`webpack.NamedModulesPlugin -> optimization.namedModules`

`webpack.NoEmitOnErrorsPlugin -> optimization.noEmitOnErrors`

`webpack.optimize.ModuleConcatenationPlugin -> optimization.concatenateModules`

[Optimization 相关文档](https://webpack.js.org/configuration/optimization)


![](https://images2018.cnblogs.com/blog/771172/201806/771172-20180626205808425-69320185.jpg)



### minimizer
优化的压缩配置:
```
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  optimization: {
    minimizer: [
      // 自定义js优化配置，将会覆盖默认配置
      new UglifyJsPlugin({
        exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
        cache: true,
        parallel: true, // 开启并行压缩，充分利用cpu
        sourceMap: false,
        extractComments: false, // 移除注释
        uglifyOptions: {
          compress: {
            unused: true,
            warnings: false,
            drop_debugger: true
          },
          output: {
            comments: false
          }
        }
      }),
      // 用于优化css文件
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessorOptions: {
          safe: true,
          autoprefixer: { disable: true }, // 禁用掉cssnano对于浏览器前缀的处理
          mergeLonghand: false,
          discardComments: {
            removeAll: true // 移除注释
          }
        },
        canPrint: true
      })
    ]
  }
}
```
OptimizeCssAssetsPlugin插件主要用来优化css文件的输出，默认使用[cssnano](https://cssnano.co/optimisations/)，其优化策略主要包括：摈弃重复的样式定义、砍掉样式规则中多余的参数、移除不需要的浏览器前缀等.


### optimization.runtimeChunk
CommonsChunkPlugin 被移除，使用 optimization.splitChunks 和 optimization.runtimeChunk 代替。
[RIP CommonsChunkPlugin](https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693)

`optimization.runtimeChunk`中'single'配置即将所有chunk的运行代码打包到一个文件中，'multiple'配合就是给每一个chunk的运行代码打包一个文件。

我们可以配合InlineManifestWebpackPlugin插件将运行代码直接插入html文件中，因为这段代码非常少，这样做可以避免一次请求的开销
```
var HtmlWebpackPlugin = require('html-webpack-plugin')
var InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')

module.exports = {
  entry: {
    app: 'src/index.js'
  },
  optimization: {
    runtimeChunk: 'single'
    // 等价于
    // runtimeChunk: {
    //   name: 'runtime'
    // }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'test',
      filename: 'index.html',
      template: 'xxx',
      inject: true,
      chunks: ['runtime', 'app'], // 将runtime插入html中
      chunksSortMode: 'dependency',
      minify: {/* */}
    }),
    new InlineManifestWebpackPlugin('runtime')
  ]
}
```
InlineManifestWebpackPlugin插件的顺序一定要在HtmlWebpackPlugin之后，否则会导致编译失败。


### optimization.splitChunks
[split-chunks-plugin相关文档](https://webpack.js.org/plugins/split-chunks-plugin/)

optimization.splitChunks配置项
- minSize (default: 30000) Minimum size for a chunk.
- minChunks (default: 1) Minimum number of chunks that share a module before splitting
- maxInitialRequests (default 3) Maximum number of parallel requests at an entrypoint
- maxAsyncRequests (default 5) Maximum number of parallel requests at on-demand loading
- chunks 有3个值"all","async" ,"initial".分别代表了全部 chunk，按需加载的 chunk 以及初始加载的 chunk。chunks 也可以是一个函数，在这个函数里可以拿到 chunk.name。


optimization.splitChunks 的默认配置.
一般来说直接使用默认配置即可.
```
module.exports = {
  optimization: {
    minimize: env === 'production' ? true : false, //是否进行代码压缩
    splitChunks: {
      chunks: "async",
      minSize: 30000, //模块大于30k会被抽离到公共模块
      minChunks: 1, //模块出现1次就会被抽离到公共模块
      maxAsyncRequests: 5, //异步模块，一次最多只能被加载5个
      maxInitialRequests: 3, //入口模块最多只能加载3个
      name: true,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20
          reuseExistingChunk: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    },
    runtimeChunk {
      name: "runtime"
    }
  }
}
```
默认配置只会作用于异步加载的代码块，它限制了分离文件的最小体积，即30KB（压缩之前），这个是前提条件，然后它有两个分组：属于node_modules模块，或者被至少2个入口文件引用，它才会被打包成独立的文件。
optimization.splitChunks.cacheGroups.default: false 可以关闭cacheGroups.default.
Webpack 4 默认的抽取的优先级是最低的，所以模块会优先被抽取到用户的自定义 chunk 中。

所有 node_modules 中引入的模块打包成一个模块：
```
vendors1: {
    test: /[\\/]node_modules[\\/]/,
    name: 'vendor',
    chunks: 'all',
  }
```

假设有 a, b, c 三个入口。希望 a，b 的公共代码单独打包为 common。也就是说 c 的代码不参与公共代码的分割。
可以定义一个 cacheGroups，然后设置 chunks 属性为一个函数，这个函数负责过滤这个 cacheGroups 包含的 chunk 是哪些。
示例代码如下：
```
optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          chunks(chunk) {
            return chunk.name !== 'c';
          },
          name: 'common',
          minChunks: 2,
        },
      },
    },
  },
```
上面配置的意思就是：把 a，b 入口中的公共代码单独打包为一个名为 common 的 chunk。使用 chunk.name，可以轻松的完成这个需求。


对不同分组入口中引入的 node_modules 中的依赖进行分组。
假设有 a, b, c, d 四个入口。希望 a，b 的依赖打包为 vendor1，c, d 的依赖打包为 vendor2。
这个需求要求对入口和模块都做过滤，所以需要使用 test 属性这个细粒度比较小的方式。
思路就是，写两个 cacheGroup，一个 cacheGroup 的判断条件是：如果 module 在 a 或者 b chunk 被引入，并且 module 的路径包含 node_modules，那这个 module 就应该被打包到 vendors1 中。 vendors2 同理。
```
vendors1: {
    test: module => {
      for (const chunk of module.chunksIterable) {
			if (chunk.name && /(a|b)/.test(chunk.name)) {
				if (module.nameForCondition() && /[\\/]node_modules[\\/]/.test(module.nameForCondition())) {
                 return true;
             }
			}
	   }
      return false;
    },
    minChunks: 2,
    name: 'vendors1',
    chunks: 'all',
  },
  vendors2: {
    test: module => {
      for (const chunk of module.chunksIterable) {
			if (chunk.name && /(c|d)/.test(chunk.name)) {
				if (module.nameForCondition() && /[\\/]node_modules[\\/]/.test(module.nameForCondition())) {
                 return true;
             }
			}
	   }
      return false;
    },
    minChunks: 2,
    name: 'vendors2',
    chunks: 'all',
  },
};
```

过去CommonsChunkPlugin的常规用法
```
module.exports = {
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ //将node_modules中的代码放入vendor.js中
      name: "vendor",
      minChunks: function(module){
        return module.context && module.context.includes("node_modules");
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({ //将webpack中runtime相关的代码放入manifest.js中
      name: "manifest",
      minChunks: Infinity
    }),
  ]
}
```

推荐配置:
```
splitChunks: {
  cacheGroups: {
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      name: 'vendor',
      minSize: 30000,
      minChunks: 1,
      chunks: 'initial',
      priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理
    },
    commons: {
      test: /[\\/]src[\\/]common[\\/]/,
      name: 'common',
      minSize: 30000,
      minChunks: 3,
      chunks: 'initial',
      priority: -1,
      reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
    }
  }
}
```
首先是将node_modules的模块分离出来。异步加载的模块将会继承默认配置，这里就不需要二次配置了。
第二点是分离出共享模块，将公用代码提取出来。
或者还有另外一种选择，将后缀为.js且使用次数超过3次的文件提取出来，但这不利于持久化缓存，新增或删除文件都有可能影响到使用次数，从而导致原先的公共文件失效。


## 长缓存(Long-term caching)
webpack4 的Long-term caching 中 Vendor hash 的问题还是没有解决，需要手动配置。
Long-term caching 在操作的时候，有个小问题，这个问题是关于 chunk 内容和 hash 变化不一致的：在公共代码 Vendor 内容不变的情况下，添加 entry，或者 external 依赖，或者异步模块的时候,Vendor 的 hash 会改变。
[可以使用这个方案优化](https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31)
这个方案的核心就是，Webpack 内部维护了一个自增的 id，每个 chunk 都有一个 id。所以当增加 entry 或者其他类型 chunk 的时候，id 就会变化，导致内容没有变化的 chunk 的 id 也发生了变化。
应对方案是，使用 webpack.NamedChunksPlugin 把 chunk id 变为一个字符串标识符，这个字符包一般就是模块的相对路径。这样模块的 chunk id 就可以稳定下来。

## 相关升级
[css-loader](https://github.com/webpack-contrib/css-loader/releases)升级到了v1.0.0,使用发生变化

## 其他
import() 语句总是返回命名空间对象，CommonJS 模块被包装为默认导出（default export）

webpack 原生支持使用 ES Module 导入 JSON。

InlineChunkWebpackPlugin可以将指定的chunk通过inline的形式写入index.html文件。

webpack-dev-server似乎有一个升级版,叫做[webpack-serve](https://github.com/webpack-contrib/webpack-serve),但还不成熟


- 移除 module.loaders
- 移除 loaderContext.options
- 移除 Compilation.notCacheable flag
- 移除 NoErrorsPlugin
- 移除 Dependency.isEqualResource
- 移除 NewWatchingPlugin
- 移除 CommonsChunkPlugin


可参考配置:
[webpack官方examples](https://github.com/webpack/webpack/tree/master/examples)
[webpack官方configCases](https://github.com/webpack/webpack/tree/master/test/configCases)
[webpack4-test](https://github.com/ansenhuang/webpack4-test)
[vuejs-templates](https://github.com/vuejs-templates/webpack)