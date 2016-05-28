const HtmlwebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');//这个插件感觉没卵用

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlwebpackPlugin({
    	//自动生成一个最简单的HTML文件，title为 Webpack-demos
      title: 'Webpack-demos'
    }),
    new OpenBrowserPlugin({
    	//webpack-dev-server 命令触发，创建一个本地服务器并并自动在浏览器打开
      url: 'http://localhost:8080'
    })
  ]
};
