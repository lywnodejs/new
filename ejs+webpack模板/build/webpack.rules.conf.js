/*
 * @Date: 2020-05-14 15:25:02
 * @Author: 刘亚伟
 * @LastEditTime: 2020-05-14 15:33:30
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production'
const rules = [{
		test: /\.(css|scss|sass)$/,
		use: [
			devMode ? 'style-loader' : {
				loader: MiniCssExtractPlugin.loader,
				options: {
					// you can specify a publicPath here
					// by default it use publicPath in webpackOptions.output
					publicPath: '../'
				}
			},
			'css-loader',
			'postcss-loader',
			'sass-loader',
		]
	},
	{
		test: /\.js$/,
		use: ["babel-loader"],
		// 不检查node_modules下的js文件
		// exclude: "/node_modules/"
	}, {
		test: /\.(png|jpg|gif)$/,
		use: [{
			// 需要下载file-loader和url-loader
			loader: "url-loader",
			options: {
				limit: 1 * 1024, //小于这个时将会已base64位图片打包处理
				// 图片文件输出的文件夹
				outputPath: "images"
			}
		}]
	},
	{
		test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
		loader: 'url-loader',
		options: {
			limit: 10000,
		}
	},
    {
        test: /\.ejs$/,
        loader: 'ejs-compiled-loader',
        options: {
            htmlmin: true,
            htmlminOptions: {
                removeComments: true
            }
        }
    },
	{
		test: /\.html$/,
		// html中的img标签
		use: ["html-withimg-loader"]
	}, {
		test: /\.less$/,
		use: [
			devMode ? 'style-loader' : {
				loader: MiniCssExtractPlugin.loader,
				options: {
					// you can specify a publicPath here
					// by default it use publicPath in webpackOptions.output
					publicPath: '../'
				}
			},
			'css-loader',
			'postcss-loader',
			'less-loader',
		]
	},
];
module.exports = rules;
