
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

[link-rel-prefetch-preload-in-webpack](https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c)
[preload-prefetch-and-priorities-in-chrome](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)
[Preloading_content](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)













