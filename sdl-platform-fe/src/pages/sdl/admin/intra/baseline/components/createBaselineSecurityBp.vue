<template>
 <el-dialog title="新建" id="admin-intra-baseline-create-dialog" :visible.sync="dialogCreateVisible" width="460px">
      <el-form label-width="100px"  label-position="left">
          <el-form-item class="createProjectDialog-input" label="语言">
          <el-select class="inputFollow"
            v-model="queryParam.condition_language"
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
          <el-select class="inputFollow"
            v-model="queryParam.condition_project_level"
            filterable
            multiple
            placeholder="请选择项目等级">
            <el-option
              v-for="item in projectLevel"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="createProjectDialog-input" label="安全BP">
            <app-employee class="inputFollow" v-model="queryParam.security_bp" ></app-employee>
        </el-form-item>
        <el-form-item class="createProjectDialog-input" label="优先级">
            <el-input class="inputFollow" v-model="queryParam.match_order"></el-input>
        </el-form-item>
        <el-form-item class="createProjectDialog-input" label="规则类型">
          <el-select class="inputFollow"
            v-model="queryParam.rule_type"
            filterable
            placeholder="请选择规则类型">
            <el-option
              v-for="item in ruleType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false" class="base-line-diaolog-button">取消</el-button>
        <el-button
          class="base-line-diaolog-btn"
          type="warning"
          round
          @click="createBaselineInfo()">
          确认更新
        </el-button>
      </div>
    </el-dialog>
    
</template>

<script>
import { connect } from '@/lib'
import * as CONSTANTS from '@/commons/admin'

export default connect(() => {
  return {
  }
}, {
    createBaselineSecurityBp: 'security_bp/createBaselineSecurityBp'
})({
  name: '',
  props: ['createBaselineDialog'],
  data() {
    return {
        id: this.baselineId,
        dialogCreateVisible: false,
        queryParam: {
            condition_language: '',
            condition_project_level: '',
            match_order: 1,
            rule_type: null,
            security_bp: ''
        },
        language: CONSTANTS.language,
        projectLevel: CONSTANTS.projectLevel,
        ruleType: CONSTANTS.ruleType
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    createBaselineDialog(val) {
        this.dialogCreateVisible = val
    },
    info(val) {
        this.queryParam.id = val.id
        this.queryParam.security_bp = val.security_bp
    },
    dialogCreateVisible(val) {
        this.$emit('createDialogVisible', this.dialogCreateVisible)
    }
  },
  methods: {
      createBaselineInfo() {
          let param = {
            condition_language: this.queryParam.condition_language,
            condition_project_level: this.queryParam.condition_project_level.join(','),
            match_order: this.queryParam.match_order,
            rule_type: this.queryParam.rule_type,
            security_bp: this.queryParam.security_bp
          }
        this.createBaselineSecurityBp(param).then(res => {
        })
        this.dialogCreateVisible = false
        this.$parent.fetchData();
      }
  }
})
</script>
<style lang="less">
#admin-intra-baseline-create-dialog{
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