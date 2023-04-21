const path = require('path');
const prod = require('./webpack.config.prod');
const merge = require('webpack-merge');

module.exports = merge(prod, {
    output: {
        path: path.resolve(__dirname, './dist/global'),
    }
});
