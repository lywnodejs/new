<template>
  <el-select v-model="selected" placeholder="请输入平台"
  filterable
    remote
    clearable
    :disabled='disabled'
    reserve-keyword
    :multiple="multiple">
    <el-option
      v-for="item in data"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import * as CONSTANTS from '@/commons/dolphin'

export default ({
  name: 'language',
  props: {
    value: null,
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected: this.value,
      data: CONSTANTS.vulPlatform
    }
  },
  watch: {
    selected(val) {
      this.$emit('input', val)
    },
    value(val) {

    //   this.transform(val)
      this.selected = val
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
})
</script>
