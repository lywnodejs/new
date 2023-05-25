---
title: vuex状态管理(一)
date: 2017-05-30
categories: vuex
cover_picture: images/vue.jpg
author: lyw
tags:
    - vue
    - vuex
---
>安装
```
npm install vuex --save
```
>然后 , 在 main.js 中加入 :
```
import vuex from 'vuex'
Vue.use(vuex);
var store = new vuex.Store({//store对象
    state:{
        show:false
    }
})
```
>再然后 , 在实例化 Vue对象时加入 store 对象 :
```
new Vue({
  el: '#app',
  router,
  store,//使用store
  template: '<App/>',
  components: { App }
})
```
>改变状态
```
console.log(this.$store.state.show)
this.$store.state.show=true;
console.log(this.$store.state.show)
```