const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const poststylus = require('poststylus');

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /.styl$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'stylus-loader'
          ]
        })
      },
      {
        test: /.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader'
          ]
        })
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack Template',
      inject: 'body',
      template: path.resolve(__dirname, 'template.html')
    }),
    new ExtractTextPlugin({
      filename: '../destination/app.css'//dist的相对路径，貌似不能用path
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      stylus: {
        default: {
          use: [poststylus([require('autoprefixer')({ browsers: 'last 10 versions' })])]
        }
      }
    }),
    new CleanWebpackPlugin(['dist'])
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.styl']
  }
};