
<template>
  <div id="app">
    <!--<router-view></router-view>-->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
  import store from './store/index';
  import {mapActions } from 'vuex';
  import robotHeader from './components/robotConfig/RobotConfigHeader';

  export default {
    name: 'App',
    store,
    methods: {
      ...mapActions([
        'setDefaultIndex'
      ]),
    },
    watch: {
      $route(to, from) {

      }
    },
    // components: {
    //   robotHeader
    // },
    created: function () {
      // this.$router.push({path: `/`})
    }
  }
</script>

<style>
  body {
    margin: 0px;
    padding: 0px;
    height: 100%;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }



  /*标注相关*/
  .corpusContent{
    line-height: normal;
  }
  .corpusContent span{
    padding: 5px 0;
    display: inline-block;
  }
  .bgcolor1{background:  #c6f4ff}
  .bgcolor2{background:  #fccfa5}
  .bgcolor3{background:  #b4d6ef}
  .bgcolor4{background:  #e9f69e}
  .bgcolor5{background:  #feb2a3}
  .bgcolor6{background:  #ff9566}
  .bgcolor7{background:  #c6f0a9}
  .bgcolor8{background:  #95d9c0}
  .bgcolor9{background:  #49becc}
  .bgcolor10{background: #b3bcdd}

  .ChooseLabel{    position: relative;  font-weight: normal;  padding: 5px;  margin: 0 6px;  }
  .ChooseLabel2{     position: relative;  font-weight: normal;  padding: 5px;  margin: 0 6px;  }
  .ChooseLabel3{    position: relative;  font-weight: normal;  padding: 5px;  margin: 0 6px;  }
  .ChooseLabel:hover i,.ChooseLabel2:hover i{
    display: inline-block;
  }

  .ChooseLabel:hover h{
    display: inline-block;
  }

  .ChooseLabel i,.ChooseLabel2 i{display: none;cursor: pointer;width: 16px;font-style: normal;position: absolute;right: -8px;top: -8px;height: 16px;background: red;border-radius: 10px;font-size: 12px;text-align: center;line-height: 16px;color: #fff}
  .ChooseLabel span,.ChooseLabel2 span{
    font-size: 14px;
  }

  .ChooseLabel h{
  /*.chooseLabel_score{*/
    display: none;
    font-style: normal;
    position: absolute; left:0px; top: -20px;height: 20px;background: white;
    font-size: 8px;text-align: center;line-height: 20px;width: 100%;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    color: #2c3e50;
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    /*margin-top: 60px;*/
  }
  p table{ table-layout: fixed; border-collapse:collapse;
    display:inline-block;
    word-break: break-all;
    word-wrap: break-word;
  }
  p table th, p table td{ border: solid 1px #DFE2E5; width: 80px; max-width: 80px; padding: 5px;}
  p table td{
    text-overflow:ellipsis;
    -moz-text-overflow: ellipsis;
    text-overflow:ellipsis;
    overflow:hidden; white-space:nowrap;
  }
  .selectWrap{
    display: inline-block;
    float: left;
    margin: 10px 10px 10px 0;
  }
  .radioGroup{
    max-height: 100px!important;
    overflow: auto;
  }
  .Water.el-dialog__wrapper{
    top: initial;
    left:initial;
  }
  .box-shadow .el-dialog{
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  }
  .MouseUp>.el-dialog{
    position: absolute;
    width: 400px;
    margin: 0!important;
  }
  .MouseUp.el-dialog__wrapper{
    overflow: initial;
  }
  .Water>.el-dialog{
    position:fixed!important;
    right: 10px;
    bottom: 10px;
    margin: 0!important;
  }
  .Water .el-dialog__header{
     padding: 0;
  }
  .Water .el-dialog__body{
     padding: 15px 20px!important;
  }
  .Water .el-tabs--border-card>.el-tabs__content{
    padding: 0!important;
  }
  a.RobotLabel:hover{
    color: #fff;
  }
/*  .tabP a:hover{
    color: #fff;
  }*/
  .textUnder{
    position: relative;
    display: inline-block;
  }
  .textUnder::after{
    content: '';
    position: absolute;
    bottom: 1px;
    left: 0;
    width: 100%;
    height: 32px;
    background: rgba(153,0,0,.15);
  }
  .RobotLabel{
    background: #7F8FA4;color: #fff;border-radius: 3px;
    border: solid 1px #7F8FA4;text-decoration: none;padding: 5px 10px;display: inline-block;
  }
  .humanLabel{
    border: solid 1px #F7981C;padding: 5px 10px;background-color:#F7981C;font-size: 14px;color: #fff;-webkit-border-radius: 3px;-moz-border-radius: 3px;border-radius: 3px;
    margin-right: 5px;
    margin-top: 5px;
  }
  .RobotLabel.list,.humanLabel.list{
    padding: 0 8px;
    border: none;
    display: inline-block;
  }
  .corpusContent{
    font-size: 18px;box-sizing: border-box;padding: 20px;position: relative;min-height: 200px;overflow: auto;max-height: 300px;
  }
  .neymar .el-tabs--border-card>.el-tabs__content{
    padding:  15px!important;
  }
  .titlebold .el-table th>.cell {
    font-weight: bold;
  }
  .resultOver{
    padding: 0;
    max-height: 240px;
    overflow: auto;
  }
  .distributeP span:nth-child(1){
    width: 130px;
  }
  .distributeP span:nth-child(n+1){
    display: inline-block;
    width: 100px;
    padding-left: 10px;
  }
  .el-table th {
    /*background-color: #c9c9c9 !important;*/
    background-color: #fff ;
    /*background-color: #fff !important;*/
    color:#000;
    font-weight:normal;
  }
.revise{color: #269AF2;cursor: pointer;text-decoration: underline;margin-left: 30px;}
  .el-radio__inner{
    border: 1px solid #7F8FA4!important;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #45B854 !important;
    background: #45B854 !important;
  }
  /*.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {*/
    /*background-color: #45B854 !important;*/
    /*border-color: #45B854 !important;*/
  /*}*/
  .el-radio__input.is-checked+.el-radio__label {
    color: #354052 !important;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #354052 !important;
  }
  .el-table--fit {
    border-top: 1px solid #EBEEF4;
    border-left: 1px solid #EBEEF4;
    border-right: 1px solid #EBEEF4;
  }
  .el-card__header {
    padding: 0 20px !important;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 46px;
    line-height: 46px;
  }
  .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: 16px !important;
  }
  .dialogClass{
    max-width: 700px;
    min-width: 500px;
  }
  /*嵌套的dialog 子dialog*/
  .actionConfigClass{
    min-width: 200px;
    max-width: 400px;
  }

</style>
