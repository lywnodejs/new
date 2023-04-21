const getEntries = require('roadhog/lib/utils/getEntry').default

module.exports = function (webpackConfig, env) {
  let IS_Oversea = false
  for (let index in webpackConfig.plugins) {
    let plugin = webpackConfig.plugins[index]

    if (plugin.constructor.name == 'DefinePlugin') {
      IS_Oversea = JSON.parse(plugin.definitions.webpackDefine)['IS_Oversea']
    }
    // 增加多页面
    if (plugin.constructor.name == 'HtmlWebpackPlugin') {
      const entries = getEntries(webpackConfig)

      if (Object.keys(entries).length > 1) { // 多页面下处理多html入口
        webpackConfig.plugins.splice(index, 1) // 删除旧插件
        for (let name in entries) {
          const newPlugin = new plugin.constructor({
            filename: `${name}.html`,
            chunks: ['common', name],
            template: `src/${name}.ejs`,
            hash: true,
            inject: true,
            IS_Oversea
          })
          webpackConfig.plugins.splice(index, 0, newPlugin) // 在原先的旧插件位置插入
        }
      }

      break
    }
  }
  return webpackConfig;
}
