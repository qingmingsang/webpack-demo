const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env) => {
  return {
    mode: 'production',
    entry: {
      polyfills: './src/polyfills.js',
      index: './src/index.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
      new webpack.ProvidePlugin({
        //_: 'lodash',
        join: ['lodash', 'join']
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'test'
      }),
    ],
    rules: [
      {
        test: /\.js$/,
        //明确指定路径减少寻径成本
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader'
      }
    ]
  }
};
