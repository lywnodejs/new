<template>
  <div id="dorado">
    <el-form class="searchForm" label-position="left" label-width="80px" :inline='true'>
      <div class="displayFlex">
        <el-form-item label="项目ID:">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.sdl_project_id"
                    clearable
                    placeholder="请输入项目ID"
                    auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="项目名称:" style="margin-left: 30px;">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.project_name"
                    clearable
                    placeholder="请输入项目名称"
                    auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="项目状态:" style="margin-left: 30px;">
          <el-cascader class="searchInput"
                      :options="projectStatus"
                      v-model="queryParam.keywords.projectStatus1"
                      clearable
                      change-on-select
                       @change="handleChange"
                      placeholder="请选择项目状态"
                      expand-trigger="hover">
          </el-cascader>
        </el-form-item>
      </div>
      <div class="displayFlex">
        <el-form-item label="安全BP:">
          <el-select class="searchInput"
                     v-model="queryParam.keywords.sdl_engineer"
                     filterable
                     clearable
                     placeholder="请选择安全BP"
                     @clear="setSdlEngineerValue"
          >
            <el-option
              v-for="item in engineerOps"
              :key="item.id"
              :label="item.emp_name_zh + ' (' + item.emp_account + ')'"
              :value="item.emp_account">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提测人:" style="margin-left: 30px;">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.creator_zh"
                    clearable
                    placeholder="请输入提测人"
                    auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="Git路径:" style="margin-left: 30px;">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.git_url"
                    clearable
                    placeholder="请输入Git路径"
                    auto-complete="off">
          </el-input>
        </el-form-item>
      </div>
      <div class="displayFlex">
      </div>

      <el-row>
        <el-col :span='24'>
          <el-form-item align="center">
            <button type="button" class='dorado-btn' @click="searchProject"><span>搜&nbsp;索</span></button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="cutLine"></div>

    <el-table
      :data="tableData"
      :default-sort = "{prop: 'sdl_project_id', order: 'descending'}"
      v-loading>
      <el-table-column
        prop="sdl_project_id"
        label="ID"
        sortable
        align="center"
        width="70">
      </el-table-column>
      <el-table-column
        label="项目名称"
        prop="project_name"
        sortable
        align="center">
        <template slot-scope="scope">
          <router-link v-if="!scope.row.workflow_type" target=_blank :to="{ path : '/sdl/dorado/ProjectWorkflow',query: {projectId:scope.row.sdl_project_id} }">
            <span>{{scope.row.project_name}}</span>
          </router-link>
          <router-link v-if="scope.row.workflow_type" target=_blank :to="{ path : '/sdl/dorado/baseline/ProjectWorkflow',query: {projectId:scope.row.sdl_project_id} }">
            <span>{{scope.row.project_name}}</span>
          </router-link>
          <el-tag v-show="scope.row.source == 1" size="mini" class="high-level">高优</el-tag>
          <!-- <span >高优</span> -->
        </template>
      </el-table-column>

      <el-table-column
        label="一级部门"
        prop="dept_t1_name"
        width="110"
        sortable
        align="center">
      </el-table-column>

      <el-table-column
        label="上线时间"
        prop="publish_time"
        width="110"
        sortable
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.publish_time}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="language"
        label="开发语言"
        width="110"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        label="提测人"
        width="110"
        prop="creator"
        sortable
        align="center">
        <template slot-scope="scope">
          <a @click="bounceJuzi(scope.row.creator)">
            <span>{{judgeZh(scope.row.creator_zh, scope.row.creator)}}</span>
          </a>
        </template>
      </el-table-column>
      <el-table-column
        label="提测时间"
        width="100"
        prop="create_time"
        sortable
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.create_time.split(' ')[0]}}<br>{{scope.row.create_time.split(' ')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="项目状态"
        prop="project_status"
        width="180"
        sortable
        align="center">
        <template slot-scope="scope">
          <span>{{handleProjectStatus(scope.row.project_status)}}</span><br>
          <el-tag v-if="!scope.row.workflow_type" type="success" class="el-tag-putong">普通</el-tag>
          <el-tag v-if="scope.row.workflow_type" class="el-tag-jixian">基线</el-tag>
          <!-- <el-tag class="workflow-type-tag">{{handleWorkFlowType(scope.row.workflow_type)}}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        label="安全BP"
        width="100"
        prop="sdl_engineer"
        sortable
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sdl_engineer==''">{{handleSdlEngineer(scope.row.sdl_engineer)}}</span>
          <a v-else :href="bounceDChat(scope.row.sdl_engineer)">
            <i class="engineerLogo"><img src="../../../assets/D-Chat_logo.svg" alt="" style="width:14px;height:14px;"></i>
            <span class='engineerName'>{{handleSdlEngineer(scope.row.sdl_engineer)}}</span>
          </a>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100px"
        align="center">
        <template slot-scope="scope">
          <router-link v-if="!scope.row.workflow_type" :to="{ path : '/sdl/dorado/ProjectWorkflow',query: {projectId:scope.row.sdl_project_id} }"
                       target=_blank>
            <span style="color:#FC9153">查看</span>
          </router-link>
          <router-link v-if="scope.row.workflow_type" :to="{ path : '/sdl/dorado/baseline/ProjectWorkflow',query: {projectId:scope.row.sdl_project_id} }"
                       target=_blank>
            <span style="color:#FC9153">查看</span>
          </router-link>
          <span class="operator-link" @click="deleteProject(scope.row.sdl_project_id)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <div align="right" style="margin-top: 10px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParam.page"
        :page-sizes="[10,20,30,50]"
        :page-size="queryParam.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="num">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import ajax from '@/plugin/ajax'
  import * as API from '@/commons/api/dorado'
  import * as CONSTANTS from '@/commons/dorado'
  import { getSdlSecurityBp } from '@/commons/api/admin'
  import bus from '@/routes/eventBus'

  export default {
    name: 'project-list',

    data() {
      return {
        tableData: [],
        num: 0,
        status: CONSTANTS.status,

        // engineer: CONSTANTS.engineer,
        engineerOps: [],
        projectStatus: CONSTANTS.projectStatus,
        queryParam: {
          page: 1,
          limit: 20,
          keywords: {
            sdl_project_id: '',
            project_name: '',
            project_status: '',
            sdl_engineer: '',
            creator_zh: '',
            projectStatus1: [],
            git_url: ''
          }
        }
      }
    },

    created() {
      this.fetchData()
      bus.$emit('sendFetch', this.fetchData)
      this.getSdlSecurityBpList() // 获取sdl信息安全工程师
    },
    mounted() {
      console.log(document.referrer);
    },
    methods: {
      setSdlEngineerValue() {
        this.queryParam.keywords.sdl_engineer = ''
      },

      getSdlSecurityBpList() {
        ajax.get(getSdlSecurityBp, {
          limit: 200,
          page: 1
        }).then(res => {
          this.engineerOps = res.data.data
        }).catch(() => {
          this.engineerOps = []
        })
      },

      fetchData() {
        let postJson = {
          queryParam: this.queryParam
        }
        ajax.post(API.getProjectList, postJson).then(response => {
          const projectData = response.data
          this.tableData = projectData.project_list
          this.num = projectData.count
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].publish_time = this.tableData[i].publish_time.split(' ')[0]
          }
        })
      },
      deleteProject(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postJson = {
            sdl_project_id: id
          }
          ajax.post(API.deleteProject, postJson).then(response => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      searchProject() {
        this.fetchData()
      },
      handleSizeChange(val) {
        this.queryParam.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryParam.page = val
        this.fetchData()
      },
      handleSdlEngineer(sdlDngineer) {
        if (!sdlDngineer) {
          sdlDngineer = '未指定'
        } else {
          for (let i = 0; i < this.engineerOps.length; i++) {
            if (sdlDngineer == this.engineerOps[i].emp_account) {
              sdlDngineer = this.engineerOps[i].emp_name_zh
            }
          }
        }
        return sdlDngineer
      },
      handleProjectStatus(projectStatus) {
        if (!projectStatus) {
          projectStatus = '未知状态'
        } else {
          projectStatus = this.status[projectStatus]
        }
        return projectStatus
      },
      handleChange(value) {
        if (value.length == 1) {
          if (value[0] == 0) {
            this.queryParam.keywords.project_status = 1
            this.queryParam.keywords.projectStatus1 = [0, 1]
          }
          if (value[0] == 1) {
            this.queryParam.keywords.project_status = 100
            this.queryParam.keywords.projectStatus1 = [1, 100]
          }
        } else {
          this.queryParam.keywords.project_status = value[1]
        }
      },
      handleWorkFlowType(type) {
        return type == 0 ? '普通' : '基线'
      },
      changeTitle(name) {
        bus.$emit('changeTitle', name)
      },
      bounceDChat(sdlDngineer) {

        // let url = 'dingtalk://dingtalkclient/action/sendmsg?dingtalk_id='
        let url = 'dchat://im/start_conversation?name='
        for (let i = 0; i < this.engineerOps.length; i++) {
          if (sdlDngineer == this.engineerOps[i].emp_account) {
            url = url + this.engineerOps[i].emp_account
          }
        }
        return url
      },
      bounceJuzi(name) {
        let url = 'http://i.xiaojukeji.com/space/personal/' + name
        window.open(url)
      },
      judgeZh(name, enName) {
        if (name != '') {
          return name
        }
        return enName
      }
    }
  }
</script>

<style lang='less' scoped>
  #dorado {
    width: 100%;
    box-sizing: border-box;
    background: white;
    // margin-bottom: 16pt;
    // padding: 20px;
    // margin-left: -0px;
    // margin-top: -15px;
    // padding-right: -20px;
    .dorado-btn {
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
    .displayFlex {
      display: flex;
    }
    .searchForm {
      .searchInput {
        width: 230px;
      }
    }
    .operator-link{
      color: #FC9153;
      cursor: pointer;
      margin-left: 5px;;
    }
    .operator-link::before {
      content: "|";
      margin-right: 7px;
      color: #ddd;
    }
    .high-level {
      background-color: rgba(245,108,108,.2);
      border-color: rgba(245,108,108,.5);
      color: #f56c6c;
      width: 30px;
    }

    // .el-table .cell {
    //   margin-top: 5px;
    //   margin-bottom: 5px;
    // }
    // .el-table th > .cell {
    //   margin-top: 0px !important;
    //   margin-bottom: 0px !important;
    // }
    .cutLine {
      // border: 1px solid
      margin-top: 5px;
      margin-bottom: 17px;
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, 0.10);
      // background: rgba(0, 0, 0, 0.10);
      // border-radius: 4px;
    }
    .el-tag {
      line-height: 18px;
      height: 18px;
      font-size: 11px;
      box-sizing: content-box;
    }
    .el-tag-putong {
      background-color: rgba(103, 194, 58, 0.1);
      border-color: rgba(103, 194, 58, 0.2);
      color: #67c23a;
    }
    .el-tag-jixian {
      background-color: rgba(250, 137, 25, 0.1);
      color: #fc9153;
      border: 1px solid rgba(250, 137, 25, 0.2);
    }
  }

  .engineerName {
    line-height: 20px;
  }

  .engineerLogo {
    position: relative;
    top: 2px;
  }


</style>
