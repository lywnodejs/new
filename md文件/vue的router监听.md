---
title: vue中监听router变化
date: 2017-03-10
categories: 前端开发
cover_picture: images/vue.jpg
author: lyw
tags:
    - vue
    - router
---
有时候我们需要监听路由，做出某种操作。。
##
下面是个简单的例子
##
```
<template>
    <div>
        <span>{{msg}}</span>//添加到页面
    </div>
</template>
<script>
export default{
    data(){
        return {
            msg:""
        }
    },
    mounted(){
        this.get()
    },
    methods:{
        get(){
            this.msg=this.$router.history.current.name
        }
    },
    watch:{
        $route:"get" //监听router变化 并立即改变data数据
    }
}
//其中this.$router.history.current是当前路由 下面的参数根据需要变化
</script>
```
还有其他封装方法 不一一列出了~