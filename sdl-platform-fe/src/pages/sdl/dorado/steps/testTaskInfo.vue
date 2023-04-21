<template>
  <div id="testTaskInfo">
      <span>
          <div class="problemListTitle">基线任务查看</div>
      </span>
      <el-button
          type="primary"
          size="mini"
          class="btn ignoreBtn"
          :disabled="disabled"
          @click="ignoreExce()">
          忽略异常继续
        </el-button>
      <el-button
          type="primary"
          size="mini"
          style="float:right;width:96px;margin-right:5px"
          class="btn"
          :disabled="disable"
          @click="scanExce()">
          重新下发
        </el-button>
    <el-table :data="tableData"
        v-loading
        style="margin-top: 10px;width: 100%">
        <app-permission>
          <el-table-column
            label=""
            fixed
            align="center"
            width="40">
            <template slot-scope="scope">
                <span @click="openDialog(scope.row)"> <i class="el-icon-edit editIcon"></i> </span>
            </template>
          </el-table-column>
        </app-permission>
      <el-table-column
        prop="baseline_no"
        label="基线编号"
        fixed
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="didi_test_task_id"
        width="150"
        fixed
        label="检测任务编号">
      </el-table-column>
      <el-table-column
        label="状态"
        width="120">
        <template slot-scope="scope">
            <el-tooltip v-show="scope.row.didi_test_task_status === 4"
              class="item" effect="dark" placement="top">
              <div class="solt-content" slot="content">1、请检查<span class="cell-red">相对路径</span>填写是否正确，修改为正确的相对路径后点击“重新下发”<br/>2、如1正确请检查使用的 build 脚本是否能在 OE 打包通过，改好 build 脚本后点击“重新下发”</div>
              <i class="el-icon-warning cell-red"></i>
            </el-tooltip>
            <el-tooltip v-show="scope.row.didi_test_task_status === 5"
              class="item" effect="dark" placement="top">
              <div slot="content">检测引擎报错或检测超时，请联系安全工程师处理！</div>
              <i class="el-icon-warning cell-red"></i>
            </el-tooltip>
            <span :class="(scope.row.didi_test_task_status === 4 || scope.row.didi_test_task_status === 5)? 'cell-red':''">{{ judgeStatus(scope.row.didi_test_task_status, testTaskStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        width="120">
        <template slot-scope="scope">
            <span>{{ judgeStatus(scope.row.didi_test_task_type, testTaskType) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="引擎"
        width="100">
        <template slot-scope="scope">
            <span>{{ judgeStatus(scope.row.didi_test_type, testType) }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="Git仓库"
          width="200">
          <template slot-scope="scope">
            <!-- {{ scope.row.df_path }} -->
            <a class="urlLink" @click="bounceUrl(scope.row.git_url)">
              <span>{{ handlePath(scope.row.git_url) }}</span>
            </a>
          </template>
      </el-table-column>
      <el-table-column
        prop="round"
        label="轮次"
        width="80">
      </el-table-column>
      <el-table-column
        prop="rule_id_list"
        min-width="450"
        label="规则列表">
      </el-table-column>
      <el-table-column
        prop="git_branch"
        min-width="100"
        label="Git分支">
      </el-table-column>
      <el-table-column
        prop="git_relative_path"
        min-width="100"
        label="Git相对路径">
      </el-table-column>
    </el-table>
    <task-info-dialog :dialogVisible='dialogVisible' @taskInfoDialog='getDialogVisible' :scopeRow='scopeRow'></task-info-dialog>
  </div>
</template>
<script>

import * as CONSTANTS from '@/commons/dorado'
import {connect} from '@/lib'
import taskInfoDialog from './dialogs/editTaskInfoDialog'

export default connect(() => {
    return {
    }
  }, {
    getBaselineTestTaskInfo: 'problem_list/getBaselineTestTaskInfo',
    scanException: 'problem_list/scanException',
    ignoreException: 'problem_list/ignoreException'
  })({
  name: 'problem-list',
  data() {
    return {
      tableData: [],
      testTaskType: CONSTANTS.testTaskType,
      testTaskStatus: CONSTANTS.testTaskStatus,
      testType: CONSTANTS.testType,
      disabled: false,
      disable: false,
      dialogVisible: false,
      scopeRow: {}
    }
  },
  inject: ['getWorkFlow'],
  created() {
    this.fetchData()
  },
  components: {taskInfoDialog},
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
      this.getBaselineTestTaskInfo(queryParam).then(res => {
        console.log(res)
        this.tableData = res.test_tasks
      })
    },
    openDialog(scopeRow) {
      this.scopeRow = scopeRow
      this.dialogVisible = true
    },
    getDialogVisible(val) {
      this.dialogVisible = val
    },
    scanExce() {
        this.disable = true
        this.sdl_project_id = parseInt(this.$route.query['projectId'])
        let queryParam = {
            'sdl_project_id': this.sdl_project_id

            // 'round': 1
        }
        this.scanException(queryParam).then(res => {
            this.fetchData()
            setTimeout(() => {
              location.reload()
            }, 3000);
        })
    },
    ignoreExce() {
      if (this.tableData[0].didi_test_task_status === 1) {
        this.$message('请等待检测任务完成');
        return
      }
      this.disabled = true
      this.sdl_project_id = parseInt(this.$route.query['projectId'])
        let queryParam = {
            'sdl_project_id': this.sdl_project_id

            // 'round': 1
      }
      this.ignoreException(queryParam).then(res => {

        // console.log(res)
        location.reload()
      })
    },
    handlePath(gitUrl) {
        return gitUrl.split(':')[1]
    },
    bounceUrl(gitUrl) {
      let url = 'https://git.xiaojukeji.com/' + gitUrl.split(':')[1]

      // url = 'https://git.xiaojukeji.com/SDL/sdl-platform/blob/master/app/services/ocean/ocean_global_service.py#L10'
      window.open(url)
    },
    judgeStatus(a, b) {
        for (let i = 0; i < b.length; i++) {
            if (b[i].value == a) {
                return b[i].label
            }
        }
    }
  }
})
</script>
<style lang='less'>
  #testTaskInfo {
    padding-top: 40px;
    -webkit-font-smoothing: antialiased;
    .problemListTitle {
      color: #333333;
      font-size: 14px;
      display: inline-block;
    }
    .urlLink {
      color: #fc9153;
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
    .cell-red {
      color: #f56c6c;
    }
    .solt-content{
      width: 300px;;
    }
    .btn{
        background: white ;
        color: #fc9153 ;
        position: relative;
        top: -5px;
    }
    .btn:hover{
        background: #fff7f2 ;
      color: #fc9153;
    }
    .ignoreBtn{
        float:right;
        width:100px;
    }
    .editIcon{
      color: #fc9153;
      cursor: pointer;
    }
    el-button--primary.is-disabled, .el-button--primary.is-disabled, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:active {
        color: #c0c4cc;
        cursor: not-allowed;
        background-image: none;
        background-color: #fff;
        border-color: #e2e2e2;
    }
  }
</style>
