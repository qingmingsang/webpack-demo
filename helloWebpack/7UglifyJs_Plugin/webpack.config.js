const webpack = require('webpack');
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
//可能不能这样用
//import webpack from 'webpack';
//const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {
	entry: './main.js',
	output: {
		filename: 'bundle.js'
	},
	module: {
		loaders: [{
			test: /\.js[x]?$/,
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				presets: ['es2015', 'react']
			}
		}]
	},
	plugins: [
		new uglifyJsPlugin({//UglifyJsPlugin貌似是内置插件，精简打包的JS文件
			compress: {
				warnings: false//这个true false不知道有啥用
			}
		})
	]
}