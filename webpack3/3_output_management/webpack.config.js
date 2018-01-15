const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');//生成html模板
const CleanWebpackPlugin = require('clean-webpack-plugin');//清理dist文件夹

module.exports = {
  entry: {
    index: './src/index.js',
    other: './src/other.js'
    //vendor: [ 'react', 'react-dom' ]
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
    })
  ]
};