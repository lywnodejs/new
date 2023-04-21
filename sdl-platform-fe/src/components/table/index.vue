<template>
<div class="app-table app-normal-bg">
	<el-table
    style="width: 100%"
    :class="{'table-nowrap': isNoWrap}"
		:data="showData"
    :height="height"
    :max-height="maxHeight"
    :stripe="stripe"
    :border="border"
    :fit="fit"
    :show-header="showHeader"
    :highlight-current-row="highlightCurrentRow"
    :current-row-key="currentRowKey"
    :row-class-name="rowClassName"
    :row-style="rowStyle"
    :row-key="rowKey"
    :empty-text="emptyText"
    :default-expand-all="defaultExpandAll"
    :expand-row-keys="expandRowKeys"
    :default-sort="defaultSort"
    :tooltip-effect="tooltipEffect"
    :show-summary="showSummary"
    :sum-text="sumText"
    :summary-method="summaryMethod"

    @select="select"
    @select-all="selectAll"
    @selection-change="selectionChange"
    @cell-mouse-enter="cellMouseEnter"
    @cell-mouse-leave="cellMouseLeave"
    @cell-click="cellClick"
    @cell-dblclick="cellDblclick"
    @row-click="rowClick"
    @row-contextmenu="rowContextmenu"
    @row-dblclick="rowDblclick"
    @header-click="headerClick"
    @sort-change="sortChange"
    @filter-change="filterChange"
    @current-change="currentChange"
    @header-dragend="headerDragend"
    @expand-change="expand-change"
    @data-load-complete="data-load-complete"
    >
    <slot></slot>
    <template v-for="_column in columns">
      <render-column
        v-if="showColumns(_column)"
        :key="_column.prop"

        :type="_column.type"
        :index="_column.index"
        :column-key="_column.columnKey"

        :label="_column.label"
        :prop="_column.prop"
        :width="_column.width"
        :min-width="_column.minWidth"

        :fixed="_column.fixed"
        :render-header="_column.renderHeader"
        :sortable="_column.sortable"
        :sort-method="_column.sortMethod"

        :sort-by="_column.sortBy"
        :resizable="_column.resizable"
        :formatter="_column.formatter"
        :show-overflow-tooltip="_column.showOverflowTooltip"

        :align="_column.align"
        :header-align="_column.headerAlign"
        :class-name="_column.className"
        :label-class-name="_column.labelClassName"

        :selectable="_column.selectable"
        :reserve-selection="_column.reserveSelection"
        :filters="_column.filters"
        :filter-placement="_column.filterPlacement"

        :filter-multiple="_column.filterMultiple"
        :filter-method="_column.filterMethod"
        :filter-value="_column.filterValue"
        :scoped-slots="_column.scopedSlots">
      </render-column>
    </template>
	</el-table>

	<div class="app-table-pagination app-border" :class="paginationClass" :style="paganationStyle" ref="pagination" v-if="pagination">
    <el-pagination
      v-if="isLoadDataComplete"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :small="pgSmall"
      :current-page.sync="currentPage"
      :page-size="pgSize"
      :page-sizes="pageSizes"
      :layout="layoutSlot"
      :total="total">
      <el-button style="float: left;" size="mini" @click="filterColumnHandler"><i class="iconfont icon-settings"></i></el-button>
    </el-pagination>
	</div>

  <el-dialog
    title="自定义显示列"
    :visible.sync="dialogVisible"
    width="40%">
    <el-transfer
    :titles="['可选择列', '已选择列']"
    v-model="selectColumn" :data="columnFeilds"></el-transfer>
    <div class="app-table--filtercolumn">
      <el-button @click="saveSelectColumn">确定</el-button>
      <el-button @click="dialogVisible=false">取消</el-button>
    </div>
  </el-dialog>

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
import moment from 'moment'
import _ from 'lodash'
import { addResize, removeResise } from 'utils'
import { DATE_TIME_FORMAT } from 'commons/constant'
import { interceptParams } from '@/utils/tools'

/**
 * 表格组件
 * 请求参数默认有page,size，选择性的参数：order, order_by
 */
// const requestMethods = {
//   GET: 'get',
//   POST: 'post'
// }

const renderColumn = {
  functional: true,
  render(h, context) {
    const { scopedSlots, ...props } = context.props

    if (typeof scopedSlots === 'function') {

      return h('el-table-column', {
        props: {
          ...props
        },
        scopedSlots: {
          default: scopedSlots
        }
      })
    }

    return h('el-table-column', {
      props: {
        ...props
      }
    })
  }
}

export default {

	props: {

    // 返回total
    url: [String],

    // 请求参数
    queryParams: {
			default() {
        return () => {}
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
      default: true,
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
    },
    isPaginationFloat: {
      type: Boolean,
      default: false
    },

    // 是否将查询参数拼接到地址栏
    isShowParam: {
      type: Boolean,
      default: false
    }
	},

	data() {

		return {
			currentPage: 1,
			total: 0,
      pgSize: Number.parseInt(this.pageSize),
      isLoadDataComplete: false, // 是否已经加载完数据，分页使用
			showData: [],
      orderParams: {
        orderBy: '',
        order: ''
      },
      multipleSelection: [],
      loading: false,
      currentData: [],

      dialogVisible: false,

      selectColumn: [],
      columns: [],
      columnFeilds: [],

      isFloat: '',
      paganationStyle: {
        width: null,
        left: null
      }
		}
	},

  computed: {

    // 判断前端还是后端，传url还是data
    isServer() {
      return !(this.url === undefined)
    },

    isSortable() {
      return Object.getOwnPropertyNames(this.defaultSort).includes('order')
    },

    // TODO... 还需要重新判断，当有slot时，table传了layout的时候
    layoutSlot() {
      if (this.columns.length > 0) {
        return 'slot, total, sizes, prev, pager, next, jumper'
      } else if (this.layout) {
        return this.layout
      }
    },

    paginationClass() {
      return this.isPaginationFloat ? 'app-table-pagination--float app-border--top' : null
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

        // this.resizeHeightLoading()
      }
    }
  },

  components: {
    renderColumn
  },

	methods: {
    init() {

      // 是否排序
      if (this.isSortable) {
        this.orderParams.orderBy = this.defaultSort.prop
        this.orderParams.order = this.defaultSort.order
      }
    },

    formatParams(params) {
      for (let key in params) {
        if (params[key] instanceof Date) {
          params[key] = moment(params[key]).format(DATE_TIME_FORMAT)
        } else {
          params[key] = params[key]
        }
      }
      return params
    },

    // 参数拼接
    joinParams(params) {
      let paramsStr = ''
      if (params) {
        paramsStr = '?'
        _.mapKeys(params, (value, key) => {
          paramsStr += key + '=' + value + '&'
        })
        paramsStr = paramsStr.substring(0, paramsStr.length - 1)
      }
      return paramsStr
    },

    /** 请求参数
     *
     */
    _getData(isPage) {

      // 刚开始加载页面时，page不是1，size不是10的时候，此时table默认page,size会覆盖前者
      // 当前页size或者page发生变化时，如果先取this.currentPage, 那么this.queryParams传过来的page会覆盖this.currentPage
      let param = Object.assign(
        {
          page: this.currentPage,
          limit: this.pgSize
        },
        this.queryParams(),
        this.orderParams)

      // 将param显示在地址栏URL上
      if (this.isShowParam) {
        this.$router.push({path: this.$route.path, query: this.formatParams(interceptParams(param))})
      }
      this.ifUseLoading ? this.loading = true : this.loading = false
      if (this.methods == 'GET') {
        this.$ajax.get(this.url, interceptParams(param)).then(
        (res) => {
          if (Array.isArray(res.data.data)) {
            this.showData = res.data.data
            this.total = res.data.total != undefined ? res.data.total : res.data.count != undefined ? res.data.count : this.total
          } else {
            this.showData = []
            console.warn(res.message)
          }

          // 发事件
          this.dataLoadComplete(res)
          this.getResponse(res)
          this.loading = false
          if (isPage) {
            this.$emit('current-change-page', res.data)
          }

          this.isLoadDataComplete = true
        },
        (res) => {
          console.warn(res.message)
          this.getResponse(res)
          this.loading = false
        })
      } else {
        this.$ajax.post(this.url, interceptParams(param)).then(
        (res) => {
          if (Array.isArray(res.data.data)) {
            this.showData = res.data.data
            this.total = res.data.total != undefined ? res.data.total : res.data.count != undefined ? res.data.count : this.total
          } else {
            this.showData = []
            console.warn(res.message)
          }

          // 发事件
          this.dataLoadComplete(res.data)
          this.getResponse(res.data)
          this.loading = false
          if (isPage) {
            this.$emit('current-change-page', res.data.data)
          }

          this.isLoadDataComplete = true
        },
        (res) => {
          console.warn(res.message)
          this.getResponse(res.data)
          this.loading = false
        })
      }
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
        this.$emit('current-change-page', page)
      } else {
        this._getData(true)
      }
    },

    // 暴露出去的方法
    // toFirstPage是false的情况只会刷新当前页
    reload(toFirstPage = false) {
      if (this.isServer) {
        if (toFirstPage) {
          this.currentPage == 1 ? this._getData() : this.currentPage = 1
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

    // 对表格进行重绘
    doLayout(...args) {
      return this.$children[0].doLayout(...args)
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
            this.orderParams.orderBy = args[0].prop
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
    },

    /**
     * 列的全集不变的情况下用方法获取，当列全集有变化时必须通过计算属性
     * 获取自定义列表中所有列的数据，并计算默认选中的列
     */
    getColumnFeilds() {
      let feilds = []
      this.columns.map(_column => {
        if (_column.prop) {
          if (_column.default) {
            this.selectColumn.push(_column.prop)
          }
          feilds.push({
            key: _column.prop,
            label: _column.label
          })
        }
      })
      this.columnFeilds = feilds
    },

    /**
     * 弹出自定义列选择框
     */
    filterColumnHandler() {
      this.dialogVisible = true
    },

    /**
     * 自定义列保存操作
     */
    saveSelectColumn() {
      let updateColumns = [], _column = {}
      if (this.selectColumn && this.selectColumn.length > 0) {
        this.columns.forEach((item, index) => {
          _column = item
          _column.default = false
          for (let i = 0; i < this.selectColumn.length; i++) {
            if (item.prop == this.selectColumn[i]) {
              _column.default = true
              break
            }
          }

          // 如果传了type，默认显示该行
          if (this.showColumns(_column)) {
            _column.default = true
          }
          updateColumns.push(_column)
        })
        this.columns = updateColumns
        this.dialogVisible = false
      } else {
        this.$message.error('表格显示的列不能为空！')
      }
    },

    /**
     * 判断是否展示该列
     */
    showColumns(_column) {
      if (_column.default || _column.type || _column.fixed) {
        return true
      }
      return false
    },

    /**
     * 固定分页位置和宽度计算
     */
    calculatePaginationiPos() {
      /* eslint-disable */
      const { x: cx, y:cy, width: cw, height: ch } = this.container.getBoundingClientRect()
      const { y: py } = this.$refs.pagination.getBoundingClientRect()

      this.paginationFixed = true
      this.paganationStyle.left = cx + 'px'
      this.paganationStyle.width = cw + 'px'
    }

    // isPaginationFloat() {
    //   console.log('scroll event from table')
    //   let tableNode = document.getElementsByClassName('app-table'), tableTop = 0, tableHeight = 0, clientHeight = 0
    //   if (tableNode && tableNode.length > 0 && this.pagination) {

    //     // table 距离body的高度
    //     tableTop = tableNode[0].offsetTop
    //     clientHeight = document.body.clientHeight // 浏览器窗口可视区域大小
    //     tableHeight = tableNode[0].offsetHeight

    //     // pageHeight = document.body.scrollHeight
    //     console.log(tableTop, clientHeight, tableHeight)

    //     if (clientHeight - tableTop > 50 && tableTop + tableHeight <= clientHeight) {
    //       this.isFloat = 'app-table-pagination--float'
    //     } else {
    //       this.isFloat = ''
    //     }
    //   }
    // }
  },

  created() {
    this.$on('column.add', function(datas) {
      if (datas.props) {
        let _col = _.cloneDeep(datas.props)
        this.columns.push(_col)
      }
    })
  },

	mounted() {
    this.container = document.querySelector('.app-container__main__content')
    this.init()
    if (this.pagination && this.isPaginationFloat) {

      // 固定到body下，解决层叠上下文对显示的影响ß
      document.body.appendChild(this.$refs.pagination);
    }

    if (!this.pagination) {

      this.showData = this.currentData = _.cloneDeep(this.data)
    } else if (!this.isServer) {
      this.currentData = _.cloneDeep(this.data)
      this.isLoadDataComplete = true // 数据加载完毕

      // 传data
      this.handleCurrentChange(1)
    } else {

      // 从route中取page,size,order,orderBy
      let query = this.$route.query
      this.currentPage = +query.page || this.currentPage
      this.pgSize = +query.size || this.pgSize
      this.orderParams.order = query.order || this.orderParams.order
      this.orderParams.orderBy = query.orderBy || this.orderParams.orderBy
      this._getData()
    }

    this.getColumnFeilds()
    this.isPaginationFloat && addResize(this.container, this.calculatePaginationiPos)
  },

  beforeDestroy() {
    if (this.pagination && this.isPaginationFloat) {
      document.body.removeChild(this.$refs.pagination)
      removeResise(this.container, this.calculatePaginationiPos)
    }
  }
}
</script>

<style lang="less">
.app-table{
  position: relative;

  .table-nowrap{
    .is-leaf>div{
      white-space: nowrap;
    }
    .el-table__row td>div{
      white-space: nowrap;
    }
  }

  .table-mask{
    position: absolute;
    top: 1px;
    left: 1px;
    bottom: 1px;
    right: 1px;
    z-index: 10;
    background-color: rgba(255, 255, 255, 0.9);
  }

  &--filtercolumn {
    text-align: center;
    margin-top: 15px;
  }

  .el-transfer {
    .el-transfer-panel {
      width: 40%;
    }
  }
}

.app-table-pagination{
  text-align: right;
  padding:5px 0;
  padding-right: 5px;
  &:not(.app-table-pagination--float) {
    border-top: none;
  }
  &--float {
    background-color: #ffffff;
    border-left: none;
    position: fixed;
    bottom: 0;
    z-index: 99;
  }
}
</style>
