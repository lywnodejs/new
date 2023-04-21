<template>
  <div id="ocean-department-evalutionProjectList">
      <div class="table">
          <div class="tableTitle">安全评估项目列表</div>
          <el-table :header-cell-style="rowClass" :cell-style='cellStyle'
      :data="tableData"
      v-loading>
      <el-table-column
        label="ID"
        width="80"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sdl_project_id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="项目名称"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.project_name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="数据分级"
        width="80"
        align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.data_level=='C1'||scope.row.data_level=='C2'"  :class="scope.row.data_level=='C1'? 'c1':'c2'" class="ccccc">{{ scope.row.data_level }}</el-tag>
          <el-tag v-if="scope.row.data_level=='C3'||scope.row.data_level=='C4'"  :class="scope.row.data_level=='C3'? 'c3':'c4'" class="ccccc">{{ scope.row.data_level }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="开发语言"
        width="80"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.language}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="提测人"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.creator_zh}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="部门"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.dept_name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="提测时间"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time.split(' ')[0]}}</span><br>
          <span>{{ scope.row.create_time.split(' ')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="项目状态"
        width="140"
        align="center">
        <template slot-scope="scope">
          <span>{{handleProjectStatus(scope.row.project_status)}}</span><br>
          <el-tag class="statusTag el-tag-putong" v-if="!scope.row.workflow_type" type="success" >普通</el-tag>
          <el-tag class="statusTag el-tag-jixian" v-if="scope.row.workflow_type">基线</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="安全BP"
        width="100"
        sortable
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sdl_engineer==''">{{handleSdlEngineer(scope.row.sdl_engineer)}}</span>
          <a v-else :href="bounceDChat(scope.row.sdl_engineer)">
            <i class="engineerLogo"><img src="@/assets/D-Chat_logo.svg" alt="" style="width:14px;height:14px;"></i>
            <span class='engineerName'>{{handleSdlEngineer(scope.row.sdl_engineer)}}</span>
          </a>
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
  import * as CONSTANTS from '@/commons/dorado'

  export default connect(() => {
    return {
    }
  }, {
    getEvaluationProjectList: 'ocean_department/getEvaluationProjectList'
  })({
    data() {
      return {
          tableData: [],
          status: CONSTANTS.status,
          engineer: CONSTANTS.engineer,
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
          this.getEvaluationProjectList(queryParam).then(res => {
            this.num = res.count
            this.tableData = res.evaluation_project_list
          })
      },
      handleProjectStatus(projectStatus) {
        if (!projectStatus) {
          projectStatus = '未知状态'
        } else {
          projectStatus = this.status[projectStatus]
        }
        return projectStatus
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
      rowClass() {
          return 'font-size:10px;background:white;'
      },
      cellStyle({row, column, rowIndex, columnIndex}) {
            return 'font-size:10px;'
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
#ocean-department-evalutionProjectList{
      background-color: white;
      margin: 23px 23px 0px 23px;
      position: relative;
      padding-bottom: 10px;
      .el-table{
          border: none !important;
      }
      .table{
          margin:0 23px;
          font-size: 11px !important;
          .tableTitle{ 
              padding: 15px 0;
              text-align: left;
              font-size: 12.5px;
          }
      }
      .statusTag {
        line-height: 18px;
        height: 18px;
        font-size: 11px;
        box-sizing: content-box; 
      }
      .engineerName {
        line-height: 20px;
      }
      .engineerLogo {
        position: relative;
        top: 2px;
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
      .ccccc{
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
      .c1{
        background-color: rgba(103, 194, 58, 0.1);
        color: #67c23a;
        border: 1px solid rgba(103, 194, 58, 0.2);
      }
      .c2{
        background-color: #ecf5ff;
        color: #409eff;
        border: 1px solid #d9ecff;
      }
      .c3{
        background-color: #fdf6ec;
        border-color: #faecd8;
        color: #e6a23c;
      }
      .c4{
        background-color: #fef0f0;
        border-color: #fde2e2;
        color: #f56c6c
      }
}
</style>

