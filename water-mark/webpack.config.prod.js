const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// const waterVersion = require('./src/configs').WATER_VERSION;

process.env.NODE_ENV = 'production';

module.exports = {
    entry: {
        'water-mark': './src/water-mark.ts',
        // [`water-mark-${waterVersion}`]: './src/water-mark.js',
        'saveHash': './iframe/js/index.ts',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        library: 'waterMark',
        libraryTarget: 'umd'
    },
    mode: 'production',
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
        new webpack.DefinePlugin({
            'process.env.TARGET': JSON.stringify(process.env.TARGET),
            VERSION: JSON.stringify(require('./package').version)
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname, './iframe/save-hash-iframe.html'),
            filename: 'save-hash-iframe.html',
            inlineSource: '.(js|css)',
            chunks: ['saveHash'],
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        }),
        new UglifyJsPlugin({
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
        }),
        new HtmlWebpackInlineSourcePlugin(),
        /* new webpack.optimize.UglifyJsPlugin({
            compress: {
                // warnings: false,
                // Disabled because of an issue with Uglify breaking seemingly valid code:
                // https://github.com/facebookincubator/create-react-app/issues/2376
                // Pending further investigation:
                // https://github.com/mishoo/UglifyJS2/issues/2011
                comparisons: false,
                // 不要删除log
                // drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true
            },
            comments: false
        }), */
        new webpack.LoaderOptionsPlugin({
            options: {}
        })
    ],
    resolve: {
        extensions: ['.ts', '.js']
    },
};
