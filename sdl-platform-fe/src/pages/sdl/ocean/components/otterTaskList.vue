<template>
  <div id="ocean-department-otterTaskList">
      <div class="table">
          <div class="tableTitle">白盒检测任务列表</div>
          <el-table  :header-cell-style="rowClass" :cell-style='cellStyle'
            :data="tableData"
            style="width: 100%;">
             <el-table-column
            prop="otter_task_id"
            label="任务ID"
            width="70"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.otter_task_id}}</span>
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
        <el-table-column
            label="任务状态"
            width="110"
            align="center">
            <template slot-scope="scope">
              <el-tag class="tagStyle" :class='judgeStatus(scope.row.status)'>{{scope.row.status_info}}</el-tag>
            </template>
        </el-table-column>
        
          </el-table>
      </div>
      
    <div align="right" style="margin-top: 10px;margin-right:23px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @change="fetchData"
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
import {connect} from '@/lib'
import * as CONSTANTS from '@/commons/otter'

  export default connect(() => {
    return {
    }
  }, {
    getOtterTaskList: 'ocean_department/getOtterTaskList'
  })({
    data() {
      return {
          tableData: [],
          taskStatus: CONSTANTS.status,
          queryParam: {
            dept_id: this.deptId,
            start_date: this.time[0],
            end_date: this.time[1],
            page: 1,
            limit: 10
          },
          num: 0
      }
    },
    props: ['deptId', 'time'],
    created() {
        this.fetchData()
    },
    mounted() {
    },
    methods: {
      fetchData() {
          let queryParam = this.queryParam
          this.queryParam.dept_id = this.deptId
          this.queryParam.start_date = this.time[0]
          this.queryParam.end_date = this.time[1]
          this.getOtterTaskList(queryParam).then(res => {
              this.num = res.count
            this.tableData = res.otter_task_list
          })
      },
      rowClass() {
          return 'font-size:10px;background:white;'
      },
      cellStyle({row, column, rowIndex, columnIndex}) {
            return 'font-size:10px;'
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
      judgeStatus(status) {
        if (status >= 5) {
          return 'el-tag-info'
        }
        if (status == 4) {
          return 'el-tag-success'
        }
        if (status == 3) {
          return 'el-tag-warning'
        }
        if (status == 2) {
          return 'el-tag-danger'
        }
        if (status == 0) {
          return 'el-tag-blue'
        }
        if (status == 1) {
          return 'el-tag-info'
        }
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
#ocean-department-otterTaskList{
    background-color: white;
      margin: 23px 23px 0px 23px;
      position: relative;
      padding-bottom: 10px;
      .el-table{
          border: none !important;
      }
      .table{
          margin:0 23px;
          .tableTitle{ 
              padding: 15px 0;
              text-align: left;
              font-size: 12.5px;
          }
      }
      .tagStyle{
        display: inline-block;
        padding: 0 10px;
        -webkit-font-smoothing: antialiased;
        height: 26px;
        line-height: 23px;
        font-size: 12px;
        border-radius: 4px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        white-space: nowrap;
      }
      .el-tag-blue{
        background-color: rgba(64,158,255,.1);
        color: #409eff;
        border: 1px solid rgba(64,158,255,.2);
      }
      .el-tag-info {
        background-color: rgba(144, 147, 153, 0.1);
        border-color: rgba(144, 147, 153, 0.2);
        color: #909399;
      }
      .el-tag-danger {
          background-color: rgba(245, 108, 108, 0.1);
          border-color: rgba(245, 108, 108, 0.2);
          color: #f56c6c;
      }
      .el-tag-success {
          background-color: rgba(103, 194, 58, 0.1);
          border-color: rgba(103, 194, 58, 0.2);
          color: #67c23a;
      }
      .el-tag-warning {
          background-color: rgba(230,162,60,.1);
          border-color: rgba(230,162,60,.2);
          color: #e6a23c;
      }
      .engineerName {
        line-height: 20px;
      }
      .engineerLogo {
        position: relative;
        top: 2px;
      }
}
</style>

