<template>
    <div id="createTask">
        <el-tabs type=""  v-model="task.target_from">
            <!-- 快速扫描模块 -->
            <el-tab-pane label="快速扫描" name=1>
                <el-form class='elForm'>
                    <el-form-item label="任务名称">
                        <el-input class="inputStyle"
                                v-model="task.task_name"
                                clearable
                                placeholder="请输入任务名称"
                                auto-complete="off">
                        </el-input>
                    </el-form-item>
                    <el-form-item class="labelWidth"  v-for="(item, index) in task.target_address" :key='index' :label="index==0?'测试地址':'测试地址'">
                        <el-input class="inputStyle"
                                v-model="task.target_address[index]"
                                clearable
                                placeholder="请输入测试地址"
                                auto-complete="off">
                        </el-input>
                        <i v-if="task.target_address.length==index+1" class="myIcon el-icon-circle-plus-outline" @click="addAddress"></i>
                        <i v-if="task.target_address.length>index+1" class="myIcon el-icon-remove-outline" @click="subAddress(index)"></i>
                    </el-form-item>
                </el-form>
                <!-- 高级参数 -->
                <el-form class='elForm'>
                    <el-form-item label="扫描周期">
                        <el-radio class="label" v-model="task.exec_type" label=1>
                            立即执行
                        </el-radio>
                        <el-radio class="label" v-model="task.exec_type" label=2>
                            计划任务
                            <el-date-picker  v-if="task.exec_type==2"
                                v-model="task.task_exec_crontab_time"
                                type="date"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-radio>
                        <el-radio class="label" v-model="task.exec_type" label=3>
                            周期任务
                            <el-select v-if="task.exec_type==3" style="width: 100px" v-model="periodTime.week_time" placeholder="请选择">
                                <el-option-group
                                    v-for="group in timeOptions"
                                    :key="group.label"
                                    :label="group.label">
                                    <el-option
                                        v-for="item in group.options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-option-group>
                            </el-select>
                            <el-time-picker v-if="task.exec_type==3"
                                v-show="periodTime.week_time!=null&&periodTime.week_time!=0?true:false"
                                v-model="task.task_exec_crontab_time"
                                :picker-options="{
                                selectableRange: '00:00:00 - 23:59:59'
                                }"
                                @change="sendPeriodTime"
                                placeholder="任意时间点">
                            </el-time-picker>
                            <el-select v-if="task.exec_type==3" @change="sendPeriodTime"
                             v-show="periodTime.week_time=='0'?true:false"
                             style="width: 100px" v-model="periodTime.day_time" placeholder="请选择">
                                <el-option-group>
                                    <el-option
                                        v-for="item in 30"
                                        :key="item"
                                        :label="item+'号'"
                                        :value="'' +item">
                                    </el-option>
                                </el-option-group>
                            </el-select>
                        </el-radio>
                    </el-form-item>
                </el-form>
                <el-form class='elForm'>
                    <el-form-item label="关键字过滤">
                        <el-input class="inputStyle"
                                v-model="task.target_filter"
                                clearable
                                placeholder="多个以逗号相隔，带有此字段的接口不被扫描"
                                auto-complete="off">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="参数替换或追加" v-for="(item, index) in task.custom_header.uri_param_filters" :key="item[0]">
                        <el-col :span="11">
                            <el-input class="doubleInput"
                                    v-model="item[0]"
                                    clearable
                                    placeholder="参数替换或追加"
                                    auto-complete="off">
                            </el-input>
                        </el-col>
                        <el-col class="line" :span="2">=</el-col>
                        <el-col :span="11">
                            <el-input class="doubleInput"
                                    v-model="item[1]"
                                    clearable
                                    placeholder="参数替换或追加"
                                    auto-complete="off">
                            </el-input>
                        </el-col>
                        <i v-if="task.custom_header.uri_param_filters.length==index+1" class="myIcon el-icon-circle-plus-outline" @click="addProperty(task.custom_header.uri_param_filters)"></i>
                        <i v-if="task.custom_header.uri_param_filters.length>index+1" class="myIcon el-icon-remove-outline" @click="subProperty(task.custom_header.uri_param_filters, index)"></i>
                    </el-form-item>
                    <el-form-item label="请求头替换或追加" v-for="(item, index) in task.custom_header.new_headers" :key="item[0]">
                        <el-col :span="11">
                            <el-input class="doubleInput"
                                    v-model="item[0]"
                                    clearable
                                    placeholder="请求头替换或追加"
                                    auto-complete="off">
                            </el-input>
                        </el-col>
                        <el-col class="line" :span="2">=</el-col>
                        <el-col :span="11">
                            <el-input class="doubleInput"
                                    v-model="item[1]"
                                    clearable
                                    placeholder="请求头替换或追加"
                                    auto-complete="off">
                            </el-input>
                        </el-col>
                        <i v-if="task.custom_header.new_headers.length==index+1" class="myIcon el-icon-circle-plus-outline" @click="addProperty(task.custom_header.new_headers)"></i>
                        <i v-if="task.custom_header.new_headers.length>index+1" class="myIcon el-icon-remove-outline" @click="subProperty(task.custom_header.new_headers, index)"></i>
                    </el-form-item>
                    <el-form-item label="扫描插件">
                        <el-select class="inputStyle"
                        filterable
                            remote
                            clearable
                            reserve-keyword
                            :multiple="true"
                            v-model="task.pluginOption"  placeholder="请选择扫描插件">
                            <el-option
                            v-for="item in plugins" :key = item.plugins_name
                             :label="item.plugins_name" :value="item.plugins_mark"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="hostbind" v-for="(item, index) in task.hostbind" :key="index">
                        <el-col :span="11">
                            <el-input class="doubleInput"
                                    v-model="item[0]"
                                    clearable
                                    placeholder="请输入绑定host域名"
                                    auto-complete="off">
                            </el-input>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-input class="doubleInput"
                                    v-model="item[1]"
                                    clearable
                                    placeholder="请输入绑定hostIP地址"
                                    auto-complete="off">
                            </el-input>
                        </el-col>
                        <i v-if="task.hostbind.length==index+1" class="myIcon el-icon-circle-plus-outline" @click="addProperty(task.hostbind)"></i>
                        <i v-if="task.hostbind.length>index+1" class="myIcon el-icon-remove-outline" @click="subProperty(task.hostbind, index)"></i>
                    </el-form-item>
                    <el-form-item label="扫描通知">
                        <app-employee class="inputStyle" v-model="task.noticeMail"></app-employee>
                    </el-form-item>
                    <el-form-item label="全局cookie">
                        <el-input class="inputStyle"
                                v-model="task.globalCookie"
                                clearable
                                placeholder="请输入全局cookie"
                                auto-complete="off">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <!-- 精确扫描模块 -->
            <el-tab-pane label="精确扫描" name=2>基础参数
                <div style="margin-top: 15px;">
                    <el-input @focus="onFocus" placeholder="请输入地址" v-model="task.target[0].url" class="input-with-select">
                        <el-select style="width: 100px" v-model="task.target[0].method" slot="prepend" placeholder="请求方法">
                            <el-option label="get" value="get"></el-option>
                            <el-option label="post" value="post"></el-option>
                            <el-option label="put" value="put"></el-option>
                        </el-select>
                    </el-input>
                    <el-form class="elForm">
                        <el-form-item label="contentType：">
                            <el-select v-model="task.target[0].content_type"
                                    placeholder="请选择content_type"
                                    class="inputStyle">
                                <el-option label="application/json" value="application/json"></el-option>
                                <el-option label="application/x-www-form-urlencoded" value="application/x-www-form-urlencoded"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    
                </div>
            </el-tab-pane>
            <el-button class="task-button" @click="submitTaskForm">提交任务</el-button>
            <el-button class="task-button" >提交任务并扫描</el-button>
        </el-tabs>
        <el-dialog
        :title="123"
            :visible.sync="targetFormVisible"
            width="674px">
            <div slot="footer" class="dialog-footer">
                <el-button class="dialog-button" @click="targetFormVisible = false">取消</el-button>
                <el-button class="dialog-btn" type="warning" round 
                        style="background: #FC9153;border-radius: 4px;"
                        @click="submitTaskForm">确定
                </el-button>
            </div>
            </el-dialog>
    </div>
</template>
<script>
import {connect} from '@/lib'
  import * as CONSTANTS from '@/commons/octopus'

  export default connect(() => {
    return {
    }
  }, {
      createTask: 'octopus_task/createTask',
      pluginsTaskList: 'octopus_task/pluginsTaskList',
      periodTaskTime: 'octopus_task/periodTaskTime',
      execTask: 'octopus_task/execTask'
  })({
    name: 'octopus-createTask',
    data() {
      return {
        dialogTitle: '添加扫描任务',
        taskType: CONSTANTS.taskType,
        dialogFormVisible: false,
        targetFormVisible: false,
        timeOptions: [{options: [{label: '每月', value: '0'}]}, {
          label: '每周扫描',
          options: [{
            value: '1',
            label: '周一'
          }, {
            value: '2',
            label: '周二'
          }, {
            value: '3',
            label: '周三'
          }, {
            value: '4',
            label: '周四'
          }, {
            value: '5',
            label: '周五'
          }, {
            value: '6',
            label: '周六'
          }, {
            value: '7',
            label: '周天'
          }]
        }],
        plugins: [],
        periodTime: {
            week_time: null,
            day_time: '0',
            clock_time: '00:00:00'
        },
        task: {
          task_name: '',    // 任务名称
          exec_type: '1',    //  1: 立即执行 2：计划任务 3：周期任务 默认1
          periodic_task_id: 0, // 周期任务ID，异步请求独立接口返回这个id值
          task_exec_crontab_time: '',   // '2018-06-22 10:00:00'
          target_from: '1',    // 1.快速扫描 2.精准扫描
          target: [{
              method: '',
              url: '',
              content_type: '',
              headers: {},
              cookie: '',
              body: {}
          }],   // 精准扫描参数
          target_address: [''], // 测试地址：快速扫描参数  http://10.10.10.10,10.10.10.20,10.10.10.10:8080
          target_filter: '',    // 黑名单地址，值同test_address
          custom_header: {
              uri_param_filters: [['', '']],
              new_headers: [['', '']]
          },    // 自定义请求头
          pluginOption: '',     // # 绑定HOST(IP地址由上面测试地址选择，自己填host)
          hostbind: [['', '']],
          globalCookie: '',
          noticeMail: ''     // 扫描通知
        }
      }
    },
    props: [],
    watch: {
    },
    created() {
        this.pluginsTaskList().then(res => {
            this.plugins = res
        })
    },
    methods: {
        transform(val, targetType) {
            switch (targetType) {
                case 'number':
                    return parseInt(val)
                case 'string':
                    if (val instanceof Array == true) {
                        return val.join(',')
                    }
                    return '' + val
                case 'object':
                    let obj = {}
                    for (let i = 0; i < val.length; i++) {
                        obj[val[i][0]] = val[i][1]
                    }
                    return obj
                case 'array':
                    if (typeof (val) == 'object') {
                        let arr = []
                        for (let item in val) {
                            if (Object.prototype.hasOwnProperty.call(val, item)) {
                                arr.pus([item, val[item]])
                            }
                        }
                        return arr
                    }
                    return val.split(',')
            }
        },
        addAddress() {
            this.task.target_address.push('')
        },
        subAddress(index) {
            this.task.target_address.splice(index, 1)
        },
        addProperty(arr) {
            arr.push(['', ''])
        },
        subProperty(arr, index) {
            arr.splice(index, 1)
        },
        sendPeriodTime() {
            let params = {periodTime: this.periodTime}
            this.periodTaskTime(params.periodTime).then(res => {
                this.task.periodic_task_id = res.periodic_task_id
            })
        },
        close() {
            this.$emit('close')
        },
        onFocus() {
           this.targetFormVisible = true
        },

        // 发起创建于更新任务请求
      submitTaskForm() {
        if (this.task.task_id) {
          this.updateTaskInfo()
        } else {
          this.createTaskInfo()
        }
        this.dialogFormVisible = false
      },
      createTaskInfo() {
        let params = {task: this.task}
        params.task.target_address = this.transform(params.task.target_address, 'string')
        params.task.exec_type = this.transform(params.task.exec_type, 'number')
        params.task.target_from = this.transform(params.task.target_from, 'number')
        params.task.pluginOption = this.transform(params.task.pluginOption, 'string')
        params.task.custom_header.uri_param_filters = this.transform(params.task.custom_header.uri_param_filters, 'object')
        params.task.custom_header.new_headers = this.transform(params.task.custom_header.new_headers, 'object')
        params.task.hostbind = this.transform(params.task.hostbind, 'object')
        this.createTask(params.task).then(

            // this.$parent.fetchData()
            this.close()
        )
      },
      updateTaskInfo() {
        let params = {task: this.task}
        this.updateTask(params).then(
          this.fetchData()
        )
      }
    }
  })
</script>
<style lang="less">
#createTask{
    // width: 100%;
    box-sizing: border-box;
    background: white;
    // padding: 0 20px;
    .el-dialog__body{
            // padding: 0px !important;
    }
    .elForm{
        .el-form-item__label{
            width: 140px;
            text-align: left;
            display: inline-block;
        }
        .inputStyle{
            width: 400px;
        }
        .myIcon{
            color: #FC9153;
            font-size: 25px;
            cursor: pointer;
            position: relative;
            top: 5px;
            left: 10px;
        }
        .myIcon:hover{
            top: 4px;
        }
        .task-button{
            // font-weight: 300
        }
        .doubleInput{
            width: 195px;
        }
        .el-col-11{
            width: 195px;
        }
        .el-col-2{
            width: 10px;
            text-align: center;
        }
    }
    
}
</style>

