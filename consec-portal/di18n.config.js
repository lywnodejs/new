/*
 * @Date: 2020-11-02 15:02:18
 * @Author: 刘亚伟
 * @LastEditTime: 2020-11-10 15:18:09
 */
module.exports = {
  entry: ['src'],
  exclude: [],
  output: ['src'],
  disableAutoTranslate: true,
  translator: null,
  ignoreComponents: [],
  ignoreMethods: [],
  primaryRegx: {},
  primaryLocale: 'zh-CN',
  supportedLocales: ['zh-CN', 'en-US'],
  importCode: "import { intl } from 'di18n-react';",
  i18nObject: 'intl',
  i18nMethod: 't',
  prettier: {
    parser: 'typescript',
    singleQuote: true,
    trailingComma: 'es5',
    endOfLine: 'lf'
  },
  localeConf: { type: 'file', folder: 'locales' }
}
