<template>
 <el-dialog title="提示" id="admin-intra-baseline-delete-dialog"
               :visible.sync="dialogDeleteVisible"
               width="30%">
      <span>是否确认删除此基线？</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="base-line-diaolog-button" @click="dialogDeleteVisible = false">取消</el-button>
        <el-button class="base-line-diaolog-btn" type="primary" @click="deleteBaselineInfo()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
    deleteBaselineSecurityBp: 'security_bp/deleteBaselineSecurityBp'
})({
  name: '',
  props: ['deleteBaselineDialog', 'baselineId'],
  data() {
    return {
        id: this.baselineId,
        dialogDeleteVisible: false
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    deleteBaselineDialog(val) {
        this.dialogDeleteVisible = val
    },
    baselineId(val) {
        this.id = val
    },
    dialogDeleteVisible(val) {
        this.$emit('testDialogVisible', this.dialogDeleteVisible)
    }
  },
  methods: {
      deleteBaselineInfo() {
        this.deleteBaselineSecurityBp({'id': this.id}).then(res => {
        })
        this.dialogDeleteVisible = false
        this.$parent.fetchData()
      }
  }
})
</script>
<style lang="less">
#admin-intra-baseline-delete-dialog{
  .base-line-diaolog-button {
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    font-size: 13px;
  }

  .base-line-diaolog-btn {
    background: #FC9153;
    border-radius: 4px;
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    font-size: 13px;
    border: none;
  }

  .base-line-diaolog-btn.search-btn {
    margin-left: 15px;
    width: 95px;
  }
}
</style>