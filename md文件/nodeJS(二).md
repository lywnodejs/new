---
title: node入门二
date: 2018-06-25
categories: 前端后台开发
author: lyw
cover_picture: images/node.jpg
tags:
    - node
---

## express
```
const express=require('express');
const expressStatic=require('express-static');

var server=express();
server.listen(8080);

//用户数据
var users={
  'blue': '123456',
  'zhangsan': '654321',
  'lisi': '987987'
};

server.get('/login', function (req, res){
  var user=req.query['user'];
  var pass=req.query['pass'];

  if(users[user]==null){
    res.send({ok: false, msg: '此用户不存在'});
  }else{
    if(users[user]!=pass){
      res.send({ok: false, msg: '密码错了'});
    }else{
      res.send({ok: true, msg: '成功'});
    }
  }
});

server.use(expressStatic('./www'),function(req,res){
  res.send("ok");
});
```
## body-parser
```
const express=require('express');
const querystring=require('querystring');
const bodyParser=require('body-parser');

var server=express();
server.listen(8080);

/*
server.use(function (req, res, next){
  var str='';
  req.on('data', function (data){
    str+=data;
  });
  req.on('end', function (){
    req.body=querystring.parse(str);

    next();
  });
});
*/

server.use(bodyParser.urlencoded({}));

server.use('/', function (req, res){
  console.log(req.body);
});
```




