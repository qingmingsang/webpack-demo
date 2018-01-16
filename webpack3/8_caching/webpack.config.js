const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
    vendor: [
      'lodash'
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Caching'
    }),
    //引入顺序在这里很重要。CommonsChunkPlugin 的 'vendor' 实例，
    //必须在 'runtime' 实例之前引入。 
    //将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    //CommonsChunkPlugin能够在每次修改后的构建结果中，
    //将 webpack 的样板(boilerplate)和 manifest 提取出来
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    })
  ],
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  }
};