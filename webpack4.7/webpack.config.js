const path=require("path");
const htmlWebpackPlugin=require('html-webpack-plugin');
module.exports={
    entry:{
        index:'./src/complate/app.js',
    },
    output:{
        path:path.join(__dirname,'dist'),
        filename:'./js/[name].js'
    },
    module:{
         rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: path.resolve(__dirname,'src'),//加载那个文件夹
                exclude: path.resolve(__dirname,'node_modules')//排除那个文件夹
            },
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
            {
                test: /\.css$/,
                use:[
                    {loader:'style-loader'},
                    {loader:'css-loader',options:{improtLoaders:1}},
                    {loader: "postcss-loader",options:{ plugins:[require('autoprefixer')]}},                    
                ]
            },
            {
                test:/\.html$/,
                use:[
                    {loader:'html-loader'}
                ]
            },
            {
                test:/\.less$/,
                 use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "postcss-loader",options:{ plugins:[require('autoprefixer')]}},
                    {loader: "less-loader"}
                ]
             },
        ]
    },
    plugins:[
        new htmlWebpackPlugin({
            filename:'index.html',
            template:'index.html',
            inject:'body'
        }),
    ]
}