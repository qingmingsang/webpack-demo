const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const ForkCheckerPlugin = require('fork-checker-plugin');
const publicPath = './';

module.exports = {
    entry: {
        app: './src/index.js',
        zbb: './src/other.js',
        lib: './src/library.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: publicPath,
        sourceMapFilename: '[name].map'
    },

    resolve: {
        extensions: ['.ts', '.js', '.json'],
        modules: [path.join(__dirname, 'src'), 'node_modules']
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
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 100000
                    }
                }
            }
        ]
    },
    plugins: [
        //new ForkCheckerPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['zbb', 'lib'].reverse()
        }),//提取公共代码
        new HtmlWebpackPlugin({//也支持引入模板
            title: 'Output Management',
            favicon: './favicon.ico'
            //template: 'src/index.html',
            //chunksSortMode: 'dependency'
        })
    ]
}
