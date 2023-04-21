<template>
  <div class="sti-table">
    <el-table :class="{'table-nowrap': isNoWrap}" :data="showData" :height="height" :max-height="maxHeight" :stripe="stripe" :border="border" :fit="fit" :show-header="showHeader" :highlight-current-row="highlightCurrentRow" :current-row-key="currentRowKey" :row-class-name="rowClassName" :row-style="rowStyle" :row-key="rowKey" :empty-text="emptyText" :default-expand-all="defaultExpandAll" :expand-row-keys="expandRowKeys" :default-sort="defaultSort" :tooltip-effect="tooltipEffect" :show-summary="showSummary" :sum-text="sumText" :summary-method="summaryMethod" @select="select" @select-all="selectAll" @selection-change="selectionChange" @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave" @cell-click="cellClick" @cell-dblclick="cellDblclick" @row-click="rowClick" @row-contextmenu="rowContextmenu" @row-dblclick="rowDblclick" @header-click="headerClick" @sort-change="sortChange" @filter-change="filterChange" @current-change="currentChange" @header-dragend="headerDragend" @expand-change="expand-change">
      <slot></slot>
    </el-table>

    <div class="sti-table-paganation" v-if="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :small="pgSmall" :current-page.sync="currentPage" :page-size="pgSize" :page-sizes="pageSizes" :layout="layout" :total="total">
      </el-pagination>
    </div>

    <div v-if="loading" class="table-mask">
      <div class="el-loading-spinner">
        <svg viewBox="25 25 50 50" class="circular">
          <circle cx="50" cy="50" r="20" fill="none" class="path">
          </circle>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>

import _ from 'lodash'
/**
 * 表格组件
 * 请求参数默认有page,size，选择性的参数：order, order_by
 */
/**
 *
 * @return {[type]} [description]
 */
function browserIs() {

  /* eslint operator-linebreak: "off" */
  let browser = {}

  let nav = navigator.userAgent.toLowerCase()

  let result

  /* eslint space-infix-ops: "off" */
  (result = nav.match(/rv:([\d.]+)\) like gecko/)) ? browser.ie = result[1] :
    (result = nav.match(/msie ([\d.]+)/)) ? browser.ie = result[1] :
      (result = nav.match(/firefox\/([\d.]+)/)) ? browser.firefox = result[1] :
        (result = nav.match(/chrome\/([\d.]+)/)) ? browser.chrome = result[1] :
          (result = nav.match(/opera.([\d.]+)/)) ? browser.opera = result[1] :
            (result = nav.match(/version\/([\d.]+).*safari/)) ? browser.safari = result[1] : 0

  return browser
}

const browser = browserIs()

const requestMethods = {
  GET: 'get',
  POST: 'post'
}

export default {

  props: {

    // 返回total
    url: [String],

    // 请求参数
    queryParams: {
      default() {
        return () => { }
      },
      type: Function
    },

    // 请求的方法
    methods: {
      default: 'GET',
      type: String
    },

    pagination: {
      default: true,
      type: Boolean
    },

    // 过长的列头，是否换行
    isNoWrap: {
      default: !browser.safari,
      type: Boolean
    },

    ifUseLoading: {
      default: true,
      type: Boolean
    },

    // elment-table默认参数
    data: {
      default() {
        return []
      },
      type: Array
    },
    height: [String, Number],
    maxHeight: [String, Number],
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    fit: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    currentRowKey: [String, Number],
    rowClassName: [Function, String],
    rowStyle: [Function, Object],
    rowKey: [Function, String],
    emptyText: [String],
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    expandRowKeys: [Array],
    defaultSort: {
      type: Object,
      default() {
        return {}
      }
    },
    tooltipEffect: [String],
    showSummary: {
      type: Boolean,
      default: false
    },
    sumText: [String],
    summaryMethod: [Function],

    // pagination的参数
    pgSmall: {
      type: Boolean,
      default: false
    },

    pageSize: {
      type: [Number, String],
      default: 10
    },

    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },

    pageSizes: {
      type: Array,
      default() {
        return this.pageSize == 10 ? [10, 20, 50, 100] : [this.pageSize, 10, 20, 50, 100].sort((a, b) => { return a - b })
      }
    }
  },

  data() {

    return {
      currentPage: 1,
      total: 0,
      pgSize: Number.parseInt(this.pageSize),
      showData: [],
      orderParams: {
        order_by: '',
        order: ''
      },
      multipleSelection: [],
      loading: false,
      currentData: []
    }
  },

  computed: {

    // 判断前端还是后端，传url还是data
    isServer() {
      return !(this.url === undefined)
    },

    isSortable() {
      return Object.getOwnPropertyNames(this.defaultSort).includes('order')
    }
  },

  watch: {

    // data是传进来的数据，不主动改变
    data(val) {
      this.currentData = _.cloneDeep(val)
      if (!this.pagination) {
        this.showData = this.currentData
      }
    },

    // cloneDeep传进来的data，排序使用
    currentData() {
      if (this.pagination) {
        this.handleCurrentChange(this.currentPage)
      }
    },

    // 修改loading遮罩的高度
    loading(val) {
      if (val) {
        this.resizeHeightLoading()
      }
    }
  },

  methods: {
    init() {

      // 是否排序
      if (this.isSortable) {
        this.orderParams.order_by = this.defaultSort.prop
        this.orderParams.order = this.defaultSort.order
      }
    },

    // 过滤参数
    interceptParams(obj) {
      let param = {};
      if (obj === null || obj === undefined || obj === '') {
        return param
      }
      for (let key in obj) {
        if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
          param[key] = obj[key]
        }
      }
      return param
    },

    // 请求参数
    _getData() {
      let param = Object.assign(
        {
          page: this.currentPage,
          size: this.pgSize
        },
        this.queryParams(),
        this.orderParams)

      switch (param.order) {
        case 'ascending':
          param.order = 'asc'
          break
        case 'descending':
          param.order = 'desc'
          break
        default:
          param.order = 'desc'
      }

      this.ifUseLoading ? this.loading = true : this.loading = false
      this.$http.get(this.url, { params: this.interceptParams(param) }).then(
        (res) => {
          if (Array.isArray(res.data.data)) {

            this.showData = res.data.data

            // 此处如果total或page值有变，那么会触发再一次的请求
            this.total = res.data.total != undefined ? res.data.total : res.data.count != undefined ? res.data.count : this.total
            res.data.page == undefined ? null : this.currentPage == res.data.page ? null : this.currentPage = res.data.page
          } else {
            this.showData = []
            console.warn(res.message)
          }

          // 发事件
          this.dataLoadComplete(res.data)
          this.getResponse(res)
          this.loading = false
        },
        (res) => {
          console.warn(res.message)
          this.getResponse(res)
          this.loading = false
        })
    },

    // 改变当前显示条数
    handleSizeChange(size) {
      this.pgSize = size
      this.handleCurrentChange(1)
    },

    // 翻页
    handleCurrentChange(page) {
      if (!this.isServer) {
        let tmpArr = []

        // 传data
        for (let i = 0; i < this.pgSize; i++) {
          let tmpData = this.currentData[(page - 1) * this.pgSize + i]

          if (tmpData) {
            tmpArr.push(tmpData)
          }
        }

        this.total = this.currentData.length
        this.showData = tmpArr
      } else {
        this._getData()
      }
    },

    // 暴露出去的方法
    // toFirstPage是false的情况只会刷新当前页 
    reload(toFirstPage = true) {
      if (this.isServer) {
        if (toFirstPage) {
          this.currentPage == 1 ? this._getData() : this.currentPage = 1 // ??
        } else {
          this._getData()
        }
      }
    },
    reload2(toFirstPage = true) {
      if (this.isServer) {
        if (toFirstPage) {
          this.currentPage = 1
          this._getData()
        } else {
          this._getData()
        }
      }
    },

    resizeHeightLoading() {
      this.$nextTick(() => {
        let vm = this.$el,
          headerHeight = vm.querySelector('.el-table__header-wrapper').offsetHeight == null ? 0 : vm.querySelector('.el-table__header-wrapper').offsetHeight,
          loadingHeight = vm.offsetHeight == null ? 0 : vm.offsetHeight

        vm.querySelector('.table-mask').style.height = loadingHeight - headerHeight + 'px'
      })
    },

    getTableData() {
      return this.isServer ? this.showData : this.currentData
    },

    getSelection() {
      return _.cloneDeep(this.multipleSelection)
    },

    dataLoadComplete(data) {
      this.$emit('data-load-complete', data)
    },

    getResponse(res) {
      this.$emit('get-response', res)
    },

    // table methods
    clearSelection(...args) {
      return this.$children[0].clearSelection(...args)
    },

    toggleRowSelection(...args) {
      return this.$children[0].toggleRowSelection(...args)
    },

    setCurrentRow(...args) {
      return this.$children[0].setCurrentRow(...args)
    },

    // table event
    select(...args) {
      this.$emit('select', ...args)
    },

    selectAll(...args) {
      this.$emit('select-all', ...args)
    },

    selectionChange(...args) {
      this.multipleSelection = args[0]
      this.$emit('selection-change', ...args)
    },

    cellMouseEnter(...args) {
      this.$emit('cell-mouse-enter', ...args)
    },

    cellMouseLeave(...args) {
      this.$emit('cell-mouse-leave', ...args)
    },

    cellClick(...args) {
      this.$emit('cell-click', ...args)
    },

    cellDblclick(...args) {
      this.$emit('cell-dblclick', ...args)
    },

    rowClick(...args) {
      this.$emit('row-click', ...args)
    },

    rowContextmenu(...args) {
      this.$emit('row-contextmenu', ...args)
    },

    rowDblclick(...args) {
      this.$emit('row-dblclick', ...args)
    },

    headerClick(...args) {
      this.$emit('header-click', ...args)
    },

    sortChange(...args) {
      if (this.pagination) {
        if (this.isServer) {
          if (args.length != 0) {
            this.orderParams.order = args[0].order
            this.orderParams.order_by = args[0].prop
          }
          this._getData()
        } else {
          if (args.length != 0) {
            let tmp = _.cloneDeep(this.currentData)
            if (args[0].order != null) {
              tmp.sort((a, b) => {
                return args[0].order == 'descending' ? b[args[0].prop] - a[args[0].prop] : a[args[0].prop] - b[args[0].prop]
              })
            }
            this.currentData = tmp
          }
        }
      }

      this.$emit('sort-change', ...args)
    },

    filterChange(...args) {
      this.$emit('filter-change', ...args)
    },

    currentChange(...args) {
      this.$emit('current-change', ...args)
    },

    headerDragend(...args) {
      this.$emit('header-dragend', ...args)
    },

    expandChange(...args) {
      this.$emit('expandChange', ...args)
    }
  },

  mounted() {
    this.init()

    if (!this.pagination) {
      this.showData = this.currentData = _.cloneDeep(this.data)
    } else if (!this.isServer) {
      this.currentData = _.cloneDeep(this.data)

      // 传data
      this.handleCurrentChange(1)
    } else {
      this._getData()
    }
  }
}
</script>

<style lang="less">
.sti-table {
  background-color: #fff;
  position: relative;
  .sti-table-paganation {
    text-align: right;
    padding: 5px 0;
    border: 1px solid rgb(223, 230, 236);
    border-top: none;
    padding-right: 5px;
  }

  .table-nowrap {
    .is-leaf > div {
      white-space: nowrap;
    }
    .el-table__row td > div {
      white-space: nowrap;
    }
  }

  .table-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    z-index: 10;
    background-color: rgba(255, 255, 255, 0.9);
  }

  .el-table__header-wrapper .el-table__header th,
  .el-table__header-wrapper .el-table__header tr {
    background-color: #f3f4f5;
  }
}
</style>
