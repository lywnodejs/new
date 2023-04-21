<template>
  <el-select v-model="selected" placeholder="请输入攻击面"
  filterable
    remote
    clearable
    :disabled='disabled'
    reserve-keyword
    :multiple="multiple"
    :remote-method="handleAttackFace">
    <el-option
      v-for="item in attackSurface"
      :key="item.attack_surface_id"
      :label="item.attack_surface_name "
      :value="item.attack_surface_id">
    </el-option>
  </el-select>
</template>

<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
      attackSurface: 'dolphin_threat/attackSurface'
  }
}, {
  getAttackSurface: 'dolphin_threat/getAttackSurface'
})({
  name: 'app-attackface',
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
      selected: this.value
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
      this.getAttackSurface()
  },
  mounted() {
  },
  methods: {
    handleAttackFace(query) {
      this.getAttackSurface(query)

    }
  }
})
</script>
