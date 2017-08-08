const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js',
        zbb: './src/other.js'
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
        new webpack.HotModuleReplacementPlugin() // 开启HMR
    ],
    devServer: {
        hot: true, // 告知 dev-server 正在使用 HMR
        contentBase: path.resolve(__dirname, 'dist'),
        publicPath: './'
    },
    devtool: "eval",
    externals: {
        qq: 'jQuery'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            $biu: "../jquery"
        }
    }
};