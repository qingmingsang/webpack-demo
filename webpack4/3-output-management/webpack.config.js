const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  mode: 'none',
  entry: {
    app: './src/index.js',
    print: './src/print.js'
  },
  plugins: [
    //默认路径似乎是跟着output.path走的
    //现在似乎不需要这个插件也会自动删除?
    new CleanWebpackPlugin({ verbose: true }),
    new HtmlWebpackPlugin({
      title: 'Output Management'
    }),
    new ManifestPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};