<template>
  <div class="app-muuri" :style="muuriStyle">
    <app-muuri-portal v-for="item in items" :key="item.id"
      :id="item.id"
      :width="item.width"
      :data-id="item.id"
      :data-width="item.width"
      @portal:remove="remove"
      @portal:change:width="changeWidth">
      <component :is="item.id" />
    </app-muuri-portal>
  </div>
</template>

<script>
import Muuri from 'muuri'

// 一次性加载全部挂件
const portals = {}
const context = require.context('../../portals', true, /^\.\/[^/]+\/index.vue/);
context.keys().map((item) => {
  const component = context(item)
  portals[component.name] = component
});

export default {
  name: 'app-muuri',
  props: {

    // portal间隔
    gutter: {
      type: Number,
      default: 15
    },

    // 默认展示的portals
    defaultItems: {
      type: Array,
      default: []
    },

    // 是否可拖拽
    dragEnabled: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    muuriStyle() {
      return {
        'margin-left': -this.gutter / 2 + 'px',
        'margin-right': -this.gutter / 2 + 'px'
      }
    }
  },
  data() {
    return {
      items: this.defaultItems.slice()
    }
  },
  watch: {
    defaultItems(val) {
      this.items = val.slice()
      this.$nextTick(() => this.reload())
    }
  },
  components: {
    ...portals
  },
  methods: {

    /**
     * 初始化muuri
     */
    init() {
      this.grid = new Muuri('.app-muuri', {
        dragEnabled: this.dragEnabled,
        dragContainer: this.$el,
        layout: {
          fillGaps: false,
          horizontal: false,
          alignRight: false,
          alignBottom: false,
          rounding: false
        }
      })
      .on('move', () => {

        // 通过拖动改变位置之后进行同步操作
        this.synchronize();
        this.synchronizeData();
      })
      .on('remove', () => {

        // 删除portal之后进行同步操作
        this.synchronizeData();
      })
    },

    /**
     * 重载Grid
     */
    reload() {
      const items = this.$el.querySelectorAll('.app-muuri-portal')

      this.grid.remove({
        layout: false
      })
      this.grid.refreshItems()
      this.grid.add(items)
    },

    /**
     * 刷新Grid
     */
    refresh() {
      this.grid.refreshItems().layout()
    },

    /**
     * 查找第一个portal
     */
    findFirstItemDOM() {
      return this.$el.querySelectorAll('.app-muuri-portal:first-child')
    },

    /**
     * 查找最后一个portal
     */
    findLastItemDOM() {
      return this.$el.querySelectorAll('.app-muuri-portal:last-child')
    },

    /**
     * 按照ID查找DOM
     */
    findItemDOMById(id) {
      return this.$el.querySelectorAll(`.app-muuri-portal[data-id=${id}]`)
    },

    /**
     * 添加portal
     */
    add(item, append = true) {
      if (append) {
        this.items.push(item) // 更新数组
        this.$nextTick(() => {
          this.grid.add(this.findLastItemDOM())
        })
      } else {
        this.items.unshift(item) // 更新数组
        this.$nextTick(() => {
          this.grid.add(this.findFirstItemDOM(), {index: 0})
        })
      }
    },

    /**
     * 删除portal
     */
    remove(id) {
      const item = this.findItemDOMById(id)

      this.grid.hide(item, {
        onFinish: items => {
          this.grid.remove(item, {removeElements: true})
        }}
      )
    },

    /**
     * 更改宽度
     */
    changeWidth(id, width) {
      const portal = _.find(this.items, [ 'id', id ])

      if (portal) {
        portal.width = width
        this.$nextTick(() => this.refresh())
      }
    },

    /**
     * 映射item排序到DOM排序
     */
    synchronize() {
      this.grid.synchronize();
    },

    /**
     * 同步DOM到数据
     */
    synchronizeData() {
      const items = this.$el.querySelectorAll('.app-muuri-portal')

      this.items = [].map.call(items, element => {
        return {
          id: element.dataset.id,
          width: +element.dataset.width
        }
      })
    },

    getSortData() {

    },

    /**
     * 销毁muuri实例
     */
    destroy() {
      this.grid.destroy()
    }
  },
  mounted() {
    this.init()
  },
  beforeDestry() {
    this.destroy()
  }
}
</script>

<style lang="less">
  .app-muuri {
    position: relative;
  }
</style>

