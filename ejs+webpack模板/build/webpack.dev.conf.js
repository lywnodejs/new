/*
 * @Date: 2020-05-14 15:25:02
 * @Author: 刘亚伟
 * @LastEditTime: 2020-05-14 15:37:17
 */
const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
const webpackConfigBase = require('./webpack.base.conf');
const ip =require('ip').address();
const webpackConfigDev = {
	mode: 'development', // 通过 mode 声明开发环境
	output: {
		path: path.resolve(__dirname, '../dist'),
		// 打包多出口文件
		// 生成 a.bundle.js  b.bundle.js
		filename: './js/[name].bundle.js'
	},
	devServer: {
		contentBase: path.join(__dirname, "../src"),
		publicPath:'/',
		host: ip || 'localhost',
		port: "8089",
		overlay: true, // 浏览器页面上显示错误
		open: false, // 开启浏览器
		// stats: "errors-only", //stats: "errors-only"表示只打印错误：
		hot: true, // 开启热更新
        proxy: {
            '/api/': {
                target: 'http://10.0.0.22:10029/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            },
        },
	},
	plugins: [
		//热更新
		new webpack.HotModuleReplacementPlugin(),
	],
	// devtool: "source-map",  // 开启调试模式
	module: {
		rules: []
	},
}
module.exports = merge(webpackConfigBase, webpackConfigDev);
