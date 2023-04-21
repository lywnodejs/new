<template>
  <div class="app-shield">
    <transition :name="animateName">
      <div class="app-shield__content" :class="contentClassName" :style="contentStyle"
        @click.self="toggle"
        v-if="show">
        <slot></slot>
      </div>
    </transition>
    <template v-if="enableMask">
      <transition name="fadeIn">
        <div class="app-shield__mask" :style="maskStyle" v-show="show"></div>
      </transition>
    </template>
  </div>
</template>

<script>
let zIndex = 1900

export default {
  name: 'app-shield',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    pos: {
      type: String,
      default: 'right'
    },
    top: {
      type: Number
    },
    right: {
      type: Number
    },
    bottom: {
      type: Number
    },
    left: {
      type: Number
    },
    enableMask: {
      type: Boolean,
      default: false
    },
    maskBackGroundColor: {
      type: String,
      default: 'rgba(0, 0, 0, 0.7)'
    }
  },
  computed: {
    contentClassName() {
      const classList = []

      switch (this.pos) {
        case 'right':
          classList.push('app-shield__content--right')
          break
        case 'bottom':
          classList.push('app-shield__content--bottom')
          break
        case 'left':
          classList.push('app-shield__content--left')
          break
        case 'top':
          classList.push('app-shield__content--top')
          break
      }

      if (this.enableMask) {
        classList.push('app-shield__content__full')
      }
      return classList
    },
    contentStyle() {
      const { top, right, bottom, left } = this

      return {
        top: typeof top === 'number' ? top + 'px' : null,
        right: typeof right === 'number' ? right + 'px' : null,
        bottom: typeof bottom === 'number' ? bottom + 'px' : null,
        left: typeof left === 'number' ? left + 'px' : null
      }
    },
    maskStyle() {
      return {
        'background-color': this.maskBackGroundColor,
        'z-index': zIndex++
      }
    },
    animateName() {
      switch (this.pos) {
        case 'right':
          return 'fadeInRight'
        case 'bottom':
          return 'fadeInUp'
        case 'left':
          return 'fadeInLeft'
        case 'top':
          return 'fadeInDown'
        default:
          return null
      }
    }
  },
  methods: {
    toggle() {
      this.enableMask && this.$emit('app:shield:close')
    }
  }
}
</script>

<style lang="less">
  .app-shield {
    &__content {
      position: fixed;
      overflow: auto;
      z-index: 2000;
      &--right {
        right: 0;
        top: 0;
      }
      &--bottom {
        bottom: 0;
        left: 50%;
      }
      &--left {
        left: 0;
        top: 0;
      }
      &--top {
        top: 0;
        left: 0;
      }
      &__full {
        width: 100%;
        height: 100%;
      }
    }
    &__mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }

</style>
