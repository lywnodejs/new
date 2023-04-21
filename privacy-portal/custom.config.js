/*
 * @Date: 2020-11-04 17:01:21
 * @Author: 刘亚伟
 * @LastEditTime: 2020-11-17 17:45:23
 */
require('babel-polyfill')
let path = require('path')

let resolve = function (...dir) {
  return path.resolve(__dirname, ...dir)
}

module.exports = {
  title: '滴滴出行隐私保护平台', // 网页标题
  port: 8011, // 服务端口
  devtool: 'cheap-eval-source-map',
  extensions: ['.es6', '.html', '.less'], // 文件后缀
  entry: ['babel-polyfill', './src/main'], // 入口地址
  productionGzip: false, // 是否在build下开启Gzip压缩
  openBrowser: false, // 自动打开浏览器
  favicon: 'favicon.ico',
  // 编译输出的`dist/static`目录在服务端对应的路由地址
  // 例如配置如下时，`dist/static/index.js`对应`/static/index.js`
  publicPath: '/',
  alias: {
    '@': resolve('src'),
    commons: resolve('src', 'commons'),
    components: resolve('src', 'components'),
    models: resolve('src', 'models'),
    interfaces: resolve('src', 'interfaces'),
    decorates: resolve('src', 'decorates'),
    utils: resolve('src', 'utils'),
    variables: resolve('src', 'style', 'variables.less'),
    lib: resolve('src', 'lib')
  }, // 路径别名，方便进行代码引入
  externals: [], // 外部引入依赖
  css: [], // 引入外部样式
  // webpack-dll相关配置
  // 当entry为一个对象时，每一个key为一个dll
  // 例如：{entry: { 'vendor1': ['xxx', 'xxx1'], 'vendor2': ['xxx2', 'xxx3'] }}
  dll: {
    enable: true,
    entry: [
      'ajv',
      'class-names',
      'mobx',
      'mobx-react',
      'moment',
      'prop-types',
      'react-router-dom',
      'styled-components'
    ]
  },
  router: {
    // 路由路径前缀
    routePrefix: '',
    ignore: ['**/i18n/**/*', '**/components/**/*'],
    lazyLoad: true
  },
  eslint: {
    enable: false,
    test: /\.(es6|js)$/
  },
  tslint: {
    enable: true
  },
  stylelint: false, // 是否使用stylelint进行语法检查
  theme: {
    '@primary-color': '#FC9052'
  } // antd 主题覆盖
}
