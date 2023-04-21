const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' },
      // { hid: 'description', name: 'description', content:'lyw' },
      {httpEquiv:'X-UA-Compatible',content:"ie=edge"}
    ],
    // link: [
    //   { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    // ],
  },

  /*
  ** Customize the progress-bar color
  */

  /*
  ** Global CSS
  */
  css: [
    './static/ybtt/icon/iconfont.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {'src':'~plugins/ui',ssr:false},
    {'src':'./static/ybtt/js/rem.js',ssr:false},
    {'src':'./static/ybtt/js/jquery-2.1.1.min.js',ssr:false},
  ],

  /*
  ** Nuxt.js modules
  */
  build: {
    vendor: ['axios'],
  },

  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },
  // npm i @nuxtjs/axios @nuxtjs/proxy -D
  proxy: {
    '/auto/report':{
      // target:'http://staging.robot.jinhui001.com/robot/semantic//semantic-api-service/',
      target:'http://semantic-api-service:31001',
      // target:'http://information.rxhui.com/information',
      pathRewrite:{
        '^/auto/report':'/'
      },
      secure:false
    },
    '/yysb/info':{
      target:'http://semantic-telecomcontent-service:31001',
      pathRewrite: {
        '^/yysb/info':'/'
      },
      secure:false
    },
    '/yysb/list':{
      target:'http://semantic-telecomknowledge-service:31001',
      pathRewrite: {
        '^/yysb/list':'/'
      },
      secure:false
    },
    '/quota':{
      target:'https://robot.rxhui.com//hangqing-service',
      pathRewrite: {
        '^/quota':'/'
      },
      secure:false
    },
    '/zq':{
      target:'http://quota.zq88.cn/',
      pathRewrite: {
        '^/zq':'/'
      },
      secure:false
    },
    '/share':{
      target:'https://hd.hczq.com/',
      pathRewrite: {
        '^/share':'/'
      },
      secure:false
    },
    '/infoID':{
      target:'http://information-doc-service:31001/',
      pathRewrite: {
        '^/infoID':'/'
      },
      secure:false
    },
    '/industry':{
      target:'http://semantic-datacenter-service:31001/',
      pathRewrite: {
        '^/industry':'/'
      },
      secure:false
    },
    '/legalProceeding':{
      target:'http://great-wisdom-doc-service:31001',
      pathRewrite: {
        '^/legalProceeding':'/'
      },
      secure:false
    },
    '/DOUBLE_TOP':{
      target:'http://stock-analysis-service:31001',
      pathRewrite: {
        '^/DOUBLE_TOP':'/'
      },
      secure:false
    },
  },
}
