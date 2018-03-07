const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Output Management',
      favicon: './favicon.ico'
    }),
    new webpack.NamedModulesPlugin(),//以便更容易查看要修补(patch)的依赖
    new webpack.HotModuleReplacementPlugin(), // 开启HMR
    new FriendlyErrorsWebpackPlugin()
  ],
  // devServer: {
  //   hot: true, // 告知 dev-server 正在使用 HMR
  //   contentBase: path.resolve(__dirname, 'dist')
  // },
  // devServer: {
  //   hot: true,
  //   host: 'localhost',
  //   port: 5000,
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:5001",
  //       changeOrigin: true,
  //       pathRewrite: { '^/api': '' }
  //     }
  //   }
  // },
  devtool: "inline-source-map"
};