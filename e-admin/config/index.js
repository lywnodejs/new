// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
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
  },
  dev: {
    env: require('./dev.env'),
    port: 8282,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/e': {
        target: 'http://10.0.0.22:9789/',
        changeOrigin: true,
        pathRewrite: {
          '^/e': '/'
        }
      },
      '/signal': {
        target: 'http://semantic-api-service:31001/',
        changeOrigin: true,
        pathRewrite: {
          '^/signal': '/'
        }
      },
      '/reportUrl': {
        target: 'http://report-composite-service:31001',
        changeOrigin: true,
        pathRewrite: {
          '^/reportUrl': '/'
        }
      },
      '/riskInfo':{
        target: 'http://semantic-datacenter-service:31001',
        changeOrigin: true,
        pathRewrite: {
          '^/riskInfo': '/'
        }
      },
      '/subject':{
        target: 'http://10.0.0.22:9789',
        changeOrigin: true,
        pathRewrite: {
          '^/subject': '/'
        }
      },
      '/upload':{
        target: 'http://10.0.0.40:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/upload': '/'
        }
      },
      '/jbg/gemantic/com': {
        target: 'http://jbg.gemantic.com:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/jbg/gemantic/com': '/'
        }
      },

      '/dengtacj': {
        target: 'http://hczq.dengtacj.cn:55561',
        changeOrigin: true,
        pathRewrite: {
          '^/dengtacj': '/'
        }
      },
      '/sqdl': {
        target: 'http://10.0.0.22:9098',
        changeOrigin: true,
        pathRewrite: {
          '^/sqdl': '/'
        }
      },
      '/analyse/hczq/home/': {
        target: 'http://10.0.0.22:9093',
        changeOrigin: true,
        pathRewrite: {
          '^/analyse/hczq/home/': '/'
        }
      },
      '/download/': {
        target: 'http://download.zq88.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/download/': '/'
        }
      },
      '/h5/page/': {
        target: 'https://moblie.hczq.com',
        changeOrigin: true,
        pathRewrite: {
          '^/h5/page/': '/'
        }
      },
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
