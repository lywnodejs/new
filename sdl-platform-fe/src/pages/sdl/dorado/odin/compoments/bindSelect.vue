<template>
  <el-select v-model="selected" placeholder="请选择,可手动输入项目ID值"
  filterable
    remote
    clearable
    allow-create
    :disabled='disabled'
    reserve-keyword
    :multiple="multiple">
    <el-option
      v-for="item in prebindOdin"
      :key="item.sdl_project_id"
      :label="item.sdl_project_name"
      :value="item.sdl_project_id">
    </el-option>
  </el-select>
</template>

<script>
// import * as CONSTANTS from '@/commons/dorado'

export default ({
  name: 'odin-',
  props: {
    value: null,
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    prebindOdinList: {
      type: Array,
      default: false
    }
  },
  data() {
    return {
      selected: this.value,
      prebindOdin: this.prebindOdinList
    }
  },
  watch: {
    selected(val) {
      this.$emit('input', val)
    },
    value(val) {

    //   this.transform(val)
      this.selected = val
    },
    prebindOdinList(val) {
      this.prebindOdin = val
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
