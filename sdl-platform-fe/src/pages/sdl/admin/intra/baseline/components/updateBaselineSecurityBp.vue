<template>
 <el-dialog title="更新信息" id="admin-intra-baseline-update-dialog" :visible.sync="dialogUpdateVisible" width="460px">
      <el-form label-width="100px"  label-position="left">
        <el-form-item  class="createProjectDialog-input" label="ID">
            <el-input v-model="queryParam.id" disabled></el-input>
        </el-form-item>
        <el-form-item class="createProjectDialog-input" label="安全BP">
            <app-employee class="inputFollow" v-model="queryParam.security_bp" ></app-employee>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateVisible = false" class="base-line-diaolog-button">取消</el-button>
        <el-button
          class="base-line-diaolog-btn"
          type="warning"
          round
          @click="updateBaselineInfo()">
          确认更新
        </el-button>
      </div>
    </el-dialog>
    
</template>

<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
    updateBaselineSecurityBp: 'security_bp/updateBaselineSecurityBp'
})({
  name: '',
  props: ['updateBaselineDialog', 'info'],
  data() {
    return {
        id: this.baselineId,
        dialogUpdateVisible: false,
        queryParam: {
            id: '',
            security_bp: ''
        }
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    updateBaselineDialog(val) {
        this.dialogUpdateVisible = val
    },
    info(val) {
        this.queryParam.id = val.id
        this.queryParam.security_bp = val.security_bp
    },
    dialogUpdateVisible(val) {
        this.$emit('updateDialogVisible', this.dialogUpdateVisible)
    }
  },
  methods: {
      updateBaselineInfo() {
        this.updateBaselineSecurityBp(this.queryParam).then(res => {
        })
        this.dialogUpdateVisible = false
        this.$parent.fetchData();
      }
  }
})
</script>
<style lang="less">
#admin-intra-baseline-update-dialog{
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
  .inputFollow{
      width: 320px;
  }
}
</style>