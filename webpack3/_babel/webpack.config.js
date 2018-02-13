const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js'
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Code Splitting'
    }),
    //CommonsChunkPlugin 与 chunkFilename 同时存在
    //commonjs不会把chunkfile打进去，而是一个引用？
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common' // 指定公共 bundle 的名称。
    })
  ],
  output: {
    filename: '[name].bundle.js',
    //决定非入口 chunk 的名称
    //bundle 被命名为 lodash.bundle.js
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};