<template>
    <el-dialog id="add-problem-dialog" title="添加问题" :visible.sync="addDialogVisible" width="920px">
      <el-form :inline="true" :model="problemInfo" ref="problemInfo"  :rules='rules'
               label-width="100px" label-position="left">
        <!-- <div class="createProjectDialog-display"> -->
            <el-form-item label="规则模式" prop="rule_mode" >
          <el-select v-model="problemInfo.rule_mode"
                       class="inputWidth"
                       type="text"
                        trigger="hover"
                       placeholder="请选择规则模式"
                       clearable>
            <el-option v-for="item in ruleModes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Git地址" prop="git_url" style="margin-left:35px;">
          <!-- <el-input
            class="inputWidth"
            placeholder="请输入Git地址"
            v-model="problemInfo.git_url"
            clearable>
          </el-input> -->
          <el-select v-model="problemInfo.git_url"
                       class="inputWidth"
                       type="text"
                       placeholder="请选择Git地址"
                       clearable>
            <el-option v-for="(item,index) in gitList"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- </div> -->
        
        <el-form-item label="Git分支">
          <el-input
            class="inputWidth"
            placeholder="请输入Git分支"
            v-model="problemInfo.git_branch"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="Git版本" style="margin-left:35px;">
          <el-input
            class="inputWidth"
            placeholder="请输入Git版本"
            v-model="problemInfo.git_version"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="Git相对地址">
          <el-input
            class="inputWidth"
            placeholder="请输入Git相对地址"
            v-model="problemInfo.git_relative_path"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="Git语言" style="margin-left:35px;">
          <el-input
            class="inputWidth"
            placeholder="请输入Git语言"
            v-model="problemInfo.language"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="漏洞类型" prop="vul_type_id">
                <vul-type class="inputWidth" v-model="problemInfo.vul_type_id" ></vul-type>
        </el-form-item>
        <el-form-item label="漏洞文件路径" style="margin-left:35px;">
          <el-input
            class="inputWidth"
            placeholder="请输入漏洞文件路径"
            v-model="problemInfo.df_path"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="漏洞代码行数">
          <el-input
            class="inputWidth"
            placeholder="请输入漏洞代码行数"
            v-model="problemInfo.df_line"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="漏洞代码摘要" style="margin-left:35px;">
          <el-input
            class="inputWidth"
            type="textarea"
            placeholder="请输入漏洞代码摘要"
            v-model="problemInfo.df_code"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="问题类型:" prop="checked">
          <el-radio-group v-model="problemInfo.checked">
            <el-radio :label="1">项目信息填错</el-radio>
            <el-radio :label="2">基线引擎检测不准</el-radio>
            <el-radio :label="3">白盒误报</el-radio>
            <el-radio :label="4">白盒漏报</el-radio>
            <el-radio :label="5">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注说明" prop="sdl_remark">
          <el-input
            class="inputWidth"
            type="textarea"
            placeholder="请添加备注说明"
            v-model="problemInfo.sdl_remark"
            clearable>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="auditResult-button" @click="addDialogVisible = false">取消</el-button>
        <el-button class="auditResult-btn" type="warning" round @click="validateProblemInfo('problemInfo')">确定</el-button>
      </div>
    </el-dialog>
</template>

<script>
import * as CONSTANTS from '@/commons/dorado'
import { connect } from '@/lib'
import vulType from '../components/vulType'

export default connect(() => {
  return {
      baselineReqList: 'baseline_requirement/baselineReqList'
  }
}, {
    createProblem: 'problem_list/createProblem'
})({
  props: ['dialogVisible', 'round', 'baseline', 'gitlist'],
  data() {
    return {
        addDialogVisible: null,
        sdl_project_id: this.$route.query['projectId'],
        problemInfo: {
            'sdl_project_id': this.$route.query['projectId'],
            'round': null,
            'baseline_no': '',
            'rule_mode': null,
            'git_url': '',
            'git_branch': '',
            'git_version': '',
            'language': '',
            'df_path': '',
            'df_line': 0,
            'df_code': '',
            'git_relative_path': '',
            'vul_type_id': null,
            'sdl_remark': ''
        },
        gitList: [],
        rules: {
          rule_mode: [{required: true, message: ' ', trigger: 'change'}],
          vul_type_id: [{required: true, message: '请选择', trigger: 'change'}],
          git_url: [{required: true, message: '请选择', trigger: 'change'}],
          sdl_remark: [{required: true, message: ' ', trigger: ''}],
          checked: [{required: true, message: ' ', trigger: ''}]
        },
        ruleModes: CONSTANTS.ruleModes,
        checked: 0,
        checkedContent: ''
    }
  },
  components: { vulType },
  created() {
      this.$parent.fetchData()
  },
  mounted() {
  },
  watch: {
    dialogVisible(val) {
        this.addDialogVisible = val
        this.problemInfo = {
            'sdl_project_id': this.$route.query['projectId'],
            'round': this.round,
            'baseline_no': this.baseline,
            'rule_mode': null,
            'git_url': '',
            'git_branch': '',
            'git_version': '',
            'language': '',
            'df_path': '',
            'df_line': 0,
            'df_code': '',
            'git_relative_path': '',
            'vul_type_id': null,
            'sdl_remark': ''
        }
    },
    addDialogVisible(val) {
        this.$emit('projectDialog', this.addDialogVisible)
    },
    round(val) {
        this.problemInfo.round = val
    },
    baseline(val) {
        this.problemInfo.baseline_no = val
    },
    gitlist(val) {
        this.gitList = val
    }
  },
  methods: {
    validateProblemInfo(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitForm()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    validate(project, rules) {
        for (let name in rules) {
          if (Object.prototype.hasOwnProperty.call(rules, name)) {
            if (project[name] != '') {
              this.confirm = true
            } else {
              this.confirm = false
              return alert('请填写' + name)
            }
          }
        }
    },
    submitForm() {
      this.checkedContent = this.problemInfo.checked == 1 ? '项目信息填错' : this.checked == 2 ? '基线引擎检测不准' : this.checked == 3 ? '白盒误报' : this.checked == 4 ? '白盒漏报' : '其他'
      this.problemInfo.df_line = parseInt(this.problemInfo.df_line)
            let queryParam = this.problemInfo
            if (this.problemInfo.git_url) {
              queryParam.white_eva_id = this.problemInfo.git_url.split(',')[0]
              queryParam.git_url = this.problemInfo.git_url.split(',')[1]
            }
            queryParam.sdl_remark = `${this.checkedContent}-${this.problemInfo.sdl_remark}`
            queryParam.vul_type1_id = this.problemInfo.vul_type_id[0]
            queryParam.vul_type2_id = this.problemInfo.vul_type_id[1]
            delete queryParam.vul_type_id
            delete queryParam.checked
            this.createProblem(queryParam).then(res => {
              this.addDialogVisible = false
              this.$parent.fetchData()
              this.problemInfo.vul_type_id = []
            })
    }
  }
})
</script>
<style lang="less">
#add-problem-dialog{
  .inputWidth {
      width: 320px;
  }
    .auditResult-button {
      font-size: 13px;
      height: 32px;
      width: 95px;
      padding: 0px;
    }
    .auditResult-btn {
      background: #fc9153;
      border-radius: 4px;
      font-size: 13px;
      height: 32px;
      width: 95px;
      padding: 0px;
      border: none;
    }
    .createProjectDialog-display{
        display: flex;
    }
}
</style>