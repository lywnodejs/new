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
        width="674px">
        <div id="createTask">
          <el-tabs type="" v-model="task.target_from" @tab-click="handleTargetFrom">
            <!-- 快速扫描模块 -->
            <el-tab-pane label="快速扫描" name='1'>基础参数

              <el-form class='elForm' label-width="150px">
                <el-form-item label="任务名称">
                  <el-input class="inputStyle"
                            v-model="task.task_name"
                            clearable
                            placeholder="请输入任务名称"
                            auto-complete="off">
                  </el-input>
                </el-form-item>
                <el-form-item class="labelWidth" label="扫描目标">
                  <div v-for="(item, index) in task.target_address" :key='item.key'>
                    <el-input class="inputStyle"
                              v-model="item.value"
                              clearable
                              placeholder="请输入扫描目标"
                              auto-complete="off">
                    </el-input>
                    <i v-if="task.target_address.length==index+1" class="myIcon el-icon-circle-plus-outline"
                       @click="addAddress"></i>
                    <i v-if="task.target_address.length>index+1" class="myIcon el-icon-remove-outline"
                       @click="subAddress(index)"></i>
                  </div>
                </el-form-item>
              </el-form>
              <!-- 高级参数 -->
              <div class="highAdvance">
                <span @click="show = !show" v-if="show">高级参数&nbsp;<i class="el-icon-caret-bottom"></i></span>
                <span @click="show = !show" v-if="!show">高级参数&nbsp;<i class="el-icon-caret-left"></i></span>
              </div>
              <transition name="el-zoom-in-top">

                <div v-show="show" class="transition-box">
                  <el-form class='elForm' label-width="150px">
                    <el-form-item label="扫描周期">
                      <el-radio class="label" v-model="task.exec_type" label=1>
                        立即执行
                      </el-radio>
                      <br v-if="task.exec_type!=1">
                      <label v-if="task.exec_type!=1" for="" style="width: 136px;display: inline-block"></label>
                      <el-radio class="label" v-model="task.exec_type" label=2>
                        计划任务
                        <el-date-picker v-if="task.exec_type==2"
                                        v-model="task.task_exec_crontab_time"
                                        type="datetime"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期时间">
                        </el-date-picker>
                        <!-- <el-time-picker v-if="task.exec_type==2"
                            v-model="task.task_exec_crontab_time"
                            style="width: 150px"
                            :picker-options="{
                            selectableRange: '00:00:00 - 23:59:59'
                            }"
                            placeholder="任意时间点">
                        </el-time-picker> -->
                      </el-radio>
                      <br v-if="task.exec_type!=1">
                      <label v-if="task.exec_type!=1" style="width: 136px;display: inline-block"></label>
                      <el-radio class="label" v-model="task.exec_type" label=3>
                        周期任务
                        <el-select v-if="task.exec_type==3" style="width: 100px" v-model="periodTime.week_time"
                                   placeholder="请选择">
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
                        <el-select v-if="task.exec_type==3"
                                   v-show="periodTime.week_time=='0'?true:false"
                                   style="width: 100px" v-model="periodTime.day_time" placeholder="请选择">
                          <el-option-group>
                            <el-option
                              v-for="item in 30"
                              :key="item + 'ri'"
                              :label="item+'号'"
                              :value="'' +item">
                            </el-option>
                          </el-option-group>
                        </el-select>
                        <el-time-picker v-if="task.exec_type==3"
                                        v-show="periodTime.week_time!=null?true:false"
                                        v-model="periodTime.clock_time"
                                        style="width: 150px"
                                        :picker-options="{
                                selectableRange: '00:00:00 - 23:59:59'
                                }"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        @change="sendPeriodTime"
                                        placeholder="任意时间点">
                        </el-time-picker>
                      </el-radio>
                    </el-form-item>
                    <el-form-item label="关键字过滤">
                      <el-input class="inputStyle"
                                v-model="task.target_filter"
                                clearable
                                placeholder="多个以逗号相隔，带有此字段的接口不被扫描"
                                auto-complete="off">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="参数替换或追加">
                      <div v-for="(item, index) in task.custom_header.uri_param_filters" :key="item.key">
                        <el-col :span="11">
                          <el-input class="doubleInput"
                                    v-model="item.name"
                                    clearable
                                    placeholder="参数替换或追加"
                                    auto-complete="off">
                          </el-input>
                        </el-col>
                        <el-col class="line" :span="2">=</el-col>
                        <el-col :span="11">
                          <el-input class="doubleInput"
                                    v-model="item.value"
                                    clearable
                                    placeholder="参数替换或追加"
                                    auto-complete="off">
                          </el-input>
                        </el-col>
                        <i v-if="task.custom_header.uri_param_filters.length==index+1"
                           class="myIcon el-icon-circle-plus-outline"
                           @click="addProperty(task.custom_header.uri_param_filters)"></i>
                        <i v-if="task.custom_header.uri_param_filters.length>index+1"
                           class="myIcon el-icon-remove-outline"
                           @click="subProperty(task.custom_header.uri_param_filters, index)"></i>
                      </div>

                    </el-form-item>
                    <el-form-item label="请求头替换或追加">
                      <div v-for="(item, index) in task.custom_header.new_headers" :key="item.key">
                        <el-col :span="11">
                          <el-input class="doubleInput"
                                    v-model="item.name"
                                    clearable
                                    placeholder="请求头替换或追加"
                                    auto-complete="off">
                          </el-input>
                        </el-col>
                        <el-col class="line" :span="2">=</el-col>
                        <el-col :span="11">
                          <el-input class="doubleInput"
                                    v-model="item.value"
                                    clearable
                                    placeholder="请求头替换或追加"
                                    auto-complete="off">
                          </el-input>
                        </el-col>
                        <i v-if="task.custom_header.new_headers.length==index+1"
                           class="myIcon el-icon-circle-plus-outline"
                           @click="addProperty(task.custom_header.new_headers)"></i>
                        <i v-if="task.custom_header.new_headers.length>index+1" class="myIcon el-icon-remove-outline"
                           @click="subProperty(task.custom_header.new_headers, index)"></i>
                      </div>
                    </el-form-item>
                    <el-form-item label="扫描插件">
                      <el-select class="inputStyle"
                                 filterable
                                 remote
                                 clearable
                                 reserve-keyword
                                 :multiple="true"
                                 v-model="task.pluginOption" placeholder="请选择扫描插件">
                        <el-option
                          v-for="item in plugins" :key=item.plugins_name
                          :label="item.plugins_name" :value="item.plugins_mark"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="hostbind">
                      <div v-for="(item, index) in task.hostbind" :key="item.key">
                        <el-col :span="11">
                          <el-input class="doubleInput"
                                    v-model="item.name"
                                    clearable
                                    placeholder="请输入绑定host域名"
                                    auto-complete="off">
                          </el-input>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                          <el-input class="doubleInput"
                                    v-model="item.value"
                                    clearable
                                    placeholder="请输入绑定hostIP地址"
                                    auto-complete="off">
                          </el-input>
                        </el-col>
                        <i v-if="task.hostbind.length==index+1" class="myIcon el-icon-circle-plus-outline"
                           @click="addProperty(task.hostbind)"></i>
                        <i v-if="task.hostbind.length>index+1" class="myIcon el-icon-remove-outline"
                           @click="subProperty(task.hostbind, index)"></i>
                      </div>

                    </el-form-item>
                    <el-form-item label="默认修复人">
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
                </div>
              </transition>
            </el-tab-pane>
            <!-- 精确扫描模块 -->
            <el-tab-pane label="精确扫描" name='2'>基础参数
              <el-form class="elForm" label-width="150px">
                <el-form-item label="任务名称">
                  <el-input class="inputStyle"
                            v-model="task.task_name"
                            clearable
                            placeholder="请输入任务名称"
                            auto-complete="off">
                  </el-input>
                </el-form-item>
                <el-form-item label="输入URL">
                  <div v-for="(item, index) in task.target" :key="item.url">
                    <el-input class="inputStyle"
                              @focus="onFocus(item, index)"
                              v-model="item.url"
                              clearable
                              placeholder="输入URL"
                              auto-complete="off">
                    </el-input>
                    <i v-if="task.target.length==index+1" class="myIcon el-icon-circle-plus-outline"
                       @click="addURL(task.target)"></i>
                    <i v-if="task.target.length>index+1" class="myIcon el-icon-remove-outline"
                       @click="subProperty(task.target, index)"></i>
                  </div>

                </el-form-item>
              </el-form>
              <!-- 高级参数 -->
              <div class="highAdvance">
                <span @click="show = !show" v-if="show">高级参数<i class="el-icon-caret-bottom"></i></span>
                <span @click="show = !show" v-if="!show">高级参数<i class="el-icon-caret-left"></i></span>
              </div>
              <transition name="el-zoom-in-top">

                <div v-show="show" class="transition-box">
                  <el-form class='elForm' label-width="150px">
                    <el-form-item label="扫描周期">
                      <el-radio class="label" v-model="task.exec_type" label=1>
                        立即执行
                      </el-radio>
                      <br v-if="task.exec_type!=1">
                      <label v-if="task.exec_type!=1" for="" style="width: 136px;display: inline-block"></label>
                      <el-radio class="label" v-model="task.exec_type" label=2>
                        计划任务
                        <el-date-picker v-if="task.exec_type==2"
                                        v-model="task.task_exec_crontab_time"
                                        type="datetime"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期时间">
                        </el-date-picker>
                        <!-- <el-time-picker v-if="task.exec_type==2"
                            v-model="task.task_exec_crontab_time"
                            style="width: 150px"
                            :picker-options="{
                            selectableRange: '00:00:00 - 23:59:59'
                            }"
                            placeholder="任意时间点">
                        </el-time-picker> -->
                      </el-radio>
                      <br v-if="task.exec_type!=1">
                      <label v-if="task.exec_type!=1" style="width: 136px;display: inline-block"></label>
                      <el-radio class="label" v-model="task.exec_type" label=3>
                        周期任务
                        <el-select v-if="task.exec_type==3" style="width: 100px" v-model="periodTime.week_time"
                                   placeholder="请选择">
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
                        <el-select v-if="task.exec_type==3"
                                   v-show="periodTime.week_time=='0'?true:false"
                                   style="width: 100px" v-model="periodTime.day_time" placeholder="请选择">
                          <el-option-group>
                            <el-option
                              v-for="item in 30"
                              :key="item + 'ri'"
                              :label="item+'号'"
                              :value="'' +item">
                            </el-option>
                          </el-option-group>
                        </el-select>
                        <el-time-picker v-if="task.exec_type==3"
                                        v-show="periodTime.week_time!=null?true:false"
                                        v-model="periodTime.clock_time"
                                        style="width: 150px"
                                        :picker-options="{
                                selectableRange: '00:00:00 - 23:59:59'
                                }"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        @change="sendPeriodTime"
                                        placeholder="任意时间点">
                        </el-time-picker>
                      </el-radio>
                    </el-form-item>
                    <el-form-item label="关键字过滤">
                      <el-input class="inputStyle"
                                v-model="task.target_filter"
                                clearable
                                placeholder="多个以逗号相隔，带有此字段的接口不被扫描"
                                auto-complete="off">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="参数替换或追加">
                      <div v-for="(item, index) in task.custom_header.uri_param_filters" :key="item.key">
                        <el-col :span="11">
                          <el-input class="doubleInput"
                                    v-model="item.name"
                                    clearable
                                    placeholder="参数替换或追加"
                                    auto-complete="off">
                          </el-input>
                        </el-col>
                        <el-col class="line" :span="2">=</el-col>
                        <el-col :span="11">
                          <el-input class="doubleInput"
                                    v-model="item.value"
                                    clearable
                                    placeholder="参数替换或追加"
                                    auto-complete="off">
                          </el-input>
                        </el-col>
                        <i v-if="task.custom_header.uri_param_filters.length==index+1"
                           class="myIcon el-icon-circle-plus-outline"
                           @click="addProperty(task.custom_header.uri_param_filters)"></i>
                        <i v-if="task.custom_header.uri_param_filters.length>index+1"
                           class="myIcon el-icon-remove-outline"
                           @click="subProperty(task.custom_header.uri_param_filters, index)"></i>
                      </div>

                    </el-form-item>
                    <el-form-item label="请求头替换或追加">
                      <div v-for="(item, index) in task.custom_header.new_headers" :key="item.key">
                        <el-col :span="11">
                          <el-input class="doubleInput"
                                    v-model="item.name"
                                    clearable
                                    placeholder="请求头替换或追加"
                                    auto-complete="off">
                          </el-input>
                        </el-col>
                        <el-col class="line" :span="2">=</el-col>
                        <el-col :span="11">
                          <el-input class="doubleInput"
                                    v-model="item.value"
                                    clearable
                                    placeholder="请求头替换或追加"
                                    auto-complete="off">
                          </el-input>
                        </el-col>
                        <i v-if="task.custom_header.new_headers.length==index+1"
                           class="myIcon el-icon-circle-plus-outline"
                           @click="addProperty(task.custom_header.new_headers)"></i>
                        <i v-if="task.custom_header.new_headers.length>index+1" class="myIcon el-icon-remove-outline"
                           @click="subProperty(task.custom_header.new_headers, index)"></i>
                      </div>
                    </el-form-item>
                    <el-form-item label="扫描插件">
                      <el-select class="inputStyle"
                                 filterable
                                 remote
                                 clearable
                                 reserve-keyword
                                 :multiple="true"
                                 v-model="task.pluginOption" placeholder="请选择扫描插件">
                        <el-option
                          v-for="item in plugins" :key=item.plugins_name
                          :label="item.plugins_name" :value="item.plugins_mark"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="hostbind">
                      <div v-for="(item, index) in task.hostbind" :key="item.key">
                        <el-col :span="11">
                          <el-input class="doubleInput"
                                    v-model="item.name"
                                    clearable
                                    placeholder="请输入绑定host域名"
                                    auto-complete="off">
                          </el-input>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                          <el-input class="doubleInput"
                                    v-model="item.value"
                                    clearable
                                    placeholder="请输入绑定hostIP地址"
                                    auto-complete="off">
                          </el-input>
                        </el-col>
                        <i v-if="task.hostbind.length==index+1" class="myIcon el-icon-circle-plus-outline"
                           @click="addProperty(task.hostbind)"></i>
                        <i v-if="task.hostbind.length>index+1" class="myIcon el-icon-remove-outline"
                           @click="subProperty(task.hostbind, index)"></i>
                      </div>

                    </el-form-item>
                    <el-form-item label="默认修复人">
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
                </div>
              </transition>
            </el-tab-pane>
            <!-- 数据安全扫描模块 -->
            <el-tab-pane label="数据安全扫描" name='3'>基础参数
              <el-form class="elForm" label-width="150px">
                <el-form-item label="任务名称">
                  <el-input class="inputStyle"
                            v-model="task.task_name"
                            clearable
                            placeholder="请输入任务名称"
                            auto-complete="off">
                  </el-input>
                </el-form-item>
                <el-form-item class="labelWidth" label="扫描目标">
                  <div v-for="(item, index) in task.target_address" :key='item.key'>
                    <el-input class="inputStyle"
                              v-model="item.value"
                              clearable
                              placeholder="请输入扫描目标"
                              auto-complete="off">
                    </el-input>
                    <i v-if="task.target_address.length==index+1" class="myIcon el-icon-circle-plus-outline"
                       @click="addAddress"></i>
                    <i v-if="task.target_address.length>index+1" class="myIcon el-icon-remove-outline"
                       @click="subAddress(index)"></i>
                  </div>
                </el-form-item>
              </el-form>
              <!-- 高级参数 -->
              <div class="highAdvance">
                <span @click="show = !show" v-if="show">高级参数<i class="el-icon-caret-bottom"></i></span>
                <span @click="show = !show" v-if="!show">高级参数<i class="el-icon-caret-left"></i></span>
              </div>
              <transition name="el-zoom-in-top">

                <div v-show="show" class="transition-box">
                  <el-form class='elForm' label-width="150px">
                    <el-form-item label="扫描周期">
                      <el-radio class="label" v-model="task.exec_type" label=1>
                        立即执行
                      </el-radio>
                      <br v-if="task.exec_type!=1">
                      <label v-if="task.exec_type!=1" for="" style="width: 136px;display: inline-block"></label>
                      <el-radio class="label" v-model="task.exec_type" label=2>
                        计划任务
                        <el-date-picker v-if="task.exec_type==2"
                                        v-model="task.task_exec_crontab_time"
                                        type="datetime"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期时间">
                        </el-date-picker>
                        <!-- <el-time-picker v-if="task.exec_type==2"
                            v-model="task.task_exec_crontab_time"
                            style="width: 150px"
                            :picker-options="{
                            selectableRange: '00:00:00 - 23:59:59'
                            }"
                            placeholder="任意时间点">
                        </el-time-picker> -->
                      </el-radio>
                      <br v-if="task.exec_type!=1">
                      <label v-if="task.exec_type!=1" style="width: 136px;display: inline-block"></label>
                      <el-radio class="label" v-model="task.exec_type" label=3>
                        周期任务
                        <el-select v-if="task.exec_type==3" style="width: 100px" v-model="periodTime.week_time"
                                   placeholder="请选择">
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
                        <el-select v-if="task.exec_type==3"
                                   v-show="periodTime.week_time=='0'?true:false"
                                   style="width: 100px" v-model="periodTime.day_time" placeholder="请选择">
                          <el-option-group>
                            <el-option
                              v-for="item in 30"
                              :key="item + 'ri'"
                              :label="item+'号'"
                              :value="'' +item">
                            </el-option>
                          </el-option-group>
                        </el-select>
                        <el-time-picker v-if="task.exec_type==3"
                                        v-show="periodTime.week_time!=null?true:false"
                                        v-model="periodTime.clock_time"
                                        style="width: 150px"
                                        :picker-options="{
                                selectableRange: '00:00:00 - 23:59:59'
                                }"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        @change="sendPeriodTime"
                                        placeholder="任意时间点">
                        </el-time-picker>
                      </el-radio>
                    </el-form-item>
                    <el-form-item label="关键字过滤">
                      <el-input class="inputStyle"
                                v-model="task.target_filter"
                                clearable
                                placeholder="多个以逗号相隔，带有此字段的接口不被扫描"
                                auto-complete="off">
                      </el-input>
                    </el-form-item>
                    <el-form-item label="HIVE库 表">
                      <div v-for="(item, index) in task.target" :key="item.key">
                        <el-col :span="11">
                          <el-input class="doubleInput"
                                    v-model="item.db_name"
                                    clearable
                                    placeholder="hive库名"
                                    auto-complete="off">
                          </el-input>
                        </el-col>
                        <el-col class="line" :span="2">:</el-col>
                        <el-col :span="11">
                          <el-input class="doubleInput"
                                    v-model="item.table_name"
                                    clearable
                                    placeholder="表名，多个以逗号相隔"
                                    auto-complete="off">
                          </el-input>
                        </el-col>
                        <i v-if="task.target.length==index+1"
                           class="myIcon el-icon-circle-plus-outline"
                           @click="addTarget(task.target)"></i>
                        <i v-if="task.target.length>index+1"
                           class="myIcon el-icon-remove-outline"
                           @click="subTarget(task.target, index)"></i>
                      </div>

                    </el-form-item>

                    <el-form-item label="扫描插件">
                      <el-select class="inputStyle"
                                 filterable
                                 remote
                                 clearable
                                 reserve-keyword
                                 :multiple="true"
                                 v-model="task.pluginOption" placeholder="请选择扫描插件">
                        <el-option
                          v-for="item in dataSecPlugins" :key=item.plugins_name
                          :label="item.plugins_name" :value="item.plugins_mark"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="默认修复人">
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
                </div>
              </transition>
            </el-tab-pane>


            <el-button v-if="dataStatus==2&&task.exec_type==1" class="task-btn" @click="submitTaskInfo('exec')">
              提交并立即执行
            </el-button>
            <el-button v-if="dataStatus==2" class="task-button" @click="submitTaskInfo('create')">保存任务</el-button>
            <el-button v-if="dataStatus==1" class="task-btn" @click="updateTaskInfo">保存</el-button>
            <el-button v-if="dataStatus==1" class="task-button" @click="dialogFormVisible = false">取消</el-button>
          </el-tabs>

          <el-dialog
            title='详细编辑'
            :visible.sync="targetFormVisible"
            width="674px"
            append-to-body>
            <div id="createTaskTargetParam">
              <el-form class="elForm" label-width="150px">
                <el-form-item label="输入URL">
                  <el-input class="inputStyle"
                            v-model="targetParam.url"
                            clearable
                            placeholder="输入URL"
                            auto-complete="off">
                  </el-input>
                </el-form-item>
                <el-form-item label="选择请求方法">
                  <el-select v-model="targetParam.method" placeholder="请求方法" class="inputStyle">
                    <el-option label="GET" value="GET"></el-option>
                    <el-option label="POST" value="POST"></el-option>
                    <el-option label="PUT" value="PUT"></el-option>
                    <el-option label="DELETE" value="DELETE"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Content-Type">
                  <el-select v-model="targetParam.content_type"
                             placeholder="请选择content_type"
                             class="inputStyle">
                    <el-option label="application/json" value="application/json"></el-option>
                    <el-option label="application/x-www-form-urlencoded"
                               value="application/x-www-form-urlencoded"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="请输入headers">
                  <div v-for="(item, index) in targetParam.headers" :key="item.key">
                    <el-col :span="11">
                      <el-input class="doubleInput"
                                v-model="item.name"
                                clearable
                                placeholder="请输入headers key"
                                auto-complete="off">
                      </el-input>
                    </el-col>
                    <el-col class="line" :span="2">=</el-col>
                    <el-col :span="11">
                      <el-input class="doubleInput"
                                v-model="item.value"
                                clearable
                                placeholder="请输入headers val"
                                auto-complete="off">
                      </el-input>
                    </el-col>
                    <i v-if="targetParam.headers.length==index+1" class="myIcon el-icon-circle-plus-outline"
                       @click="addProperty(targetParam.headers)"></i>
                    <i v-if="targetParam.headers.length>index+1" class="myIcon el-icon-remove-outline"
                       @click="subProperty(targetParam.headers, index)"></i>
                  </div>

                </el-form-item>
                <el-form-item label="请输入body">
                  <div v-for="(item, index) in targetParam.body" :key="item.key">
                    <el-col :span="11">
                      <el-input class="doubleInput"
                                v-model="item.name"
                                clearable
                                placeholder="请输入body key"
                                auto-complete="off">
                      </el-input>
                    </el-col>
                    <el-col class="line" :span="2">=</el-col>
                    <el-col :span="11">
                      <el-input class="doubleInput"
                                v-model="item.value"
                                clearable
                                placeholder="请输入body val"
                                auto-complete="off">
                      </el-input>
                    </el-col>
                    <i v-if="targetParam.body.length==index+1" class="myIcon el-icon-circle-plus-outline"
                       @click="addProperty(targetParam.body)"></i>
                    <i v-if="targetParam.body.length>index+1" class="myIcon el-icon-remove-outline"
                       @click="subProperty(targetParam.body, index)"></i>
                  </div>

                </el-form-item>
                <el-form-item label="输入Cookie">
                  <el-input class="inputStyle"
                            v-model="targetParam.cookie"
                            clearable
                            placeholder="输入Cookie"
                            auto-complete="off">
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button class="task-button" @click="targetFormVisible = false">取消</el-button>
              <el-button class="task-btn" type="warning" round style="background: #FC9153;border-radius: 4px;"
                         @click="changeTargetParam(targetParam)">
                确定
              </el-button>
            </div>
          </el-dialog>
        </div>
      </el-dialog>
    </div>

    <el-dialog
      title="任务详情"
      :visible.sync="taskDetailFormVisible"
      width="674px">
      <!-- <el-tabs type="card" style="width: 100%"> -->
      <el-tabs type="">
        <el-tab-pane label="基本信息">
          <el-table
            :data="taskBasic"
            :show-header='false'
            border
            v-loading>
            <el-table-column
              prop="label_1"
              align="left"
              min-width="25">
            </el-table-column>
            <el-table-column
              align="left"
              min-width="38%">
              <template slot-scope="scope">
                <span>{{scope.row.value_1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="label_2"
              align="left"
              min-width="25">
            </el-table-column>
            <el-table-column
              align="left"
              min-width="36%">
              <template slot-scope="scope">
                <span>{{scope.row.value_2}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label=" 扫描参数详情">
          {{sendScanDetail}}
        </el-tab-pane>
        <el-tab-pane label="原始参数详情">
          {{basicDetail}}
        </el-tab-pane>
      </el-tabs>

    </el-dialog>
  </div>
</template>

<script>
  import {connect} from '@/lib'
  import * as CONSTANTS from '@/commons/octopus'
  import bus from '@/routes/eventBus'

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
    data() {
      return {
        show: false,
        targetFrom: CONSTANTS.targetFrom,
        privilege: CONSTANTS.privilege,
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
        taskType: CONSTANTS.taskType,
        dialogFormVisible: false,
        targetFormVisible: false,
        taskDetailFormVisible: false,
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
        dataSecPlugins: [],
        plugins: [],
        periodTime: {
          week_time: null,
          day_time: '0',
          clock_time: '00:00:00'
        },
        tabName: 1,
        task: {
          task_name: '',    // 任务名称
          exec_type: '1',    //  1: 立即执行 2：计划任务 3：周期任务 默认1
          periodic_task_id: 0, // 周期任务ID，异步请求独立接口返回这个id值
          task_exec_crontab_time: '',   // '2018-06-22 10:00:00'
          target_from: '1',    // 1.快速扫描 2.精准扫描 3.数据扫描
          target: [{
            method: '',
            url: '',
            content_type: '',
            headers: [{name: '', value: '', key: Math.random() * Math.random() + 1}],
            cookie: '',
            body: [{name: '', value: '', key: Math.random() * Math.random() + 1}]
          }],   // 精准扫描参数
          target_address: [''], // 测试地址：快速扫描参数  http://10.10.10.10,10.10.10.20,10.10.10.10:8080
          target_filter: '',    // 黑名单地址，值同test_address
          custom_header: {
            uri_param_filters: [{name: '', value: '', key: Math.random() * Math.random() + 1}],
            new_headers: [{name: '', value: '', key: Math.random() * Math.random() + 1}]
          },    // 自定义请求头
          pluginOption: [],     // # 绑定HOST(IP地址由上面测试地址选择，自己填host)
          hostbind: [{name: '', value: '', key: Math.random() * Math.random() + 1}],
          globalCookie: '',
          noticeMail: ''  // 扫描通知
        },
        targetParam: {
          method: '',
          url: '',
          content_type: '',
          headers: [{name: '', value: '', key: Math.random() * Math.random() + 1}],
          cookie: '',
          body: [{name: '', value: '', key: Math.random() * Math.random() + 1}],
          number: null
        }
      }
    },
    created() {
      this.getUserInfo()
      this.fetchData()
      this.pluginsTaskList().then(res => {
        this.plugins = res.octopus
        this.dataSecPlugins = res.datasec
      })
    },
    mounted() {
      setInterval(this.fetchData, 60000);
    },
    methods: {
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
      addAddress() {
        this.task.target_address.push({value: '', key: Math.random() * Math.random() + 1})
      },
      subAddress(index) {
        this.task.target_address.splice(index, 1)
      },
      addProperty(arr) {
        arr.push({name: '', value: '', key: Math.random() * Math.random() + 1})
      },
      subProperty(arr, index) {
        arr.splice(index, 1)
      },
      addTarget(arr) {
        arr.push({})
      },
      subTarget(arr, index) {
        arr.splice(index, 1)
      },
      addURL(arr) {
        let targetParam = {
          method: '',
          url: '',
          content_type: '',
          headers: [{name: '', value: '', key: Math.random() * Math.random() + 1}],
          cookie: '',
          body: [{name: '', value: '', key: Math.random() * Math.random() + 1}]
        }
        arr.push(targetParam)
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
      onFocus(item, index) {
        let obj = item
        obj.body = this.transform(obj.body, 'array')
        obj.headers = this.transform(obj.headers, 'array')
        this.targetParam = JSON.parse(JSON.stringify(obj))
        this.targetParam.number = index
        this.targetFormVisible = true
      },
      changeTargetParam(targetParam) {
        let obj = targetParam
        obj.body = this.transform(obj.body, 'object')
        obj.headers = this.transform(obj.headers, 'object')
        this.task.target[targetParam.number] = JSON.parse(JSON.stringify(obj))
        this.targetFormVisible = false
      },

      // 发起创建于更新任务请求
      submitTaskInfo(method) {
        let params = {task: this.task}
        params.task.target_address = this.transform(params.task.target_address, 'string')
        params.task.exec_type = this.transform(params.task.exec_type, 'number')
        params.task.target_from = this.transform(params.task.target_from, 'number')
        params.task.pluginOption = params.task.pluginOption.join(',')
        params.task.custom_header.uri_param_filters = this.transform(params.task.custom_header.uri_param_filters, 'object')
        params.task.custom_header.new_headers = this.transform(params.task.custom_header.new_headers, 'object')
        params.task.hostbind = this.transform(params.task.hostbind, 'hostbind')
        if (method == 'create') {
          this.createTask(params.task).then(response => {
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
            this.close()
          })
        }
        if (method == 'exec') {
          this.execTask(params.task).then(response => {
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
            this.close()
          })
        }
        this.dialogFormVisible = false
      },
      updateTaskInfo() {
        let params = {task: this.task}
        this.dialogFormVisible = false
        params.task.target_address = this.transform(params.task.target_address, 'string')
        params.task.exec_type = this.transform(params.task.exec_type, 'number')
        params.task.target_from = this.transform(params.task.target_from, 'number')
        params.task.pluginOption = params.task.pluginOption.join(',')
        params.task.custom_header.uri_param_filters = this.transform(params.task.custom_header.uri_param_filters, 'object')
        params.task.custom_header.new_headers = this.transform(params.task.custom_header.new_headers, 'object')
        params.task.hostbind = this.transform(params.task.hostbind, 'hostbind')
        this.updateTask(params.task).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '修改成功',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '修改失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.fetchData()
          this.close()
        })
        this.dialogFormVisible = false
      },
      getUserInfo() {
        let param = {username: this.user.username}
        this.getUserAuth(param).then(res => {
          if (res.data.user_agreement_status !== 'yes') {
            this.open()
          }
        })
      },
      confirm() {
        let param = {user_agreement_status: 'yes'}
        this.signAgreementUserAuth(param).then(res => {
          if (res.errno == 0) {

          }
          this.$notify({
            title: '成功',
            message: '已开通权限',
            type: 'success'
          })
        })
      },
      open() {
        let text = `<div>
          1.创建任务时扫描目标只能是自己负责的机器、WEB服务等，不可扫描他人的任何形式的IT资源。<br>
          2.因黑盒扫描任务对扫目标造成的任何不利影响、违规事件等责任均由扫描任务创建者自行承担。<br><br>
          如果不同意上述条款，将无法使用黑盒服务。
        </div>`
        this.$alert(text, '使用黑盒扫描服务前请遵守以下约定:  ', {
          confirmButtonText: '同意',
          dangerouslyUseHTMLString: true,
          showClose: false,
          callback: action => {
            this.confirm()
          }
        });
      },
      handleTargetFrom(tab, event) {
        if (tab.name == 3) {
          this.task.target = [{
            table_name: '',
            db_name: ''

          }]
          this.task.pluginOption = []
          for (let i = 0; i < this.dataSecPlugins.length; i++) {
            this.task.pluginOption.push(this.dataSecPlugins[i].plugins_mark)
          }

        }

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
