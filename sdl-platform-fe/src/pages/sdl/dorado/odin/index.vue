<template>
  <div id="odinModel">
    <div class="odinModel">
    <el-form class="searchForm" label-position="left" :inline='true' label-width="80px">
      <div class="displayFlex">
        <el-form-item label="Odin模块名:" prop="name">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.module_name"
                    clearable
                    placeholder="请输入Odin模块名"
                    auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="发起人:" prop="name" style="margin-left: 30px;">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.creator"
                    clearable
                    placeholder="请输入发起人"
                    auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="SDL项目ID:" prop="date" style="margin-left: 30px;">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.sdl_project_id"
                    clearable
                    placeholder="请输入SDL项目ID"
                    auto-complete="off">
          </el-input>
        </el-form-item>
      </div>
      <div class="displayFlex">
        <el-form-item label="Odin流程ID:" prop="date">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.odin_workflow_id"
                    clearable
                    placeholder="请输入Odin流程ID"
                    auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="审批状态:" prop="name" style="margin-left: 30px;">
          <a-slect class="searchInput" v-model="queryParam.keywords.status" :selectData='selectodinStatus'></a-slect>
        </el-form-item>
        <el-form-item label="安全BP:" prop="name" style="margin-left: 30px;">
          <a-slect class="searchInput" v-model="queryParam.keywords.safe_approver" :selectData='selectSafeApprover'></a-slect>
        </el-form-item>
      </div>

      <el-row>
        <el-col :span='24'>
          <el-form-item align="center">
            <button type="button" class='dorado-btn' @click="searchOdin"><span>搜&nbsp;索</span></button>
          </el-form-item>
          <button @click="syncOdin" type="button" class="odinBtn">一键同步</button>
        </el-col>
        
      </el-row>
    </el-form>
    
    <div class="cutLine"></div>

    <el-table
      :data="tableData"
      v-loading>
      <el-table-column
        width="100"
        sortable
        label="Odin ID"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.odin_workflow_id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="module_name"
        label="Odin模块名"
        sortable
        align="center">
         <template slot-scope="scope">
          <span  @click="detail(scope.row)" class="opera">{{scope.row.module_name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="creator"
        label="发起人"
        sortable
        width="120"
        align="center">
      </el-table-column>
      <el-table-column
        label="审批状态"
        width="110"
        sortable
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="110"
        label="提交时间"
        sortable
        align="center">
        <template slot-scope="scope">
          <span v-html="timeOper(scope.row.create_time)"></span>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        label="安全BP"
        sortable
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.safe_approver}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        prop="sdl_project_id"
        label="SDL项目ID"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        align="center">
        <template slot-scope="scope">
          <span class="opera" @click="openSerDialog(scope.row.odin_workflow_id)">审批 |</span>
          <span class="opera" @click="openDialog(scope.row.odin_workflow_id, scope.row.sdl_project_id)">绑定 |</span>
          <span class="opera" @click="odinNotify(scope.row)">通知({{scope.row.notify_count}})</span>
        </template>
      </el-table-column>
    </el-table>
    <div align="right" style="margin-top: 10px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParam.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="queryParam.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="num">
      </el-pagination>
    </div>

    <!-- 项目绑定 -->
    <el-dialog title="项目绑定" :visible.sync="dialogFormVisible" width="460px">
      <el-form label-width="120px" label-position="left" v-model="bindParam">
        <el-form-item label="选择SDL项目ID">
          <bind-slect v-if="prebindOdinData" v-show="prebindOdinData" v-model="bindParam.sdl_project_id" :prebindOdinList='prebindOdinList'></bind-slect>
        </el-form-item>
        <!-- <el-form-item label="SDL项目ID">
          <el-input :disabled='selected'
            v-model="bindParam.sdl_project_id"
            placeholder="请输入SDL项目ID"
            clearable>
          </el-input>
        </el-form-item> -->
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="codeResult-button" @click="dialogFormVisible = false">取消</el-button>
        <el-button class="codeResult-btn" type="warning" round @click="submit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 安全审批 -->
    <el-dialog title="安全审批" :visible.sync="dialogVisible" width="460px">
      <el-form label-width="120px" label-position="left" v-model="serParam">
        <el-form-item label="请选择审批意见">
        <el-radio-group v-model="action" size="medium">
          <el-radio class="inputWidth" label="通过"></el-radio>
          <el-radio class="inputWidth" label="拒绝"></el-radio>
          <!-- <el-radio class="label" v-model="task.exec_type" label=1>
          通过
          </el-radio>
          <el-radio class="label" v-model="task.exec_type" label=1>
          拒绝
          </el-radio> -->
        </el-radio-group>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="codeResult-button" @click="dialogVisible = false">取消</el-button>
        <el-button class="codeResult-btn" type="warning" round @click="securityApprove()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 详细信息 -->
    <el-dialog title="安全审批" :visible.sync="odinDetailVisible" width="80%">
       <el-table
        :data="odinDetail"
        :show-header='false'
        v-loading
        border>
        <el-table-column
          prop="label_1"
          align="left"
          min-width="10%">
        </el-table-column>
        <el-table-column
          label="值"
          align="left"
          min-width="40%">
          <template slot-scope="scope">
            <span>{{scope.row.value_1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="label_2"
          align="left"
          min-width="10%">
        </el-table-column>
        <el-table-column
          label="值"
          align="left"
          min-width="40%">
          <template slot-scope="scope">
            <span>{{scope.row.value_2}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button class="codeResult-button" @click="odinDetailVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
  </div>
  
</template>

<script>
  import {connect} from '@/lib'
  import ajax from '@/plugin/ajax'
  import * as API from '@/commons/api/dorado'
  import * as CONSTANTS from '@/commons/dorado'
  import aSlect from './compoments/index'
  import bindSlect from './compoments/bindSelect'

  export default connect(() => {
    return {
      user: 'user/user'
    }
  }, {
  })({
    name: 'project-list',

    data() {
      return {
        tableData: [],
        dialogFormVisible: false,
        dialogVisible: false,
        odinDetailVisible: false,
        num: 0,
        odinDetail: [],
        selectodinStatus: CONSTANTS.odinStatus,
        selectSafeApprover: CONSTANTS.safeApprover,
        queryParam: {
          page: 1,
          limit: 10,
          keywords: {
            module_name: '',
            creator: '',
            sdl_project_id: '',
            safe_approver: '',
            status: '',
            odin_workflow_id: ''
          }
        },
        bindParam: {
          odin_workflow_id: 0,
          sdl_project_id: ''
        },
        prebindOdinList: [],
        prebindOdinData: false,
        action: '通过',
        serParam: {
          odin_workflow_id: 0,
          action: ''
        }
      }
    },
    components: { aSlect, bindSlect },
    created() {
      this.queryParam.keywords.status = 'SafeApproving'
      this.queryParam.keywords.safe_approver = this.user.username
      this.fetchData(this.queryParam)
    },
    computed: {
    },
    methods: {
      fetchData(queryParam) {
        if (queryParam.odin_workflow_id != '') {
          queryParam.odin_workflow_id = parseInt(queryParam.odin_workflow_id)
        }
        let postJson = {
          queryParam: queryParam
        }
        ajax.post(API.getOdinList, postJson).then(response => {
          const data = response.data
          this.tableData = data.data_list
          this.num = data.count
          for (let i = 0; i < this.tableData.length; i++) {
            for (let j = 0; j < this.selectodinStatus.length; j++) {
              if (this.tableData[i].status == this.selectodinStatus[j].value) {
                this.tableData[i].status = this.selectodinStatus[j].label
                continue
              }
            }
          }
        })
      },
      searchOdin() {
        this.fetchData(this.queryParam)
      },
      timeOper(time) {
        let arr = time.split(' ')
        return `${arr[0]}<br>${arr[1]}`
      },
      handleSizeChange(val) {
        this.queryParam.limit = val
        this.fetchData(this.queryParam)
      },
      handleCurrentChange(val) {
        this.queryParam.page = val
        this.fetchData(this.queryParam)
      },
      securityApprove() {
        if (this.action == '通过') {
          this.serParam.action = 'pass'
        } else {
          this.serParam.action = 'notpass'
        }
        ajax.post(API.securityApprove, this.serParam).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '成功',
              message: errmsg,
              type: 'success'
            })
            this.fetchData(this.queryParam)
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
        })
        this.dialogVisible = false
      },
      openDialog(odinWorkflowId, sdlId) {
        this.prebindOdinData = false
        this.prebindOdinData = true
        this.bindParam.sdl_project_id = sdlId
        this.bindParam.odin_workflow_id = odinWorkflowId
        let postJson = {
          odin_workflow_id: odinWorkflowId
        }
        ajax.post(API.prebindOdin, postJson).then(response => {
          const errno = response.errno
          const data = response.data
          if (errno === 0) {
              this.prebindOdinList = data.sdl_project_list

              // console.log(this.prebindOdinList)
          } else {
            this.prebindOdinData = false
          }
          this.dialogFormVisible = true
        })
      },
      openSerDialog(odinWorkflowId) {
        this.serParam.odin_workflow_id = odinWorkflowId
        this.dialogVisible = true
      },
      submit() {
        if (this.bindParam.sdl_project_id != '') {
          this.bindParam.sdl_project_id = parseInt(this.bindParam.sdl_project_id)
          if (isNaN(this.bindParam.sdl_project_id)) {
            this.bindParam.sdl_project_id = ''
            return this.$notify({
              title: '绑定项目失败',
              message: '请输入项目ID',
              type: 'error'
            })
          }
        }
        let postJson = {
          bind_param: this.bindParam
        }
        ajax.post(API.bindOdinProject, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '成功',
              message: errmsg,
              type: 'success'
            })
            this.fetchData(this.queryParam)
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.dialogFormVisible = false
        })
      },
      odinNotify(data) {
        let postJson = {
          om_id: data.om_id
        }
        ajax.post(API.odinNotify, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '成功',
              message: errmsg,
              type: 'success'
            })
            this.fetchData(this.queryParam)
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
        })
      },
      detail(data) {
        this.odinDetail = [
          {label_1: '主键ID', value_1: data.om_id, label_2: 'Odin流程ID', value_2: data.odin_workflow_id},
          {label_1: 'SDL项目ID', value_1: data.sdl_project_id, label_2: '工单状态', value_2: data.status},
          {label_1: '模块名称', value_1: data.module_name, label_2: '模块级别', value_2: data.module_level},
          {label_1: '模块节点', value_1: data.odin_ns, label_2: '模块描述', value_2: data.module_comment},
          {label_1: '工单创建者', value_1: data.creator, label_2: '创建者部门', value_2: data.department},
          {label_1: '研发接口人', value_1: data.rd_owner, label_2: '研发上级', value_2: data.rd_senior},
          {label_1: '安全审批人', value_1: data.safe_approver, label_2: '是否外网', value_2: data.is_external},
          {label_1: '域名', value_1: data.domain_name, label_2: '主要开发语言', value_2: data.language},
          {label_1: 'git仓库', value_1: data.git_url, label_2: '相对路径', value_2: data.git_relative_path},
          {label_1: '代码分支', value_1: data.git_branch, label_2: 'wiki链接', value_2: data.framework_wiki},
          {label_1: '创建时间', value_1: data.create_time, label_2: '更新时间', value_2: data.update_time}
        ]
        this.odinDetailVisible = true
      },
      syncOdin() {
        ajax.post(API.syncOdin).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '成功',
              message: errmsg,
              type: 'success'
            })
            this.fetchData(this.queryParam)
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
        })
      }

      // prebindOdin(id) {
      // }
    }
  })
</script>

<style lang='less'>
#odinModel{
 .dorado-btn {
    background: #fc9153;
    border-radius: 4px;
    width: 95px;
    height: 32px;
    border: none;
    color: white;
    margin-left: 80px;
    margin-top: 5px;
    cursor: pointer;
    font-size: 13px;
    -webkit-font-smoothing: antialiased;
    span {
      font-family: Avenir, Helvetica, Arial, sans-serif;
    }
  }

  .odinModel {
    width: 100%;
    box-sizing: border-box;
    background: white;
    // margin-top: -15px;
    // padding: 20px;
    .displayFlex {
      display: flex;
    }
    .searchForm {
      .searchInput {
        width: 230px;
      }
    }
  }


  .cutLine {
    // border: 1px solid
    margin-top: 5px;
    margin-bottom: 17px;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0.10);
    // background: rgba(0, 0, 0, 0.10);
    // border-radius: 4px;
  }

  .codeResult-button {
    width: 90px;
    height: 32px;
    font-size: 13px;
    padding: 0;
    // font-weight: 100;
  }

  .codeResult-btn {
    background: #fc9153;
    border-radius: 4px;
    height: 32px;
    font-size: 13px;
    width: 90px;
    padding: 0px;
    border: none;
    // font-weight: 100;
  }
  .odinBtn{
    margin-top: 4px;
    background: white;
    height: 32px;
    line-height: 31px;
    width: 100px;
    border-radius: 4px;
    padding: 0px;
    border: 1px solid #FC9153;
    color: #fc9153;
    margin-bottom: 10px;
    float: right;
    font-size: 13px;
    -webkit-font-smoothing: antialiased;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    // font-weight: 400;

    cursor: pointer;
  }
  .odinBtn:hover{
    background: #fff7f2;
  }
  .opera {
    color: #FC9153;
    cursor: pointer;
    // display: inline-block;
    // margin-left: 5px;
  }
  .serDetail{
    padding-right: 20px;
    line-height: 26px;
    .mySpan{
      width: 100px;
      display: inline-block;
    }
  }
  .el-radio__inner{
    // border: none;
    // background: none;
    // display: inline;
  }
  .inputWidth{
    width: 50px;
    text-align: center;
    // margin-right: 10px;
  }
  /*清除浮动代码*/
  .clearfloat:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .clearfloat {
    zoom: 1;
  }
  
}
 
</style>
