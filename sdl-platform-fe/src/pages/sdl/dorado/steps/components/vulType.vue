<template>
  <el-cascader
    v-model="selected"
    :options="vul_type"
    :disabled='disabled'
    placeholder="请选择漏洞类型"
    clearable
    filterable>
  </el-cascader>
</template>

<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
  getPreInfo: 'dolphin_knowledgeBase/getPreInfo'
})({
  name: 'vul-type',
  props: {
    value: null,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected: this.value,
      vul_type: []
    }
  },
  watch: {
    selected(val) {
      this.$emit('input', val)
    },
    value: {
      handler(newValue, oldValue) {
        if (newValue != null && oldValue != null) {
          for (let i = 0; i < newValue.length; i++) {
            if (oldValue[i] != newValue[i]) {
              this.selected = newValue
            }
          }
        }
      },
      deep: true
    }
  },
  created() {
      this.getPreInfoList()
  },
  mounted() {
  },
  methods: {
      getPreInfoList() {
        this.getPreInfo().then(response => {
          const data = response

          // this.vul_level = data.vul_level
          // this.vul_from = data.vul_from
          this.vul_type = data.vul_type
        })
      }
  }
})
</script>
