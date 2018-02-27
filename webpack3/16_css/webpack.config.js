const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const poststylus = require('poststylus');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

let autoprefixerConfig = { browsers: 'last 10 versions' };

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
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                //sourceMap: true
              }
            },
            {
              loader: 'stylus-loader',
              options: {
                use: [poststylus([require('autoprefixer')(autoprefixerConfig)])]
              }
            }
          ]
        })
      },
      {
        test: /.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                //sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('autoprefixer')(autoprefixerConfig)
                ]
              }
            }
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
      filename: '../destination/app.css'//dist的相对路径，基准可能是output
    }),
    new CleanWebpackPlugin(['dist']),
    new UglifyJSPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.styl']
  }
};