<template>
  <div id='task'>
    <div class="el-main">
      <el-form class="searchForm" label-position="left" label-width="80px" :inline='true'>
        <div class="displayFlex">
          <el-form-item label="扫描目标:">
            <el-input class="searchInput"
                      v-model="queryParam.keywords.target_address"
                      clearable
                      placeholder="请输入扫描目标"
                      auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="任务编号:" style="margin-left: 30px;">
            <el-input class="searchInput"
                      v-model="queryParam.keywords.oct_task_main_id"
                      clearable
                      placeholder="请输入任务ID"
                      auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="执行类型:" style="margin-left: 30px;">
            <el-select class="searchInput"
                       v-model="queryParam.keywords.exec_type"
                       filterable
                       clearable
                       placeholder="请选择扫描周期">
              <el-option
                v-for="item in execType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="任务参数:" >
            <el-input class="searchInput"
                      v-model="queryParam.keywords.send_to_scan_params"
                      clearable
                      placeholder="请输入任务参数"
                      auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="任务状态:" style="margin-left: 30px;">
            <el-select class="searchInput"
                       v-model="queryParam.keywords.octopus_task_status"
                       filterable
                       clearable
                       placeholder="请选择扫描状态">
              <el-option
                v-for="item in taskStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务名称:" style="margin-left: 30px;">
            <el-input class="searchInput"
                      v-model="queryParam.keywords.task_name"
                      clearable
                      placeholder="请输入用户名称"
                      auto-complete="off">
            </el-input>
          </el-form-item>
        </div>
        <div class="displayFlex">
          <el-form-item label="任务来源:">
            <el-select class="searchInput"
                       v-model="queryParam.keywords.source_type"
                       filterable
                       clearable
                       placeholder="请选择任务来源">
              <el-option
                v-for="item in sourceType"
                :key="item.label"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <app-permission>
            <el-form-item label="用户名称:" style="margin-left: 30px;">
              <el-input class="searchInput"
                        v-model="queryParam.keywords.username"
                        clearable
                        placeholder="请输入用户名称"
                        auto-complete="off">
              </el-input>
            </el-form-item>
          </app-permission>

        </div>
        <el-row>
          <el-form-item align="center">
            <button type="button" class='octopus-btn' @click="searchTask"><span>搜&nbsp;索</span></button>
          </el-form-item>
          <div class="floatR">
            <el-button
              @click="openDialog()"
              type="primary"
              icon="el-icon-circle-plus-outline"
              size="mini"
              class="add-btn">
              添加
            </el-button>
          </div>
        </el-row>
      </el-form>

      <div class="cutLine"></div>

      <el-table
        :data="taskList"
        v-loading>
        <el-table-column
          prop="oct_task_main_id"
          label="任务编号"
          sortable
          align="center"
          width="101">
        </el-table-column>
        <el-table-column
          label="任务名称"
          sortable
          align="center">
          <template slot-scope="scope">
            <router-link
              :to="{ path : '/sdl/octopus/vulnerability',query: {oct_task_main_id: scope.row.oct_task_main_id} }">
              <span>{{scope.row.task_name}}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="101"
          sortable
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.create_time.split(' ')[0]}}<br>{{scope.row.create_time.split(' ')[1]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="任务进度"
          sortable
          width="170"
          align="center">
          <template slot-scope="scope">
            <el-progress :text-inside="true"
                         :stroke-width="18"
                         :percentage="searchPercen(scope.row, 'process')"
                         :status="searchPercen(scope.row, 'process')==100?'success':'exception'"></el-progress>
          </template>
        </el-table-column>
        <el-table-column
          label="任务状态"
          width="101"
          sortable
          align="center">
          <template slot-scope="scope">
            <span>{{searchPercen(scope.row, 'status')}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="执行类型"
          width="101"
          sortable
          align="center">
          <template slot-scope="scope">
            <span>{{searchType(scope.row.exec_type)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="下次执行时间"
          sortable
          align="center"
          width="130">
          <template slot-scope="scope">
            <span>{{scope.row.task_exec_crontab_time.split(' ')[0]}}<br>{{scope.row.task_exec_crontab_time.split(' ')[1]}}</span>
          </template>
        </el-table-column>
        <app-permission>
          <el-table-column
            prop="sso_creator"
            label="创建者"
            sortable
            align="center"
            width="90">
          </el-table-column>
        </app-permission>

        <el-table-column
          label="操作"
          width="60px"
          align="center">
          <template slot-scope="scope">
            <span class="opera"
                  v-if="searchPercen(scope.row, 'id')<=1||searchPercen(scope.row, 'id')>=10||searchPercen(scope.row, 'id')==4"
                  @click="taskAction(scope.row, '启动')">启动</span>
            <span class="opera" v-if="searchPercen(scope.row, 'id')==3" @click="taskAction(scope.row, '中止')">中止</span>
            <span class="opera" v-if="searchPercen(scope.row, 'id')<=1||searchPercen(scope.row, 'id')>=10"
                  @click="openDialog(scope.row)">编辑</span>
            <span class="opera"
                  v-if="searchPercen(scope.row, 'id')==4||searchPercen(scope.row, 'id')<=1||searchPercen(scope.row, 'id')>=10"
                  @click="taskAction(scope.row, '删除')">删除</span>
            <span class="opera" v-if="searchPercen(scope.row, 'id')==4||searchPercen(scope.row, 'id')>=10"
                  @click="openDialog(scope.row, 'copy')">复制</span>
            <router-link :to="{ path : '/sdl/octopus/vulnerability',query: {oct_task_main_id:scope.row.oct_task_main_id} }">
              <span v-if="searchPercen(scope.row, 'id')==4" style="color:#FC9153" @click="changeTitle('查看漏洞')">漏洞</span>
            </router-link>
            <span class="opera" @click="openDialogDetail(scope.row)">详情</span>
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

      <!-- 添加扫描任务-弹窗 -->
      <!-- <create-task :title="dialogTitle" :formVisible='dialogFormVisible'></create-task> -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogFormVisible"
        width="800px">
        <div id="createTask">
          <create-task @close="handleCreateTaskClose"></create-task>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {connect} from '@/lib'
  import * as CONSTANTS from '@/commons/octopus'
  import bus from '@/routes/eventBus'
  import createTask from './components/edit'

  export default connect(() => {
    return {
      user: 'user/user',
      taskList: 'octopus_task/taskList',
      num: 'octopus_task/taskListLength',
      statusTaskList: 'octopus_task/statusTaskList'
    }
  }, {
    getTaskList: 'octopus_task/getTaskList',
    getTaskInfo: 'octopus_task/getTaskInfo',
    startTask: 'octopus_task/startTask',
    stopTask: 'octopus_task/stopTask',
    retestTask: 'octopus_task/retestTask',
    deleteTask: 'octopus_task/deleteTask',
    updateTask: 'octopus_task/updateTask',
    createTask: 'octopus_task/createTask',
    pluginsTaskList: 'octopus_task/pluginsTaskList',
    periodTaskTime: 'octopus_task/periodTaskTime',
    execTask: 'octopus_task/execTask',
    statusTask: 'octopus_task/statusTask',
    signAgreementUserAuth: 'octopus_userauth/signAgreementUserAuth',
    getUserAuth: 'octopus_userauth/getUserAuth'
  })({
    name: 'octopus-task-list',
    components: {
      createTask
    },
    data() {
      return {
        show: false,
        taskStatus: CONSTANTS.taskStatus,
        execType: CONSTANTS.execType,
        sourceType: CONSTANTS.sourceType,
        taskBasic: [],
        sendScanDetail: '',
        basicDetail: '',
        dataStatus: 0,
        queryParam: {
          page: 1,
          limit: 10,
          keywords: {
            target_address: '',
            exec_type: '',
            oct_task_main_id: '',
            send_to_scan_params: '',
            octopus_task_status: '',
            username: '',
            source_type: '',
            task_name: ''
          }
        },
        dialogTitle: '添加扫描任务',
        dialogFormVisible: false,
        plugins: [],
        periodTime: {
          week_time: null,
          day_time: '0',
          clock_time: '00:00:00'
        }
      }
    },
    created() {
      this.fetchData()

      // this.pluginsTaskList().then(res => {
      //   this.plugins = res.octopus
      //   this.dataSecPlugins = res.datasec
      // })
    },

    mounted() {
      setInterval(this.fetchData, 60000);
    },

    methods: {
      handleCreateTaskClose() {
        this.dialogFormVisible = false
      },

      fetchData() {
        let queryParam = {queryParam: this.queryParam}
        this.getTaskList(queryParam.queryParam).then(res => {
          let octopusTaskIds = []
          for (let i = 0; i < this.taskList.length; i++) {
            octopusTaskIds.push({
              octopus_task_id: this.taskList[i].octopus_task_id,
              source_type: this.taskList[i].source_type,
              oct_task_main_id: this.taskList[i].oct_task_main_id
            })
          }

          let params = {task_id_list: octopusTaskIds}
          this.statusTask(params).then(res => {
          })
        })
      },

      searchTask() {
        this.fetchData()
      },

      searchType(name) {
        if (name == 1) {
          return '立即执行'
        }
        if (name == 2) {
          return '计划任务'
        }
        if (name == 3) {
          return '周期任务'
        }
      },
      searchPercen(octopusTask, name) {
        let taskId = octopusTask.octopus_task_id
        let mainId = octopusTask.oct_task_main_id
        if (this.statusTaskList.length > 0) {
          for (let i = 0; i < this.statusTaskList.length; i++) {
            if ((this.statusTaskList[i].octopus_task_id && this.statusTaskList[i].octopus_task_id == taskId) || (this.statusTaskList[i].oct_task_main_id && this.statusTaskList[i].oct_task_main_id == mainId)) {
              if (name == 'process') {
                return this.statusTaskList[i].process
              }
              if (name == 'id') {
                return this.statusTaskList[i].status_no
              }
              return this.statusTaskList[i].action
            }
          }
        }
      },

      // 控制添加、编辑页面展示
      openDialog(data = '', opera) {

        if (data) {
          if (opera == 'copy') {
            this.dataStatus = 2
            this.dialogTitle = '新建扫描任务'
          } else {
            this.dataStatus = 1
            this.dialogTitle = '编辑扫描任务'
          }
          let obj = JSON.parse(data.user_raw_params)
          this.task = {
            oct_task_main_id: data.oct_task_main_id,
            task_name: obj.task_name,
            exec_type: this.transform(obj.exec_type, 'string'),
            periodic_task_id: obj.periodic_task_id,
            task_exec_crontab_time: obj.task_exec_crontab_time,
            target_from: this.transform(obj.target_from, 'string'),
            target: obj.target,
            target_address: this.transform(obj.target_address, 'array'),
            target_filter: obj.target_filter,
            custom_header: {
              uri_param_filters: this.transform(obj.custom_header.uri_param_filters, 'array'),
              new_headers: this.transform(obj.custom_header.new_headers, 'array')
            },
            pluginOption: obj.pluginOption.split(','),
            hostbind: this.transform(obj.hostbind, 'arrhostbind'),
            globalCookie: obj.globalCookie,
            noticeMail: obj.noticeMail
          }
          if (this.task.pluginOption[0] == '') {
            this.task.pluginOption.splice(0, 1)
          }
        } else {
          this.dialogTitle = '添加扫描任务'
          this.dataStatus = 2
          this.task = {
            task_name: '',
            exec_type: '1',
            periodic_task_id: 0,
            task_exec_crontab_time: '',
            target_from: '1',
            target: [{
              method: '',
              url: '',
              content_type: '',
              headers: [{name: '', value: '', key: Math.random() * Math.random() + 1}],
              cookie: '',
              body: [{name: '', value: '', key: Math.random() * Math.random() + 1}]
            }],
            target_address: [{value: '', key: Math.random() * Math.random() + 1}],
            target_filter: '',
            custom_header: {
              uri_param_filters: [{name: '', value: '', key: Math.random() * Math.random() + 1}],
              new_headers: [{name: '', value: '', key: Math.random() * Math.random() + 1}]
            },
            pluginOption: [],
            hostbind: [{name: '', value: '', key: Math.random() * Math.random() + 1}],
            globalCookie: '',
            noticeMail: this.user.username
          }
          for (let i = 0; i < this.plugins.length; i++) {
            this.task.pluginOption.push(this.plugins[i].plugins_mark)
          }
        }
        this.dialogFormVisible = true
      },
      openDialogDetail(data) {
        for (let i = 0; i < this.sourceType.length; i++) {
          if (data.source_type == this.sourceType[i].value) {
            data.source_type = this.sourceType[i].label
          }
        }
        this.taskBasic = [
          {label_1: '主键ID', value_1: data.oct_task_main_id, label_2: '任务名称', value_2: data.task_name},
          {
            label_1: 'Octopus任务ID',
            value_1: data.octopus_task_id,
            label_2: 'Octopus任务状态',
            value_2: data.octopus_task_status
          },
          {label_1: '参数ID', value_1: data.oct_param_id, label_2: '任务创建者', value_2: data.sso_creator},
          {label_1: '周期任务ID', value_1: data.periodic_task_id, label_2: '扫描目标', value_2: data.target_address},
          {label_1: '任务启动次数', value_1: data.octopus_task_sum, label_2: '任务描述', value_2: data.description},
          {label_1: '执行类型', value_1: data.exec_type, label_2: '任务创建时间', value_2: data.create_time},
          {label_1: '任务URL资产数', value_1: data.task_target_count, label_2: '任务更新时间', value_2: data.update_time},
          {label_1: '执行类型', value_1: data.source_type, label_2: '下次执行时间', value_2: data.task_exec_crontab_time}
        ]
        this.sendScanDetail = data.send_to_scan_params
        console.log(this.sendScanDetail)
        let json = this.sendScanDetail
        json = JSON.parse(json)
        json = JSON.stringify(json)
        console.log(json)
        this.basicDetail = data.user_raw_params
        this.taskDetailFormVisible = true
      },

      // 重要操作提示框
      taskAction(task, actionType) {
        let param = {
          octopus_task_id: task.octopus_task_id,
          oct_task_main_id: task.oct_task_main_id,
          source_type: task.source_type
        }
        let params = {
          oct_task_main_id: task.oct_task_main_id,
          octopus_task_id: task.octopus_task_id,
          oct_param_id: task.oct_param_id,
          source_type: task.source_type
        }
        this.$confirm('此操作将' + actionType + '扫描任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (actionType === '启动') {
            this.startTaskByTaskId(param)
          }
          if (actionType === '中止') {
            this.stopTaskByTaskId(param)
          }
          if (actionType === '复测') {
            this.retestTaskByTaskId(param)
          }
          if (actionType === '删除') {
            this.delTask(params)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消' + actionType
          });
        });
      },
      startTaskByTaskId(taskId) {
        this.startTask(taskId).then(
          this.fetchData()
        )
      },
      stopTaskByTaskId(taskId) {
        this.stopTask(taskId).then(
          this.fetchData()
        )
      },
      retestTaskByTaskId(taskId) {
        this.retestTask(taskId).then(
          this.fetchData()
        )
      },
      delTask(taskId) {
        this.deleteTask(taskId).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '操作成功',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '操作失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.fetchData()
        })
      },

      // 分页
      handleSizeChange(val) {
        this.queryParam.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryParam.page = val
        this.fetchData()
      },

      toggleAssetView(value) {
        this.task.target_from = value
      },
      changeTitle(name) {
        bus.$emit('changeTitle', name)
      },
      transform(val, targetType) {
        switch (targetType) {
          case 'number':
            return parseInt(val)
          case 'string':
            if (Array.isArray(val) == true) {
              let arr = []
              for (let i = 0; i < val.length; i++) {
                arr.push(val[i].value)
              }
              return arr.join(',')
            }
            if (typeof (val) == 'number') {
              return '' + val
            }
            break
          case 'object':
            let obj = {}
            if (Array.isArray(val)) {
              for (let i = 0; i < val.length; i++) {
                if (val[i].name) {
                  obj[val[i].name] = val[i].value
                }
              }
            }
            return obj
          case 'array':
            if (Array.isArray(val)) {
              return val
            }
            if (typeof (val) == 'object') {
              let arr = []
              for (let item in val) {
                if (Object.prototype.hasOwnProperty.call(val, item)) {
                  arr.push({name: item, value: val[item], key: Math.random() * Math.random() + 1})
                }
              }
              if (arr.length == 0) {
                arr.push({name: '', value: '', key: Math.random() * Math.random() + 1})
              }
              return arr
            }
            if (typeof (val) == 'string') {
              let arr = val.split(',')
              for (let i = 0; i < arr.length; i++) {
                arr[i] = {value: arr[i], key: Math.random() * Math.random() + 1}
              }
              if (arr.length == 0) {
                arr.push({value: '', key: Math.random() * Math.random() + 1})
              }
              return arr
            }
            break
          case 'hostbind':
            let arr = []
            for (let i = 0; i < val.length; i++) {
              arr[i] = val[i].name + '|' + val[i].value
            }
            if (arr.length != 0) {
              return arr.join(',')
            }
            return ''
          case 'arrhostbind':
            let a = val.split(',')
            for (let i = 0; i < a.length; i++) {
              let arr = a[i].split('|')
              a[i] = {name: arr[0], value: arr[1], key: Math.random() * Math.random() + 1}
            }
            return a
        }
      },
      close() {
        this.$emit('close')
      }
    }
  })
</script>

<style lang='less'>
  #task {
    .octopus-btn {
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
      // font-weight: 100;
      // line-height: 31px;
      span {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        // font-weight: 100;
      }
    }
    .floatR {
      float: right;
      position: relative;
      top: 5px;
    }
    .add-btn {
      background: white;
      color: #fc9153 !important;
      border-radius: 4px;
      float: right;
      margin-left: 15px;
      border: 1px solid #fc9153;
      height: 32px;
      width: 100px;
      -webkit-font-smoothing: antialiased;
    }

    .dialog-button {
      width: 90px;
      // font-weight: 100;
    }
    .dialog-btn {
      background: #fc9153;
      border-radius: 4px;
      height: 36px;
      width: 90px;
      padding: 5px;
      border: none;
      // font-weight: 100;
      margin-right: 13px;
    }

    .el-main {
      width: 100%;
      box-sizing: border-box;
      background: white;
      // margin-bottom: 15px;
      // padding: 20px;
      // margin-left: -0px;
      // margin-top: -15px;
      // padding-right: -20px;
      .displayFlex {
        display: flex;
      }
      .searchForm {
        .searchInput {
          width: 230px;
        }
      }
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

    .opera {
      color: #FC9153;
      cursor: pointer;
      display: block;
    }
  }

  #createTask {
    // width: 100%;
    box-sizing: border-box;
    background: white;
    // padding: 0 20px;
    .el-dialog__body {
      // padding: 0px !important;
    }
    .elForm {
      .el-form-item__label {
        width: 140px;
        text-align: left;
        display: inline-block;
      }
      .inputStyle {
        width: 400px;
      }
      .myIcon {
        color: #FC9153;
        font-size: 16px;
        cursor: pointer;
        position: relative;
        top: 0px;
        left: 10px;
      }
      .myIcon:hover {
        top: 1.5px;
      }
      .doubleInput {
        width: 195px;
      }
      .el-col-11 {
        width: 195px;
      }
      .el-col-2 {
        width: 10px;
        text-align: center;
      }

    }
    .task-button {
      // font-weight: 300;
      float: right;
      -webkit-font-smoothing: antialiased;
      margin-left: 20px;
      margin-top: 15px;
      width: 120px;
      font-size: 13px;
    }
    .task-btn {
      // font-weight: 100;
      padding-left: 10px;
      padding-right: 10px;
      font-size: 13px;
      -webkit-font-smoothing: antialiased;
      float: right;
      background: #FC9153;
      border: #FC9153;
      color: white;
      margin-left: 20px;
      margin-top: 15px;
      width: 120px;
    }
    .highAdvance {
      cursor: pointer;
      margin-bottom: 5px;
    }
    .el-icon-caret-bottom {
      color: #FC9153
    }
    .el-icon-caret-left {
      color: #FC9153
    }
    .el-icon-caret-top {
      color: #FC9153
    }
    .el-icon-caret-right {
      color: #FC9153
    }
  }
</style>
