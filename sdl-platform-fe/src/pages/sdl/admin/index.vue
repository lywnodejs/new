<template>
  <div id="ratel">
    <div class="forward">系统管理功能</div>
    <div class="need"></div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: ''
      }
    }
  }
</script>
<style lang="less">
  #ratel {
    margin: auto;
    width: 100%;
    height: 100%;
    background: white;
    margin-top: -40px;
    box-sizing: border-box;
    .forward {
      padding-top: 30px;
      margin-top: 30px;
      text-align: center;
      font-size: 20px;
    }
    .need {
      text-align: center;
      font-size: 15px;
      padding-top: 10px;
    }
  }
</style>

