<template>
  <div id="ratel-project-task-list">
    <el-table
        :data="data"
        v-loading>
             <el-table-column
                label="任务ID"
                width="70"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.ratel_task_id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="应用名称"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.app_release_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="应用标识"
                width="180"
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
                    <i class="engineerLogo"><img src='@/assets/D-Chat_logo.svg' alt="" style="width:14px;height:14px;"></i>
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
export default connect(() => {
    return {
    }
    }, {
        getTaskListByTaskId: 'ratel_project/getTaskListByTaskId',
        taskClaim: 'ratel_project/taskClaim'
    })({
    data() {
      return {
        value: '',
        data: [],
        queryParam: {
            ratel_project_id: parseInt(this.$route.query.ratel_project_id),
            page: 1,
            limit: 10
        },
        sdlAuditStatus: [{label: '未审计', value: 0}, {label: '漏洞', value: 2}, {label: '误报', value: 5}, {label: '忽略', value: 7}],
        num: 0,
        ratelTaskStatus: CONSTANTS.ratelTaskStatus
      }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            this.getTaskListByTaskId(this.queryParam).then(res => {
                this.num = res.count
                this.data = res.ratel_task_list
            })
        },
        claim(id) {
          this.taskClaim({ratel_task_id: id}).then(res => {
            this.fetchData()
          })
        },
        changeSelect(id, status) {
            let params = {
                ratel_result_id: id,
                sdl_audit_status: status
            }
            this.resultSDLMark(params).then(res => {
                console.log(res)
            })
        },
        judgeVulLevel(id) {
            for (let i = 0; i < CONSTANTS.vulLevel.length; i++) {
                if (CONSTANTS.vulLevel[i].value === id) {
                    return CONSTANTS.vulLevel[i].label
                }
            }
        },
        judgeAuditStatus(status) {
            for (let i = 0; i < this.sdlAuditStatus.length; i++) {
                if (this.sdlAuditStatus.vulLevel[i].value === status) {
                    return this.sdlAuditStatus.vulLevel[i].label
                }
            }
        },
        handleSizeChange(val) {
            this.queryParam.limit = val
            this.fetchData()
        },
        handleCurrentChange(val) {
            this.queryParam.page = val
            this.fetchData()
        },
        bounceDChat(sdlDngineer) {

            // let url = 'dingtalk://dingtalkclient/action/sendmsg?dingtalk_id='
            let url = 'dchat://im/start_conversation?name='
            url = url + sdlDngineer
            return url
        },

        // judgeStatus(status) {
        //     for (let i = 0; i < this.ratelTaskStatus.length; i++) {
        //         if (this.ratelTaskStatus[i].value === status) {
        //             return this.ratelTaskStatus[i].label
        //         }
        //     }
        // },
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
  #ratel-project-task-list {
    margin: auto;
    width: 100%;
    height: 100%;
    background: white;
    // margin-top: -40px;
    box-sizing: border-box;
    .forward {
      padding-top: 10px;
      // margin-top: 30px;
      text-align: center;
      font-size: 20px;
    }
    .need {
      text-align: center;
      font-size: 15px;
      padding-top: 10px;
      margin-bottom: 20px;
    }
    .engineerName {
        line-height: 20px;
        color: #FC9153;
    }
    .el-tag {
        display: inline-block;
        padding: 0 10px;
        -webkit-font-smoothing: antialiased;
        height: 32px;
        line-height: 30px;
        font-size: 12px;
        border-radius: 4px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        white-space: nowrap;
    }
    .engineerLogo {
        position: relative;
        top: 2px;
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

