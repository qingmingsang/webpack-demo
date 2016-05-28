const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

//import CommonsChunkPlugin from "webpack/lib/optimize/CommonsChunkPlugin";//false

module.exports = {
	entry: {
		bundle1: './main1.jsx',
		bundle2: './main2.jsx'
	},
	output: {
		filename: '[name].js'//生成了bundle1.js bundle2.js文件
	},
	module: {
		loaders: [{
			test: /\.js[x]?$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015', 'react']
			}
		}]
	},
	plugins: [
		new CommonsChunkPlugin('init.js')//合并生成的打包文件
	]
}