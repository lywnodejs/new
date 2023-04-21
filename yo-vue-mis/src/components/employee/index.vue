<template>
  <el-select :size="size" v-model="selected" :placeholder="$t('manage.select')"
    value-key="id"
    filterable
    remote
    clearable
    :reserve-keyword="multiple"
    :multiple="multiple"
    :remote-method="handleEmpSearchList">
    <el-option
      v-for="item in employeesOptions"
      :key="item.value.id"
      :label="item.label"
      :value="item[rtnType]">
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
  name: 'app-employee',
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
     * 下拉框默认初始值
     */
    options: {
      type: Array
    },

    rtnType: {
      type: String,
      default: 'value' // name account
    },

    size: {
      type: String,
      default: 'default'
    }
  },

  data() {
    return {
      employeesOptions: [],
      employees: [],
      reserveOptions: [],
      selected: this.value
    }
  },
  watch: {
    selected(val) {
      this.$emit('input', val)
    },

    value(val) {
      this.selected = val
      this.reserveOptions = this.employeesOptions.filter(emp => val.indexOf(emp[this.rtnType]) != -1)
    },

    options(val) {
      this.reserveOptions = this.employeesOptions = val
    }
  },
  methods: {
    handleEmpSearchList(query) {
      let params = {
        'account': query
      }
      this.$http.get('secEvent/searchEmpList', {params: params}).then(res => {
        if (res.data.errno == 0) {
          this.employees = res.data.data.map((item) => {
            return {
              value: item,
              label: item.name + "(" + item.email + ")"
            }
          })
          this.employeesOptions = concat(this.employees, this.reserveOptions, this.rtnType)
        } else {
          this.employeesOptions = []
        }
      })
    }
  },
  created() {
    this.reserveOptions = []
  },
  mounted() {
    if (this.options && this.options.length > 0) {
      this.reserveOptions = this.employeesOptions = this.options
    }
  }
}
</script>
