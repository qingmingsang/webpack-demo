
# getting started
`Node 8.2/npm 5.2.0` 以上版本提供的 npx 命令，可以运行在初始安装的 webpack 包(package)的 webpack 二进制文件（`./node_modules/.bin/webpack`）.

`npx webpack` 相当于 `"build":"webpack"`-> `npm run build`

默认支持ES2015 中的 import 和 export.

# Asset Management
[MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production)
可用于css萃取

[Loading Fonts](https://survivejs.com/webpack/loading/fonts/)

# Output Management
[html-webpack-template](https://github.com/jaketrent/html-webpack-template)
[webpack-manifest-plugin](https://github.com/danethurber/webpack-manifest-plugin)
[introduction-source-maps](https://blog.teamtreehouse.com/introduction-source-maps)

# Hot Module Replacement
[webpack-hot-middleware](https://github.com/webpack-contrib/webpack-hot-middleware)
[react-hot-loader](https://github.com/gaearon/react-hot-loader)

需要注意module.hot.accept前绑定的事件如果更新后可能需要重新绑定.

说实话webpack-dev-server已经帮我们做到了自动检测代码变化并且自动刷新页面了,不知道HMR的必要性是什么.


# tree shaking
tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。
它依赖于 ES2015 模块系统中的静态结构特性[Static module structure](http://exploringjs.com/es6/ch_modules.html#static-module-structure)，例如 import 和 export。
这个术语和概念实际上是兴起于 ES2015 模块打包工具 rollup。

webpack 2 正式版本内置支持 ES2015 模块（也叫做 harmony 模块）和未引用模块检测能力。
新的 webpack 4 正式版本，扩展了这个检测能力，通过 package.json 的 "sideEffects" 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是 "pure(纯的 ES2015 模块)"，由此可以安全地删除文件中未使用的部分。


## 将文件标记为无副作用(side-effect-free) 
在一个纯粹的 ESM 模块世界中，识别出哪些文件有副作用很简单。然而，我们的项目无法达到这种纯度，所以，此时有必要向 webpack 的 compiler 提供提示哪些代码是“纯粹部分”。

这种方式是通过 package.json 的 "sideEffects" 属性来实现的。
```
{
  "name": "your-project",
  "sideEffects": false
}
```
如同上面提到的，如果所有代码都不包含副作用，我们就可以简单地将该属性标记为 false，来告知 webpack，它可以安全地删除未用到的 export 导出。

「副作用」的定义是，在导入时会执行特殊行为的代码，而不是仅仅暴露一个 export 或多个 export。
举例说明，例如 polyfill，它影响全局作用域，并且通常不提供 export。
如果你的代码确实有一些副作用，那么可以改为提供一个数组：
```
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js"
  ]
}
```
数组方式支持相关文件的相对路径、绝对路径和 glob 模式。它在内部使用 micromatch。

注意，任何导入的文件都会受到 tree shaking 的影响。这意味着，如果在项目中使用类似 css-loader 并导入 CSS 文件，则需要将其添加到 side effect 列表中，以免在生产模式中无意中将它删除：
```
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js",
    "*.css"
  ]
}
```
最后，还可以在 module.rules 配置选项 中设置 "sideEffects"。

这个sideEffects应该是把有可能有副作用的代码文件路径放进去,有点迷

为了使用 tree shaking必须:
- 使用 ES2015 模块语法（即 import 和 export）。
- 在项目 package.json 文件中，添加一个 "sideEffects" 属性。
- 引入一个能够删除未引用代码(dead code)的压缩工具(minifier)（例如 UglifyJSPlugin）。


[webpack-4-beta-try-it-today](https://medium.com/webpack/webpack-4-beta-try-it-today-6b1d27d7d7e2#9a67)



# Production
webpack4内置了压缩插件[UglifyjsWebpackPlugin](https://webpack.js.org/plugins/uglifyjs-webpack-plugin/)
如果觉得他的tree-shaking或其他方面不好,可以考虑用这些替换:
[webpack-closure-compiler](https://github.com/roman01la/webpack-closure-compiler)
[babel-minify-webpack-plugin](https://github.com/webpack-contrib/babel-minify-webpack-plugin)
并且要这么配置
```
const WebpackClosureCompiler = require('webpack-closure-compiler');

module.exports = {
  //...
  optimization: {
    minimizer: [
      new WebpackClosureCompiler({ /* your config */ })
    ]
  }
};
```

一个令人蛋疼的点:设置optimization.minimizer会覆盖webpack提供的默认值，因此必须同时指定JS minimalizer(也就是说uglifyjs-webpack-plugin你可能还是要主动装!)

webpack v4开始，指定mode自动配置[DefinePlugin](https://webpack.js.org/plugins/define-plugin/)

避免source-map类型`inline-***`和`eval-***`在生产中使用，因为它们会增加bundle尺寸并降低整体性能。


css萃取
```
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  }
}
```

更多css萃取相关,参考这个[minimizing-for-production](https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production)


# Code Splitting
代码分离是 webpack 中最引人注目的特性之一。此特性能够把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

有三种常用的代码分离方法：
- 入口起点：使用 entry 配置手动地分离代码。
- 防止重复：使用 [SplitChunks](https://webpack.js.org/plugins/split-chunks-plugin/) 去重和分离 chunk。(应该是相当于以前的CommonsChunkPlugin)
- 动态导入：通过模块的内联函数调用来分离代码。


## Entry Points
```
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    another: './src/another-module.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

```
Version: webpack 4.20.2
Asset              Size   Chunks             Chunk Names
another.bundle.js  551 KiB  another  [emitted]  another
index.bundle.js  551 KiB    index  [emitted]  index
```
缺点:
- 如果入口 chunks 之间包含重复的模块，那些重复模块都会被引入到各个 bundle 中。
- 这种方法不够灵活，并且不能将核心应用程序逻辑进行动态拆分代码。

以上两点中，第一点对我们的示例来说无疑是个问题，因为之前我们在 `./src/index.js` 中也引入过 lodash，这样就在两个 bundle 中造成重复引用。所以导致2个包都重复打包了lodash,导致打出500KB的包.

## SplitChunksPlugin
CommonsChunkPlugin 已经从 webpack v4（代号 legato）中移除。
由SplitChunksPlugin替代。

```
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    another: './src/another-module.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
```

```
Version: webpack 4.20.2
                Asset             Size                 Chunks             Chunk Names
              another.bundle.js  6.94 KiB                another  [emitted]  another
                index.bundle.js  7.08 KiB                  index  [emitted]  index
vendors~another~index.bundle.js   547 KiB  vendors~another~index  [emitted]  vendors~another~index
```
这里使用 SplitChunks 之后，可以看出，index.bundle.js 和another.bundle.js中已经移除了重复的依赖模块。


其他一些用于分离代码的插件
[mini-css-extract-plugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)
[bundle-loader](https://webpack.js.org/loaders/bundle-loader/)
[promise-loader](https://github.com/gaearon/promise-loader)


# Dynamic Imports
当涉及到动态代码拆分时，webpack 提供了两个类似的技术。
对于动态导入，第一种，也是推荐选择的方式是，使用符合 [ECMAScript提案](https://github.com/tc39/proposal-dynamic-import) 的 [import()](https://webpack.js.org/api/module-methods/#import-) 语法。
第二种，则是使用 webpack 特定的 [require.ensure](https://webpack.js.org/api/module-methods/#require-ensure)。

`import()` 调用会在内部用到 promises。
如果在旧有版本浏览器中使用 `import()`，记得使用 一个 polyfill 库（例如 [es6-promise](https://github.com/stefanpenner/es6-promise) 或 [promise-polyfill](https://github.com/taylorhakes/promise-polyfill)），来 shim Promise。


## output.chunkFilename 
`string`
此选项决定了非入口(non-entry) chunk 文件的名称。

注意，这些文件名需要在 runtime 根据 chunk 发送的请求去生成。因此，需要在 webpack runtime 输出 bundle 值时，将 chunk id 的值对应映射到占位符(如 [name] 和 [chunkhash])。这会增加文件大小，并且在任何 chunk 的占位符值修改后，都会使 bundle 失效。

默认使用 [id].js 或从 output.filename 中推断出的值（[name] 会被预先替换为 [id] 或 [id].）。

在`import()`注释中使用 webpackChunkName。会导致 bundle 被命名为 [name].bundle.js ，而不是 [id].bundle.js 。

```
async function getComponent() {
    var element = document.createElement('div');
    const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    return element;
}
getComponent().then(component => {
    document.body.appendChild(component);
});
```

```
Version: webpack 4.20.2
                   Asset      Size          Chunks             Chunk Names
         index.bundle.js  8.76 KiB           index  [emitted]  index
vendors~lodash.bundle.js   547 KiB  vendors~lodash  [emitted]  vendors~lodash
```
过去使用`import()`要配合[babel-plugin-syntax-dynamic-import](https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import/#installation)一起使用,现在貌似不用了.


# Prefetching/Preloading modules 
ssr中用的蛮多的技术.

webpack 4.6.0+增加了对预取和预加载的支持。

在声明导入时使用这些内联指​​令允许webpack输出“Resource Hint”，它告诉浏览器：
- prefetch：将来某些页面可能需要资源
- preload：当前页面可能需要资源

```
import(/* webpackPrefetch: true */ 'LoginModal');
```
这将导致`<link rel="prefetch" href="login-modal-chunk.js">`被附加在页面的头部，这将指示浏览器在空闲时间预取login-modal-chunk.js文件。

一旦父块加载，webpack将添加预取提示。
与prefetch相比，Preload指令有许多不同之处：
- 预加载(preloaded)的块开始与父块并行加载。父块完成加载后，将启动预取的块( prefetched)。
- 预加载的块具有中等优先级并立即下载。浏览器空闲时会下载预取的块。
- 父组块应立即请求预加载的块。可以在将来的任何时间使用预取的块。
- 浏览器支持是不同的。

```
import(/* webpackPreload: true */ 'ChartingLibrary');
```
假设一个ChartComponent需要巨大的组件ChartingLibrary。
它会LoadingIndicator在呈现时显示并立即执行按需导入ChartingLibrary.
当ChartComponent请求使用该页面的页面时，也会通过请求charting-library-chunk`<link rel="preload">`。假设页面块较小并且完成得更快，则页面将显示a LoadingIndicator，直到已经请求charting-library-chunk完成为止。这将提供一点加载时间，因为它只需要一次往返而不是两次。特别是在高延迟环境中。

错误地使用webpackPreload实际上会损害性能，因此使用它时要小心

[link-rel-prefetch-preload-in-webpack](https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c)
[preload-prefetch-and-priorities-in-chrome](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)
[Preloading_content](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)


# Bundle Analysis
[analyse](https://github.com/webpack/analyse)//这个是webpack自带的好像是
[webpack-chart](https://github.com/alexkuz/webpack-chart)
[webpack-visualizer](https://github.com/chrisbateman/webpack-visualizer)
[webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)


# Lazy Loading
懒加载或者按需加载，是一种很好的优化网页或应用的方式。
这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。
这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载。

```
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, 'dist')
  },
```

```
Version: webpack 4.20.2

          Asset       Size  Chunks             Chunk Names
index.bundle.js    556 KiB   index  [emitted]  index
 print.chunk.js  645 bytes   print  [emitted]  print
     index.html  187 bytes          [emitted]
```
当调用 ES6 模块的 import() 方法（引入模块）时，必须指向模块的 .default 值，因为它才是 promise 被处理后返回的实际的 module 对象。

[react-router code-splitting](https://reacttraining.com/react-router/web/guides/code-splitting)
[Lazy-load-in-Vue-using-Webpack-s-code-splitting](https://alexjoverm.github.io/2017/07/16/Lazy-load-in-Vue-using-Webpack-s-code-splitting/)
[angularjs-webpack-lazyload](https://medium.com/@var_bin/angularjs-webpack-lazyload-bb7977f390dd)
[lazy-loading-es2015-modules-in-the-browser](https://dzone.com/articles/lazy-loading-es2015-modules-in-the-browser)


# Caching
## output.path 
`string`
output 目录对应一个绝对路径。
```
module.exports = {
  //...
  output: {
    path: path.resolve(__dirname, 'dist/assets')
  }
};
```

## output.filename 
`string function`
此选项决定了每个输出 bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下。

对于单个入口起点，filename 会是一个静态名称。
```
module.exports = {
  //...
  output: {
    filename: 'bundle.js'
  }
};
```

当通过多个入口起点(entry point)、代码拆分(code splitting)或各种插件(plugin)创建多个 bundle，应该使用以下一种替换方式，来赋予每个 bundle 一个唯一的名称……

使用入口名称：
```
module.exports = {
  //...
  output: {
    filename: '[name].bundle.js'
  }
};
```
使用内部 chunk id
```
module.exports = {
  //...
  output: {
    filename: '[id].bundle.js'
  }
};
```
使用每次构建过程中，唯一的 hash 生成
```
module.exports = {
  //...
  output: {
    filename: '[name].[hash].bundle.js'
  }
};
```
使用基于每个 chunk 内容的 hash：
```
module.exports = {
  //...
  output: {
    filename: '[chunkhash].bundle.js'
  }
};
```
使用为提取的内容生成的哈希：
```
module.exports = {
  //...
  output: {
    filename: '[contenthash].bundle.css'
  }
};
```
使用函数返回文件名：
```
module.exports = {
  //...
  output: {
    filename: (chunkData) => {
      return chunkData.chunk.name === 'main' ? '[name].js': '[name]/[name].js';
    },
  }
};
```

[hash] 和 [chunkhash] 的长度可以使用 [hash:16]（默认为20）来指定。或者，通过指定[output.hashDigestLength](https://webpack.js.org/configuration/output/#output-hashdigestlength) 在全局配置长度。

在使用 ExtractTextWebpackPlugin 时，可以用 [contenthash] 来获取提取文件的 hash（既不是 [hash] 也不是 [chunkhash]）。

```
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  }
```
因为 webpack 在入口 chunk 中，包含了某些样板(boilerplate)，特别是 runtime 和 manifest。可能导致每次打出的包,虽然内容没变,但是contenthash/chunkhash的值还是发生了变化.在文件结构比较简单时可能不会发生变化.


## 提取模板 Extracting Boilerplate
将 optimization.runtimeChunk 设置为 single，就能创建单个运行时 bundle(one runtime bundle).

### optimization.runtimeChunk
```
  optimization: {
    runtimeChunk: 'single'
  }

//output
                          Asset       Size  Chunks             Chunk Names
   main.845262d1c1cf85cfe242.js   69.7 KiB       0  [emitted]  main
runtime.2a0331f68276675b6b4d.js   1.42 KiB       1  [emitted]  runtime
                     index.html  275 bytes          [emitted]
```
相当于设置了
```
module.exports = {
  //...
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    }
  }
};
```

```
  optimization: {
    runtimeChunk: true//或'multiple'
  }

//output
                               Asset       Size  Chunks             Chunk Names
        main.845262d1c1cf85cfe242.js   69.7 KiB       0  [emitted]  main
runtime~main.2a0331f68276675b6b4d.js   1.42 KiB       1  [emitted]  runtime~main
                          index.html  280 bytes          [emitted]
```
相当于设置了
```
module.exports = {
  //...
  optimization: {
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    }
  }
};
```


### splitChunks.cacheGroups 
缓存组可以继承和/或覆盖任何`splitChunks.*`的选项; 
但是test，priority和reuseExistingChunk只能在高速缓存组级别配置(cache group level)。要禁用任何默认缓存组，请将其设置为false。
```
module.exports = {
  //...
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false
      }
    }
  }
};
```

提取vendors bundle
```
module.exports = {
  //...
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
};

//output

                          Asset       Size  Chunks             Chunk Names
   main.0a87143b1eb30e13df7c.js  260 bytes       0  [emitted]  main
vendors.0a20f6f07497391db6f5.js   69.5 KiB       1  [emitted]  vendors
runtime.ad513d18f94de88a582b.js   1.42 KiB       2  [emitted]  runtime
                     index.html  353 bytes          [emitted]
```

## 模块标识符 Module Identifiers
### module.id (CommonJS) 
当前模块的 ID。
```
module.id === require.resolve('./file.js');
```
只修改主体文件,并未修改node_modules里的文件,vendors的hash值却发生了变化,为了解决这个问题可以用2种插件解决:
NamedModulesPlugin  
`new webpack.NamedModulesPlugin()`
将使用模块的路径，而不是数字标识符。
虽然此插件有助于在开发过程中输出结果的可读性，然而执行时间会长一些,适合在开发环境中使用。(说实话我没看出来哪里增加了可读性了)

[HashedModuleIdsPlugin](https://webpack.js.org/plugins/hashed-module-ids-plugin/)
推荐用于生产环境构建
`new webpack.HashedModuleIdsPlugin()`


[what is cache](https://searchstorage.techtarget.com/definition/cache)
[Explain Hash Changes in Caching Guide](https://github.com/webpack/webpack.js.org/issues/652)


# Authoring Libraries
externals可以指定某些库/文件不打入bundle中
```
  externals: [
    'library/one',
    'library/two',
    // 所有以 "library/" 开始的
    /^library\/.+$/
  ]

      externals: {
        lodash: {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: 'lodash',
            root: '_'
        }
    }
```

```
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'webpack-numbers.js',
        library: 'webpackNumbers',
        libraryTarget: 'umd'
    },
```

有以下几种方式暴露 library：
- 变量：作为一个全局变量，通过 script 标签来访问（libraryTarget:'var'）。
- this：通过 this 对象访问（libraryTarget:'this'）。
- window：在浏览器中通过 window 对象访问（libraryTarget:'window'）。
- UMD：在 AMD 或 CommonJS require 之后可访问（libraryTarget:'umd'）。

如果设置了 library 但没有设置 libraryTarget，则 libraryTarget 默认指定为 var。


# shimming
## shim 预置全局变量
使用 ProvidePlugin 后，能够在 webpack 编译的每个模块中，通过访问一个变量来获取一个 package。
还可以使用 ProvidePlugin 暴露出某个模块中单个导出，通过配置一个“数组路径”（例如 `[module, child, ...children?]`）实现此功能。
```
  plugins: [
    new webpack.ProvidePlugin({
      //_: 'lodash',
      join: ['lodash', 'join']
    }),
  ]
```

## 细粒度 shim
一些遗留模块依赖的 this 指向的是 window 对象。
当模块运行在 CommonJS 上下文中，也就是说此时的 this 指向的是 module.exports。在这种情况下，可以通过使用 `imports-loader` 覆盖 this 指向.
```
  module: {
    rules: [
      {
        test: require.resolve('index.js'),
        use: 'imports-loader?this=>window'
      }
    ]
  },
```

## 全局 export 
假设某个 library 创建出一个全局变量，它期望 consumer(使用者) 使用这个变量。
可以使用 `exports-loader`，将一个全局变量作为一个普通的模块来导出。
`imports-loader`与`exports-loader`似乎不能同时使用.


# 环境变量
`webpack --env.NODE_ENV=local --env.production --progress`

```
const path = require('path');

module.exports = env => {
  // Use env.<YOUR VARIABLE> here:
  console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
  console.log('Production: ', env.production); // true

  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
};
```


# 管理依赖
## 带表达式的 require 语句 
`require('./template/' + name + '.ejs');`
webpack 解析 require() 调用，然后提取出如下一些信息：
```
Directory: ./template
Regular expression: /^.*\.ejs$/
```
生成一个 context module(上下文模块)。它包含目录下的所有模块的引用，是通过一个 request 解析出来的正则表达式，去匹配目录下所有符合的模块，然后都 require 进来。此 context module 包含一个 map 对象，会把 request 中所有模块翻译成对应的模块 id。

webpack 能够支持动态地 require，但会导致所有可能用到的模块都包含在 bundle 中。

## require.context 
还可以通过 `require.context()` 函数来创建自己的 context。
可以给这个函数传入三个参数：一个要搜索的目录，一个标记表示是否还搜索其子目录， 以及一个匹配文件的正则表达式。
webpack 会在构建中解析代码中的 `require.context()` 。
```
require.context(directory, useSubdirectories = false, regExp = /^\.\//);
```

示例：
```
// （创建出）一个 context，其中文件来自 test 目录，request 以 `.test.js` 结尾。
require.context('./test', false, /\.test\.js$/);

// （创建出）一个 context，其中所有文件都来自父文件夹及其所有子级文件夹，request 以 `.stories.js` 结尾。
require.context('../', true, /\.stories\.js$/);
```
传递给 require.context 的参数必须是字面量(literal)

## context module API 
一个 context module 会导出一个（require）函数，此函数可以接收一个参数：request。

此导出函数有三个属性：resolve, keys, id。
- resolve 是一个函数，它返回 request 被解析后得到的模块 id。
- keys 也是一个函数，它返回一个数组，由所有可能被此 context module 处理的请求组成。
- id 是 context module 里面所包含的模块 id. 它可能在你使用 module.hot.accept 时会用到。

如果想引入一个文件夹下面的所有文件，或者引入能匹配一个正则表达式的所有文件，这个功能就会很有帮助，例如：
```
function importAll (r) {
  r.keys().forEach(r);
}

importAll(require.context('../components/', true, /\.js$/));
var cache = {};
```

```
// 在构建时(build-time)，所有被 require 的模块都会被填充到 cache 对象中。
function importAll (r) {
  r.keys().forEach(key => cache[key] = r(key));
}

importAll(require.context('../components/', true, /\.js$/));
```


# 公共路径
```
import webpack from 'webpack';

// 尝试使用环境变量，否则使用根路径
const ASSET_PATH = process.env.ASSET_PATH || '/';

export default {
  output: {
    publicPath: ASSET_PATH
  },

  plugins: [
    // 这可以帮助我们在代码中安全地使用环境变量
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
    })
  ]
};
```

webpack 暴露了一个名为 `__webpack_public_path__` 的全局变量。所以在应用程序的 entry point 中，可以直接如下设置
`__webpack_public_path__ = process.env.ASSET_PATH;`


# 构建性能
## 通用环境 
### loader 
对最少数量的必要模块使用 loader。
```
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader'
      }
    ]
  }
};
```
每个额外的 loader/plugin 都有其启动时间。尽量少使用工具。

### 解析 
以下步骤可以提高解析速度:
- 减少 resolve.modules, resolve.extensions, resolve.mainFiles, resolve.descriptionFiles 中 items 数量，因为他们会增加文件系统调用的次数。
- 如果你使用 symlinks（例如 npm link 或者 yarn link），可以设置 resolve.symlinks: false。
- 如果使用自定义 resolve plugin 规则，并且没有指定 context 上下文，可以设置 resolve.cacheWithContext: false。

### Dlls
使用 DllPlugin 为更改不频繁的代码生成单独编译结果。这可以提高应用程序的编译速度，尽管它确实增加了构建过程的复杂度。

### 小即是快(smaller = faster) 
减少编译结果的整体大小，以提高构建性能。尽量保持 chunk 体积小。
- 使用数量更少/体积更小的 library。
- 在多页面应用程序中使用 CommonsChunkPlugin。
- 在多页面应用程序中使用 CommonsChunkPlugin，并开启 async 模式。
- 移除未引用代码。
- 只编译当前正在开发的那些代码。

### worker 池(worker pool) 
thread-loader 可以将非常消耗资源的 loader 分流给一个 worker pool。

不要使用太多的 worker，因为 Node.js 的 runtime 和 loader 都有启动开销。最小化 worker 和 main process(主进程) 之间的模块传输。进程间通讯(IPC, inter process communication)是非常消耗资源的。

### 持久化缓存 
使用 cache-loader 启用持久化缓存。使用 package.json 中的 "postinstall" 清除缓存目录。


## 开发环境
### 增量编译 
使用 webpack 的 watch mode(监听模式)。而不使用其他工具来 watch 文件和调用 webpack 。内置的 watch mode 会记录时间戳并将此信息传递给 compilation 以使缓存失效。

在某些配置环境中，watch mode 会回退到 poll mode(轮询模式)。监听许多文件会导致 CPU 大量负载。在这些情况下，可以使用 watchOptions.poll 来增加轮询的间隔。

### 在内存中编译 
下面几个工具通过在内存中（而不是写入磁盘）编译和 serve 资源来提高性能：
- webpack-dev-server
- webpack-hot-middleware
- webpack-dev-middleware

### stats.toJson 加速 
webpack 4 默认使用 `stats.toJson()` 输出大量数据。除非在增量步骤中做必要的统计，否则请避免获取 stats 对象的部分内容。webpack-dev-server 在 v3.1.3 以后的版本，包含一个重要的性能修复，即最小化每个增量构建步骤中，从 stats 对象获取的数据量。

### devtool 
需要注意的是不同的 devtool 设置，会导致不同的性能差异。
- "eval" 具有最好的性能，但并不能帮助你转译代码。
- 如果你能接受稍差一些的 map 质量，可以使用 cheap-source-map 变体配置来提高性能
- 使用 eval-source-map 变体配置进行增量编译。

=> 在大多数情况下，最佳选择是 `cheap-module-eval-source-map`。

### 避免在生产环境下才会用到的工具 
某些 utility, plugin 和 loader 都只用于生产环境。例如，在开发环境下使用 TerserPlugin 来 minify(压缩) 和 mangle(混淆破坏) 代码是没有意义的。
通常在开发环境下，应该排除以下这些工具：
- TerserPlugin
- ExtractTextPlugin
- [hash]/[chunkhash]
- AggressiveSplittingPlugin
- AggressiveMergingPlugin
- ModuleConcatenationPlugin

### 最小化 entry chunk 
webpack 只会在文件系统中生成已经更新的 chunk。
某些配置选项（HMR, output.chunkFilename 的 `[name]/[chunkhash]`, `[hash]`）来说，除了对更新的 chunk 无效之外，对于 entry chunk 也不会生效。

确保在生成 entry chunk 时，尽量减少其体积以提高性能。下面的代码块将只提取包含 runtime 的 chunk，其他 chunk 都作为其子 chunk:
```
new CommonsChunkPlugin({
  name: 'manifest',
  minChunks: Infinity
});
```

### 避免额外的优化步骤 
webpack 通过执行额外的算法任务，来优化输出结果的体积和加载性能。这些优化适用于小型代码库，但是在大型代码库中却非常耗费性能：
```
module.exports = {
  // ...
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  }
};
```

### 输出结果不携带路径信息 
webpack 会在输出的 bundle 中生成路径信息。然而，在打包数千个模块的项目中，这会导致造成垃圾回收性能压力。在 options.output.pathinfo 设置中关闭：
```
module.exports = {
  // ...
  output: {
    pathinfo: false
  }
};
```

### Node.js 版本 
最新稳定版本的 Node.js 及其 ES2015 Map 和 Set 实现，出现一些 性能回退。其修复版本已经合并到 master 分支，但是有些已经发布的正式版本无法应用到这些修复内容。同时，为了充分利用增量构建速度，请尝试使用 8.9.x 版本（8.9.10 - 9.11.1 之间的版本存在性能问题）。webpack 已经开始大量使用这些 ES2015 数据结构，因此选择这些版本也将改善初始构建时间。

### TypeScript loader 
ts-loader 已经开始使用 TypeScript 内置 watch mode API，可以明显减少每次迭代时重新构建的模块数量。experimentalWatchApi 与普通 TypeScript watch mode 共享同样的逻辑，并且在开发环境使用时非常稳定。此外开启 transpileOnly，用于真正快速增量构建。
```
module.exports = {
  // ...
  test: /\.tsx?$/,
  use: [
    {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        experimentalWatchApi: true,
      },
    },
  ],
};
```
注意：ts-loader 文档建议使用 cache-loader，但是这实际上会由于使用硬盘写入而减缓增量构建速度。

### TypeScript 
在单独的进程中使用 fork-ts-checker-webpack-plugin 进行类型检查。
配置 loader 跳过类型检查。
使用 ts-loader 时，设置 `happyPackMode: true / transpileOnly: true`。

### Sass 
node-sass 中有个来自 Node.js 线程池的阻塞线程的 bug。 
当使用 thread-loader 时，需要设置 workerParallelJobs: 2。


## 生产环境 
不要为了很小的性能收益，牺牲应用程序的质量！
注意，在大多数情况下，优化代码质量比构建性能更重要。

### 多个 compilation(编译时) 
在进行多个 compilation 时，以下工具可以帮助到你：
- parallel-webpack：它允许在 worker 池中运行 compilation。
- cache-loader：可以在多个 compilation 之间共享缓存。


