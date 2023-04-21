<template>
  <div class="app-muuri-portal" :style="portalStyle">
    <div class="app-muuri-portal__content">
      <app-widget :show-fold="false">
        <template slot="custom">
          <li>
            <el-select v-model="w" @change="handleChange" placeholder="请选择">
              <el-option
                v-for="item in widthOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </li>
          <li slot="custom">
            <i class="icon iconfont icon-close" @click="remove"></i>
          </li>
        </template>
        <slot></slot>
      </app-widget>
    </div>
  </div>
</template>

<script>
import { getClosestVueParent } from 'utils'

export default {
  name: 'app-muuri-portal',
  props: {
    title: {
      type: String
    },
    id: {
      type: String
    },
    width: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      gutter: 7.5,
      w: this.width,
      widthOptions: [ 1, 2, 3, 4 ]
    }
  },
  computed: {
    portalStyle() {
      const gutter = this.$parent.gutter / 2
      const width = this.width * 6 * 100 / 24

      return {
        width: width + '%',
        'padding-left': gutter + 'px',
        'padding-right': gutter + 'px'
      }
    }
  },
  methods: {
    remove() {
      this.$emit('portal:remove', this.id)
    },
    handleChange(value) {
      this.$emit('portal:change:width', this.id, value)
    }
  },
  mounted() {
    const parent = getClosestVueParent(this.$parent, 'app-muuri')

    if (!parent) {
      throw Error('app-muuri-portal must be included app-muuri')
    }
  }
}
</script>

<style lang="less">
  .app-muuri-portal {
    position: absolute;
    z-index: 1;
    &.muuri-item-dragging {
      z-index: 3;
    }
    &.muuri-item-releasing {
      z-index: 2;
    }
    &.muuri-item-hidden {
      z-index: 0;
    }
    .app-widget__header {
      .el-select {
        width: 80px;
        .el-input__inner {
          height: 30px;
        }
      }
    }
  }
</style>
