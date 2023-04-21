<template>
  <el-select :size="size" v-model="selected" :placeholder="$t('manage.select')"
    filterable
    remote
    clearable
    reserve-keyword
    ref="select"
    :multiple="multiple"
    :remote-method="handleDeptSearchList">
    <el-option
      v-for="item in departmentsOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
/**
 * 判断对象数组是否包含某个值
 */
function includes(source, value, comparator) {
  let index = -1,
      length = source == null ? 0 : source.length

  while (++index < length) {
    if (comparator(value, source[index])) {
      return true
    }
  }
  return false
}

/**
 * 去重合并
 */
function concat(source, target, prop) {
  let index = -1,
      length = target.length,
      result = source.slice()

  while (++index < length) {
    if (!includes(source, target[index], function(s, t) { return s[prop] == t[prop] })) {
      result.unshift(target[index])
    }
  }

  return result
}

export default {
  name: 'app-department',
  props: {
    value: null,

    /**
     * 是否多选
     */
    multiple: {
      type: Boolean,
      default: false
    },

    /**
     * 部门级别
     */
    level: {
      type: String,
      default: null
    },

    rtnType: {
      type: String,
      default: 'value' // name account
    },

    /**
     * 下拉框默认初始值
     */
    options: {
      type: Array
    },

    size: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      departments: [],
      departmentsOptions: [],
      selected: this.value
    }
  },
  watch: {
    selected(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.selected = val
      this.reserveOptions = this.departmentsOptions.filter(dept => val.indexOf(dept[this.rtnType]) != -1)
    },

    options(val) {
      this.departmentsOptions = val
    }
  },
  methods: {
    handleDeptSearchList(query) {
      let params = {
        'searchText': query
      }
      if (this.level) {
        params['level'] = this.level
      }
      this.$http.get('process/department', {params: params}).then(res => {
        if (res.data.errno == 0) {
          this.departments = res.data.data.map((item) => {
            return {
              value: +item.productId,
              label: item.productName
            }
          })
          this.departmentsOptions = concat(this.departments, this.reserveOptions, this.rtnType)
        } else {
          this.this.departmentsOptions = []
        }
      })
    }
  },

  created() {
    this.reserveOptions = []
  },

  mounted() {

    if (this.options && this.options.length > 0) {
      this.reserveOptions = this.departmentsOptions = this.options
    }

    // 暂时不考虑多选情况
    this.value && !this.multiple && this.getDeptById(this.value).then(res => {
      this.departmentsOptions = this.departments
    })
  }
}
</script>
