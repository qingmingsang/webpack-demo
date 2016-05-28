module.exports = {
  entry: './main.jsx',
  output: {
    filename: 'bundle.js'
  },
  module: {//制定loaders
    loaders:[
      {//更自然的写法
        test: /\.js[x]?$/,
        exclude: /node_modules/,
	      loader: 'babel',
	      query: {
	        presets: ['es2015', 'react']
	      }
      },
    ]
  }
//module: {//制定loaders
//  loaders:[
//    {
//      test: /\.js[x]?$/,
//      exclude: /node_modules/,
//      loader: 'babel-loader?presets[]=es2015&presets[]=react',
//    },
//  ]
//}  
};
