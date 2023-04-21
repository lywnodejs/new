'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8082, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    proxyTable: {
      '/information/': {
        // target: 'http://10.0.0.22:10029/',
        target: 'http://localhost:31001/',
        // target: 'http://10.0.0.22:10029/',
        changeOrigin: true,
        pathRewrite: {
          '^/information': '/'
        }
      },
      '/event/': {
        target: 'http://semantic-api-service:31001/',
        changeOrigin: true,
        pathRewrite: {
          '^/event': '/'
        }
      },
      '/getStockName/': {
        target: 'http://quota.zq88.cn/',
        changeOrigin: true,
        pathRewrite: {
          '^/getStockName': '/'
        }
      },
      '/freeQuestion/': {
        // target: 'http://localhost:9097',
        target: 'http://big-data.rxhui.com/freeQuestion',
        changeOrigin: true,
        pathRewrite: {
          '^/freeQuestion': '/'
        }
      },
      '/searchStock/': {
        target: 'http://semantic-api-service:31001/',
        changeOrigin: true,
        pathRewrite: {
          '^/searchStock': '/'
        }
      },
    },

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
