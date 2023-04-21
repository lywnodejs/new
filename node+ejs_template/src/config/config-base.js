var _ = require('lodash');
var Config = function(options) {
  for(var key in options) {
    this[key] = options[key];
  }
};

/**
 * 获取配置中key对应的value，如果当前环境配置中存在key，则返回当前环境的，否则返回this的
 */
Config.prototype.getConfig = function(key) {
  if (!key) {
    throw  new Error('缺少参数key');
  }
  var current = this[process.env.NODE_ENV || 'production'];
  if (current && current[key]) {
    return current[key];
  }
  return this[key];
};

module.exports = Config;
