<template>
  <el-select v-model="selected"
    filterable
    remote
    clearable
    reserve-keyword
    ref="select"
    :multiple="multiple"
    :remote-method="handleDeptSearchList">
    <el-option
      v-for="item in departments"
      :key="item.dept_id"
      :label="item.dept_fullname"
      :value="item">
    </el-option>
  </el-select>
</template>

<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
    departments: 'base/departments'
  }
}, {
  deptSearchList: 'base/deptSearchList'
})({
  name: 'app-department',
  props: {
    value: null,
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected: this.value
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
  methods: {
    handleDeptSearchList(query) {
      this.deptSearchList(query)
    }
  }
})
</script>
