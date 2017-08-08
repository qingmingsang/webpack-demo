const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-source-map',
    devServer: {
        port: 7777,
        host: 'localhost',
        historyApiFallback: true,
        noInfo: false,
        stats: 'minimal',
        publicPath: './',
        hot: true,
        contentBase: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
}