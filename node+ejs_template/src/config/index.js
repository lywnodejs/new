let Config = require('./config-base');
module.exports = new Config({
  local: {
    web_url:'http://webpdf.agent.dragontrail.cn'
  },
  dev: {
    web_url:'http://live.agent.dragontrail.cn'
  },
  staging: {
    web_url:'http://webpdf.agent.dragontrail.cn'
  },
  production: {
    web_url:'https://ctalive.com'
  },
  logDir: process.cwd() + '/logs/',

});
