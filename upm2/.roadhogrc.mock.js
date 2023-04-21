const path = require('path');
const fs = require('fs');

const mock = {};

function walk(dirPath) {
  fs.readdirSync(dirPath)
    .forEach(function (file) {
      if (fs.statSync(dirPath + '/' + file).isDirectory()) {
        walk(dirPath + '/' + file)
      } else if (path.extname(file) === '.js') {
        Object.assign(mock, require(dirPath + '/' + file));
      }
    });
}

walk(path.join(__dirname + '/mock'))

export default mock;
