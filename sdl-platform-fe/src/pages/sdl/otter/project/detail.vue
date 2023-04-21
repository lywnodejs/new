<template>
    <div id="detail">
      <div class="el-main">
        <h4 class="myH4">详细信息</h4>
        <div class="basicContentDisplay">
          <div class="items">
            <span class="c1">项目编号：</span>
            <span class="c2">{{projectTaskList.otter_project_id}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">Git 路径：</span>
            <span class="c2">{{projectTaskList.git_url}}</span>
          </div>
          <div class="items">
            <span class="c1">创建时间：</span>
            <span class="c2">{{projectTaskList.create_time}}</span>
          </div>
          
           <div class="rightItem">
            <span class="c1">代码分支：</span>
            <span class="c2">{{projectTaskList.git_branch}}</span>
          </div>
          <div class="items">
            <span class="c1">最近检测时间：</span>
            <span class="c2">{{projectTaskList.last_check_time}}</span>
          </div>
          <div class="rightItem">
            <span class="c1">相对路径：</span>
            <span class="c2">{{projectTaskList.git_relative_path}}</span>
          </div>
          
          <div class="items">
            <span class="c1">所属部门：</span>
            <span class="c2">{{projectTaskList.dept_name}}</span>
          </div>
          <div class="rightItem">
          </div>
      </div>
      <!-- 任务列表 -->
      <div class="task">
        <h4 class="myH4">检测任务</h4>
        <el-table
          :data="otterTaskList"
          v-loading>
          <el-table-column
            prop="otter_task_id"
            label="任务ID"
            width="80"
            align="center">
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
            prop="git_url"
            label="Git路径"
            align="center">
            <template slot-scope="scope">
              <a class="aLink" @click="gitHandle(scope.row.git_url, 'link')">{{gitHandle(scope.row.git_url, 'url')}}</a>
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
            label="Odin部署ID"
            width="100"
            align="center">
            <template slot-scope="scope">
              <a class='aLink' :href="scope.row.odin_deploy_url" target="_blank">{{scope.row.odin_deploy_id}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="rd_zh"
            label="研发负责人"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column
            prop="sdl_engineer"
            label="安全工程师"
            width="110"
            align="center">
          </el-table-column>
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
            width="120">
            <template slot-scope="scope">
              <el-button type="text">
                <router-link style="color:#FC9153;" :to="{ path : '/sdl/otter/task/detail', query: {otter_task_id: scope.row.otter_task_id}}" target=_blank>
                  <span v-show="scope.row.status==3||scope.row.status==2">结果审计</span>
                  <span v-show="scope.row.status==4">查看</span>
                </router-link>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div align="right" style="margin-top: 10px;">
          <el-pagination
            @size-change="handleSizeChangeTask"
            @current-change="handleCurrentChangeTask"
            :current-page="taskQueryParam.page"
            :page-sizes="[10,20,30, 50]"
            :page-size="taskQueryParam.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="taskNum">
          </el-pagination>
        </div>
      </div>
      
      <div class="task">
        <h4 class="myH4">漏洞列表</h4>
       <el-table
        :data="otterVulList"
        v-loading>
        <el-table-column
          prop="otter_vulnerability_id"
          label="ID"
          align="center"
          width="70">
        </el-table-column>
        <el-table-column
          label="漏洞类型"
          align="center">
          <template slot-scope="scope">{{scope.row.vul_type_id}}
          </template>
        </el-table-column>
        <el-table-column
          prop="dept_name"
          label="部门"
          align="center">
        </el-table-column>
        <el-table-column
            label="漏洞级别"
            align="center"
            width="100">
            <template slot-scope="scope"><span>{{choseVulLevel(scope.row.vul_level_id)}}</span>
            </template>
          </el-table-column>
        <el-table-column
          label="漏洞状态"
          width="110"
          align="center">
          <template slot-scope="scope"><span>{{choseVulStatus(scope.row.vul_status)}}</span>
            </template>
        </el-table-column>
        <el-table-column
          label="漏洞工单"
          width="110"
          align="center">
          <template slot-scope="scope"><span class="linkClass" @click="bounceAnquan(scope.row.anquan_vul_id)">{{scope.row.anquan_vul_id}}</span>
            </template>
        </el-table-column>
      </el-table>
        <div align="right" style="margin-top: 10px;">
          <el-pagination
            @size-change="handleSizeChangeVul"
            @current-change="handleCurrentChangeVul"
            :current-page="vulQueryParam.page"
            :page-sizes="[10,20,30, 50]"
            :page-size="vulQueryParam.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="vulNum">
          </el-pagination>
        </div>
      </div>
        <div class="follower">
          <h4 class="myH4">关注人列表</h4>
          <div class="followTag">
            <el-tag type="info" v-for="item in followers" :key="item.account" class="tag"><span @click="bouncePerson(item.account)">{{item.name_zh}}</span></el-tag>
          </div>
          <app-employee class="inputFollow" v-model="follower" multiple></app-employee>
          <button class="follower-btn" type="button" @click="addFollower(follower)">添&nbsp;加</button>
        </div>
      </div>
    </div>
</template>
<script>
import {connect} from '@/lib'

import * as CONSTANTS from '@/commons/otter'

  export default connect(() => {
    return {
    }
  }, {
    getOtterDetail: 'otter/getOtterDetail',
    getPreInfo: 'dolphin_knowledgeBase/getPreInfo',
    getTaskListByProjectId: 'otter/getTaskListByProjectId',
    getVulListByProjectId: 'otter/getVulListByProjectId',
    addProjectFollower: 'otter/addProjectFollower',
    getProjectFollower: 'otter/getProjectFollower'
  })({
    data() {
        return {
          vulTypeList: [],
          followers: [],
          follower: [],
          projectTaskList: {},
          otterTaskList: [],
          taskNum: 0,
          otterVulList: [],
          vulNum: 0,
          taskQueryParam: {
            page: 1,
            limit: 10,
            otter_project_id: parseInt(this.$route.query.otter_project_id)
          },
          vulQueryParam: {
            page: 1,
            limit: 10,
            otter_project_id: parseInt(this.$route.query.otter_project_id)
          }
      }
    },
    created() {
      this.getPreInfo().then(response => {
        const data = response.vul_type
        this.vulTypeList = data
      })
      this.getOtterDetail({otter_project_id: this.$route.query.otter_project_id}).then(response => {
        this.projectTaskList = response
      })
      this.getTaskListByProjectId(this.taskQueryParam).then(res => {
        this.otterTaskList = res.otter_task_list
        this.taskNum = res.count
      })
      this.getVulListByProjectId(this.vulQueryParam).then(res => {
        this.otterVulList = res.otter_vul_list
        for (let i = 0; i < this.otterVulList.length; i++) {
          this.otterVulList[i].vul_type_id = this.getVulType(this.otterVulList[i].vul_type_id)
        }
        this.vulNum = res.count
      })
      this.getFollower(this.$route.query.otter_project_id)
    },
    methods: {
      fetchData() {},
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
        handleSizeChangeTask(val) {
          this.taskQueryParam.limit = val
          this.getTaskListByProjectId(this.taskQueryParam).then(res => {
            this.otterTaskList = res.otter_task_list
            this.taskNum = res.count
          })

          // this.fetchData()
        },
        handleCurrentChangeTask(val) {
          this.taskQueryParam.page = val
          this.getTaskListByProjectId(this.taskQueryParam).then(res => {
            this.otterTaskList = res.otter_task_list
            this.taskNum = res.count
          })

          // this.fetchData()
        },
        handleSizeChangeVul(val) {
          this.vulQueryParam.limit = val
          this.getVulListByProjectId(this.vulQueryParam).then(res => {
            this.otterVulList = res.otter_vul_list
            for (let i = 0; i < this.otterVulList.length; i++) {
              this.otterVulList[i].vul_type_id = this.getVulType(this.otterVulList[i].vul_type_id)
            }
            this.vulNum = res.count
          })

          // this.fetchData()
        },
        handleCurrentChangeVul(val) {
          this.vulQueryParam.page = val
          this.getVulListByProjectId(this.vulQueryParam).then(res => {
            this.otterVulList = res.otter_vul_list
            for (let i = 0; i < this.otterVulList.length; i++) {
              this.otterVulList[i].vul_type_id = this.getVulType(this.otterVulList[i].vul_type_id)
            }
            this.vulNum = res.count
          })

          // this.fetchData()
        },
        getVulType(myId) {
            for (let i = 0; i < this.vulTypeList.length; i++) {
              let name = this.vulTypeList[i].label
              for (let j = 0; j < this.vulTypeList[i].children.length; j++) {
                if (this.vulTypeList[i].children[j].value == myId) {
                  return `${name}/${this.vulTypeList[i].children[j].label}`
                }
              }
            }
        },
        bounceAnquan(id) {
          let url = `http://anquan.didichuxing.com/project/portals/pages/hole-detail.html?id=${id}`
          window.open(url)
        },
        choseVulLevel(id) {
          for (let i = 0; i < CONSTANTS.vulLevel.length; i++) {
                if (CONSTANTS.vulLevel[i].value == id) {
                    return CONSTANTS.vulLevel[i].label
                }
          }
        },
        choseVulStatus(id) {
          for (let i = 0; i < CONSTANTS.vulStatus.length; i++) {
                if (CONSTANTS.vulStatus[i].value == id) {
                    return CONSTANTS.vulStatus[i].label
                }
          }
        },
        addFollower(followers) {
          this.addProjectFollower({otter_project_id: this.$route.query.otter_project_id, follower_list: followers}).then(res => {
            this.getFollower(this.$route.query.otter_project_id)
            this.follower = []
          })
        },
        getFollower(id) {
            this.getProjectFollower({otter_project_id: id}).then(res => {
              this.followers = res
            })
        },
        bouncePerson(name) {
            let url = 'http://i.xiaojukeji.com/space/personal/' + name
            window.open(url)
        }
    }
})
</script>
<style lang="less">
  #detail {
        margin: auto;
        width: 100%;
        height: 100%;
        background: white;
        // margin-top: -15px;
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        .el-main {
          .task {
            margin-top: 30px;
          }
          .myH4{
            color: #333333;
            font-size: 14px;
            margin: 0;
            font-weight: normal;
            margin-bottom: 10px;
          }
            width: 100%;
            box-sizing: border-box;
            background: white;
            .displayFlex {
                display: flex;
            }
            .searchForm {
                .searchInput {
                width: 320px;
                }
            }
          .aLink{
            color: #FC9153;
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
        }
        .basicContentDisplay {
          margin-top: 10px;
          padding-bottom: 10px;
          display: flex;
          flex-wrap: wrap;
          background: #ffff;
          box-sizing: border-box;
          border: 1px solid #e2e2e2;
          border-radius: 8px;
          font-size: 13px;
          .items {
            padding-top: 10px;
            flex: 1;
            flex-basis: 40%;
            justify-content: center;
            display: flex;
            // font-size: 15px;
            font-family: "Helvetica Neue", "Helvetica", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE\8F6F\96C5\9ED1", "Arial", "sans-serif";
            color: gray;
            .c1 {
                flex: 2;
                text-align: left;
                padding-left: 20px;
            }
            .c2 {
                flex: 5;
                color: black;
                font-family: PingFang-SC;
            }
          }
          .rightItem {
            padding-top: 10px;
            flex: 2;
            flex-basis: 60%;
            justify-content: center;
            display: flex;
            // font-size: 15px;
            font-family: "Helvetica Neue", "Helvetica", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE\8F6F\96C5\9ED1", "Arial", "sans-serif";
            color: gray;
            .c1 {
                flex: 2;
                text-align: left;
                padding-left: 20px;
            }
            .c2 {
                flex: 11;
                color: black;
                font-family: PingFang-SC;
            }
          }
        }
        .follower {
          margin-top: 30px;
          .followTag {
            // margin-top: -5px;
            .tag {
              border: none;
              color: #fc9153;
              background: white;
              font-size: 12px;
              span{
                font-weight: 400;
                cursor: pointer;
              }
            }
          }
          span {
            font-weight: bold;
          }
          .inputFollow {
            margin-top: 10px;
            width: 100%;
          }
          .follower-btn {
            height: 32px;
            width: 100px;
            text-align: center;
            padding: 5px;
            border: 1px solid #fc9153;
            background: #fc9153;
            border-radius: 4px;
            // font-weight: 100;
            color: white;
            cursor: pointer;
            margin-top: 15px;
            font-size: 12px;
          }
        }
        .linkClass{
          cursor: pointer;
          color: #FC9153;
        }
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

