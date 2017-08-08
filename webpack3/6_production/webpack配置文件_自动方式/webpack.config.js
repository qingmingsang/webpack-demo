const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let options = {
    entry: {
        app: './src/index.js',
        zbb: './src/other.js'
        //vendor: [ 'react', 'react-dom' ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // 开启HMR
        new HtmlWebpackPlugin({
            title: 'Output Management',
            favicon: './favicon.ico'
        })
    ],
    devServer: {
        hot: true, // 告知 dev-server 正在使用 HMR
        contentBase: path.resolve(__dirname, 'dist'),
        publicPath: './'
    },
    devtool: "cheap-module-source-map"
};
options.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0)
}));
module.exports = options;