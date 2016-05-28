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
		}, {
			test: /\.(png|jpg)$/,
			loader: 'url-loader?limit=8192' //限制大小在8192bytes,如果大于的话会转换成64位的Data URL
		}]
	}
};