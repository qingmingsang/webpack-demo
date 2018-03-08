const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    // vendor1: ['lodash'],
    // vendor2: ['underscore']
    //vendor: ['lodash', 'underscore']
  },
  plugins: [
    //new webpack.NamedModulesPlugin(),
    //new webpack.HotModuleReplacementPlugin(),
    new HTMLWebpackPlugin({
      title: 'demo'
    }),
    //CommonsChunkPlugin 与 chunkFilename 同时存在
    //commonjs不会把chunkfile打进去，而是一个引用？
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['vendor1', 'vendor2'] // 指定公共 bundle 的名称。
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor'
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: (module) => {
        return module.context && module.context.includes("node_modules");
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'client',
    //   async: 'chunk-vendor',
    //   children: true,
    //   minChunks: (module, count) => {
    //     // 被 3 个及以上 chunk 使用的共用模块提取出来
    //     return count >= 1
    //   }
    // })
  ],
  output: {
    filename: '[name].[chunkhash:8].bundle.js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    path: path.resolve(__dirname, 'dist')
  },
  // devServer: {
  //   hot: true, // 告知 dev-server 正在使用 HMR
  // }
};