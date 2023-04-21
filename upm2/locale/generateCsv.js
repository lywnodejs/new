var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var format = require('./formatCSVField');
var lngs = require('./lngs').all;
var SRC_PATH = path.join(__dirname, '../src/');

var source = require(path.join(SRC_PATH, 'i18n/zhCN/resource.json'));

function getSourceString(original) {
  return Object.keys(source).map((key) => {
    var newKey = `"${ format.json2csv(key) }"`;

    var value = original[key];
    var newValue = '""';

    if (original[key]) {
      newValue = `"${ format.json2csv(value) }"`;
    } else if (original[newKey]) {
      newValue = original[newKey];
    }

    return `${newKey},${newValue},`;
  }).join('\n') + '\n';
}

lngs.forEach(function(lng) {
  var target = path.join(SRC_PATH, `i18n/${lng}/resource.csv`);

  fs.readFile(target, 'utf8', (err, data) => {
    var obj = {};
    var inQuota = false;
    data.split(/\r?\n/).forEach((item) => {
      let lineString = item;
      if (item.charCodeAt(0) === 0xFEFF ) {
        lineString = item.slice(1);
      }

      let key, value;
      let string = '';
      const lineArray = lineString.split('');
      lineArray.forEach((char, index) => {
        if (char === '"') {
          inQuota = !inQuota;
          string += char;
        } else {
          if (char === ',' && !inQuota) {
            if (index !== (lineArray.length - 1)) {
              key = string;
              string = '';
            }
          } else {
            string += char;
          }
        }
      });
      value = string;

      if (key && key !== '') {
        obj[key] = value ? value : '';
      }
    });

    // \ufeff 是CSV文件要求的BOM头信息
    fs.writeFileSync(target, '\ufeff' + getSourceString(obj));
    console.log(`CSV file for ${lng} generated success!`);
  });
});
