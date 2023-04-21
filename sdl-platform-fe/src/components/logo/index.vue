<template>
  <div class="app-logo" @click="handlerLogo">
    <img src="../../assets/logo-white.png" />
    滴滴SDL平台
  </div>
</template>
<script>
export default {
  name: 'app-logo',

  methods: {
    handlerLogo() {
      this.$router.push('/')
    }
  }
}
</script>
<style lang="less">
  .app-logo {
    width: 200px;
    color: gray;
    font-size: 18px;
    // height: 65px;
    padding: 8px 11px;
    white-space: nowrap;
    cursor: pointer;
    // border-bottom: 1px solid gray;
    // box-shadow: 0 2px 3px 0 rgba(0,0,0,0.10);
    background-color: white;
    img {
      width: 40px;
      height: 33px;
      margin-right: 5px;
      vertical-align: middle;
      cursor: pointer;
    }
  }
</style>

