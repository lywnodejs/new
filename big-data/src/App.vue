<template>
  <div id="app">

    <keep-alive :include="keepAlive">
     <router-view>
     </router-view>
    </keep-alive>
  </div>
</template>

<script>
import store from './store'
  export default {
    name:'app',
    computed: {
      keepAlive(){
        return store.getters.keepAliveListFun
      }
    }
  }
</script>

<style>
  .rxhBD_scope{
    float: left;
    width: 4rem;
    text-align: right;
  }
  .clear{
    clear: both;
  }
  .inputreport{
    width: calc(100% - 6rem) !important;
    float: left;
    margin-left: 1.35rem !important;
  }
  .rxhBD_head_report_pop .rxhBD_pop_bg{
    position: fixed !important;
  }
  .rxhBD_scope_A{
    float: right !important;
    margin-right: 1rem;
  }
  .rxhBD_scope_A,.rxhBD_scope_A i,.rxhBD_scope_A span {
    color: #fff !important;
    font-size: 0.938rem;
    line-height: 2.125rem;
    height: 2.125rem;
  }
  .rxhBD_head_report_pop .rxhBD_pop_box {
    background-color: #fff;
    border-radius: 0.25rem;
    padding: 0 0.875rem;
    position: fixed;
    top: 3.5rem !important;
    right: 1.5rem !important;
    z-index: 20002;
  }
  .rxhBD_all_bd_ul li{
    overflow: -moz-hidden-unscrollable !important;
  }
    .cube-scroll-nav-bar-item{
        color: #9b9b9b !important;
    }
    .cube-scroll-nav-bar-item_active{
        color: #ffffff !important;
        font-size: 1.13rem;
        line-height: 0.9rem;
    }
    .cube-scroll-nav-bar-item_active span{
        position: relative;
    }
    .cube-scroll-nav-bar-item_active span:after{
        content:'';
        width: 1.13rem;
        height: 0.19rem;
        position: absolute;
        left: 50%;
        bottom: -0.4rem;
        transform: translate(-50%,0);
        border-radius: 0.1rem;
        background: #ffffff;
    }
    .appendBox_Common .rxhBD_main{
        margin-bottom: 0;
    }
</style>
<style src="../static/common/css/yy_bigData.css"></style>
<style src="../static/common/css/xdy.css"></style>
