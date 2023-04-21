const fs = require('fs'),
      path = require('path'),
      yaml = require('js-yaml'),
      cfgFile = path.resolve(__dirname, './application.yml'),
      configs = yaml.safeLoad(fs.readFileSync(cfgFile), 'utf-8')

module.exports = configs