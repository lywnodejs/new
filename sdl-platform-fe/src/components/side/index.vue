<template>
  <div class="side-panel">
    <slot></slot>
    <div class="side-panel__oper">
      <i @click="changeFullScreen" class="iconfont icon-icon--1" :class="fullScreen ? 'icon-icon--1' : 'icon-icon--2'"></i>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'app-side',

  computed: {
    ...mapState(['fullScreen'])
  },

  methods: {
    ...mapActions({
      changeFullScreen: 'updateFullScreen'
    })
  }
}
</script>
<style lang="less">
  .side-panel {
    height: 100%;
    // padding-bottom: 50px;
    // padding-top: 16px;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    // background-color: #374457;
    background-color: #3F4760;
    color: black;
    // margin-top: 3px;
    &__oper {
      height: 50px;
      line-height: 50px;
      text-align: center;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      .iconfont {
        font-size: 24px;
        color: gray;
        cursor: pointer;
      }
    }
    
  }
// .is-dark.el-tooltip__popper{
//   max-width: 250px !important;
//   background: #303133; 
//     color: #fff;
//   // background: #f2f6fc  !important;
//   // color: #333333;
//   // border: 1px solid #ebeef5;
//   // background-image: linear-gradient(90deg, #C2E9FB 0%, #A1C4FD 100%);
//   // background-image: linear-gradient(135deg, #FCC687 0%, #F286A0 100%);
// }
</style>

