const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const poststylus = require('poststylus');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

//const postcssConfig = require('./postcss.config.js');
//const autoprefixerConfig = postcssConfig.postcssConfig;

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
        test: /\.styl$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                //minimize: true,
                modules: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                //sourceMap: true
              }
            },
            'postcss-loader',
            'stylus-loader'
            // {
            //   loader: 'stylus-loader',
            //   options: {
            //     //use: [poststylus]
            //     //use: [poststylus([require('autoprefixer')(autoprefixerConfig)])]
            //   }
            // }
          ]
        })
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                //minimize: true,
                //sourceMap: true,
                modules: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              }
            },
            'postcss-loader'
            // {
            //   loader: 'postcss-loader',
            //   options: {
            //     ident: 'postcss',
            //     plugins: [
            //       require('autoprefixer')(autoprefixerConfig)
            //     ]
            //   }
            // }
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
    // new ExtractTextPlugin({
    //   filename: '../destination/[name].[contenthash:8].css'//dist的相对路径，基准可能是output
    // }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash:8].css'//dist的相对路径，基准可能是output
    }),
    new CleanWebpackPlugin(['dist']),
    new UglifyJSPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.styl']
  }
};