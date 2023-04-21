<template>
  <div id="auditResult">
    <span>
      <div class="auditResultTitle">SDL审计检测结果</div>
    </span>
    <el-table :data="tableData"
        v-loading
        style="margin-top: 10px;width: 100%">
      <el-table-column
        prop="baseline_no"
        label="基线编号"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="baseline_name"
        label="基线名称">
      </el-table-column>
      <el-table-column
        align="center"
        label="基线状态"
        width="150">
        <template slot-scope="scope">
          <el-tag
            :class="judgeStatus(scope.row.baseline_status)">
            {{scope.row.baseline_status_description}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="openDialog('check', scope.row.baseline_no)"
            v-if="scope.row.baseline_enName!='BASELINE_STATUS_TO_BE_IMPROVED' && 
                  scope.row.baseline_enName!='BASELINE_STATUS_NOT_APPLICABLE' && 
                  scope.row.baseline_enName!='BASELINE_STATUS_SATISFIED' && 
                  scope.row.baseline_enName!='BASELINE_STATUS_CONFIRM_NOT_APPLICABLE'">查看问题 (<span style="color: red">{{scope.row.issues.length}}</span>)
          </el-button>
          <br v-if="scope.row.baseline_enName!='BASELINE_STATUS_TO_BE_IMPROVED' && 
                  scope.row.baseline_enName!='BASELINE_STATUS_NOT_APPLICABLE' && 
                  scope.row.baseline_enName!='BASELINE_STATUS_SATISFIED' && 
                  scope.row.baseline_enName!='BASELINE_STATUS_CONFIRM_NOT_APPLICABLE'">
          <el-button 
            size="mini"
            type="text" 
            class="el-icon-circle-plus-outline"
            @click="openDialog('add', scope.row.baseline_no)"
            v-if="scope.row.baseline_enName!='BASELINE_STATUS_TO_BE_IMPROVED' && 
                  scope.row.baseline_enName!='BASELINE_STATUS_NOT_APPLICABLE' && 
                  scope.row.baseline_enName!='BASELINE_STATUS_SATISFIED' && 
                  scope.row.baseline_enName!='BASELINE_STATUS_CONFIRM_NOT_APPLICABLE'">新增问题
          </el-button>
          <br v-if="scope.row.baseline_enName == 'BASELINE_STATUS_SATISFIED_HAVING_RULES' || 
                    scope.row.baseline_enName == 'BASELINE_STATUS_SATISFIED_NO_RULES' ||
                    scope.row.baseline_enName == 'BASELINE_STATUS_SATISFIED_LANG_UNSUPPORTED' ||
                    scope.row.baseline_enName == 'BASELINE_STATUS_TEST_EXCEPTION'" >
          <el-select v-model="scope.row.baseline_status"
              v-if="scope.row.baseline_enName == 'BASELINE_STATUS_NOT_APPLICABLE' || 
                    scope.row.baseline_enName == 'BASELINE_STATUS_CONFIRM_NOT_APPLICABLE' ||
                    scope.row.baseline_enName == 'BASELINE_STATUS_TO_BE_IMPROVED' ||
                    scope.row.baseline_enName == 'BASELINE_STATUS_SATISFIED' ||
                    scope.row.baseline_enName == 'BASELINE_STATUS_SATISFIED_HAVING_RULES' ||
                    scope.row.baseline_enName == 'BASELINE_STATUS_SATISFIED_NO_RULES' ||
                    scope.row.baseline_enName == 'BASELINE_STATUS_SATISFIED_LANG_UNSUPPORTED' ||
                    scope.row.baseline_enName == 'BASELINE_STATUS_TEST_EXCEPTION'" 
                    class="selectInput"
                    type="text"
                    placeholder="请选择基线确认状态"
                    size="mini"
                    @change="changeBaselineStatus(scope.row.id, scope.row.baseline_status)">
            <el-option v-for="item in baselineReconfirmStatus"
              :key="item.value"
              :disabled="item.disabled"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>

    <div class="submitButton">
      <el-button 
        class="auditResultBtn" 
        type="warning" 
        @click="throttleButton(submitAuditResult)" :disabled="isDisabled">
        提 交
      </el-button>
    </div>

    <!-- 添加问题弹窗 -->
    <add-problem-dialog :dialogVisible='addDialogVisible' @projectDialog='getFormVisible' 
                        :round='round' 
                        :baseline='addDialogBaselineNo'
                        :gitlist='gitList'></add-problem-dialog>

    <!-- 查看问题列表弹窗 -->
    <watch-problem-dialog :dialogVisible='checkDialogVisible' @projectCheckDialog='getCheckFormVisible' 
                          :data='tableData'
                          :problemData='problemTableData'
                          :baseline='addDialogBaselineNo'></watch-problem-dialog>
  </div>
</template>
<script>
import * as CONSTANTS from '@/commons/dorado'
import vulType from './components/vulType'
import addProblemDialog from './dialogs/addProblemDialog'
import watchProblemDialog from './dialogs/watchProblemDialog'
import {connect} from '@/lib'
import throttle from '@/plugin/throttle'

// import dialog from '@/utils/dialog';

export default connect(() => {
    return {
      baselineAuditResultList: 'problem_list/baselineAuditResultList',
      whiteEvaluation: 'baseline_requirement/whiteEvaluation'
    }
  }, {
    getBaselineAuditResultList: 'problem_list/getBaselineAuditResultList',
    updateBaselineStatus: 'problem_list/updateBaselineStatus',
    calculateScan: 'problem_list/calculateScan',
    fecthBaselineCodeWhiteEvaluation: 'baseline_requirement/fecthBaselineCodeWhiteEvaluation'
  })({
  name: 'audit-result',
  data() {
    return {
      tableData: [],
      sdl_project_id: 0,
      round: 0,
      addDialogBaselineNo: '',
      problemTableData: [],
      ruleResultSubmitList: [],
      addDialogVisible: false,
      checkDialogVisible: false,
      baselineConfirmStatus: CONSTANTS.baselineConfirmStatus,
      baselineReconfirmStatus: CONSTANTS.baselineReconfirmStatus,
      gitList: [],
      ruleResults: CONSTANTS.ruleResults,
      isDisabled: false
    }
  },
  components: { vulType, addProblemDialog, watchProblemDialog },
  inject: ['getWorkFlow'],
  created() {
    this.fetchData()
  },
  updated() {
  },
  methods: {

    // handleTableData() {
    //   for (let i in this.baselineDetails) {
    //     if (this.baselineDetails.hasOwnProperty(i)) {
    //       let temp = this.baselineDetails[i]
    //       temp.baseline_no = i
    //       tableArr.push[temp]
    //     }
    //   }
    //   console.log(tableArr)
    // }
    fetchData() {
      this.sdl_project_id = parseInt(this.$route.query['projectId'])
      let queryParam = {
        'sdl_project_id': this.sdl_project_id
      }
      this.gitList = []
      this.getBaselineAuditResultList(queryParam).then(res => {
        this.tableData = this.richStatus(res.baseline_details)
        this.round = res.round
      })
      this.fecthBaselineCodeWhiteEvaluation(queryParam).then(res => {
        this.whiteEvaluation.white_eva_list.forEach(item => {
          let val = item.white_eva_id + ',' + item.git_url
          this.gitList.push({label: item.git_url, value: val})
        })
      })
    },
    openDialog(param, baselineNo) {
      if (param == 'add') {
        this.addDialogVisible = true
        this.addDialogBaselineNo = baselineNo
      } else {
        this.checkDialogVisible = true
        this.addDialogBaselineNo = baselineNo
      }
    },
    getFormVisible(val) {
      this.addDialogVisible = val
    },
    getCheckFormVisible(val) {
      this.checkDialogVisible = val
    },
    richStatus(param) {
      param.forEach(item => {
        this.baselineConfirmStatus.forEach(i => {
          if (item.baseline_status == i.value) {
            item.baseline_enName = i.name
          }
        })
      });
      return param
    },
    judgeStatus(status) {
      for (let item = 0; item < this.baselineConfirmStatus.length; item++) {
        if (this.baselineConfirmStatus[item].value == status) {
          return this.baselineConfirmStatus[item].color
        }
      }
    },
    changeBaselineStatus(id, status) {
      let queryParam = {
        id: id,
        baseline_status: status
      }
      this.updateBaselineStatus(queryParam).then(res => {
        this.fetchData()
      })
    },
    submitAuditResult() {
      this.isDisabled = true
      let queryParam = {
        sdl_project_id: this.sdl_project_id,
        round: this.round
      }
      this.calculateScan(queryParam).then(res => {
        this.isDisabled = false
        this.fetchData()
        this.getWorkFlow()
      })
    },
    throttleButton: throttle(function(func) {

        // console.log(func)
        let args = Array.from(arguments).slice(1);
        func.apply(this, args);
      }, 2200)
    }
})
</script>
<style lang='less'>
  #auditResult {
    padding-top: 40px;
    -webkit-font-smoothing: antialiased;
    .auditResultTitle {
      color: #333333;
      font-size: 14px;
    }
    .inputWidth {
      width: 320px;
    }
    .selectInput {
      width: 100px;
    }
    .submitButton {
      margin-top: 15px;
    }
    .auditResultBtn {
      height: 32px;
      // width: 110px;
      width: 100px;
      padding: 0px;
      text-align: center;
      background: #fc9153;
      border-radius: 4px;
      border: none;
      // font-weight: 100;
      -webkit-font-smoothing: antialiased;
      // margin-left: -10px;
      span {
        font-size: 12px;
      }
    }
    .el-input__suffix{
      right: 0;
    }
    .el-input__inner {
        padding-right: 20px;
    }
    .blue{
      background-color: #ecf5ff;
      color: #409eff;
      border: 1px solid #b3d8ff;
    }
    .green{
      background-color: rgba(103, 194, 58, 0.1);
      border-color: rgba(103, 194, 58, 0.2);
      color: #67c23a;
    }
    .red{
      background-color: rgba(245, 108, 108, 0.1);
      border-color: rgba(245, 108, 108, 0.2);
      color: #f56c6c;
    }
    .gray{
      background-color: #f4f4f5;
      border-color: #e9e9eb;
      color: #909399;
    }
    .yellow{
      background-color: #fdf6ec;
      border-color: #faecd8;
      color: #e6a23c;
    }
    .urlLink {
      color: #fc9153;
    }
    .el-button--warning.is-disabled, .el-button--warning.is-disabled:active, .el-button--warning.is-disabled:focus, .el-button--warning.is-disabled:hover {
            color: #bcbec2;
            background-color: #f4f4f5;
            border-color: #e9e9eb;
    }
  }
</style>
