# 拓展阅读
[Module Methods](https://webpack.js.org/api/module-methods/)
[Writing a Loader](https://webpack.js.org/contribute/writing-a-loader/)
[tapable](https://github.com/webpack/tapable)
[Modular_programming](https://en.wikipedia.org/wiki/Modular_programming)
[commonjs](http://www.commonjs.org/specs/modules/1.0/)
[AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md)
[webpack-http-2](https://medium.com/webpack/webpack-http-2-7083ec3f3ce6#.7y5d3hz59)

# concepts 概念
## entry
入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始，webpack 会找出有哪些模块和 library 是入口起点（直接和间接）依赖的。

默认值是 `./src/index.js`，然而，可以通过在 webpack 配置中配置 entry 属性，来指定一个不同的入口起点（或者也可以指定多个入口起点）。
```
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

## output
output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，主输出文件默认为 ./dist/main.js，其他生成文件的默认输出目录是 ./dist。
```
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```

## loader
作为开箱即用的自带特性，webpack 自身只支持 JavaScript。
而 loader 能够让 webpack 处理那些非 JavaScript 文件，并且先将它们转换为有效 模块，然后添加到依赖图中，这样就可以提供给应用程序使用。
```
const path = require('path');

const config = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};

module.exports = config;
```

`test` 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
`use` 属性，表示进行转换时，应该使用哪个 loader。

## plugins
loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务，插件的范围包括：
打包优化、资源管理和注入环境变量。
```
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

module.exports = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```

## mode
通过将 mode 参数设置为 development, production 或 none，可以启用对应环境下 webpack 内置的优化。默认值为 production。
```
module.exports = {
  mode: 'production'
};
```

## 浏览器兼容性 
webpack 支持所有 ES5 兼容（IE8 及以下不提供支持）的浏览器。webpack 的 `import()` 和 `require.ensure()` 需要环境中有 Promise。
如果你想要支持旧版本浏览器，你应该在使用这些 webpack 提供的表达式之前，先加载一个 polyfill。


# entry points 入口点
单个入口（简写）语法
`entry: string|Array<string>`

```
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

对象语法 
`entry: {[entryChunkName: string]: string|Array<string>}`

```
module.exports = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
};
```

多页面应用程序 
```
module.exports = {
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js'
  }
};
```

# output 输出
配置 output 选项可以控制 webpack 如何向硬盘写入编译文件。
注意，即使可以存在多个入口起点，但只可指定一个输出配置。

```
module.exports = {
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
};

// 写入到硬盘：./dist/app.js, ./dist/search.js
```

使用 CDN 和资源 hash 的复杂示例：
```
module.exports = {
  //...
  output: {
    path: '/home/proj/cdn/assets/[hash]',
    publicPath: 'http://cdn.example.com/assets/[hash]/'
  }
};
```

在编译时不知道最终输出文件的 publicPath 路径的情况下，publicPath 可以留空，并且在入口起点文件运行时动态设置。
如果你在编译时不知道 publicPath，你可以先忽略它，并且在入口起点设置 `__webpack_public_path__`。
```
__webpack_public_path__ = myRuntimePublicPath;

// 剩余的应用程序入口
```

# mode
提供 mode 配置选项，告知 webpack 使用相应模式的内置优化。
```
//只在配置中提供 mode 选项：
module.exports = {
  mode: 'production'
};

//或者从 CLI 参数中传递：
webpack --mode=production
```

mode |  作用
-|-
development | 会将 `process.env.NODE_ENV` 的值设为 `development`。启用 `NamedChunksPlugin` 和 `NamedModulesPlugin`。
production | 会将 `process.env.NODE_ENV` 的值设为 `production`。启用 `FlagDependencyUsagePlugin`, `FlagIncludedChunksPlugin`, `ModuleConcatenationPlugin`, `NoEmitOnErrorsPlugin`, `OccurrenceOrderPlugin`, `SideEffectsFlagPlugin` 和 `UglifyJsPlugin`.
none | 不选用任何默认优化选项


如果想要根据 webpack.config.js 中的 mode 变量去影响编译行为，那你必须将导出对象，改为导出一个函数：
```
var config = {
  entry: './app.js'
  //...
};

module.exports = (env, argv) => {

  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  if (argv.mode === 'production') {
    //...
  }

  return config;
};
```


# loader
loader 用于对模块的源代码进行转换。loader 可以使你在 import 或"加载"模块时预处理文件。
因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的强大方法。

## Configuration 
module.rules 允许你在 webpack 配置中指定多个 loader。 
这是展示 loader 的一种简明方式，并且有助于使代码变得简洁。
同时让你对各个 loader 有个全局概览：
```
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  }
};
```

## inline
可以在 import 语句或任何等效于 "import" 的方式中指定 loader。
使用 `!` 将资源中的 loader 分开。
分开的每个部分都相对于当前目录解析。
```
import Styles from 'style-loader!css-loader?modules!./styles.css';
```
通过前置所有规则及使用 `!`，可以将源文件对应重载到配置中的任意 loader 中。
选项可以传递查询参数，例如 `?key=value&foo=bar`，或者一个 JSON 对象，例如 `?{"key":"value","foo":"bar"}`。

## CLI 
你也可以通过 CLI 使用 loader：
```
webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
```

## loader 特性 
- loader 支持链式传递。loader 链中每个 loader，都对前一个 loader 处理后的资源进行转换。loader 链会按照相反的顺序执行。第一个 loader 将（应用转换后的资源作为）返回结果传递给下一个 loader，依次这样执行下去。最终，在链中最后一个 loader，返回 webpack 所预期的 JavaScript。
- loader 可以是同步的，也可以是异步的。
- loader 运行在 Node.js 中，并且能够执行任何可能的操作。
- loader 接收查询参数。用于对 loader 传递配置。
- loader 也能够使用 options 对象进行配置。
- 除了使用 package.json 常见的 main 属性，还可以将普通的 npm 模块导出为 loader，做法是在 package.json 里定义一个 loader 字段。
- 插件(plugin)可以为 loader 带来更多特性。
- loader 能够产生额外的任意文件。


## 解析 loader 
loader 遵循标准的模块解析。多数情况下，loader 将从模块路径（通常将模块路径认为是 npm install, node_modules）解析。

loader 模块需要导出为一个函数，并且使用 Node.js 兼容的 JavaScript 编写。
通常使用 npm 进行管理，但是也可以将自定义 loader 作为应用程序中的文件。
按照约定，loader 通常被命名为 xxx-loader（例如 json-loader）。
有关详细信息，请查看[如何编写 loader](https://webpack.js.org/contribute/writing-a-loader/)。


# plugins
## 剖析 Anatomy
webpack 插件是一个具有 apply 方法的 JavaScript 对象。
apply 属性会被 webpack compiler 调用，并且 compiler 对象可在整个编译生命周期访问。
```
//ConsoleLogOnBuildWebpackPlugin.js

const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, compilation => {
      console.log('webpack 构建过程开始！');
    });
  }
}
```
compiler hook 的 tap 方法的第一个参数，应该是驼峰式命名的插件名称。建议为此使用一个常量，以便它可以在所有 hook 中复用。

## 用法  Usage
由于插件可以携带参数/选项，你必须在 webpack 配置中，向 plugins 属性传入 new 实例。

根据你的 webpack 用法，这里有多种方式使用插件。

### 配置 Configuration 
```
const HtmlWebpackPlugin = require('html-webpack-plugin'); //通过 npm 安装
const webpack = require('webpack'); //访问内置的插件
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    filename: 'my-first-webpack.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```

### Node API 
```
//compiler.apply 并不是推荐的使用方式。
const webpack = require('webpack'); //访问 webpack 运行时(runtime)
const configuration = require('./webpack.config.js');

let compiler = webpack(configuration);
compiler.apply(new webpack.ProgressPlugin());

compiler.run(function(err, stats) {
  // ...
});
```


# configuration
因为 webpack 配置是标准的 Node.js CommonJS 模块，你可以做到以下事情：
- 通过 require(...) 导入其他文件
- 通过 require(...) 使用 npm 的工具函数
- 使用 JavaScript 控制流表达式，例如 ?: 操作符
- 对常用值使用常量或变量
- 编写并执行函数来生成部分配置

虽然技术上可行，但应避免以下做法：
- 在使用 webpack 命令行接口(CLI)（应该编写自己的命令行接口(CLI)，或使用 --env）时，访问命令行接口(CLI)参数
- 导出不确定的值（调用 webpack 两次应该产生同样的输出文件）
- 编写很长的配置（应该将配置拆分为多个文件）

```
var path = require('path');

module.exports = {
  mode: 'development',
  entry: './foo.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  }
};
```


# 模块 modules
在模块化编程中，开发者将程序分解成离散功能块(discrete chunks of functionality)，并称之为`_模块_`。

每个模块具有比完整程序更小的接触面，使得校验、调试、测试轻而易举。 
精心编写的`_模块_`提供了可靠的抽象和封装界限，使得应用程序中每个模块都具有条理清楚的设计和明确的目的。

Node.js 从最一开始就支持模块化编程。然而，在 web，模块化的支持正缓慢到来。在 web 存在多种支持 JavaScript 模块化的工具，这些工具各有优势和限制。
webpack 基于从这些系统获得的经验教训，并将`_模块_`的概念应用于项目中的任何文件。

## 什么是 webpack 模块 
对比 Node.js 模块，webpack `_模块_`能够以各种方式表达它们的依赖关系，几个例子如下：
- ES2015 import 语句
- CommonJS require() 语句
- AMD define 和 require 语句
- css/sass/less 文件中的 @import 语句。
- 样式(url(...))或 HTML 文件(<img src=...>)中的图片链接(image url)

## 支持的模块类型 
webpack 通过 loader 可以支持各种语言和预处理器编写模块。loader 描述了 webpack 如何处理 非 JavaScript(non-JavaScript) `_模块_`，并且在bundle中引入这些`_依赖_`。 webpack 社区已经为各种流行语言和语言处理器构建了 loader.
总的来说，webpack 提供了可定制的、强大和丰富的 API，允许任何技术栈使用 webpack，保持了在你的开发、测试和生成流程中无侵入性(non-opinionated)。


# 模块解析 module resolution
esolver 是一个库(library)，用于帮助找到模块的绝对路径。一个模块可以作为另一个模块的依赖模块，然后被后者引用，如下：
```
import foo from 'path/to/module';
// 或者
require('path/to/module');
```
所依赖的模块可以是来自应用程序代码或第三方的库(library)。resolver 帮助 webpack 找到 bundle 中需要引入的模块代码，这些代码在包含在每个 `require/import` 语句中。 当打包模块时，webpack 使用 [enhanced-resolve](https://github.com/webpack/enhanced-resolve) 来解析文件路径.

## webpack 中的解析规则 
使用 enhanced-resolve，webpack 能够解析三种文件路径：

### 绝对路径 
```
import '/home/me/file';

import 'C:\\Users\\me\\file';
```
由于我们已经取得文件的绝对路径，因此不需要进一步再做解析。

### 相对路径 
```
import '../src/file1';
import './file2';
```
在这种情况下，使用 import 或 require 的资源文件(resource file)所在的目录被认为是上下文目录(context directory)。在 import/require 中给定的相对路径，会添加此上下文路径(context path)，以产生模块的绝对路径(absolute path)。

### 模块路径 
```
import 'module';
import 'module/lib/file';
```
模块将在 `resolve.modules` 中指定的所有目录内搜索。 
你可以替换初始模块路径，此替换路径通过使用 `resolve.alias` 配置选项来创建一个别名。

一旦根据上述规则解析路径后，解析器(resolver)将检查路径是否指向文件或目录。如果路径指向一个文件：

如果路径具有文件扩展名，则被直接将文件打包。
否则，将使用 `resolve.extensions` 选项作为文件扩展名来解析，此选项告诉解析器在解析中能够接受哪些扩展名（例如 .js, .jsx）。
如果路径指向一个文件夹，则采取以下步骤找到具有正确扩展名的正确文件：

如果文件夹中包含 package.json 文件，则按照顺序查找 `resolve.mainFields` 配置选项中指定的字段。
并且 package.json 中的第一个这样的字段确定文件路径。
如果 package.json 文件不存在或者 package.json 文件中的 main 字段没有返回一个有效路径，则按照顺序查找 `resolve.mainFiles` 配置选项中指定的文件名，看是否能在 import/require 目录下匹配到一个存在的文件名。
文件扩展名通过 `resolve.extensions` 选项采用类似的方法进行解析。

```
module.exports = {
  //...
  resolve: {
    mainFields: ['browser', 'module', 'main']
  }
};
```

## 解析 Loader(Resolving Loaders) 
Loader 解析遵循与文件解析器指定的规则相同的规则。
但是 resolveLoader 配置选项可以用来为 Loader 提供独立的解析规则。
```
module.exports = {
  //...
  resolveLoader: {
    modules: [ 'node_modules' ],
    extensions: [ '.js', '.json' ],
    mainFields: [ 'loader', 'main' ]
  },
  //...
  resolve: {
    alias: {
      Utilities: path.resolve(__dirname, 'src/utilities/'),
      Templates: path.resolve(__dirname, 'src/templates/')
    }
  }
};
```

## 缓存 
每个文件系统访问都被缓存，以便更快触发对同一文件的多个并行或串行请求。
在观察模式下，只有修改过的文件会从缓存中摘出。如果关闭观察模式，在每次编译前清理缓存。
```
module.exports = {
  //...
  watch: false
};
```

# 依赖图 dependency graph
任何时候，一个文件依赖于另一个文件，webpack 就把此视为文件之间有依赖关系。
这使得 webpack 可以接收非代码资源(non-code asset)（例如图像或 web 字体），并且可以把它们作为_依赖_提供给你的应用程序。

webpack 从命令行或配置文件中定义的一个模块列表开始，处理你的应用程序。 
从这些 入口起点 开始，webpack 递归地构建一个依赖图，这个依赖图包含着应用程序所需的每个模块，然后将所有这些模块打包为少量的 bundle -- 通常只有一个 -- 可由浏览器加载。


# manifest
在使用 webpack 构建的典型应用程序或站点中，有三种主要的代码类型：
- 你或你的团队编写的源码。
- 你的源码会依赖的任何第三方的 library 或 "vendor" 代码。
- webpack 的 runtime 和 manifest，管理所有模块的交互。

## Runtime 
runtime，以及伴随的 manifest 数据，
主要是指：在浏览器运行时，webpack 用来连接模块化的应用程序的所有代码。
runtime 包含：在模块交互时，连接模块所需的加载和解析逻辑。
包括浏览器中的已加载模块的连接，以及懒加载模块的执行逻辑。

## Manifest 
当编译器(compiler)开始执行、解析和映射应用程序时，它会保留所有模块的详细要点。
这个数据集合称为 "Manifest"，当完成打包并发送到浏览器时，会在运行时通过 Manifest 来解析和加载模块。
无论你选择哪种模块语法，那些 import 或 require 语句现在都已经转换为 `__webpack_require__`方法，此方法指向模块标识符(module identifier)。
通过使用 manifest 中的数据，runtime 将能够查询模块标识符，检索出背后对应的模块。

*runtime 和 manifest 的注入在每次构建都会发生变化。*

# 构建目标 targets
因为服务器和浏览器代码都可以用 JavaScript 编写，所以 webpack 提供了多种构建目标(target)，你可以在你的 webpack 配置中设置。
## 用法 
要设置 target 属性，只需要在你的 webpack 配置中设置 target 的值。
```
webpack.config.js

module.exports = {
  target: 'node'
};
```
在上面例子中，使用 node webpack 会编译为用于「类 Node.js」环境（使用 Node.js 的 require ，而不是使用任意内置模块（如 fs 或 path）来加载 chunk）。

每个target都有各种部署(deployment)/环境(environment)特定的附加项，以支持满足其需求。
[可用值](https://webpack.js.org/configuration/target/)


## 多个 Target 
尽管 webpack 不支持向 target 传入多个字符串，但是可以通过打包两份分离的配置来创建同构的库：
```
//lib.node.js
const path = require('path');
const serverConfig = {
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.node.js'
  }
  //…
};

//lib.js
const clientConfig = {
  target: 'web', // <=== 默认是 'web'，可省略
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.js'
  }
  //…
};

module.exports = [ serverConfig, clientConfig ];
```


# 模块热替换 hot module replacement
模块热替换(HMR - Hot Module Replacement)功能会在应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面。
主要是通过以下几种方式，来显著加快开发速度：
- 保留在完全重新加载页面时丢失的应用程序状态。
- 只更新变更内容，以节省宝贵的开发时间。
- 调整样式更加快速 - 几乎相当于在浏览器调试器中更改样式。

## HMR 的工作原理
### 在应用程序中  In the Application 
通过以下步骤，可以做到在应用程序中置换(swap in and out)模块：
- 应用程序代码要求 HMR runtime 检查更新。
- HMR runtime（异步）下载更新，然后通知应用程序代码。
- 应用程序代码要求 HMR runtime 应用更新。
- HMR runtime（异步）应用更新。

### 在编译器中 In the Compiler 
除了普通资源，编译器(compiler)需要发出 "update"，以允许更新之前的版本到新的版本。"update" 由两部分组成：
- 更新后的 manifest(JSON)
- 一个或多个更新后的 chunk (JavaScript)

manifest 包括新的编译 hash 和所有的待更新 chunk 目录。每个更新 chunk 都含有对应于此 chunk 的全部更新模块（或一个 flag 用于表明此模块要被移除）的代码。

编译器确保模块 ID 和 chunk ID 在这些构建之间保持一致。通常将这些 ID 存储在内存中（例如，使用 webpack-dev-server 时），但是也可能将它们存储在一个 JSON 文件中。

### 在模块中  In a Module
HMR 是可选功能，只会影响包含 HMR 代码的模块。举个例子，通过 style-loader 为 style 样式追加补丁。 为了运行追加补丁，style-loader 实现了 HMR 接口；当它通过 HMR 接收到更新，它会使用新的样式替换旧的样式。

类似的，当在一个模块中实现了 HMR 接口，你可以描述出当模块被更新后发生了什么。然而在多数情况下，不需要强制在每个模块中写入 HMR 代码。如果一个模块没有 HMR 处理函数，更新就会冒泡。这意味着一个简单的处理函数能够对整个模块树(complete module tree)进行更新。如果在这个模块树中，一个单独的模块被更新，那么整组依赖模块都会被重新加载。

### 在 HMR Runtime 中  In the Runtime
对于模块系统的 runtime，附加的代码被发送到 parents 和 children 跟踪模块。在管理方面，runtime 支持两个方法 check 和 apply。

check 发送 HTTP 请求来更新 manifest。如果请求失败，说明没有可用更新。如果请求成功，待更新 chunk 会和当前加载过的 chunk 进行比较。对每个加载过的 chunk，会下载相对应的待更新 chunk。当所有待更新 chunk 完成下载，就会准备切换到 ready 状态。

apply 方法将所有被更新模块标记为无效。对于每个无效模块，都需要在模块中有一个更新处理函数，或者在它的父级模块们中有更新处理函数。否则，无效标记冒泡，并也使父级无效。每个冒泡继续直到到达应用程序入口起点，或者到达带有更新处理函数的模块（以最先到达为准）。如果它从入口起点开始冒泡，则此过程失败。

之后，所有无效模块都被（通过 dispose 处理函数）处理和解除加载。然后更新当前 hash，并且调用所有 "accept" 处理函数。runtime 切换回闲置状态，一切照常继续。




