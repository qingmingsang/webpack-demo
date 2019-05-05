const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Caching'
    }),
    //第一个插件是 NamedModulesPlugin，将使用模块的路径，而不是一个数字 identifier。虽然此插件有助于在开发环境下产生更加可读的输出结果，然而其执行时间会有些长。
    //第二个选择是使用 HashedModuleIdsPlugin，推荐用于生产环境构建
    //避免verndor的hash变化
    new webpack.HashedModuleIdsPlugin(),
  ],
  output: {
    //contenthash现在貌似不需要啥配置也能稳定不变了
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  // optimization: {
  //   runtimeChunk: {
  //     name: 'runtime'
  //   }
  // },
  // optimization: {
  //   runtimeChunk: true
  // },
  // optimization: {
  //   runtimeChunk: 'multiple'
  // },
  optimization: {
    runtimeChunk: 'single',//runtime分离出去
    splitChunks: {
      cacheGroups: {//lodash分离出去
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
};