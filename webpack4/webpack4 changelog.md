# webpack4 changelog
翻译webpack4的主要功能变更,bugfixes之类的如果不重要会略过

# V4.0.0

## 大的变更
### 环境
不再支持Node.js 4。源代码已升级为更高的ecmascript版本。

### 用法
现在必须在两种模式之间选择 (`mode` or `--mode`)：`production`  or  `development`
- 生产支持所有类型的优化以生成优化的bundles
- 开发支持开发的注释和提示，并启用`eval devtool`
- 生产不支持watching，开发针对快速增量重建进行了优化
- 生产还可以实现模块连接 (Scope Hoisting)
- 可以使用`optimization.*`标志进行详细配置（构建你的custom mode）
- `process.env.NODE_ENV` 设置为生产或开发（仅在构建的代码中，而不是在配置中）
- 有一种隐藏`none`模式可以禁用所有内容

### 语法
`import()`始终返回命名空间对象。CommonJS模块包含在默认导出中
如果你以前用`import()`导入CommonJs，这可能会破坏你的代码

###  配置
不再需要使用这些插件：
`NoEmitOnErrorsPlugin` - > `optimization.noEmitOnErrors`（在生产模式下默认启用）
`ModuleConcatenationPlugin` - > `optimization.concatenateModules`（在生产模式下默认启用）
`NamedModulesPlugin` - > `optimization.namedModules`（在开发模式下默认启用）
`CommonsChunkPlugin`被删除 - > `optimization.splitChunks`，`optimization.runtimeChunk`

### JSON
- webpack现在可以处理JSON了
    - 在通过loader将JSON转换为JS时可能需要添加`type: "javascript/auto"`
    - 只使用没有loader的JSON应该仍然有用
- 允许通过ESM语法导入JSON
    - JSON模块的未使用导出消除(unused exports elimination for JSON modules)

### 优化
将`uglifyjs-webpack-plugin`升级到v1
- 支持ES15

## 大的功能
### 模块
webpack现在支持以下模块类型：
- `javascript / auto` :( webpack 3中的默认值）启用了所有模块系统的Javascript模块：`CommonJS，AMD，ESM`
- `javascript / esm`：EcmaScript模块，所有其他模块系统都不可用
- `javascript / dynamic`：只有CommonJS和EcmaScript模块不可用
- `json`：JSON数据，可通过require和import获得
- `webassembly / experimental`：WebAssembly模块（目前是实验性的）

`javascript/esm`与`javascript/auto`相比对ESM处理更严格：
- 导入的模块需要存在导入的名称
- 动态模块（非esm，即CommonJs）只能通过default导入，其他所有内容（包括命名空间导入）都会发出错误

`.mjs`模块默认是`javascript/esm`

WebAssembly模块
- 可以导入其他模块（JS和WASM）
- 通过ESM导入验证WebAssembly模块的导出
    - 尝试从WASM导入不存在的导出时，你将收到warning/error
- 只能在async chunks中使用。它们在initial chunks中不起作用（对Web性能不利）
    - 使用WASM通过`import()`导入模块 
- 这是一个实验性特征和变化主题

### 优化
`sideEffects: false` 现在在`package.json`中受支持
- `sideEffects` 在`package.json`中还支持glob表达式和glob表达式数组

使用JSONP数组而不是JSONP函数 - >异步脚本标记支持，顺序不再重要

`optimization.splitChunks`推出新选项
- 详情： https：//gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693

现在通过webpack本身删除了死分支(Dead branches)
- 之前：Uglify删除了死代码
- 现在：webpack删除死代码（在某些情况下）
- 这可以防止`import()`在死分支中发生崩溃

### 语法
`webpackInclude`和`webpackExclude`得到`import()`魔术评论(magic comment)的支持。(webpackInclude and webpackExclude are supported by the magic comment for import())它们允许在使用动态表达式时过滤文件。

`System.import()`现在使用会发出警告
- 可以使用`Rule.parser.system: true`禁用警告 
- 可以通过`Rule.parser.system: false`禁用`System.import`

### 配置
解析(Resolving)现在可以通过`module.rules[].resolve`配置。它与全局配置合并。

`optimization.minimize` 已被添加到开关最小化(minimizing)开/关
- 默认情况下：在生产模式下打开，在开发模式下关闭

`optimization.minimizer` 已被添加以配置最小化器和选项

### 用法
现在验证了一些插件选项

CLI已移至webpack-cli，您需要安装webpack-cli才能使用CLI

ProgressPlugin（`--progress`）现在显示插件名称
- 至少对于迁移到新插件系统的插件

### 性能
UglifyJs现在默认缓存和多线程

多项性能改进，尤其适用于更快的增量重建

改进`RemoveParentModulesPlugin`的性能

### 统计
统计信息可以显示嵌套在连接模块中的模块


## (新增一般)功能
### 配置
为mjs，json和wasm扩展自动选择模块类型。其他扩展需要通过配置`module.rules[].type`

`options.dependencies`现在错误的配置会引发错误

`sideEffects` 可以通过module.rules覆盖

`output.hashFunction` 现在可以是自定义散列函数的构造函数
- 出于性能原因，您可以提供非cryto哈希函数

添加`output.globalObject`配置选项以允许在运行时exitCode中选择全局对象引用

### 运行时(runtime)
误差块装载现在包括更多的信息和两个新的属性type和request。

### Devtool
从SourceMaps和eval中删除评论页脚(remove comment footer from SourceMaps and eval)
增加对支持include test和exclude到EVAL源地图devtool插件

### 性能
webpacks AST可以直接从loader传递给webpack，以避免额外的解析

未使用的模块不再是不必要的连接

添加一个ProfilingPlugin，用于编写包含插件时序的（Chrome）配置文件

迁移到使用for of而不是forEach

迁移到使用Map而Set不是对象

迁移到使用includes而不是indexOf

用字符串方法替换了一些RegExp

队列不会两次排队(enqueues)同一个工作

默认情况下，使用更快的md4哈希进行散列

### 优化
当使用超过25个出口时，损坏的出口名称会更短。

脚本标签不再是`text/javascript`默认值，而是async（节省几个字节）(script tags are no longer text/javascript and async as this are the default values (saves a few bytes))

连接模块现在生成的代码更少

现在不需要常量替换`__webpack_require__`，省略了参数

### 默认
WebPACK现在可看的`.wasm`，`.mjs`，`.js`和`.json`扩展顺序

`output.pathinfo` 现在默认情况下处于开发模式

现在，内存缓存在生产中默认关闭

entry 默认为 `./src`

output.path 默认为 `./dist`

production省略mode选项时使用默认值

### 用法(Usage)
向`SourceMapDevToolPlugin`添加详细的进度报告

删除插件现在提供有用的错误消息

### 统计
现在，尺寸显示为`kiB`而不是统计中的`kB`

默认情况下，入口点显示在统计信息中

现在块显示`<{parents}>` `>{children}<`和`={siblings}=`在统计

buildAt为统计数据添加时间

stats json现在包含输出路径

### 语法
上下文中支持资源查询

import()现在引用入口点名称会发出错误而不是警告

升级到acorn 5并支持ES 2018

### 插件
done 现在是一个异步钩子

## 删除功能
去除 `module.loaders`
去除 `loaderContext.options`
删除 `Compilation.notCacheable`标志
去除 `NoErrorsPlugin`
去除 `Dependency.isEqualResource`
去除 `NewWatchingPlugin`
去除 `CommonsChunkPlugin`

# v4.0.1
添加version属性到webpack导出

# V4.1.0
添加filename选项以`optimization.splitChunks`修改拆分块的文件名模板

允许不将代码发送到包中的模块

# v4.1.1
统计信息现在显示模块的资源(assets)数量

# V4.2.0
添加`splitChunks.automaticNameDelimiter`以配置自动名称的名称分隔符

`stats.excludeModules` 现在也接受布尔

尝试一次运行两次时，webpack会引发错误

performance 默认情况下在非Web目标中处于禁用状态

现在可以通过继承来扩展AMD解析器插件

# v4.3.0
添加对`[contenthash]`占位符的支持

# V4.4.0
如果没有安装webpack-cli，它会要求安装它

`splitChunks.chunks` 现在支持自定义功能

省略mode时更好的警告 

# v4.6.0
给`import()`添加`webpackPrefetch/ webpackPreload`魔术评论

# V4.7.0
添加webpackIgnore magic comment`（import(/* webpackIgnore: true */ "...")）`以保持包中的导入

# v4.9.0
BannerPlugin支持函数作为banner选项

允许serve配置模式中的属性

添加entryOnly选项以DllPlugin仅在入口点中公开模块

允许在webpack-cli和webpack-command之间进行选择(?)

在JSON解析失败时改进错误消息

允许JSON中的BOM

排序usedIds中records的stablility

# v4.11.0
支持reportProgress在afterEmit

如果魔术注释无法编译，则会发出警告

添加了对加载器的matchResource内联请求的支持

在条目块中使用webpackPrefetch现在会在运行时触发预取
- HTML中不需要链接标记

尝试使用从wasm导入的i64函数时将发出警告

# v4.13.0
在DefinePlugin现在支持`runtimeValues`到通过计算值与可随时间变化的依赖

添加 `optimization.hashedModuleIds`

`crossOrigin for chunks`仅在真正需要时才设置

每个块组标记添加

更新增强 - 解决
- 您现在可以使用绝对路径作为键 `resolve.alias`

# v4.15.0
maxSize为splitChunks（实验性）添加选项

在初始块中使用wasm时添加有用的错误

# v4.16.0
添加wasm对electron-renderer目标的支持

添加optimization.moduleIds和optimization.chunkIds选项以替换其他选项

弃用`Dependency.compare`建议使用`compareLocations`
弃用`optimization.namedModules` 
弃用`optimization.hashedModuleIds` 
弃用`optimization.namedChunks`
弃用`optimization.occurrenceOrder` 



