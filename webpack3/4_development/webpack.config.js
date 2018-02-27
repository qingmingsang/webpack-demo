const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js',
    zbb: './src/other.js'
    //vendor: [ 'react', 'react-dom' ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/'// 也会在服务器脚本用到，以确保文件资源能够在 http://localhost:3000 下正确访问
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
    new HtmlWebpackPlugin({
      title: 'Output Management',
      favicon: './favicon.ico'
    })
  ],
  //如果不用webpack-dev-server，需要配置这个
  devServer: {
    contentBase: './dist'
  },
  devtool: "inline-source-map"
};