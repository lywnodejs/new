<template>
    <el-dialog title="查看问题列表" 
            id="problemList-dialog" 
            :visible.sync="checkDialogVisible" 
            width="1200px">
            <!-- problemList-查看问题列表 -->
            <app-permission>
              <div class="global_result" style="float:right">
                修改所有结果：<el-select
                  :disabled="currentStatus==107 && permission==1"
                  v-model="globalStatus"
                            class="selectInput"
                            type="text"
                            placeholder="请选择规则状态"
                            size="mini"
                            @change="changeGlobalSelect(globalStatus)">
                    <el-option v-for="(item,index) in issueStatus1"
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
            </div>
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
            label="git地址">
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
            label="添加备注"
            width="150">
            <template slot-scope="scope">
              {{ scope.row.rd_remark }}
              <br><a style="color:#fc9153" @click="open(scope.row.id, scope.row.rd_remark)">修改/添加</a>
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
            label="结果确认"
            width="170"
            align="center">
            <template slot-scope="scope">
              <el-select
              :disabled="currentStatus==107 && permission==1"
              v-bind="scope.row.issue_status==3?scope.row.issue_status='确认误报':scope.row.issue_status"
              v-model="scope.row.issue_status"
                        class="selectInput"
                        type="text"
                        placeholder="请选择规则状态"
                        size="mini"
                        @change="changeSelect(scope.row.id, scope.row.issue_status, scope.row.rd_remark)">
                <el-option v-for="(item,index) in issueStatus1"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button class="probList-button" @click="updateList()">取消</el-button>
        <el-button class="probList-btn" type="warning" round @click="submitStatus()">提交状态</el-button>
      </div>
    </el-dialog>
</template>

<script>
import * as CONSTANTS from '@/commons/dorado'
import { connect } from '@/lib'

export default connect(() => {
  return {
      permission: 'permission/permission'
  }
}, {
    updateIssueStatus: 'problem_list/updateIssueStatus',
    rdmarkIssue: 'problem_list/rdmarkIssue',
    getOutputTaskId: 'problem_list/getOutputTaskId'
})({
  props: ['dialogVisible', 'data', 'currentStatus'],
  data() {
    return {
      checkDialogVisible: null,
      problemTableData: this.data,
      round: 0,
      issueStatus: CONSTANTS.issueStatus,
      issueStatus1: CONSTANTS.issueStatus1,
      issueStatusSubmitList: [],
      remark: '',
      globalStatus: -1
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    dialogVisible(val) {
        this.checkDialogVisible = val
    },
    checkDialogVisible(val) {
        this.$emit('problemListDialog', this.checkDialogVisible)
    },
    data(val) {
        this.problemTableData = val
        this.issueStatusSubmitList = val
    },
    problemTableData(val) {
    }
  },
  methods: {
    updateList() {
      this.checkDialogVisible = false
      this.$parent.selectRound()
    },
    changeGlobalSelect(globalStatus) {
      for (let i = 0; i < this.issueStatusSubmitList.length; i++) {
        this.issueStatusSubmitList[i].issue_status = globalStatus
      }
    },
    changeSelect(id, status, remark) {

      // if (status === 2) {
      //   this.open(id, remark)
      // }
      for (let i = 0; i < this.issueStatusSubmitList.length; i++) {
        if (id == this.issueStatusSubmitList[i].id) {
          this.issueStatusSubmitList[i].issue_status = status
        }
      }
    },
    async submitStatus() {
      let arr = []
      for (let i = 0; i < this.issueStatusSubmitList.length; i++) {
        let obj = {
          issue_primary_id: this.issueStatusSubmitList[i].id,
          issue_status: this.issueStatusSubmitList[i].issue_status
        }

        if (this.issueStatusSubmitList[i].issue_status === 2 && this.issueStatusSubmitList[i].rd_remark === '') {

          // this.$message({
          //   message: '提交前请在添加备注一栏填写误报原因，且误报原因不能为空',
          //   type: 'warning'
          // });
          this.open(this.issueStatusSubmitList[i].id, this.remark)
          return
        }
        arr.push(obj)
      }
      let queryParam = {
        issue_details: arr
      }
      this.updateIssueStatus(queryParam).then(res => {
        this.checkDialogVisible = false
        this.$parent.selectRound()
      })
    },
    rdmark(id, remark) {
      let param = {
        issue_primary_id: id,
        rd_remark: remark
      }
      this.rdmarkIssue(param).then(res => {
        for (let i = 0; i < this.problemTableData.length; i++) {
            if (this.problemTableData[i].id == res.id) {
                this.problemTableData[i].rd_remark = param.rd_remark
                this.$set(this.problemTableData[i], 'rd_remark', param.rd_remark)
            }
        }
        this.$parent.selectRound()
      })
    },
    handleDetail(data) {
      this.getOutputTaskId({sdl_project_id: data.sdl_project_id, round: data.round, rule_id: data.rule_id}).then(res => {
        console.log(res)
        let url = `http://studio.xiaojukeji.com/s?ref=sdl&repo=${res.git_url.split(':')[1].split('.')[0]}&src=sdl-fatbird&task_id=${res.fatbird_task_id}&vul_id=${res.fatbird_result_id}`
        window.open(url)
      })
    },
    async open(id, remark) {
        await this.$prompt('', '添加备注/误报原因', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: remark,
          inputType: 'textarea',
          customClass: 'remarkBox'
        }).then(({ value }) => {
          if (value.trim() === '') {
            this.$message({
              message: '输入不能为空',
              type: 'warning'
            });
            return
          }
          this.remark = value
          for (let i = 0; i < this.issueStatusSubmitList.length; i++) {
            if (this.issueStatusSubmitList[i].issue_status === 2 && this.issueStatusSubmitList[i].rd_remark === '') {
              this.rdmark(this.issueStatusSubmitList[i].id, value)
            }
          }
        }).catch(() => {
          this.$message({
            message: '输入失败',
            type: 'warning'
          });
        });
    },
    judgeIssueStatus(status) {
      for (let i = 0; i < this.issueStatus.length; i++) {
        if (this.issueStatus[i].value == status) {
          return this.issueStatus[i].label
        }
      }
      return status
    },
    handleDFPath(gitPath, dfPath) {
      let temp = ''
      try {
        temp = gitPath.split(':')[1].split('.')[0]
      } catch (error) {
        temp = ''
      }
      let path = ''
      if (dfPath.indexOf(temp) > 0) {
        path = dfPath.split(temp)[1]
      } else {
        path = dfPath
      }
      return path
    },
    handlePath(path) {
      if (!path) {
        return ''
      }
      let pathArr = path.split('/')
      return pathArr[pathArr.length - 1]
    },
    bounceUrl(gitUrl, gitBranch, dfLine, dfPath) {

      //  当前直接把dfpath拼接到下面url中
      // let handledDFPath = this.handleDFPath(gitUrl, dfPath)
      let url = ''
      try {
        url = 'https://git.xiaojukeji.com/' +
          gitUrl.split(':')[1].split('.')[0] +
          '/blob/' +
          gitBranch + '/' +
          dfPath +
          '#L' +
          dfLine
      } catch (error) {
        url = ''
      }

      // url = 'https://git.xiaojukeji.com/SDL/sdl-platform/blob/master/app/services/ocean/ocean_global_service.py#L10'
      window.open(url)
    },
    bouncePath(path) {
      window.open(path)
    }
  }
})
</script>
<style lang="less">
#problemList-dialog{
  .global_result{
    float: right;
    margin-bottom: 10px;
    margin-right: 36px;
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
    .urlLink {
      color: #fc9153;
    }
    .probList-button {
      font-size: 13px;
      height: 32px;
      width: 95px;
      padding: 0px;
    }
    .probList-btn {
      background: #fc9153;
      border-radius: 4px;
      font-size: 13px;
      height: 32px;
      width: 95px;
      padding: 0px;
      border: none;
    }
    .selectInput {
      width: 100px;
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
.remarkBox{
    .el-message-box__content {
        position: relative;
        padding: 0px 20px !important;
        color: #606266;
        font-size: 13px;
    }
    textarea{
        min-height: 80px !important;
    }
}

</style>