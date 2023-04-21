const path = require('path'),
    webpack = require('webpack'),
    dist = path.resolve(__dirname, './dist/'),
    src = path.resolve(__dirname, './src/')

module.exports = {

    entry: {
        main: ['./src/index.es6']
    },

    output: {
        path: dist,
        filename: '[name].bundle.js',
        libraryTarget: 'umd',
        publicPath: '/project/mis/sdl/'
    },

    module: {
        loaders: [
            /* ES6编译 */
            {
                test: /\.(js|es6)$/,
                loader: 'babel-loader',
                include: src,
                query: {
                    babelrc: true
                }
            }, {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }, {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            }, {
                test: /\.vue$/,
                loader: 'vue-loader'
            }, {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]
    },
    plugins: [

    ],
    resolve: {
        alias: {
            '@': src,
            vue: 'vue/dist/vue.js',
            styles: path.resolve(__dirname, './styles'),
            app: path.resolve(src, './app'),
            commons: path.resolve(src, './commons'),
            'vue-datepicker-local$': path.resolve(src, 'components', 'vue-datepicker-local/index.js')
        }
    }
}
