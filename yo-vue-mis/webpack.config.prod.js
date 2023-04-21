const wpkcfg = require('./webpack.config.base'),
    path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    CompressionWebpackPlugin = require('compression-webpack-plugin'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin')

const CopyWebapckPlugin = require('copy-webpack-plugin')
wpkcfg.devtool = '#source-map'

wpkcfg.entry = {
  main: ['./src/index.es6'],
  vendor: ['element-ui', 'jquery-sparkline', 'moment', 'vue-i18n', 'vue-json-tree-view', 'vue-resource', 'vue-router', 'vuex', 'vue2-editor', 'bootstrap-vue']
},

wpkcfg.externals = {
    vue: 'Vue',
    jquery: 'jQuery',
    lodash : {
      commonjs2: 'lodash',
      commonjs: 'lodash',
      amd: 'lodash',
      root: '_' // indicates global variable
    }
}

//  抽取CSS 文本
wpkcfg.module.loaders.forEach(item => {
    if (item.loader === 'style-loader!css-loader') {
        item.loader = ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader'] })
    }
    if (item.loader === 'style-loader!css-loader!less-loader') {
        item.loader = ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'less-loader'] })
    }
})

wpkcfg.plugins = [

  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: [
      path.resolve(__dirname, 'dist')
    ]
  }),

  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor-[hash].min.js',
    minChunks: Infinity
  }),
  new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons-[hash].min.js',
  }),
  new webpack.ContextReplacementPlugin(
    /moment[/\\]locale$/,
    /zh-cn/
  ),
  new CompressionWebpackPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.js$|\.css$|\.html$/,
    threshold: 10240,
    minRatio: 0.8
  }),
  new ExtractTextPlugin("[name]-[hash].min.css"),
    new HtmlWebpackPlugin({
        title: 'Webpack Hot Reload Template',
        filename: 'sdl.html',
        inject: 'body',
        template: 'template.ejs',
        // links: [{
        //     href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css',
        //     rel: 'stylesheet',
        //     integrity: "sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u",
        //     crossorigin: "anonymous"
        // }],
        /****/
        // scripts: [
        //     'https://cdn.jsdelivr.net/npm/vue'
        // ]

    })
    // new CopyWebapckPlugin([{
    //     context: __dirname + "/static/lib/ueditor/",
    //     from: "**/*",
    //     to: __dirname + "/dist/static/ueditor"
    // }])
]

module.exports = wpkcfg
