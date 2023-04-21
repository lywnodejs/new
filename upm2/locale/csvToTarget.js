var path = require('path');
var fs = require('fs');
var format = require('./formatCSVField');
var lngs = require('./lngs').all;

var SRC_PATH = path.join(__dirname, '../src/');

lngs.forEach((lng) => {
  var source = path.join(SRC_PATH, `i18n/${lng}/resource.csv`);
  var target = path.join(SRC_PATH, `i18n/${lng}/resource.json`);

  fs.readFile(source, 'utf8', (err, data) => {
    var obj = {};

    data.replace(/\r?\n$/, '').split(/\r?\n/).forEach((item, index) => {
      // const [key, value] = item.split(',');
      const reg = /"([^"]*)","(.*)"/g;
      const [source, key, value] = reg.exec(item)

      let newKey = '';
      if (index === 0) {
        newKey = format.csv2jsonWithKey(key.replace('\ufeff', ''));
      } else {
        newKey = format.csv2jsonWithKey(key);
      }

      obj[newKey] = format.csv2jsonWithValue(value);
    });

    fs.writeFileSync(target, JSON.stringify(obj, null, 2));
    console.log(`JSON file for ${lng} generated success!`);
  });
});
