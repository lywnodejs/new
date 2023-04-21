const configs = require('./config'),
    hotUrl = `webpack-hot-middleware/client?path=${configs.server.path}&timeout=10000&reload=true`,
    webpack = require('webpack'),
    wpkcfg = require('./webpack.config.base')
const CopyWebapckPlugin = require('copy-webpack-plugin')
//  添加热加载地址
for (let key in wpkcfg.entry) {
    wpkcfg.entry[key].push(hotUrl);
}

wpkcfg.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebapckPlugin([{
        context: __dirname + "/static/lib/ueditor/",
        from: "**/*",
        to: __dirname + "/dist/static/ueditor"
    }])
]

Object.assign(wpkcfg, {

    devtool: '#source-map',

    output: {
        filename: '[name].bundle.js',
        publicPath: '/'
    }
})


module.exports = wpkcfg