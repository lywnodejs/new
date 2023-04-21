<template>
  <section class="app-section app-border app-padding app-margin--bottom">
    <span class="app-section__title app-normal-bg">{{title}}</span>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'app-section',
  props: {
    title: null
  }
}
</script>

<style lang="less">
  .app-border {
    border-width: 1px;
    border-style: solid;
    border-color: #e2e2e2;
  }

  .app-padding {
    padding: 15px;
  }

  .app-margin--bottom {
    margin-bottom: 15px;
  }

  .app-section {
    position: relative;
    &__title {
      color: #FF0000;
      font-weight: bold;
      position: absolute;
      top: -20px;
      background-color: #ffff;
      padding: 0 5px;
    }
  }
</style>
