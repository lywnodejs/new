<template>
    <div id="octopus-grpup-project">
        <el-form class="searchForm" label-position="left" label-width="80px" :inline='true'>
      <div class="displayFlex">
        <el-form-item label="项目名称:">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.group_project_name"
                    clearable
                    placeholder="请输入项目名称"
                    auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="项目类型:" style="margin-left:30px;">
          <el-select class="searchInput"
                     v-model="queryParam.keywords.group_project_type"
                     filterable
                     clearable
                     placeholder="请选择项目类型">
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
            <button type="button" class='octopus-btn' @click="openDialog(2)"><span>创建团队项目</span></button>
            <app-permission><button type="button" class='octopus-btn' @click="openDialog(3)"><span>创建默认项目</span></button></app-permission>
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
          <span>{{scope.row.octopus_group_project_id}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="项目名称"
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
          <span>{{scope.row.group_project_type == 1?'团队项目':'默认项目'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="部门"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.dept_name}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="Git地址"
        align="center">
        <template slot-scope="scope">
            <div v-for="item in scope.row.git_url.split(',')" :key="item">
                <div><a @click="bounceGitUrl(item)">{{item}}</a></div>
            </div>
        </template>
      </el-table-column> -->
      <el-table-column
        label="创建人"
        width="130"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.creator_zh}}</span>
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
      <el-table-column v-if="display"
        label="操作"
        width="120"
        align="center">
        <template slot-scope="scope">
          <span class="opera" @click="openDialog(1, scope.row)">编辑</span>&nbsp;
          <router-link :to="{ path : '/sdl/octopus/group/project/detail',query: {id: scope.row.octopus_group_project_id} }"
                       target=_blank>
            <span class="opera">模板配置</span>
          </router-link>
        </template>
      </el-table-column>
      <app-permission v-else>
        <el-table-column
          label="操作"
          width="80"
          align="center">
          <template slot-scope="scope">
            <span class="opera" @click="openDialog(1, scope.row)">编辑</span>&nbsp;
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

    <createproject-dialog :dialogVisible='dialogFormVisible' @projectDialog='getFormDialog'></createproject-dialog>
    <create-default-dialog :dialogDefaultVisible='dialogFormDefaultVisible' @projectDefaultDialog='getFormDefaultDialog'></create-default-dialog>
    <update-default-dialog :scopeRow='updateData' :dialogUpdateDefaultVisible='dialogFormDefaultUpdateVisible' @projectDefaultUpdateDialog='getFormDefaultUpdateDialog'></update-default-dialog>
    <updateproject-dialog :projectContext='projectContext' :updateDialogVisible='updateDialogFormVisible' @updateProjectDialog='getUpdateFormDialog'></updateproject-dialog>
    </div>
</template>
<script>
import {connect} from '@/lib'
import appDepartment1 from '../componnents/department'
import createprojectDialog from '../componnents/createProjectDialog'
import updateprojectDialog from '../componnents/updateProjectDialog'
import createDefaultDialog from './dialog/createDefaultDialog'
import updateDefaultDialog from './dialog/updateDefaultDialog'

  export default connect(() => {
    return {
    }
  }, {
      getGroupProjectList: 'octopus_group/getGroupProjectList'
  })({
    data() {
        return {
            groupList: [],
            num: 0,
            updateDialogFormVisible: false,
            projectContext: null,
            dialogFormVisible: false,
            dialogFormDefaultVisible: false,
            dialogFormDefaultUpdateVisible: false,
            updateData: {},
            projectType: [{value: 1, label: '团队项目'}, {value: 0, label: '默认项目'}],
            queryParam: {
                page: 1,
                limit: 10,
                keywords: {
                    group_project_name: null,
                    group_project_type: 0,
                    dept_id: null
                }
            },
            display: true
        }
    },
    components: {appDepartment1, createprojectDialog, updateprojectDialog, createDefaultDialog, updateDefaultDialog},
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            let queryParam = this.queryParam
            this.getGroupProjectList(queryParam).then(res => {
                this.groupList = res.octopus_group_project_list
                this.num = res.count
                if (this.queryParam.keywords.group_project_type === 1) {
                  this.display = true
                } else {
                  this.display = false
                }
            })
        },
        getGroupList() {
            this.fetchData()
        },
        openDialog(type, obj) {
            if (type === 1 && obj.group_project_type == 1) {
                this.updateDialogFormVisible = true
                this.projectContext = obj
            } else if (type === 2) {
                this.dialogFormVisible = true
            } else if (type === 3) {
              this.dialogFormDefaultVisible = true
            } else if (type === 1 && obj.group_project_type == 0) {
              this.dialogFormDefaultUpdateVisible = true
              this.updateData = obj
            }
        },
        getFormDialog(val) {
            this.dialogFormVisible = val
        },
        getUpdateFormDialog(val) {
            this.updateDialogFormVisible = val
        },
        getFormDefaultDialog(val) {
          this.dialogFormDefaultVisible = val
        },
        getFormDefaultUpdateDialog(val) {
          this.dialogFormDefaultUpdateVisible = val
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
        }
    }
})
</script>
<style lang="less">
#octopus-grpup-project {
    .displayFlex {
        display: flex;
    }
    .searchForm {
        .searchInput {
            width: 230px;
        }
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

