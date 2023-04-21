/**
 * 封装并导出日志实例对象
 * Created by xfw on 17/8/28.
 */
var consoleLogger = require('@rhjx/logger').consoleLogger;
var fileLogger = require('@rhjx/logger').fileLogger;
var logger = new consoleLogger();
var file = new fileLogger();
logger.setFilterParamter(['password', 'rhPassword']);
module.exports = file;