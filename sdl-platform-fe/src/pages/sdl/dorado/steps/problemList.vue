<template>
  <div id="problemList">
    <span>
      <div class="problemListTitle">问题列表</div>
      <div class="chooseRound">
        <span>检测轮次:</span>
        <el-select
          v-model="round"
          @change="selectRound(round)">
          <el-option v-for="item in roundList"
            :key="item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
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
        prop="baseline_status_description"
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
          <el-select class="selectInput" filterable type="text" placeholder="请选择基线确认状态" size="mini"
                    v-model="scope.row.baseline_status"
                    v-if="scope.row.baseline_enName == 'BASELINE_STATUS_TO_BE_IMPROVED' || 
                          scope.row.baseline_enName == 'BASELINE_STATUS_SATISFIED'  "
                    :disabled="currentStatus==107 && permission==1"
                    @change="changeBaselineStatus(scope.row.id, scope.row.baseline_status)">
                    <el-option
                        v-for="item in judgeBaseline(scope.row.baseline_enName)"
                        :key="item.value"
                        :disabled="item.disabled"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
          </el-select>
          <el-button 
            type="text" 
            size="mini" 
            v-if="scope.row.baseline_enName != 'BASELINE_STATUS_TO_BE_IMPROVED' && scope.row.baseline_enName != 'BASELINE_STATUS_SATISFIED' "
            @click="openDialog(scope.row.baseline_no, 'open')">查看问题 (<span style="color: red">{{scope.row.issues.length}}</span>)
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="submitButton">
      <app-permission>
         <el-button class="problemListBtn" type="warning" @click="throttleButton(submitProblemList)" :disabled="isDisabled">提 交</el-button>
         <el-button v-if="currentStatus!=107" class="problemListBtn" type="warning" @click="throttleButton(submitProblemList)">提 交</el-button>
      </app-permission>
      &nbsp; &nbsp;
      <el-tag
        class="myTag"
        v-show="problemStatus"
        @close="handleClose()"
        type="danger">
        <i class="el-icon-warning"></i>
        提示：不能提交状态为 "检测不通过"、"待改进"的基线
      </el-tag>
    </div>

    <!-- 查看问题列表弹窗 -->
    <problem-list-dialog :dialogVisible='checkDialogVisible' @problemListDialog='getFormVisible' :data='problemTableData' :currentStatus='currentStatus'></problem-list-dialog>
  </div>
</template>
<script>
import * as CONSTANTS from '@/commons/dorado'
import {connect} from '@/lib'
import problemListDialog from './dialogs/problemListDialog'
import throttle from '@/plugin/throttle'

export default connect(() => {
    return {
      baselineRdResultList: 'problem_list/baselineRdResultList',
      permission: 'permission/permission'
    }
  }, {
    getBaselineRdResultList: 'problem_list/getBaselineRdResultList',
    updateBaselineStatus: 'problem_list/updateBaselineStatus',
    retestBaseline: 'problem_list/retestBaseline'
  })({
  name: 'problem-list',
  data() {
    return {
      tableData: [],
      problemTableData: [],
      round: 0,
      checkDialogVisible: false,
      selectedRound: 0,
      roundList: [],
      problemStatus: false,
      baselineConfirmStatus: CONSTANTS.baselineConfirmStatus,
      baselineReconfirmStatus2: CONSTANTS.baselineReconfirmStatus2,
      baselineReconfirmStatus3: CONSTANTS.baselineReconfirmStatus3,
      baselineReconfirmStatus4: CONSTANTS.baselineReconfirmStatus4,
      baselineReconfirmStatus5: CONSTANTS.baselineReconfirmStatus5,
      baselineReconfirmStatus6: CONSTANTS.baselineReconfirmStatus6,
      baselineReconfirmStatus7: CONSTANTS.baselineReconfirmStatus7,
      isDisabled: false
    }
  },
  inject: ['getWorkFlow'],
  props: ['currentStatus'],
  created() {
    this.fetchData()
  },
  components: {problemListDialog},
  methods: {
    fetchData() {
      this.sdl_project_id = parseInt(this.$route.query['projectId'])
      let queryParam = {
        'sdl_project_id': this.sdl_project_id
      }
      this.getBaselineRdResultList(queryParam).then(res => {
        this.tableData = this.richStatus(this.baselineRdResultList)
        this.round = res.round
        this.selectedRound = res.total_round
        this.roundList = []
        for (let i = 0; i < this.selectedRound; i++) {
          let obj = {
            value: i + 1,
            label: i + 1
          }
          this.roundList.push(obj)
        }
      })
    },
    openDialog(baselineNo, type) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].baseline_no == baselineNo) {
          this.problemTableData = this.tableData[i].issues
        }
      }
      this.checkDialogVisible = true
    },
    getFormVisible(val) {
      this.checkDialogVisible = val
    },
    handleClose() {
      this.problemStatus = false
    },
    selectRound() {
      let queryParam = {
        sdl_project_id: this.sdl_project_id,
        round: this.round
      }
      this.getBaselineRdResultList(queryParam).then(res => {
        this.tableData = this.richStatus(this.baselineRdResultList)
        this.round = res.round
        this.selectedRound = res.total_round
      })
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
    judgeBaseline(name) {
      if (name == 'BASELINE_STATUS_TO_BE_IMPROVED') {
        return this.baselineReconfirmStatus3
      }
      if (name == 'BASELINE_STATUS_SATISFIED') {
        return this.baselineReconfirmStatus4
      }
      if (name == 'BASELINE_STATUS_CHECK_NOT_PASS') {
        return this.baselineReconfirmStatus5
      }
      if (name == 'BASELINE_STATUS_FIXED') {
        return this.baselineReconfirmStatus6
      }
      if (name == 'BASELINE_STATUS_ACCEPT_RISK') {
        return this.baselineReconfirmStatus7
      }
    },
    judgeStatus(status) {

      // 待改进-黄色 1
      // 不适用-红色 2
      // 已满足-蓝色 3
      // 已满足-有规则 - 蓝色 4
      // 已满足-无规则 - 红色 5
      // 待改进-有规则 - 黄色 6
      // 待改进-无规则 - 黄色 7
      // 检测通过 - 绿色 8
      // 检测不通过 - 红色 9
      // 确认不适用 - 灰色 10
      // 已修复 - 蓝色 11
      // 接受风险上线 - 红色 12

      for (let item = 0; item < this.baselineConfirmStatus.length; item++) {
        if (this.baselineConfirmStatus[item].value == status) {
          return this.baselineConfirmStatus[item].color
        }
      }

      // this.baselineConfirmStatus.forEach(item => {
      //   if (status == item.value) {
      //     if (item.color == 'gray') {
      //       return 'info'  // 灰
      //     }
      //     if (item.color == 'green') {
      //       return 'success' // 绿
      //     }
      //     if (item.color == 'yellow') {
      //       return 'warning' // 黄
      //     }
      //     if (item.color == 'red') {
      //       return 'danger' // 红
      //     }
      //     if (item.color == 'blue') {
      //       return ''  // 蓝
      //     }
      //   }
      // });
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
    throttleButton: throttle(function(func) {
          let args = Array.from(arguments).slice(1);
          func.apply(this, args);
    }, 2200),
    submitProblemList() {
      this.isDisabled = true
      let queryParam = {
        sdl_project_id: this.sdl_project_id
      }
      let flag = 1
      this.tableData.forEach(item => {
        if (item.baseline_enName == 'BASELINE_STATUS_TO_BE_IMPROVED' || item.baseline_enName == 'BASELINE_STATUS_CHECK_NOT_PASS') {
          flag = 0
        }
      })
      if (flag) {
        this.retestBaseline(queryParam).then(res => {
          this.isDisabled = false
          this.fetchData()
          this.getWorkFlow()
        })
      } else {
        this.isDisabled = false
        if (this.problemStatus == true) { return }
        this.problemStatus = true
        setTimeout(() => {
          this.problemStatus = false
        }, 5000);
      }
    }
  }
})
</script>
<style lang='less'>
  #problemList {
    padding-top: 40px;
    -webkit-font-smoothing: antialiased;
    .problemListTitle {
      color: #333333;
      font-size: 14px;
      display: inline-block;
    }
    .submitButton {
      margin-top: 15px;
    }
    .problemListBtn {
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
    .chooseRound {
      float: right;
      margin-bottom: 5px;
      font-size: 13px;
      span {
        color: #666;
      }
      .el-select {
        width: 60px;
        margin-left: 3px;
      }
    }
    .el-button--warning.is-disabled, .el-button--warning.is-disabled:active, .el-button--warning.is-disabled:focus, .el-button--warning.is-disabled:hover {
            color: #bcbec2;
            background-color: #f4f4f5;
            border-color: #e9e9eb;
    }
    .myTag{
      border: none !important;
      background: none !important;
      font-weight: 400 !important;
      font-size: 13px;
    }
  }
</style>
