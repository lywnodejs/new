<template>
  <div id="app">
    <!--<img src="assets/logo.png">-->
    <!--<router-view/>-->

    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  height:100%;
  /*margin-top: 60px;*/
}
html,body{height:100%}
body{
    padding:0;
    margin:0;
  }
.condition {
  padding: 15px 0;
  margin: 10px 0;
  border: 1px solid #d1dbe5;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
  border-radius: 4px;
  padding: 20px;
  position: relative;
}
.el-tooltip__popper.is-dark{
  max-width:500px !important;
}
.el-autocomplete-suggestion{
  width:360px !important;
}
.expand .el-table__expand-column .cell {
    display: none;
}
.el-select-dropdown{
  width: 250px !important;
}
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background-color: #1890ff;
  color: #ffffff;
}
/*td div.el-tooltip{*/
  /*position:relative;*/
  /*line-height:1.4em;*/
  /*!* 3 times the line-height to show 3 lines *!*/
  /*height:4.2em;*/
  /*overflow:hidden;*/
/*}*/
/*td div.el-tooltip:after {*/
  /*content:"...";*/
  /*font-weight:bold;*/
  /*position:absolute;*/
  /*bottom:0;*/
  /*right:0;*/
  /*padding:0 20px 1px 45px;*/
/*}*/
</style>
