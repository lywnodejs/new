const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

process.env.NODE_ENV = 'development';

module.exports = {
    entry: {
        'water-mark': './src/water-mark.ts',
        'saveHash': './iframe/js/index.ts'
    },
    devtool: 'cheap-module-eval-source-map',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        library: 'waterMark',
        libraryTarget: 'umd'
    },
    mode: 'development',
    module: {
        rules: [{
                enforce: 'pre',
                test: /\.js$/,
                use: [{
                    loader: 'eslint-loader', // require.resolve('eslint-loader')
                    options: {
                        formatter: require('eslint-friendly-formatter')
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader'
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname, './iframe/save-hash-iframe.html'),
            filename: 'save-hash-iframe.html',
            inlineSource: '.(js|css)',
            chunks: ['saveHash']
        }),
        new HtmlWebpackInlineSourcePlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            },
            VERSION: JSON.stringify(require('./package').version)
        }),
        new webpack.LoaderOptionsPlugin({
            options: {}
        })
    ],
    resolve: {
        extensions: ['.ts', '.js']
    },
};
