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
    module: {
      rules: [
        // {
        //   test: require.resolve('./src/index.js'),
        //   use: 'imports-loader?this=>window'
        // },
        {
          test: require.resolve('./src/global.js'),
          use: 'exports-loader?file,parse=helpers.parse'
        }
      ]
    },
  }
};
