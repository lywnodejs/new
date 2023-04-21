<template>
<div>
<el-dialog id="admin-intra-baseline-test-dialog" title="测试基线生成规则"  :visible.sync="dialogFormVisible" width="460px">
      <el-form label-width="100px"  label-position="left">
        <el-form-item class="createProjectDialog-input" label="语言">
          <el-select
            v-model="queryParam.language"
            filterable
            placeholder="请选择语言">
            <el-option
              v-for="item in language"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="createProjectDialog-input" label="项目等级">
          <el-select
            v-model="queryParam.project_level"
            filterable
            placeholder="请选择项目等级">
            <el-option
              v-for="item in projectLevel"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" class="base-line-diaolog-button">取消</el-button>
        <el-button
          class="base-line-diaolog-btn"
          type="warning"
          round
          @click="testBaseline()">
          测试规则
        </el-button>
      </div>
      <!-- <div v-show="data">{{data}}</div> -->
    </el-dialog>
<info-dialog :dialog='infoDialog' :info='data' @infoDialog='getInfoDialog'></info-dialog>
</div>

</template>

<script>
import { connect } from '@/lib'
import * as CONSTANTS from '@/commons/admin'
import infoDialog from './infoDialog'

export default connect(() => {
  return {
  }
}, {
    testBaselineSecurityBp: 'security_bp/testBaselineSecurityBp'
})({
  name: '',
  props: ['testBaselineDialog'],
  data() {
    return {
        dialogFormVisible: false,
        queryParam: {
            language: '',
            project_level: ''
        },
        language: CONSTANTS.language,
        projectLevel: CONSTANTS.projectLevel,
        infoDialog: false,
        data: []
    }
  },
  created() {
  },
  mounted() {
  },
  components: { infoDialog },
  watch: {
    testBaselineDialog(val) {
        this.dialogFormVisible = val
    },
    dialogFormVisible(val) {
        this.$emit('testDialogVisible', this.dialogFormVisible)
    }
  },
  methods: {
      testBaseline() {
          let param = {
              language: this.queryParam.language,
              project_level: this.queryParam.project_level
          }
        this.testBaselineSecurityBp(param).then(res => {
            this.data = res.data
        })
        this.infoDialog = true
        this.dialogFormVisible = false;
      },
      getInfoDialog(val) {
          this.infoDialog = val
      }
  }
})
</script>
<style lang="less">
#admin-intra-baseline-test-dialog{
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
  .createProjectDialog-display{
    display: flex;
  }
  .createProjectDialog-important-input{
    width: 420px !important;
  }
  .createProjectDialog-label{
    font-weight: bold;
    margin-bottom: 20px;
    span{
      color: #FF0000;
    }
  }
  .inputBaseline {
    width: 320px;
  }

  .el-select {
    width: 320px;
  }
}
</style>