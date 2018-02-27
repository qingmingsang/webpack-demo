const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack-numbers.js',
    library: 'webpackNumbers',
    libraryTarget: 'umd'
  },
  //加这个就不会将lodash主动打包了，而是依赖装了webpack-numbers的用户的lodash
  externals: {
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_'
    }
  },
  // entry: './src/test.js',
  // output: {
  //   filename: 'test.js',
  //   path: path.resolve(__dirname, 'dist')
  // }
};