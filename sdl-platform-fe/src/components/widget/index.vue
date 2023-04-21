<template>
  <div class="app-widget app-border app-normal-bg" :class="isFull ? 'app-widget--full' : null">
    <header class="app-widget__header" :class="!isFold ? 'app-border--bottom' : null">
      <div class="app-widget__header__title">
        {{title}}
      </div>
      <ul class="app-widget__header__oper">
        <!-- custom slot content -->
        <li>
          <slot name="custom" :isFold="isFold"></slot>
        </li>
        <li v-if="showFold && !isFull">
          <i class="icon iconfont" @click="fold" :class="isFold ? 'icon-arrow-down-double' : 'icon-arrow-up-double'"></i>
        </li>
        <li v-if="showFull">
          <i class="icon iconfont" @click="full" :class="isFull ? 'icon-screen-exit' : 'icon-screen-full'"></i>
        </li>
      </ul>
    </header>
    <el-collapse-transition>
      <div class="app-widget__content app-section" v-show="!isFold">
        <!-- display content slot -->
        <slot></slot>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
export default {
  name: 'app-widget',
  props: {
    title: String,
    defaultFold: {
      type: Boolean,
      default: false
    },
    showFold: {
      type: Boolean,
      default: false
    },
    showFull: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFold: this.defaultFold,
      isFull: false
    }
  },
  methods: {
    fold() {
      this.isFold = !this.isFold
      this.$emit('widget:fold', this.isFold)
    },
    full() {
      if (!this.isFull) {
        this.scrollTop = this.container.scrollTop
        this.isFull = true
      } else {
        this.isFull = false
        this.$nextTick(() => {
          this.container.scrollTop = this.scrollTop
        })
      }
      this.$emit('widget:full', this.isFull)
    }
  },
  mounted() {
    this.container = document.querySelector('.app-container__main__content')
  }
}
</script>

<style lang="less">
  .app-widget {
    margin-bottom: 15px;
    &__header {
      height: 40px;
      padding: 0 15px;
      overflow: hidden;
      &__title {
        line-height: 40px;
        float: left;
      }
      &__oper {
        font-size: 12px;
        height: 100%;
        float: right;
        display: flex;
        align-items: center;
        li {
          margin-left: 10px;
          float: left;
          i {
            cursor: pointer;
          }
        }
        &__min {
          height: 25px;
          display: block;
          border-bottom: 3px solid #c0c4cc;
        }
        &__max {
          height: 20px;
          display: block;
          margin-top: 8px;
          border: 1px solid #c0c4cc;
          border-top: 3px solid #c0c4cc;
        }
      }
    }
    &__content {
      overflow: hidden;
    }
    &--full {
      box-shadow: 0px 0px 6px 3px #606266;
      margin-bottom: 0px;
      padding-top: 40px;
      position: fixed;
      top: 2px;
      right: 2px;
      bottom: 2px;
      left: 2px;
      z-index: 999;
      .app-widget__header {
        margin-top: -40px;
      }
      .app-widget__content {
        height: 100%;
        overflow: auto;
      }
    }
  }
</style>
