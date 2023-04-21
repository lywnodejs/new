<template>
    <div id="octopus-grpup-task">
        <el-form class="searchForm" label-position="left" label-width="80px" :inline='true'>
      <div class="displayFlex">
        <el-form-item label="任务名称:">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.task_name"
                    clearable
                    placeholder="请输入任务名称"
                    auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="项目类型:" style="margin-left:30px;">
          <el-select class="searchInput"
                     v-model="queryParam.keywords.source"
                     filterable
                     clearable
                     placeholder="请选择任务类型">
            <el-option
              v-for="item in projectType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="部门："  style="margin-left:30px;">
              <app-department1 class="searchInput" v-model="queryParam.keywords.dept_id"></app-department1>
        </el-form-item>
        
      </div>

      <el-row>
        <el-col :span='24'>
          <el-form-item align="center">
            <button type="button" class='octopus-button' @click="getGroupList"><span>搜&nbsp;索</span></button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

     <div class="cutLine"></div>

      <el-table
      :data="groupList"
      v-loading>
      <el-table-column
        label="ID"
        width="70"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.octopus_group_task_id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="任务名称"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.task_name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所属项目名称"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.group_project_name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="项目类型"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.source == 1?'团队项目':'默认项目'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所属人"
        width="80"
        align="center">
        <template slot-scope="scope">
          <a :href="bounceDChat(scope.row.username)">
            <i v-show="scope.row.username_zh" class="engineerLogo"><img src="@/assets/D-Chat_logo.svg" alt="" style="width:14px;height:14px;"></i>
            <span class='engineerName'>{{scope.row.username_zh}}</span>
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
          <span>{{scope.row.create_time.split(' ')[0]}}<br>{{scope.row.create_time.split(' ')[1]}}</span>
        </template>
      </el-table-column>
      <app-permission>
        <el-table-column
        label="操作"
        width="80"
        align="center">
        <template slot-scope="scope">
          <span class="opera" @click="openDialog(1, scope.row)">编辑</span>
        </template>
      </el-table-column>
      </app-permission>
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
    <group-task-dialog :scopeRow='data' :dialogVisible='dialogFormVisible' @groupTaskDialog='getFormDialog'></group-task-dialog>
    </div>
</template>
<script>
import {connect} from '@/lib'
import appDepartment1 from '../componnents/department'
import groupTaskDialog from '../componnents/groupTaskDialog'

  export default connect(() => {
    return {
    }
  }, {
      getGroupTask: 'octopus_group/getGroupTask'
  })({
    data() {
        return {
            groupList: [],
            num: 0,
            dialogFormVisible: false,
            data: {},
            projectType: [{value: 1, label: '团队项目'}, {value: 2, label: '默认项目'}],
            queryParam: {
                page: 1,
                limit: 10,
                keywords: {
                    task_name: '',
                    source: 2,
                    dept_id: null
                }
            }
        }
    },
    components: {appDepartment1, groupTaskDialog},
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            let queryParam = this.queryParam
            this.getGroupTask(queryParam).then(res => {
                this.groupList = []
                this.groupList = res.data.octopus_group_task_list
                this.num = res.data.count
            })
        },
        getGroupList() {
            this.fetchData()
        },
        openDialog(type, obj) {
          this.dialogFormVisible = true
          this.data = obj
        },
        getFormDialog(val) {
            this.dialogFormVisible = val
        },
        handleSizeChange(val) {
            this.queryParam.limit = val
            this.fetchData()
        },
        handleCurrentChange(val) {
            this.queryParam.page = val
            this.fetchData()
        },
        bounceGitUrl(url) {
            let urll = 'http://git.xiaojukeji.com/' + url.split(':')[1]
            window.open(urll)
        },
        bounceDChat(sdlDngineer) {

          // let url = 'dingtalk://dingtalkclient/action/sendmsg?dingtalk_id='
          let url = 'dchat://im/start_conversation?name='
          url += sdlDngineer
          return url
        }
    }
})
</script>
<style lang="less">
#octopus-grpup-task {
    .displayFlex {
        display: flex;
    }
    .searchForm {
        .searchInput {
            width: 230px;
        }
    }
     .engineerName {
        line-height: 20px;
        color: #FC9153;
      }

      .engineerLogo {
        position: relative;
        top: 2px;
      }
    .octopus-btn{
        border: 1px solid #FC9153;
        border-radius: 4px;
        width: 95px;
        height: 32px;
        color: #FC9153;
        margin-left: 25px;
        background: white;
        cursor: pointer;
        margin-top: 5px;
        font-size: 13px;
        -webkit-font-smoothing: antialiased;
        // font-weight: 100;
        // line-height: 32px;
        span{
        font-family: Avenir,Helvetica,Arial,sans-serif;
        // font-weight: 100;
        }
    }
    .octopus-btn:hover{
        background-color: #fff3e8;
    }
    .octopus-button{
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
    .opera {
        color: #FC9153;
        cursor: pointer;
        // display: inline-block;
        // margin-left: 5px;
    } 
    .cutLine {
        // border: 1px solid
        margin-top: 5px;
        margin-bottom: 17px;
        width: 100%;
        border-top: 1px solid rgba(0, 0, 0, 0.10);
        // background: rgba(0, 0, 0, 0.10);
        // border-rad
    }
}
</style>

