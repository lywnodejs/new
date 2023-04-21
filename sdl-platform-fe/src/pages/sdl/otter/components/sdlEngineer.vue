<template>
  <el-select v-model="selected"
    filterable
    remote
    clearable
    placeholder="请选择安全工程师"
    reserve-keyword
    ref="select"
    :multiple="multiple"
    :remote-method="handleDeptSearchList">
    <el-option
      v-for="item in engineer"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import { connect } from '@/lib'
import * as CONSTANTS from '@/commons/otter'

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
      selected: this.value,
      engineer: CONSTANTS.engineer
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
