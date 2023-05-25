---
title: webpack配置
date: 2018-04-15
categories: 前端开发
cover_picture: images/webpack.jpg
author: lyw
tags:
    - webpack
    - 前端模块化开发
---
# webpack配置官网
>webpack官网地址: https://www.webpackjs.com
>此教程项目地址:  https://github.com/lywnodejs/new/tree/master/webpack4.7 (拿到之后下载依赖 npm install)

>webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle

* 从 webpack v4.0.0 开始，可以不用引入一个配置文件。然而，webpack 仍然还是高度可配置的。在开始前你需要先理解四个核心概念：

>入口(entry)
>输出(output)
>loader
>插件(plugins)
--------------
# 入口&输出

```
const path=require('path');
module.exports={
    entry:{
        index:path.join(__dirname,'src/scripts/index.js'),
        index2:path.join(__dirname,'src/scripts/index2.js')
    },
    output:{
        path:path.join(__dirname,'dist/js'),
        filename:'[name]-[chunkhash].js'  //hash为本次打包的hash值  [chunkhash] 为保证文件唯一性，可以认为是文件的版本号
    }
}
//打包单个
    entry:{
        index:"./src/scripts/index.js",
        index2:"./src/scripts/index2.js"
    }
  或者：entry:["src/script/index.js"."src/script/index2.js"]
     output:{
        filename:'dist/js/index.js'
     }
```
>执行webpack
不想用webpack.config.js作为配置文件  可以在npm命令行中输入 webapck --config webpack.dev.config.js 此处webpack.dev.config.js为文件名  
配合npm 执行webpack ：在package.json中的scripts对象中添加“build”：“webpack --config webpack.config.js --progress --display-module --colors --display-reason”
![img](http://chuantu.biz/t6/316/1526958897x-1566688562.png)

--------------
# loader
## html-webpack-plugin
打包之后的HTML文件会自动插入打包后的js文件。如果html文件地址不对，请把output改为path:path.join(__dirname,'dist/')
想要使src下的HTML与打包后的HTML文件相关联  html-webpack-plugin中传参数
```
new htmlWebpackPlugin({
    template:'./src/index.html',//模板文件
    filename:'index.html',//输出html文件，同样可以指定文件名，设置hash值
    inject:false,//将脚本放入head还是body
    title:"webpack-app",//html的标题 同时要在hmtl模板中的title中加入<%= htmlWebpackpligin.options.title %>此处必须是驼峰式命名，不然会报错
    date:new Date(),
    minify:{
        removeComments:true,//删除注释
        collapseWhitespace:true //删除空格
    }
})
```
多页面时 要分别引入不同的js文件 :
```
    new htmlWebpackPlugin({
            template:'./src/index.html',//模板文件
            filename:'index.html',//同样可以指定文件名，设置hash值
            inject:'body',//将脚本放入head还是body
            title:"webpack-app",//html的标题同时要在hmtl模板中的title中加入<%=htmlWebpackpligin.options.title%>此处必须是驼峰式命名，不然会报错
            chunks:['index'],//引入不同的脚本
            excluedChunks:[a,c]排除不引用的脚本
        }),
    new htmlWebpackPlugin({
        template:'./src/index2.html',
        filename:'index2.html',
        inject:'body',
        title:"webpack-app2",
        chunks:['index'],
    })
```
将脚本直接写入html中
```
<script type="text/javascript">
    <%= compilation.assets[htmlWebpackPlugin.files.chunks.index2.entry.substr(htmlWebpackPlugin.files.publicPath.length)].source() %>
</script>
```
--------------
## babel
安装：npm install --save-dev babel-loader babel-core
```
module:{
     rules: [
        {
            test: /\.js$/,
            use: 'babel-loader',
            include: path.resolve(__dirname,'src'),//加载哪个文件夹
            exclude: path.resolve(__dirname,'node_modules')//排除哪个文件夹
        }
    ]
}
```
------------------
## style-loader!css-loader!postcss-loader
```
{
    test: /\.css$/,
    use:[
        {loader:'style-loader'},
        {loader:'css-loader',options:{improtLoaders:1}},
        {loader: "postcss-loader",options:{ plugins:[require('autoprefixer')]}},                    
    ]
}
```
自动加浏览器前缀 postcss-loader >autoprefixer 需要npm下载

--------------
## less-loader
> 打包less文件  npm install less less-loader --save-dev
```
{
    test:/\.less$/,
    use: [
        {loader: "style-loader"},
        {loader: "css-loader"},
        {loader: "postcss-loader",options:{ plugins:[require('autoprefixer')]}},
        {loader: "less-loader"}
    ]
}
```
 > 打包sass和less一样
-------------------
## html-loader
> 打包html模板文件 npm install html-loader --save-dev
```
{
    test:/\.html$/,
    use:[
        {loader:'html-loader'}
    ]
}
```
------------------
## img-loader & file-loader
打包之前压缩图片   npm install image-webpack-loader --save-dev
```
{
test:/\.(png|gif|svg|jpg)$/i,
use:[
    {
        loader:'url-loader',
        options:{
            limit:10000,
            name:'images/[name].[ext]'
        }
    },
    {
        loader:'image-webpack-loader',
        options:{
            mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75
              }
        }
    }  
]
},
```
# 以上教程根据webpack-4.7编写,亲测有效
