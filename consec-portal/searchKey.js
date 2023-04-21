/*
 * @Date: 2020-11-12 11:01:35
 * @Author: 刘亚伟
 * @LastEditTime: 2020-11-12 11:11:01
 */
const fs = require('fs');

module.exports = {
  input: [
    'src/*.{ts,tsx}',
    'src/**/*.{ts,tsx}',
    'src/**/**/*.{ts,tsx}',

    // Use ! to filter out files or directories
    '!src/i18n/**',
    '!**/node_modules/**'
  ],
  output: './', // 输出目录
  options: {
    debug: true,
    func: false,
    trans: false,
    lngs: ['zh-CN', 'en-US'], // 生成的语言类型
    defaultLng: 'zh-CN',
    resource: {
      loadPath: 'locales/{{lng}}.json', // 输入路径
      savePath: 'locales/{{lng}}.json', // 输出路径
      jsonIndent: 2,
      lineEnding: '\n'
    },
    removeUnusedKeys: true,
    nsSeparator: false, // namespace separator
    keySeparator: false, // key separator
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    }
  },
  transform: function customTransform (file, enc, done) { // 自己通过该函数来加工key或value
    'use strict';
    const parser = this.parser;
    const content = fs.readFileSync(file.path, enc);
    parser.parseFuncFromString(content, { list: ['lang', 't'] }, (key, options) => {
      options.defaultValue = key;
      parser.set(options.defaultValue, '');
    });
    done();
  }
};
