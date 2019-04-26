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
  // optimization: {
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         chunks: 'all'
  //       }
  //     }
  //   }
  // },
};