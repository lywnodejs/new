<template>
  <div id="ratel-task">
      <el-form class="searchForm" label-position="left" label-width="80px" :inline='true'>
      <div class="displayFlex">

          <el-form-item label="应用标识:" class="searchFormItem">
            <el-input class="searchInput"
                        v-model="queryParam.keywords.app_package_name"
                        clearable
                        placeholder="请输入APP检测包名"
                        auto-complete="off">
            </el-input>
          </el-form-item>
        <el-form-item label="部门:" style="margin-left: 20px;">
            <app-department class="searchInput" v-model="queryParam.keywords.dept_id"></app-department>
        </el-form-item>
        <el-form-item label="发版工程师:" style="margin-left: 20px;">
          <app-employee class="searchInput" v-model="queryParam.keywords.rd"></app-employee>
        </el-form-item>
      </div>
      <div class="displayFlex">
          <el-form-item label="安全工程师:">
            <el-input class="searchInput"
                        v-model="queryParam.keywords.sdl_engineer"
                        clearable
                        placeholder="请输入SDL工程师"
                        auto-complete="off">
            </el-input>
          </el-form-item>

        <el-form-item label="创建时间" label-width="80px"  style="margin-left: 20px;">
                <el-date-picker class="searchInput"
                  @change="changeTime(time)"
                    v-model="time"
                    type="daterange"
                    align="right"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
          </el-form-item>

        <el-form-item label="静态状态:" style="margin-left: 20px;">
          <el-select class="searchInput"
                     v-model="queryParam.keywords.static_status"
                     clearable
                     placeholder="请选择任务状态">
            <el-option
              v-for="item in ratelTaskStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
        <div class="displayFlex">
          <el-form-item label="动态状态:">
            <el-select class="searchInput"
                       v-model="queryParam.keywords.dynamic_status"
                       clearable
                       placeholder="请选择任务状态">
              <el-option
                v-for="item in ratelTaskStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>

      <el-row>
        <el-col :span='24'>
          <el-form-item align="center">
            <button type="button" class='ratel-button' @click="fetchData"><span>搜&nbsp;索</span></button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="cutLine"></div>

    <el-table
        :data="data"
        v-loading>
            <el-table-column
                label="任务ID"
                width="60"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.ratel_task_id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="应用名称"
                align="center">
                <template slot-scope="scope">
                  <div class="flexbox">
                    <img class="appIcon" :src="scope.row.icon_link" alt="">&nbsp;
                    <span>{{scope.row.app_release_name}}</span>
                  </div>
                <!-- <span>{{scope.row.app_release_name}}</span> -->
                </template>
            </el-table-column>
            <el-table-column
                label="应用标识"
                width="170"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.app_package_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="类型"
                width="50"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.app_type}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column
                label="发版工程师"
                width="100"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.rd_zh}}</span>
                </template>
            </el-table-column> -->
            <el-table-column
                label="发版工程师"
                width="90"
                align="center">
                <template slot-scope="scope">
                <span v-if="scope.row.rd==''"></span>
                <a v-else :href="bounceDChat(scope.row.rd)">
                    <i class="engineerLogo"><img src='../../../../../assets/D-Chat_logo.svg' alt="" style="width:14px;height:14px;"></i>
                    <span class='engineerName'>{{scope.row.rd_zh}}</span>
                </a>
                </template>
            </el-table-column>
            <el-table-column
                label="部门"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.dept_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="创建时间"
                width="100"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.task_create_time.split(' ')[0]}}<br>{{scope.row.task_create_time.split(' ')[1]}}</span>
                </template>
            </el-table-column>
            <el-table-column
              label="安全工程师"
              width="90"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.static_status===2 || scope.row.dynamic_status ===2"><button class="claimTaskRD" @click="claim(scope.row.ratel_task_id)">认领</button></span>
                <span v-else-if="scope.row.sdl_engineer=='' && (scope.row.static_status!==2 || scope.row.dynamic_status !==2)">{{handleSdlEngineer(scope.row.sdl_engineer)}}</span>
                <a v-else :href="bounceDChat(scope.row.sdl_engineer)">
                  <i class="engineerLogo"><img src="@/assets/D-Chat_logo.svg" alt="" style="width:14px;height:14px;"></i>
                  <span class='engineerName'>{{handleSdlEngineer(scope.row.sdl_engineer)}}</span>
                </a>
              </template>
            </el-table-column>
            <el-table-column
              label="静态状态"
              width="90"
              align="center">
              <template slot-scope="scope">
                <span><el-tag :type='judgeStatusTag(scope.row.static_status)'>{{scope.row.static_status_info}}</el-tag></span>
              </template>
            </el-table-column>
            <el-table-column
              label="动态状态"
              width="90"
              align="center">
              <template slot-scope="scope">
                <span><el-tag :type='judgeStatusTag(scope.row.dynamic_status)'>{{ scope.row.dynamic_status_info }}</el-tag></span>
              </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="70"
                align="center">
                <template slot-scope="scope">
                    <router-link style="color:#FC9153" :to="{ path : '/sdl/ratel/release/task/detail', query: {ratel_task_id: scope.row.ratel_task_id}}" target=_blank>
                    详情
                    </router-link>
                <!-- <span class="opera" @click="openDialog(scope.row.ratel_project_id)">查看详情</span> -->
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
</template>
<script>
import {connect} from '@/lib'
import * as CONSTANTS from '@/commons/ratel'
import appDepartment from '../components/department'
export default connect(() => {
    return {
    }
    }, {
        getRatelTaskList: 'ratel_project/getRatelTaskList',
        taskClaim: 'ratel_project/taskClaim'
    })({
    data() {
      return {
        data: [],
        time: '',
        queryParam: {
            keywords: {
                create_begin_time: null,
                create_end_time: '',
                app_package_name: '',
                dept_id: null,
                sdl_engineer: '',
                dynamic_status: '',
                static_status: '',
                rd: ''
            },
            page: 1,
            limit: 10
        },
        num: 0,
        ratelTaskStatus: CONSTANTS.ratelTaskStatus
      }
    },
    created() {
        this.fetchData()
    },
    components: {appDepartment},
    methods: {
        fetchData() {
            this.getRatelTaskList(this.queryParam).then(res => {
                console.log(res)
                this.num = res.count
                this.data = res.ratel_task_list
            })
        },
        handleSizeChange(val) {
            this.queryParam.limit = val
            this.fetchData()
        },
        handleCurrentChange(val) {
            this.queryParam.page = val
            this.fetchData()
        },
        changeTime(time) {
            this.queryParam.keywords.create_begin_time = time[0]
            this.queryParam.keywords.create_end_time = time[1]
        },
        bounceDChat(sdlDngineer) {

            // let url = 'dingtalk://dingtalkclient/action/sendmsg?dingtalk_id='
            let url = 'dchat://im/start_conversation?name='
            url = url + sdlDngineer
            return url
        },
        judgeStatus(status) {
            for (let i = 0; i < this.ratelTaskStatus.length; i++) {
                if (this.ratelTaskStatus[i].value === status) {
                    return this.ratelTaskStatus[i].label
                }
            }
        },
        judgeStatusTag(status) {
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
        claim(id) {
          this.taskClaim({ratel_task_id: id}).then(res => {
            this.fetchData()
          })
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
        }
    }
  })
</script>
<style lang="less">
  #ratel-task {
    margin: auto;
    width: 100%;
    height: 100%;
    background: white;
    // margin-top: -40px;
    box-sizing: border-box;
    .displayFlex {
      display: flex;
      // width: 1240px;
    }
    .searchForm {
      .searchFormItem{
        width: 310px;
        .searchInput {
          width: 230px;
        }
      }
      .searchInput {
          width: 230px;
      }
    }
    .flexbox {
      display: flex;
      align-items: center;
      justify-content: center;
      .appIcon {
        width: 15px;
        height: 15px;
        border-radius: 3px;
      }
    }
    .ratel-button{
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
    .cutLine {
      // border: 1px solid
      margin-top: 5px;
      margin-bottom: 17px;
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, 0.10);
      // background: rgba(0, 0, 0, 0.10);
      // border-radius: 4px;
    }
    .opera {
        color: #FC9153;
        cursor: pointer;
        // display: inline-block;
        // margin-left: 5px;
    }
    .engineerName {
        line-height: 20px;
        color: #FC9153;
    }

    .engineerLogo {
        position: relative;
        top: 2px;
    }
          .el-tag{
            height: 25px;
            line-height: 25px;
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
</style>

