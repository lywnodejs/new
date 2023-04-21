var scanner = require('i18next-scanner');
var vfs = require('vinyl-fs');
var path = require('path');

var SRC_PATH = path.join(__dirname, '../src/');

var options = {
  debug: true,
  func: {
    list: ['i18next.t', 'i18n.t', 't'],
    extensions: ['.js', '.jsx']
  },
  trans: {
    extensions: ['.js', '.jsx'],
    fallbackKey: function(ns, value) {
      return value;
    }
  },
  lngs: ['zhCN'],
  defaultNs: 'resource',
  defaultValue: '',
  resource: {
    loadPath: 'i18n/{{lng}}/{{ns}}.json',
    savePath: 'i18n/{{lng}}/{{ns}}.json',
    jsonIndent: 2,
    lineEnding: '\n'
  },
  nsSeparator: ':', // namespace separator
  keySeparator: false, // key separator
  pluralSeparator: '_',
  contextSeparator: '_',
  interpolation: {
    prefix: '{{',
    suffix: '}}'
  },
  sort: true,
  allowEmpty: true
};

vfs.src(['src/**/*.js', 'src/**/*.jsx'])
  .pipe(scanner(options))
  .pipe(vfs.dest(SRC_PATH));
