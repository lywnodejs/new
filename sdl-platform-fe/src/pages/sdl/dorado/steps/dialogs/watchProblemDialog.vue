<template>
    <el-dialog id="watch-problem-dialog" title="查看问题列表" :visible.sync="checkDialogVisible" width="1200px">
      <app-permission>
              <div class="global_result" style="float:right">
                修改所有结果：<el-select
                  :disabled="permission==1"
                  v-model="globalStatus"
                            class="selectInput"
                            type="text"
                            placeholder="请选择规则状态"
                            size="mini"
                            @change="changeGlobalSelect(globalStatus)">
                    <el-option v-for="(item,index) in ruleResults"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </div>
            </app-permission>
      <el-table
        ref="problemTable"
        :data="problemTableData">
        <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table-expand" label-width="90px">
            <div class="flex-box">
                <el-form-item label="来源文件[行号]:" v-show="props.row.sf_path || props.row.sf_line">
                  <a class="urlLink" @click="bounceUrl(props.row.git_url, props.row.git_branch, props.row.sf_line, props.row.sf_path)">
                     <span class="backgroundColor">{{ handlePath(props.row.sf_path) }}</span><span class="backgroundLineColor">{{`[${props.row.sf_line}]`}}</span>
                  </a>
                </el-form-item>
                <el-form-item label="来源问题代码:" v-show="props.row.sf_code">
                  <span>{{ props.row.sf_code }}</span>
                </el-form-item>
                <el-form-item label="目标文件[行号]:" v-show="props.row.df_line || props.row.df_path">
                  <a class="urlLink" @click="bounceUrl(props.row.git_url, props.row.git_branch, props.row.df_line, props.row.df_path)">
                    <span class="backgroundColor">{{ handlePath(props.row.df_path) }}</span><span class="backgroundLineColor">{{`[${props.row.df_line}]`}}</span>
                  </a>
                </el-form-item>
                <el-form-item label="目标问题代码:" v-show="props.row.df_code">
                  <span>{{ props.row.df_code }}</span>
                </el-form-item>
                <el-form-item label="规则id:">
                  <span>{{ props.row.rule_id }}</span>
                </el-form-item>
                <el-form-item label="规则名称:">
                <span>{{ props.row.rule_name }}</span>
                </el-form-item>
                <el-form-item label="SDL工程师备注:">
                  <span>{{ props.row.sdl_remark }}</span>
                </el-form-item>
                <el-form-item label="RD备注:">
                  <span>{{ props.row.rd_remark }}</span>
                </el-form-item>
            </div>
            <!-- <el-form-item label="基线确认状态:">
              <span>{{ handleParams(props.row.baseline_first_confirm_status) }}</span>
            </el-form-item> -->
            <!-- <el-form-item label="问题代码路径:">
                <span>
                    <a class="urlLink" @click="bounceUrl(props.row.git_url, props.row.git_branch, props.row.df_line, props.row.df_path)">
                    <span>{{ handleDFPath(props.row.git_url, props.row..df_path) }}</span>
                    </a>
                </span>
                    
            </el-form-item> -->
            <!-- <el-form-item label="行号:">
              <span  v-for="item in props.row.check_method.split(',')" :key='item'><a @click="checkMethod(props.row.baseline_no)" class="checkMethod" target="_blank" :href="item">{{ item }}</a> </span>
            </el-form-item> -->
            
          </el-form>
        </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="100">
          <template slot-scope="scope">
            {{ judgeIssueStatus(scope.row.issue_status) }}
          </template>
        </el-table-column>
        <el-table-column
          label="git地址"
          width="150">
          <template slot-scope="scope">
            {{ scope.row.git_url.split(':')[1] }}
          </template>
        </el-table-column>
        <el-table-column
          label="git分支"
          width="120">
          <template slot-scope="scope">
            {{ scope.row.git_branch }}
          </template>
        </el-table-column>
        <el-table-column
          label="问题代码路径">
          <template slot-scope="scope">
            <!-- {{ scope.row.df_path }} -->
            <el-tooltip  class="item" effect="dark" placement="top">
              <div slot="content">
                问题代码路径：{{handleDFPath(scope.row.git_url, scope.row.df_path)}}<br/>
                <span  v-show="scope.row.df_line || scope.row.df_path">来源文件[行号]：<span class="backgroundColor">{{ handlePath(scope.row.sf_path) }}</span><span class="backgroundLineColor">{{`[${scope.row.sf_line}]`}}</span></span><br/>
                <span v-show="scope.row.sf_code">来源问题代码：{{scope.row.sf_code}}</span><br/>
                <span v-show="scope.row.df_line || scope.row.df_path">目标文件[行号]：<span class="backgroundColor">{{ handlePath(scope.row.df_path) }}</span><span class="backgroundLineColor">{{`[${scope.row.df_line}]`}}</span></span><br/>
                <span v-show="scope.row.df_code">目标问题代码：{{scope.row.df_code}}</span>
              </div>
              <a class="urlLink" @click="bounceUrl(scope.row.git_url, scope.row.git_branch, scope.row.df_line, scope.row.df_path)">
                <span class="ellipsis">{{ handleDFPath(scope.row.git_url, scope.row.df_path) }}</span>
              </a>
            </el-tooltip>
            <!-- <a class="urlLink" @click="bounceUrl(scope.row.git_url, scope.row.git_branch, scope.row.df_line, scope.row.df_path)">
                <span class="ellipsis">{{ handleDFPath(scope.row.git_url, scope.row.df_path) }}</span>
            </a> -->
          </template>
        </el-table-column>
        <el-table-column
          label="规则名称"
          align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.rule_id + '：' +scope.row.rule_name" placement="top">
              <span class="ellipsis">{{scope.row.rule_name.split('-')[1]}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="详情"
          align="center"
          width="80">
          <template slot-scope="scope">
            <span style="color: #fc9153" @click="handleDetail(scope.row)">查看详情</span>
          </template>
        </el-table-column>
        <el-table-column
          label="结果审计"
          width="140"
          align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.rule_result"
                      class="selectInput"
                      type="text"
                      placeholder="请选择规则状态"
                      size="mini"
                      @change="changeSelect(scope.row.id, scope.row.rule_result, scope.row.sdl_remark)">
              <el-option v-for="item in ruleResults"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button class="auditResult-button" @click="updateList()">取消</el-button>
        <el-button class="auditResult-btn" type="warning" round @click="submitStatus()">提交状态</el-button>
      </div>
      <el-dialog
        width="500px"
        title="请输入通过/不通过原因"
        :visible.sync="innerVisible"
        append-to-body>
        <el-radio-group v-model="checked">
          <el-radio :label="1">项目信息填错</el-radio>
          <el-radio :label="2">基线引擎检测不准</el-radio>
          <el-radio :label="3">白盒误报</el-radio>
          <el-radio :label="4">其他</el-radio>
        </el-radio-group><br><br>
        <el-input
          type="textarea"
          :rows="2"
          class="remarkBox"
          placeholder="请输入误报原因"
          v-model="remark">
        </el-input>
        <div slot="footer" class="dialog-footer">
          <el-button class="auditResult-button" @click="innerVisible = false">取消</el-button>
          <el-button class="innerVisible-btn" type="warning" @click="popUp">确定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
</template>

<script>
import * as CONSTANTS from '@/commons/dorado'
import { connect } from '@/lib'
import vulType from '../components/vulType'

export default connect(() => {
  return {
  }
}, {
    updateRuleResult: 'problem_list/updateRuleResult',
    getOutputTaskId: 'problem_list/getOutputTaskId'
})({
  props: ['dialogVisible', 'data', 'baseline', 'problemData'],
  data() {
    return {
        tableData: [],
        baselineNo: '',
        checkDialogVisible: null,
        problemTableData: [],
        ruleResultSubmitList: [],
        ruleResults: CONSTANTS.ruleResults,
        issueStatus: CONSTANTS.issueStatus,
        baselineConfirmStatus: CONSTANTS.baselineConfirmStatus,
        baselineReconfirmStatus: CONSTANTS.baselineReconfirmStatus,
        remark: '',
        sign: 0,
        changedId: [],
        innerVisible: false,
        checked: 0,
        checkedContent: '',
        globalStatus: -1
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
        this.checkDialogVisible = val
    },
    checkDialogVisible(val) {
        this.$emit('projectCheckDialog', this.checkDialogVisible)
    },
    data(val) {
        this.tableData = val
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].baseline_no == this.baseline) {
            this.problemTableData = this.tableData[i].issues
            this.ruleResultSubmitList = this.problemTableData
          }
        }
    },
    baseline(val) {
        this.baselineNo = val
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].baseline_no == this.baselineNo) {
            this.problemTableData = this.data[i].issues
            this.ruleResultSubmitList = this.problemTableData
          }
        }
    },
    problemData(val) {
    }
  },
  methods: {
    submitStatus() {
      let arr = []
      for (let i = 0; i < this.ruleResultSubmitList.length; i++) {
        for (let j = 0; j < this.changedId.length; j++) {
          if (this.changedId[j] == this.ruleResultSubmitList[i].id && this.ruleResultSubmitList[i].sdl_remark === '') {
            this.innerVisible = true
            return
          }
        }
        let obj = {
          issue_primary_id: this.ruleResultSubmitList[i].id,
          rule_result: this.ruleResultSubmitList[i].rule_result,
          remark: this.ruleResultSubmitList[i].sdl_remark
        }
        arr.push(obj)
      }
      let queryParam = {
        issue_details: arr,
        remark: `${this.checkedContent}-${this.remark}`
      }
      this.updateRuleResult(queryParam).then(res => {
        this.checkDialogVisible = false
        this.changedId = []
        this.$parent.fetchData()
      })
    },
    updateList() {
      this.checkDialogVisible = false
      this.$parent.fetchData()
    },
    handlePath(path) {
      if (!path) {
        return ''
      }
      let pathArr = path.split('/')
      return pathArr[pathArr.length - 1]
    },
    changeGlobalSelect(globalStatus) {
      for (let i = 0; i < this.problemTableData.length; i++) {
        this.problemTableData[i].rule_result = globalStatus
      }
    },
    handleDetail(data) {
      this.getOutputTaskId({sdl_project_id: data.sdl_project_id, round: data.round, rule_id: data.rule_id}).then(res => {
        console.log(res)
        let url = `http://studio.xiaojukeji.com/s?ref=sdl&repo=${res.git_url.split(':')[1].split('.')[0]}&src=sdl-fatbird&task_id=${res.fatbird_task_id}&vul_id=${res.fatbird_result_id}`
        window.open(url)
      })
    },
    async popUp() {
        if (this.checked === 0) {
          this.$message({
              message: '误报原因为必选',
              type: 'warning'
          });
          return
        }
        if (this.remark.trim() === '') {
            this.$message({
              message: '输入不能为空',
              type: 'warning'
            });
            return
        }
        this.checkedContent = this.checked == 1 ? '项目信息填错' : this.checked == 2 ? '基线引擎检测不准' : this.checked == 3 ? '白盒误报' : '其他'
        for (let i = 0; i < this.ruleResultSubmitList.length; i++) {
          for (let j = 0; j < this.changedId.length; j++) {
            if (this.changedId[j] == this.ruleResultSubmitList[i].id) {
              this.ruleResultSubmitList[i].sdl_remark = `${this.checkedContent}-${this.remark}`
            }
          }
        }
        this.innerVisible = false
    },
    changeSelect(id, ruleResult, remark) {
      this.changedId.push(id)
      this.sign = 1
      for (let i = 0; i < this.ruleResultSubmitList.length; i++) {
        if (id == this.ruleResultSubmitList[i].id) {
          this.ruleResultSubmitList[i].rule_result = ruleResult
        }
      }

      // this.$prompt('', '请输入通过/不通过原因', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     inputValue: remark,
      //     inputType: 'textarea',
      //     customClass: 'remarkBox'
      // }).then(({ value }) => {
      //   this.remark = value
      //     for (let i = 0; i < this.ruleResultSubmitList.length; i++) {
      //       if (id == this.ruleResultSubmitList[i].id) {
      //         this.ruleResultSubmitList[i].rule_result = ruleResult
      //         this.ruleResultSubmitList[i].sdl_remark = value
      //       }
      //     }
      // }).catch(res => {
      //   this.$message({
      //     message: '提交前请输入通过/不通过原因',
      //     type: 'warning'
      //   });
      // })
    },
    judgeIssueStatus(status) {
      for (let i = 0; i < this.issueStatus.length; i++) {
        if (this.issueStatus[i].value == status) {
          return this.issueStatus[i].label
        }
      }
    },
    handleDFPath(gitPath, dfPath) {
      let temp = gitPath.split(':')[1].split('.')[0]
      let path = ''
      if (dfPath.indexOf(temp) > 0) {

        // path = dfPath.split(temp)[1]
        path = dfPath.slice(dfPath.indexOf(temp) + temp.length)
      } else {
        path = dfPath
      }
      return path
    },
    bounceUrl(gitUrl, gitBranch, dfLine, dfPath) {

      //  当前直接把dfpath拼接到下面url中
      // let handledDFPath = this.handleDFPath(gitUrl, dfPath)
      // handledDFPath = handledDFPath[0] == '/' ? handledDFPath : '/' + handledDFPath
      let url = 'https://git.xiaojukeji.com/' +
      gitUrl.split(':')[1].split('.')[0] +
      '/blob/' +
      gitBranch + '/' +
      dfPath +
      '#L' +
      dfLine

      // url = 'https://git.xiaojukeji.com/SDL/sdl-platform/blob/master/app/services/ocean/ocean_global_service.py#L10'
      window.open(url)
    }
  }
})
</script>
<style lang="less">
#watch-problem-dialog{
  .global_result{
    float: right;
    margin-bottom: 10px;
    margin-right: 20px;
  }
  .ellipsis{
    white-space:nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
  }
    .flex-box{
        padding: 10px;
        padding-left: 30px;
        font-size: 12.5px;
    }
    .el-form-item__label{
        color: #596385;
        font-size: 12.5px;
    }
    .el-form-item {
        margin-bottom: 0px;
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
  .backgroundColor{
    color: rgb(179, 9, 9);
    cursor: pointer;
    text-decoration: underline;
  }
  .backgroundLineColor{
    color: green;
    text-decoration: underline;
  }
}
.innerVisible-btn {
      background: #fc9153;
      border-radius: 4px;
      font-size: 13px;
      height: 32px;
      width: 95px;
      padding: 0px;
      border: none;
    }
</style>