<template>
  <transition name="fadeInUp">
    <div class="app-container-error">
      <div class="app-container-error__box">
        <h1>404</h1>
        <h3>Page Not Found</h3>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'page-error'
  }
</script>
<style lang="less">
  .app-container-error {
    height: 100%;
    color: #676a6c;
    &__box {
      max-width: 400px;
      padding-top: 40px;
      margin: 0 auto;
      text-align: center;
      h1 {
        font-size: 170px;
        font-weight: 100;
        line-height: 1;
        margin-bottom: 10px;
      }
      h3 {
        margin-bottom: 10px;
      }
    }
  }
</style>

