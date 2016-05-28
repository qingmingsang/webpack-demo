const webpack = require('webpack');

//设置config参数，设置了就一直在了，再改变还需要手动改
//set DEBUG=true
//webpack-dev-server
const devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [devFlagPlugin]
};
