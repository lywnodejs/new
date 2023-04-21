const path = require('path');
const webpack = require('webpack');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

process.env.NODE_ENV = 'development';

module.exports = {
    entry: ['./test/tests.ts'],
    output: {
        path: path.resolve(__dirname, './test'),
        filename: '[name].test.js'
    },
    mode: 'development',
    module: {
        rules: [{
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
        /* new UglifyJsPlugin({
            cache: true,
            parallel: true,
            uglifyOptions: {
                ie8: false,
                ecma: 8,
                beautify: false,
                compress: true,
                comments: false,
                mangle: false,
                toplevel: false,
                keep_classnames: true, // <-- doesn't exist, I guess. It's in harmony branch
                keep_fnames: true //
            },
            sourceMap: false
        }), */
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        })
    ],
    resolve: {
        extensions: ['.ts', '.js']
    },
};
