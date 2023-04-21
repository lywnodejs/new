<template>
    <div id="itemList">
    <div class="el-main">
      <el-form class="searchForm" label-position="left" label-width="80px" :inline='true'>
        <div class="displayFlex">
          <el-form-item label="Git 路径:" prop="name">
            <el-input class="searchInput"
                      clearable
                      placeholder="请输入Git路径"
                      v-model="queryParam.keywords.git_url"
                      auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="所属部门:" prop="name" style="margin-left: 30px;">
            <app-department class="searchInput" v-model="queryParam.keywords.dept_id"></app-department>
          </el-form-item>
          <el-form-item label="研发负责人:" prop="name" style="margin-left: 30px;">
            <app-employee class="searchInput" v-model="queryParam.keywords.rd"></app-employee>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="安全工程师:" prop="name">
            <sdl-engineer class="searchInput" v-model="queryParam.keywords.sdl_engineer"></sdl-engineer>
          </el-form-item>
          <el-form-item label="任务来源:" prop="name" style="margin-left: 30px;">
              <el-select v-model="queryParam.keywords.source" placeholder="请选择任务来源" class="searchInput" clearable>
                    <el-option label="Odin部署" value="0"></el-option>
                    <el-option label="安全评估" value="1"></el-option>
                    <el-option label="新建任务" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务状态:" prop="name" style="margin-left: 30px;">
              <el-select v-model="queryParam.keywords.status" placeholder="请选择任务状态" class="searchInput" clearable>
                    <el-option v-for="item in taskStatus" :key="item.label" :label="item.label" :value="item.value"></el-option>
                </el-select>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="创建时间:" prop="name">
            <el-date-picker class="searchInput"
              v-model="createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="语言:" prop="name" style="margin-left: 30px;">
             <el-select v-model="queryParam.keywords.language" placeholder="请选择语言" class="searchInput" clearable>
                    <el-option v-for="item in languages" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
          </el-form-item>
        </div>
        <el-row>
          <el-col :span='24'>
            <el-form-item align="center">
              <button type="button" class='vulknowledge-button' @click="fetchData()"><span>搜&nbsp;&nbsp;索</span>
              </button>
            </el-form-item>
              <!-- <button type="button" class='create-task-button' @click="openDialog()"><span>新建任务</span></button> -->
          </el-col>
        </el-row>
      </el-form>


      <div class="cutLine"></div>

      <!-- 展示数据 -->
      <el-table
        :data="otterTaskList"
        v-loading>
        <el-table-column
            prop="otter_task_id"
            label="任务ID"
            width="70"
            align="center">
            <template slot-scope="scope">
              <router-link class="aLink" :to="{ path : '/sdl/otter/task/detail', query: {otter_task_id: scope.row.otter_task_id}}" target=_blank>
                {{scope.row.otter_task_id}}
              </router-link>
            </template>
          </el-table-column>
        <el-table-column
            prop="git_url"
            label="Git路径"
            align="center">
            <template slot-scope="scope">
              <a @click="gitHandle(scope.row.git_url, 'link')">{{gitHandle(scope.row.git_url, 'url')}}</a>
            </template>
          </el-table-column>
          <el-table-column
            label="Commit"
            width="100"
            align="center">
            <template slot-scope="scope">{{scope.row.git_version.substring(0,8)}}
            </template>
          </el-table-column>
          <el-table-column
          label="创建时间"
          align="center"
          width="100">
          <template slot-scope="scope">
            <span>{{scope.row.task_create_time.split(' ')[0]}}<br>{{scope.row.task_create_time.split(' ')[1]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="所属部门名称"
          align="center">
          <template slot-scope="scope">{{scope.row.dept_name}}
          </template>
        </el-table-column>
        <el-table-column
          prop="rd_zh"
          label="研发负责人"
          width="100"
          align="center">
        </el-table-column>
        <app-permission>
          <el-table-column
              label="安全工程师"
              width="100"
              align="center">
              <template slot-scope="scope">
              <span v-if="scope.row.status==2"><button class="claimTaskRD" @click="claimTaskRD(scope.row.otter_task_id)">认领</button></span>
              <span v-else-if="scope.row.sdl_engineer==''&&scope.row.status!=2">{{handleSdlEngineer(scope.row.sdl_engineer)}}</span>
              <a v-else :href="bounceDChat(scope.row.sdl_engineer)">
                  <i class="engineerLogo"><img src="@/assets/D-Chat_logo.svg" alt="" style="width:14px;height:14px;"></i>
                  <span class='engineerName'>{{handleSdlEngineer(scope.row.sdl_engineer)}}</span>
              </a>
              </template>
          </el-table-column>
          <el-table-column
              label="安全工程师"
              width="100"
              align="center">
              <template slot-scope="scope">
              <span v-if="scope.row.sdl_engineer==''">{{handleSdlEngineer(scope.row.sdl_engineer)}}</span>
              <a v-else :href="bounceDChat(scope.row.sdl_engineer)">
                  <i class="engineerLogo"><img src="@/assets/D-Chat_logo.svg" alt="" style="width:14px;height:14px;"></i>
                  <span class='engineerName'>{{handleSdlEngineer(scope.row.sdl_engineer)}}</span>
              </a>
              </template>
          </el-table-column>
        </app-permission>
        <el-table-column
            label="任务状态"
            width="110"
            align="center">
            <template slot-scope="scope">
              <el-tag :type='judgeStatus(scope.row.status)' :class="scope.row.status==0||scope.row.status==1?'blue':''">{{scope.row.status_info}}</el-tag>
            </template>
          </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="80">
          <template slot-scope="scope">
            <router-link style="color:#FC9153" :to="{ path : '/sdl/otter/task/detail', query: {otter_task_id: scope.row.otter_task_id}}" target=_blank>
              <span v-show="scope.row.status==3||scope.row.status==2">结果审计</span>
              <span v-show="scope.row.status==4">查看</span>
            </router-link>
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
    </div>
    <create-task-dialog :visible='dialogVisible' @dialog='getDialog'></create-task-dialog>

    </div>
</template>
<script>
import {connect} from '@/lib'
import * as CONSTANTS from '@/commons/otter'
import appDepartment from '../components/department'
import sdlEngineer from '../components/sdlEngineer'
import createTaskDialog from './components/creatTaskDialog'

  export default connect(() => {
    return {
      otterTaskList: 'otter/otterTaskList',
      num: 'otter/otterTaskListLength'
    }
  }, {
    getOtterTaskList: 'otter/getOtterTaskList',
    claimTask: 'otter/claimTask'
  })({
    data() {
        return {
            createTime: [],
            detectionTime: [],
            taskStatus: CONSTANTS.status,
            languages: CONSTANTS.language,
            queryParam: {
              page: 1,
              limit: 10,
              keywords: {
                  create_begin_time: '',
                  create_end_time: '',
                  git_url: '',
                  dept_id: '',
                  rd: '',
                  sdl_engineer: '',
                  status: '',
                  source: '',
                  language: ''
                }
            },
            dialogVisible: false
        }
    },
    components: { appDepartment, sdlEngineer, createTaskDialog },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {

        if (this.createTime) {
          this.queryParam.keywords.create_begin_time = this.createTime[0]
          this.queryParam.keywords.create_end_time = this.createTime[1]
        } else {
          this.queryParam.keywords.create_begin_time = ''
          this.queryParam.keywords.create_end_time = ''
        }
        if (!this.queryParam.keywords.dept_id) {
            this.queryParam.keywords.dept_id = 0
        }
        this.getOtterTaskList(this.queryParam).then(response => {
          if (this.queryParam.keywords.dept_id == 0) {
            this.queryParam.keywords.dept_id = ''
          }
        })
      },
      claimTaskRD(id) {
        let params = {otter_task_id: id}
        this.claimTask(params).then(res => {
          this.fetchData()
        })
      },
      openDialog() {
        this.dialogVisible = true
      },
      getDialog(val) {
            this.dialogVisible = val
      },
      gitHandle(url, name) {
        let arr = url.split(':')
        if (name == 'url') {
          return arr[1]
        }
        if (name == 'link') {
          let myUrl = 'https://git.xiaojukeji.com/' + arr[1]
          window.open(myUrl)
        }
      },
      judgeStatus(status) {
        if (status >= 5) {
          return 'info'
        }
        if (status == 4) {
          return 'success'
        }
        if (status == 3) {
          return 'warning'
        }
        if (status == 2) {
          return 'danger'
        }
        if (status == 0 || status == 1) {
          return ''
        }
      },
      handleSdlEngineer(sdlDngineer) {
        if (!sdlDngineer) {
          sdlDngineer = '未指定'
        } else {
          for (let i = 0; i < CONSTANTS.engineer.length; i++) {
            if (sdlDngineer == CONSTANTS.engineer[i].value) {
              sdlDngineer = CONSTANTS.engineer[i].label
            }
          }
        }
        return sdlDngineer
      },
      bounceDChat(sdlDngineer) {
        let url = 'dchat://im/start_conversation?name='
        for (let i = 0; i < CONSTANTS.engineer.length; i++) {
          if (sdlDngineer == CONSTANTS.engineer[i].value) {
            url = url + CONSTANTS.engineer[i].value
          }
        }
        return url
      },
        handleSizeChange(val) {
            this.queryParam.limit = val
            this.fetchData()
        },
        handleCurrentChange(val) {
            this.queryParam.page = val
            this.fetchData()
        }
    }
})
</script>
<style lang="less">
  #itemList {
        margin: auto;
        width: 100%;
        height: 100%;
        background: white;
        // margin-top: -15px;
        box-sizing: border-box;
        .el-main {
            width: 100%;
            box-sizing: border-box;
            background: white;
            .displayFlex {
                display: flex;
            }
            .searchForm {
                .searchInput {
                width: 230px;
                }
            }
            .el-tag{
                height: 25px;
                line-height: 25px;
            }
            .blue{
                background-color: rgba(64,158,255,.1);
                color: #409eff;
                border: 1px solid rgba(64,158,255,.2);
            }
            .claimTaskRD{
              cursor: pointer;
              color: white;
              background: #FC9153;
              border: none;
              // font-weight: 100;
              font-size: 10px;
              border-radius: 5px;
              width: 60px;
              height: 25px;
            }
            .claimTaskRD:hover{
              background: orange;
            }
        }
        .aLink{
            color: #FC9153;
            cursor: pointer;
        }
        .engineerName {
            line-height: 20px;
        }

        .engineerLogo {
            position: relative;
            top: 2px;
        }
    }
  .vulknowledge-btn {
    border: 1px solid #FC9153;
    border-radius: 4px;
    width: 110px;
    height: 36px;
    color: #FC9153;
    background: white;
    margin-left: 25px;
    cursor: pointer;
    // font-weight: 100;
    line-height: 33px;
    span {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      // font-weight: 100;
    }
  }

  .vulknowledge-btn:hover {
    background-color: #fff3e8;
  }

  .vulknowledge-button {
    background: #FC9153;
    border-radius: 4px;
    width: 95px;
    height: 32px;
    border: none;
    color: white;
    margin-top: 5px;
    margin-left: 80px;
    font-size: 13px;
    -webkit-font-smoothing: antialiased;
    cursor: pointer;
    span {
      font-family: Avenir, Helvetica, Arial, sans-serif;
    }
  }
  .create-task-button{
    border: 1px solid #FC9153;
    border-radius: 4px;
    width: 95px;
    height: 32px;
    color: #FC9153;
    margin-top: 5px;
    background: white;
    cursor: pointer;
    // font-weight: 100;
    font-size: 13px;
    float: right;
    span {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      // font-weight: 100;
    }
  }
  .create-task-button:hover {
    background-color: #fff3e8;
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

  .vulEvalu-button {
    width: 90px;
    // font-weight: 100;
  }

  .vulEvalu-btn {
    background: #FC9153;
    border-radius: 4px;
    height: 36px;
    width: 90px;
    padding: 5px;
    border: none;
    // font-weight: 100;
    margin-right: 12px;
  }

</style>
