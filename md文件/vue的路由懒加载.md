---
title: vue中的路由懒加载
date: 2017-03-15
categories: vue
cover_picture: images/vue.jpg
author: lyw
tags:
    - vue
---
##
懒加载：
       也叫延迟加载，即在需要的时候进行加载，随用随载。

为什么需要懒加载？
　　　　像vue这种单页面应用，如果没有应用懒加载，运用webpack打包后的文件将会异常的大，造成进入首页时，需要加载的内容过多，时间过长，会出啊先长时间的白屏，即使做了loading也是不利于用户体验，而运用懒加载则可以将页面进行划分，需要的时候加载页面，可以有效的分担首页所承担的加载压力，减少首页加载用时

　　　　简单的说就是：进入首页不用一次加载过多资源造成用时过长！！！

如何实现？

# 懒加载写法：
```
import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component:resolve=>require(["@/components/login"],resolve)
    },
    {
      path: '/list',
      component:resolve=>require(["@/components/list/list"],resolve),
      children:[
        {
          path: 'CuserManagement',
          name:"C端用户管理",
          component:resolve=>require(["@/components/CuserManagement"],resolve)       
        },
        {
          path: 'BuserManagement',
          name:"B端用户管理",
          component:resolve=>require(["@/components/BuserManagement"],resolve)
        },
      ]
    },
  ]
})
```