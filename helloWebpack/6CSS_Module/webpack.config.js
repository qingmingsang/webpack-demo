module.exports = {
	entry: './main.jsx',
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
			test: /\.css$/,
			//modules参数开启css-modules
			loader: 'style-loader!css-loader?modules'
		}]
	}
};