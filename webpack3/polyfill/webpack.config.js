const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const AddAssertHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    //vendor: ['lodash', 'underscore']
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
    new HTMLWebpackPlugin({
      title: 'thor',
      inject: 'body',
      template: path.resolve(__dirname, 'template.html'),
      minify: { collapseWhitespace: true, removeComments: true }
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "vendor"
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: (module) => {
        return module.context && module.context.includes("node_modules");
      }
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'index',
    //   async: 'chunk-vendor',
    //   children: true,
    //   minChunks: (module, count) => {
    //     // 被 3 个及以上 chunk 使用的共用模块提取出来
    //     return count >= 2
    //   }
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'BundleAnalyzer.report.html'
    }),
    new CleanWebpackPlugin(['dist']),
    new UglifyJSPlugin(),
    new AddAssertHtmlPlugin({
      filepath: path.resolve(__dirname, 'polyfills/polyfills.*'),
      includeSourcemap: false
    }),
  ],
  output: {
    filename: '[name].[chunkhash:8].bundle.js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map'
};