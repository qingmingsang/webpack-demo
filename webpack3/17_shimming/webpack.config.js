const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    //将 babel-polyfill 和 whatwg-fetch全局引入
    polyfills: './src/polyfills.js',
    index: './src/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.ProvidePlugin({
      //_: 'lodash'//将lodash注册为全局变量_
      join: ['lodash', 'join']//也可以将指定的模块注入全局变量，便于 tree shaking
    })
  ],
  module: {
    rules: [
      //exports-loader 和 imports-loader两个一起用貌似有问题，
      //直接这样写不对的
      {
        //将某个文件不显式的导出到全局
        test: require.resolve('./src/globals.js'),
        use: 'exports-loader?file,parse=helpers.parse'
      },
      // {
      //   //通过使用 imports-loader 覆写 this
      //   test: require.resolve('./src/index.js'),
      //   use: 'imports-loader?this=>window'
      // },
    ]
  },
};