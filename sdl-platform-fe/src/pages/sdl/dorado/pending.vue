<template>
  <div id="pending">
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
        sortable
        prop="project_name"
        align="center">
        <template slot-scope="scope">
          <router-link v-if="!scope.row.workflow_type" :to="{ path : '/sdl/dorado/ProjectWorkflow',query: {projectId:scope.row.sdl_project_id} }">
            <span>{{scope.row.project_name}}</span>
          </router-link>
          <router-link v-if="scope.row.workflow_type" :to="{ path : '/sdl/dorado/baseline/ProjectWorkflow',query: {projectId:scope.row.sdl_project_id} }">
            <span>{{scope.row.project_name}}</span>
          </router-link>
          <el-tag v-show="scope.row.source == 1" size="mini" class="high-level">高优</el-tag>
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
        width="110"
        prop="publish_time"
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
        sortable
        prop="creator"
        align="center">
        <template slot-scope="scope">
          <a @click="bounceJuzi(scope.row.creator)">
            <span>{{scope.row.creator_zh}}</span>
          </a>
        </template>
      </el-table-column>
      <el-table-column
        label="提测时间"
        prop="create_time"
        width="98"
        sortable
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.create_time.split(' ')[0]}}<br>{{scope.row.create_time.split(' ')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="项目状态"
        width="180"
        prop="project_status"
        sortable
        align="center">
        <template slot-scope="scope">
          <span>{{handleProjectStatus(scope.row.project_status)}}</span><br>
          <el-tag v-if="!scope.row.workflow_type" type="success">普通</el-tag>
          <el-tag v-if="scope.row.workflow_type">基线</el-tag>
          <!-- <el-tag class="workflow-type-tag">{{handleWorkFlowType(scope.row.workflow_type)}}</el-tag> -->
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
  import bus from '@/routes/eventBus'

  export default {
    name: 'project-list',

    data() {
      return {
        tableData: [],
        num: 0,
        status: CONSTANTS.status,
        engineer: CONSTANTS.engineer,
        projectStatus: CONSTANTS.projectStatus,
        queryParam: {
          page: 1,
          limit: 20
        }
      }
    },

    created() {
      this.fetchData()
    },

    methods: {
      fetchData() {

        let postJson = {
          queryParam: this.queryParam
        }
        ajax.post(API.getMyProjectList, postJson).then(response => {
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
      handleSizeChange(val) {
        this.queryParam.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryParam.page = val
        this.fetchData()
      },
      handleProjectStatus(projectStatus) {
        if (!projectStatus) {
          projectStatus = '未知状态'
        } else {
          projectStatus = this.status[projectStatus]
        }
        return projectStatus
      },
      changeTitle(name) {
        bus.$emit('changeTitle', name)
      },
      bounceJuzi(name) {
        let url = 'http://i.xiaojukeji.com/space/personal/' + name
        window.open(url)
      }
    }
  }
</script>

<style lang='less' >
#pending{
  width: 100%;
  box-sizing: border-box;
  background: white;
    // margin-bottom: 15px;
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

// .el-table .cell{
//   margin-top: 8px ;
//   margin-bottom: 7px ;
// }
// .el-table th > .cell{
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
  .high-level {
      background-color: rgba(245,108,108,.2);
      border-color: rgba(245,108,108,.5);
      color: #f56c6c;
      width: 30px;
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
}

</style>
