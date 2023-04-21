<template>
  <div :style="{zIndex:zIndex}" class="sticky">
    <!-- <h3>流程进度</h3> -->
    <div class="stickyTitle">流程进度</div>
    <div :class="className" style="margin-top:20px" :style="{top:stickyTop+'px',zIndex:zIndex,position:position,width:width}">
      <!-- ,height:height+'px' -->
      <slot>
        <div>sticky</div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sticky',
  props: {
    stickyTop: {
      type: Number,
      default: 0
    },
    zIndex: {
      type: Number,
      default: 1
    },
    className: {
      type: String
    }
  },
  data() {
    return {
      active: false,
      position: '',
      currentTop: '',
      width: undefined,
      height: undefined,
      child: null,
      stickyHeight: 0
    }
  },
  mounted() {
    this.height = this.$el.getBoundingClientRect().height
    window.addEventListener('scroll', this.handleScroll)
  },
  activated() {
    this.handleScroll()
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    sticky() {
      if (this.active) {
        return
      }
      this.position = 'fixed'
      this.active = true
      this.width = this.width + 'px'
    },
    reset() {
      if (!this.active) {
        return
      }
      this.position = ''
      this.width = 'auto'
      this.active = false
    },
    handleScroll() {
      this.width = this.$el.getBoundingClientRect().width
      const offsetTop = this.$el.getBoundingClientRect().top
      if (offsetTop <= this.stickyTop) {
        this.sticky()
        return
      }
      this.reset()
    }
  }
}
</script>
<style lang="less">
.sticky{
  position: sticky;
  /* z-index: 10000; */
  top: 0px;
  height: 125px;
  .stickyTitle {
    color: #333333;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }
}
</style>
