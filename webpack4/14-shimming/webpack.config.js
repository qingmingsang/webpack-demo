const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    filename: 'bundle.js',
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
  module: {
    rules: [
      {
        test: require.resolve('index.js'),
        use: 'imports-loader?this=>window'
      }
    ]
  },
};