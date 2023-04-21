<template>
 <el-dialog title="提示" id="base-line-delete-dialog"
               :visible.sync="dialogDeleteVisible"
               width="30%">
      <span>是否确认删除此基线？</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="base-line-diaolog-button" @click="dialogDeleteVisible = false">取消</el-button>
        <el-button class="base-line-diaolog-btn" type="primary" @click="deleteBaselineInfo(didi_baseline_id)">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
    deleteBaseline: 'dolphin_baseline/deleteBaseline'
})({
  name: '',
  props: ['dialogWarnVisible', 'didiBaselineId'],
  data() {
    return {
        didi_baseline_id: this.didiBaselineId,
        dialogDeleteVisible: this.dialogWarnVisible
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    dialogWarnVisible(val) {
        this.dialogDeleteVisible = val
    },
    didiBaselineId(val) {
        this.didi_baseline_id = val
    },
    dialogDeleteVisible(val) {
        this.$emit('deleteVisible', this.dialogDeleteVisible)
    }
  },
  methods: {
      deleteBaselineInfo(id) {
        this.deleteBaseline({'id': id}).then(res => {
        })
        this.dialogDeleteVisible = false
        this.$parent.fetchData()
      }
  }
})
</script>
<style lang="less">
#base-line-delete-dialog{
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