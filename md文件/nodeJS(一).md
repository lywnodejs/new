---
title: node入门一
date: 2018-06-22
categories: 前端后台开发
author: lyw   
cover_picture: images/node.jpg
tags:
    - node
---

## http
```
const http=require('http');

var server=http.createServer(function (req, res){//req:require  res:response
  switch(req.url){
    case '/1.html':
      res.write("111111");
      break;
    case '/2.html':
      res.write("2222");
      break;
    default:
      res.write('404');
      break;
  }
  console.log(req.url)
  res.end();
});

//监听——等着
//端口-数字
server.listen(8080);

//http://localhost:8080/
```
## fs
```
const http=require('http');
const fs=require('fs');

var server=http.createServer(function (req, res){
  //req.url=>'/index.html'
  //读取=>'./www/index.html'
  //  './www'+req.url
  var file_name='./www'+req.url;
  fs.readFile(file_name, function (err, data){//file_name:读取地址
    if(err){
      res.write('404');//如果未找到 404
    }else{
      res.write(data);//data：读取的文件内容
    }
    res.end();

  });
});

server.listen(8080,function(){
  console.log("ssss");
});
```
## url
```
const http=require('http');
const urlLib=require('url');

http.createServer(function (req, res){
  var obj=urlLib.parse(req.url, true);

  var url=obj.pathname;//'./aaa'
  var GET=obj.query;//{name:'33',pass:'22'}

  console.log(url, GET);
  res.write('aaa');
  res.end();
}).listen(8081);
```
## 登录注册实例
```
const http=require('http');
const fs=require('fs');
const querystring=require('querystring');
const urlLib=require('url');

var users={};   //{"blue": "123456", "zhangsan": "123456", "lisi": "321321"}

var server=http.createServer(function (req, res){
  //解析数据
  var str='';
  req.on('data', function (data){
    str+=data;
  });
  req.on('end', function (){
    var obj=urlLib.parse(req.url, true);

    const url=obj.pathname;
    const GET=obj.query;
    const POST=querystring.parse(str);

    //区分——接口、文件
    if(url=='/user'){   //接口
      switch(GET.act){
        case 'reg':
          //1.检查用户名是否已经有了
          if(users[GET.user]){
            res.write('{"ok": false, "msg": "此用户已存在"}');
          }else{
            //2.插入users
            users[GET.user]=GET.pass;
            res.write('{"ok": true, "msg": "注册成功"}');
          }
          break;
        case 'login':
          //1.检查用户是否存在
          if(users[GET.user]==null){
            res.write('{"ok": false, "msg": "此用户不存在"}');
          //2.检查用户密码
          }else if(users[GET.user]!=GET.pass){
            res.write('{"ok": false, "msg": "用户名或密码有误"}');
          }else{
            res.write('{"ok": true, "msg": "登录成功"}');
          }
          break;
        default:
          res.write('{"ok": false, "msg": "未知的act"}');
      }
      res.end();
    }else{              //文件
      //读取文件
      var file_name='./www'+url;
      fs.readFile(file_name, function (err, data){
        if(err){
          res.write('404');
        }else{
          res.write(data);
        }
        res.end();
      });
    }
  });
});

server.listen(8080);

```




