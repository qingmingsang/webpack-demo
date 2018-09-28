
# getting started
`Node 8.2/npm 5.2.0` 以上版本提供的 npx 命令，可以运行在初始安装的 webpack 包(package)的 webpack 二进制文件（`./node_modules/.bin/webpack`）.

`npx webpack` 相当于 `"build":"webpack"`-> `npm run build`

默认支持ES2015 中的 import 和 export.

# Asset Management
[MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production)
可用于css萃取

# Output Management
[html-webpack-template](https://github.com/jaketrent/html-webpack-template)
[webpack-manifest-plugin](https://github.com/danethurber/webpack-manifest-plugin)
[introduction-source-maps](https://blog.teamtreehouse.com/introduction-source-maps)

# Hot Module Replacement
[webpack-hot-middleware](https://github.com/webpack-contrib/webpack-hot-middleware)
[react-hot-loader](https://github.com/gaearon/react-hot-loader)

需要注意module.hot.accept前绑定的事件如果更新后可能需要重新绑定.

说实话webpack-dev-server已经帮我们做到了自动检测代码变化并且自动刷新页面了,不知道HMR的必要性是什么.








