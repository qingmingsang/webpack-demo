const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    polyfills: './polyfills/index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }]
  },
  plugins: [
    new CleanWebpackPlugin(
      [
        'polyfills/polyfills.*'
      ]
    ),
    new UglifyJSPlugin()
  ],
  output: {
    filename: '[name].[chunkhash:8].js',
    path: path.resolve(__dirname, 'polyfills')
  }
};