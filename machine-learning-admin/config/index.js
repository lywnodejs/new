'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/information': {
        // target: 'http://192.168.200.60:8080/',
        target: 'http://ai-api-service:31001/',
        changeOrigin: true,
        timeout: 5*60*1000,		//设置超时
        pathRewrite: {
          '^/information': '/'
        }
      },

      '/robotConfig': {
        // target: 'http://192.168.111.71:9099/',
        target: 'http://ai-api-service:31001/',
        changeOrigin: true,
        timeout: 5*60*1000,		//设置超时
        pathRewrite: {
          '^/robotConfig': '/'
        }
      },

      '/reportUrl': {
        target: 'http://report-composite-service:31001/',
        // target: 'http://192.168.111.217:31001/',
        changeOrigin: true,
        pathRewrite: {
          '^/reportUrl': '/'
        },
      },

      '/previewReportUrl': {
        target: 'http://reports.jinhui001.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/previewReportUrl': '/'
        },
      },

      '/robotcache': {
        target: 'http://dialogue-manage-service:31001',
        changeOrigin: true,
        timeout: 5*60*1000,		//设置超时
        pathRewrite: {
          '^/robotcache': '/'
        }
      },
      '/semanticApi': {
        target: 'http://semantic-api-service:31001',
        changeOrigin: true,
        timeout: 5*60*1000,		//设置超时
        pathRewrite: {
          '^/semanticApi': '/'
        },
      },


    },

    // Various Dev Server settings
    host: '127.0.0.1', // can be overwritten by process.env.HOST
    port: 7722, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


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
    // assetsPublicPath: './',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
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
