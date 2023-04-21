<template>
  <el-select v-model="selected" placeholder="请输入邮箱前缀选取"
    filterable
    remote
    clearable
    reserve-keyword
    :multiple="multiple"
    :remote-method="handleEmpSearchList">
    <el-option
      v-for="item in employees"
      :key="item.account"
      :label="item.name + ' (' + item.email + ')'"
      :value="item.account">
    </el-option>
  </el-select>
</template>

<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
    employees: 'base/employees'
  }
}, {
  empSearchList: 'base/empSearchList'
})({
  name: 'app-employee',
  props: {
    value: null,
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected: this.value,
      obj: ''
    }
  },
  watch: {
    selected(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.selected = val
    }
  },
  created() {
  },
  methods: {
    handleEmpSearchList(query) {
      this.empSearchList(query)
    }
  }
})
</script>
