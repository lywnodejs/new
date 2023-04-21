const path = require('path');
const fs = require('fs');

const mock = {};

function walk(dirPath) {
  fs.readdirSync(dirPath)
    .forEach(function(file) {
      if (fs.statSync(dirPath + '/' + file).isDirectory()) {
        walk(dirPath + '/' + file)
      } else if (path.extname(file) === '.js') {
        Object.assign(mock, require(dirPath + '/' + file));
      }
    });
}

// 切换测试环境、本地环境
local_target = 'http://sdl.xiaojukeji.com'
test_target = 'http://10.190.2.228:8080'

debug = false
if (debug) {
  target = local_target
} else {
  target = test_target
}

walk(path.join(__dirname + '/mock'))

module.exports = {
  proxy: {

    // 优先级最高，若开启全局配置，mock本地数据失效，全部启用代理
    enable: false,
    path: '/', // path

    // 详见http-proxy-middleware(https://github.com/chimurai/http-proxy-middleware#options)
    options: {
      target: 'http://localhost:8000',
    }
  },
  mock
};
