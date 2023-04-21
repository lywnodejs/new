<!--
 * @Date: 2020-03-17 16:00:23
 * @Author: 魏愈茜
 * @LastEditTime: 2020-04-01 20:35:14
 -->
<template>
  <a-layout id="components-layout-demo-fixed-sider">
    
    <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 ,top:'60px'}">
      <div class="logo"></div>
      <a-menu theme="dark" mode="inline" :selectedKeys="selectionKey">
        <a-menu-item
          v-for="(item,index) in rootSubmenuKeys"
          :key="item"
          :index="index"
          @click="routerTo(index)">
          <a-icon type="user" />
          <span>{{item}}</span>
        </a-menu-item>
      </a-menu>

    </a-layout-sider>
    <a-layout :style="{ marginLeft: '200px' }">
      <a-layout-header :style="{ background: '#fff', padding: 0 }" />
      <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <div :style="{ padding: '24px', background: '#fff', textAlign: 'center' }">
          <router-view></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">

      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
  export default {
    name:'index',
    data(){
      return {
        selectionKey:[],//当前选中菜单
        rootSubmenuKeys:['test','information'],//菜单组
      }
    },
    created(){
      if(this.$route.path!=='/'){
        var path_ = this.$route.path.substr(1,this.$route.path.length)
        this.selectionKey=[path_]
      }
    },
    beforeRouteUpdate(to,from,next){
      if(to.path!=='/'){
        var path_ = to.path.substr(1,to.path.length)
        this.selectionKey=[path_]
      }
      next()
    },
    methods:{
      routerTo(index){
        this.$router.push({
          path:this.rootSubmenuKeys[index]
        })
      }
    }
  }
</script>
<style>
  #components-layout-demo-fixed-sider .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
</style>
