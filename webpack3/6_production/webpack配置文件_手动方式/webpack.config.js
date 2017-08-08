const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let env = process.env.NODE_ENV;
let devOptions = require(`./webpack.${env}.js`);
let options = {
    entry: {
        app: './src/index.js',
        zbb: './src/other.js'
        //vendor: [ 'react', 'react-dom' ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: './',
        sourceMapFilename: '[name].map'
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
        new HtmlWebpackPlugin({
            title: 'Output Management',
            favicon: './favicon.ico'
        })
    ]
};
Object.assign(options, devOptions);
module.exports = options;
