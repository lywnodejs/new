<template>
  <div class="app-search-form">
    <app-widget :title="$t('查询条件')" :show-fold="showFold"
      :default-fold="defaultFold"
      @widget:fold="handleFold"
    >
      <template slot="custom">
        <slot></slot>
      </template>
      <!-- <div class="app-section"> -->
      <div>
        <el-form
          :label-position="labelPosition"
          :label-width="labelWidth"
          @submit.native.prevent="submit">
          <el-row :gutter="gutter">
            <slot name="fields">
            </slot>
          </el-row>
          <div :class="buttonClass">
            <slot name="buttons">
            </slot>
          </div>
        </el-form>
      </div>
    </app-widget>
    <div class="app-search-form__query app-border app-border--bottom app-padding--container"
      v-if="floatQuery && queryable && querys.length > 0"
      ref="query">
      <el-tag type="primary" v-for="query in querys"
        closable
        @close="handleClose(query)"
        :key="query.field">{{$t(query.label)}}：{{query.value}}</el-tag>
    </div>
  </div>
</template>

<script>
import { connect } from '@/lib'
import { addEvent, removeEvent } from '@/utils'

export default connect(() => {
  return {
    dictionaryOptions: 'dictionary/dictionaryOptions'
  }
})({
  name: 'app-search-form',
  props: {
    labelPosition: {
      type: String,
      default: 'left'
    },
    labelWidth: {
      type: String,
      default: '80px'
    },
    gutter: {
      type: Number,
      default: 80
    },
    buttonAlign: {
      type: String,
      default: 'left'
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    showFold: {
      type: Boolean,
      default: true
    },
    fold: {
      type: Boolean,
      default: true
    },
    floatQuery: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      defaultFold: this.fold,
      queryable: false,
      querys: []
    }
  },
  computed: {
    buttonClass() {
      return this.buttonAlign === 'right' ? 'app-search-form__button--right' : null
    }
  },
  watch: {
    queryable(value) {
      if (value) {
        this.$nextTick(() => {
          const firstChild = this.floatWindow.children[0]

          this.$refs.query && this.floatWindow.insertBefore(this.$refs.query, firstChild)
        })
        this.querys = this.formatQuery()
      } else {
        this.querys = []
      }
    }
  },
  methods: {
    submit(e) {
      this.$emit('submit', e)
    },

    /**
     * 注册item
     */
    registryItem({label, prop, type, codeType}) {
      this.itemMap[prop] = {
        label,
        type,
        codeType
      }
    },

    /**
     * 格式化查询条件
     */
    formatQuery() {
      const query = this.$route.query
      const keys = Object.keys(query)
      const querys = []

      // 合并查询字段
      keys.forEach(key => {
        const ret = key.match(/(.*)(Begin|End)$/)

        if (ret) {
          querys.indexOf(ret[1]) === -1 && querys.push(ret[1])
        } else if (this.itemMap[key]) {
          querys.push(key)
        }
      })

      return querys.map(key => {
        const { label, type, codeType } = this.itemMap[key]

        let value

        if (codeType) {

          // 从字典查找
          value = _.find(this.dictionaryOptions[codeType], {code: +query[key]}).name
        } else if (type === 'range') {

          // 时间字段
          value = query[`${key}Begin`] + ' - ' + query[`${key}End`]
        } else {

          // 文本字段
          value = query[key]
        }

        return {
          field: key,
          label: label,
          value
        }
      })
    },
    handleFold(fold) {
      this.$emit('searchForm:fold', fold)
    },
    handleScroll() {
      const offsetHeight = this.$el.offsetHeight
      const scrollTop = this.container.scrollTop

      this.queryable = scrollTop > 0 && offsetHeight < scrollTop
    },
    handleClose(query) {
      this.querys.splice(this.querys.indexOf(query), 1);
      this.$emit('searchForm:remove', query)
    }
  },
  created() {
    this.itemMap = {}
  },
  mounted() {
    if (this.floatQuery) {
      this.container = document.querySelector('.app-container__main__content') // 页面容器
      this.floatWindow = document.querySelector('.app-float-window') // 浮动窗口
      this._handleScroll = _.debounce(this.handleScroll, 20)
      addEvent(this.container, 'scroll', this._handleScroll)
    }
  },
  beforeDestroy() {
    if (this.floatQuery) {
      this.$refs.query && this.floatWindow.removeChild(this.$refs.query)
      removeEvent(this.container, 'scroll', this._handleScroll)
    }
  }
})
</script>

<style lang="less">
  .app-search-form {
    overflow: hidden;
    &__simple {
      padding: 2px 5px;
      input {
        border: none;
      }
    }
    &__button {
      &--right {
        text-align: right;
      }
    }
    &__query {
      .el-tag {
        margin-top: 15px;
        &:not(:last-of-type) {
          margin-right: 15px;
        }
      }
    }
    .el-select {
      width: 100%;
    }
    .el-col {
      border-radius: 4px;
    }
    .bg-purple-dark {
      background: #99a9bf;
    }
    .bg-purple {
      background: #d3dce6;
    }
    .bg-purple-light {
      background: #e5e9f2;
    }
    .grid-content {
      border-radius: 4px;
      min-height: 36px;
    }
  }

</style>

