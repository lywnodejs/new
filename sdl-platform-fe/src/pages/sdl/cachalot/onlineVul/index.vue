<template>
    <div id="cachalot-onlineVul">
    <el-form class="searchForm" label-position="left" label-width="90px" :inline='true'>
      <div class="displayFlex">
        <el-form-item label="漏洞ID:">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.vul_id"
                    clearable
                    placeholder="请输入漏洞ID"
                    auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="漏洞等级:" style="margin-left: 30px;">
            <el-select class="searchInput"
                     v-model="queryParam.keywords.vul_level_id"
                     filterable
                     clearable
                     placeholder="请选择漏洞等级">
            <el-option
              v-for="item in vulLevel"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="漏洞domain:" style="margin-left: 30px;">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.vul_domain"
                    clearable
                    placeholder="请输入漏洞domain"
                    auto-complete="off">
          </el-input>
        </el-form-item>
      </div>
      <div class="displayFlex">
        <el-form-item label="当前分析状态:">
          <!-- <el-select class="searchInput"
                     v-model="queryParam.keywords.current_status"
                     filterable
                     clearable
                     placeholder="请选择当前分析状态">
            <el-option
              v-for="item in R2VulStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
          <el-cascader class="searchInput cascader-height"
                      :options="projectStatus"
                      v-model="current_status"
                      clearable
                      change-on-select
                       @change="handleChange"
                      placeholder="请选择项目状态"
                      expand-trigger="hover">
          </el-cascader>
        </el-form-item>
        <el-form-item label="部门:" style="margin-left: 30px;">
          <app-department class="searchInput"
                    v-model="dept"
                    clearable
                    placeholder="请输入提测人"
                    auto-complete="off"></app-department>
        </el-form-item>
        <el-form-item label="Git路径:" style="margin-left: 30px;">
          <el-input class="searchInput"
                    v-model="queryParam.keywords.vul_git_url"
                    clearable
                    placeholder="请输入Git路径"
                    auto-complete="off">
          </el-input>
        </el-form-item>
      </div>
      <div class="displayFlex">
          <el-form-item label="漏洞提交时间:">
            <el-date-picker type="date" placeholder="选择日期" v-model="queryParam.vul_post_begin_time" class="searchInput"></el-date-picker>
          </el-form-item>
          <el-form-item label="漏洞关闭时间:" style="margin-left: 30px;">
            <el-date-picker type="date" placeholder="选择日期" v-model="queryParam.vul_post_end_time" class="searchInput"></el-date-picker>
          </el-form-item>
      </div>

      <el-row>
        <el-col :span='24'>
          <el-form-item align="center">
            <button type="button" class='dorado-btn' @click="fetchData"><span>搜&nbsp;索</span></button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="cutLine"></div>
    <el-table
        :data="tableData"
        :default-sort = "{prop: 'vul_id', order: 'descending'}"
        row-key='vul_id'
        :expand-row-keys='expandRow'
        v-loading>
        <el-table-column type="expand" >
          <template slot-scope="props">
            <div class="expand-box">
                <span class="title">R2漏洞 &nbsp;<span class="child-title-link" @click="edit(props.row, 'create_workflow')">编辑</span></span>
                <el-form label-position="left" class="table-expand" label-width="100px">
                    <el-form-item label="暴露风险:" class="item">
                        <span>{{ props.row.expandData.create_workflow ? props.row.expandData.create_workflow.expose_risk : '' }}</span>
                    </el-form-item>
                    <el-form-item label="备注:" class="item">
                        <span>{{ props.row.expandData.create_workflow ? props.row.expandData.create_workflow.remark : '' }}</span>
                    </el-form-item>
                    <el-form-item label="更新时间:" class="item">
                        <span>{{ props.row.expandData.create_workflow ? props.row.expandData.create_workflow.update_time : '' }}</span>
                    </el-form-item>
                </el-form>
            </div>
            <div class="expand-box">
                <span class="title">漏洞定位</span>
                <el-input class="expand-box-input"
                    v-model="param.domain"
                    clearable
                    placeholder="请输入漏洞domain"
                    auto-complete="off">
                </el-input>
                <el-input class="expand-box-input"
                    v-model="param.git_url"
                    clearable
                    placeholder="请输入Git路径"
                    auto-complete="off">
                </el-input>
                <button type="button" class='expand-box-btn' @click="getPositionVul(props.row.vul_id)"><span>查&nbsp;询</span></button>
                <div v-show="props.row.expandData.vul_position_workflow">
                    <el-form label-position="left" class="table-expand" label-width="110px">
                        <el-form-item label="domain:" class="item">
                            <span>{{ props.row.expandData.vul_position_workflow ? props.row.expandData.vul_position_workflow.domain : '' }}</span>
                        </el-form-item>
                        <el-form-item label="Git路径:" class="item">
                            <span>{{ props.row.expandData.vul_position_workflow ? props.row.expandData.vul_position_workflow.git_url : '' }}</span>
                        </el-form-item>
                        <el-form-item label="更新时间:" class="item">
                            <span>{{ props.row.expandData.vul_position_workflow ? props.row.expandData.vul_position_workflow.update_time: '' }}</span>
                        </el-form-item>
                    </el-form>
                    <!-- <div class="flex-box">
                    <div class="flex-box-left"> -->
                    <div class="child-title">cmdb_domain</div>
                    <el-form label-position="left" class="table-expand" label-width="110px" v-if="props.row.expandData.vul_position_workflow">
                        <el-form-item label="dns:" class="items">
                            <span>{{ props.row.expandData.vul_position_workflow.cmdb_domain ? props.row.expandData.vul_position_workflow.cmdb_domain.dns: '' }}</span>
                        </el-form-item>
                        <el-form-item label="location:" class="items">
                            <span>{{ props.row.expandData.vul_position_workflow.cmdb_domain ? props.row.expandData.vul_position_workflow.cmdb_domain.location : '' }}</span>
                        </el-form-item>
                    </el-form>
                    <!-- </div> -->
                    <!-- <div class="flex-box-right"> -->
                    <div class="child-title">odin_module</div>
                    <el-form label-position="left" class="table-expand" label-width="110px" v-if="props.row.expandData.vul_position_workflow">
                        <el-form-item label="odin_workflow_id:" class="items">
                            <span>{{ props.row.expandData.vul_position_workflow.odin_module ? props.row.expandData.vul_position_workflow.odin_module.odin_workflow_id : '' }}</span>
                        </el-form-item>
                        <el-form-item label="状态:" class="items">
                            <span>{{ props.row.expandData.vul_position_workflow.odin_module ? props.row.expandData.vul_position_workflow.odin_module.status : '' }}</span>
                        </el-form-item>
                        <el-form-item label="安全工程师:" class="items">
                            <span>{{ props.row.expandData.vul_position_workflow.odin_module ? props.row.expandData.vul_position_workflow.odin_module.safe_approver : '' }}</span>
                        </el-form-item>
                        <el-form-item label="创建时间:" class="items">
                            <span>{{ props.row.expandData.vul_position_workflow.odin_module ? props.row.expandData.vul_position_workflow.odin_module.create_time : '' }}</span>
                        </el-form-item>
                    </el-form>
                    <!-- </div>
                    </div> -->
                    <div class="child-title">otter_task</div>
                    <el-form label-position="left" class="table-expand" label-width="110px"  v-if="props.row.expandData.vul_position_workflow">
                        <el-form-item label="ID:" class="items">
                            <span>{{ props.row.expandData.vul_position_workflow.otter_task ? props.row.expandData.vul_position_workflow.otter_task.otter_task_id : '' }}</span>
                        </el-form-item>
                        <el-form-item label="sdl_engineer:" class="items">
                            <span>{{ props.row.expandData.vul_position_workflow.otter_task ? props.row.expandData.vul_position_workflow.otter_task.sdl_engineer : '' }}</span>
                        </el-form-item>
                        <el-form-item label="任务创建时间:" class="items">
                            <span>{{ props.row.expandData.vul_position_workflow.otter_task ? props.row.expandData.vul_position_workflow.otter_task.task_create_time : '' }}</span>
                        </el-form-item>
                    </el-form>
                    <div class="child-title">sdl_project</div>
                    <el-form label-position="left" class="table-expand" label-width="110px">
                        <el-form-item label="详细信息:" class="items">
                            <span>{{ props.row.expandData.vul_position_workflow ? props.row.expandData.vul_position_workflow.sdl_project : '' }}</span>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="expand-box" v-if="props.row.current_status >= 103">
                <span class="title">手工分析 &nbsp;<span class="child-title-link" @click="edit(props.row, 'human_analysis')">编辑</span></span>
                <el-form label-position="left" class="table-expand" label-width="100px">
                    <el-form-item label="路径:" class="items">
                        <span>{{ props.row.expandData.human_analysis_workflow ? props.row.expandData.human_analysis_workflow.path: '' }}</span>
                    </el-form-item>
                    <el-form-item label="code:" class="items">
                        <span>{{ props.row.expandData.human_analysis_workflow ? props.row.expandData.human_analysis_workflow.code : '' }}</span>
                    </el-form-item>
                </el-form>
            </div>
            <div class="expand-box" v-if="props.row.current_status >= 104">
                <span class="title">转换/覆盖</span>
                <div class="child-title">流程卡点转换 &nbsp;<span class="child-title-link" @click="edit(props.row, 'process_transform')">编辑</span></div>
                <el-form label-position="left" class="table-expand" label-width="100px" v-if="props.row.expandData.vul_transform_workflow.process_transform">
                    <el-form-item label="状态:" class="items">
                        <span>{{ handleProcessStatus(props.row.expandData.vul_transform_workflow.process_transform.status) }}</span>
                    </el-form-item>
                    <el-form-item label="安全工程师:" class="items">
                        <span>{{ props.row.expandData.vul_transform_workflow.process_transform.sdl_engineer }}</span>
                    </el-form-item>
                    <el-form-item label="备注:" class="items">
                        <span>{{ props.row.expandData.vul_transform_workflow.process_transform.remark }}</span>
                    </el-form-item>
                    <el-form-item label="更新时间:" class="items">
                        <span>{{ props.row.expandData.vul_transform_workflow.process_transform.update_time }}</span>
                    </el-form-item>
                </el-form>
                <div class="child-title">设计转换 &nbsp;<span class="child-title-link" @click="edit(props.row, 'design_transform')">编辑</span></div>
                <el-form label-position="left" class="table-expand" label-width="100px"  v-if="props.row.expandData.vul_transform_workflow.design_transform">
                    <el-form-item label="SDL ID:" class="items">
                        <span>{{ props.row.expandData.vul_transform_workflow.design_transform.sdl_project_id }}</span>
                    </el-form-item>
                    <el-form-item label="状态:" class="items">
                        <span>{{ handleProcessStatus(props.row.expandData.vul_transform_workflow.design_transform.status) }}</span>
                    </el-form-item>
                    <el-form-item label="安全工程师:" class="items">
                        <span>{{ props.row.expandData.vul_transform_workflow.design_transform.sdl_engineer }}</span>
                    </el-form-item>
                    <el-form-item label="更新时间:" class="items">
                        <span>{{ props.row.expandData.vul_transform_workflow.design_transform.update_time }}</span>
                    </el-form-item>
                </el-form>
                <div class="child-title">白盒转换 &nbsp;<span class="child-title-link" @click="edit(props.row, 'white_transform')">编辑</span></div>
                <el-form label-position="left" class="table-expand" label-width="100px"  v-if="props.row.expandData.vul_transform_workflow.white_transform">
                    <el-form-item label="状态:" class="items">
                        <span>{{ handleProcessStatus(props.row.expandData.vul_transform_workflow.white_transform.status) }}</span>
                    </el-form-item>
                    <el-form-item label="安全工程师:" class="items">
                        <span>{{ props.row.expandData.vul_transform_workflow.white_transform.sdl_engineer }}</span>
                    </el-form-item>
                    <el-form-item label="备注:" class="items">
                        <span>{{ props.row.expandData.vul_transform_workflow.white_transform.remark }}</span>
                    </el-form-item>
                    <el-form-item label="更新时间:" class="items">
                        <span>{{ props.row.expandData.vul_transform_workflow.white_transform.update_time }}</span>
                    </el-form-item>
                </el-form>
                <div class="child-title">黑盒转换 &nbsp;<span class="child-title-link" @click="edit(props.row, 'black_transform')">编辑</span></div>
                <el-form label-position="left" class="table-expand" label-width="100px"  v-if="props.row.expandData.vul_transform_workflow.black_transform">
                    <el-form-item label="状态:" class="items">
                        <span>{{ handleProcessStatus(props.row.expandData.vul_transform_workflow.black_transform.status) }}</span>
                    </el-form-item>
                    <el-form-item label="安全工程师:" class="items">
                        <span>{{ props.row.expandData.vul_transform_workflow.black_transform.sdl_engineer }}</span>
                    </el-form-item>
                    <el-form-item label="备注:" class="items">
                        <span>{{ props.row.expandData.vul_transform_workflow.black_transform.remark }}</span>
                    </el-form-item>
                    <el-form-item label="更新时间:" class="items">
                        <span>{{ props.row.expandData.vul_transform_workflow.black_transform.update_time }}</span>
                    </el-form-item>
                </el-form>
            </div>
            <div class="expand-box" v-if="props.row.current_status >= 105">
                <span class="title">分析完成</span>
                <el-form label-position="left" class="table-expand" label-width="100px">
                    <el-form-item label="更新时间:" class="item">
                        <span>{{ props.row.expandData.finish_workflow.update_time }}</span>
                    </el-form-item>
                </el-form>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="vul_id"
            label="漏洞ID"
            sortable
            align="center"
            width="100">
        </el-table-column>
        <el-table-column
            label="漏洞名称"
            prop="vul_name"
            sortable
            align="center">
            <template slot-scope="scope">
                <span>{{scope.row.vul_name}}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="当前状态"
            prop="current_status"
            sortable
            align="center">
            <template slot-scope="scope">
                <span>{{ handleStatus(scope.row.current_status, R2VulStatus) }}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="处理人"
            sortable
            align="center">
            <template slot-scope="scope">
                <span>{{ handleEnginner(scope.row.sdl_engineer) }}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="漏洞等级"
            prop="vul_level_id"
            sortable
            align="center">
            <template slot-scope="scope">
                <span>{{ handleStatus(scope.row.vul_level_id, vulLevel) }}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="部门"
            prop="vul_level_id"
            align="dept_name">
            <template slot-scope="scope">
                <span>{{scope.row.dept_name}}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="时间"
            prop="vul_post_time"
            width="110"
            sortable
            align="center">
            <template slot-scope="scope">
            <span>{{scope.row.vul_post_time.split(' ')[0]}}<br>{{scope.row.vul_post_time.split(' ')[1]}}</span>
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

    <update-dialog :visible='dialogVisible' @dialog='getDialog' :data='scopeRow' @updateData='getData'></update-dialog>
    </div>
</template>
<script>
import * as CONSTANTS from '@/commons/cachalot'
import { connect } from '@/lib'
import updateDialog from './components/updateDialog'

export default connect(() => {
  return {
  }
}, {
    getOnlineVulList: 'cachalot_onlineVul/getOnlineVulList',
    getOneOnlineVul: 'cachalot_onlineVul/getOneOnlineVul',
    getPositionOnlineVul: 'cachalot_onlineVul/getPositionOnlineVul',
    updateOnlineVul: 'cachalot_onlineVul/updateOnlineVul'
})({
    data() {
        return {
            num: 0,
            queryParam: {
                page: 1,
                limit: 10,
                keywords: {
                    vul_id: '',
                    vul_level_id: '',
                    vul_git_url: '',
                    vul_domain: '',
                    vul_post_begin_time: '',
                    current_status: '',
                    vul_post_end_time: '',
                    dept_name: '',
                    transform_workflow: ''
                }
            },
            R2VulStatus: CONSTANTS.R2VulStatus,
            vulLevel: CONSTANTS.vulLevel,
            projectStatus: CONSTANTS.projectStatus,
            SDLEngineers: CONSTANTS.engineer,
            tableData: [],
            current_status: [],
            dept: {},
            param: {
                domain: '',
                git_url: '',
                vul_id: null
            },
            scopeRow: {
                vul_id: null,
                current_status: null,
                data: {}
            },
            dialogVisible: false,
            expandRow: []
        }
    },
    created() {
        this.queryParam.keywords.vul_id = this.$route.query['vul_id'] ? this.$route.query['vul_id'] : ''
        this.fetchData()
    },
    components: { updateDialog },
    methods: {
        fetchData() {
            this.queryParam.keywords.dept_name = this.dept.dept_fullname
            this.getOnlineVulList(this.queryParam).then(res => {
                this.num = res.count
                this.tableData = res.online_vul_list
                for (let i = 0; i < this.tableData.length; i++) {
                    this.getOneOnlineVul({vul_id: this.tableData[i].vul_id}).then(res => {
                        this.tableData[i].expandData = res

                        // this.$set(this.tableData, i, this.tableData[i])
                    })
                }
            })
        },
        getPositionVul(id) {
            this.param.vul_id = id
            this.getPositionOnlineVul(this.param).then(res => {
                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].vul_id === id) {
                        this.tableData[i].current_status = res.current_status
                        this.tableData[i].vul_position_workflow = res.vul_position_workflow
                    }
                }
                this.fetchData()
            })
        },
        edit(data, key) {
            this.scopeRow = {
                vul_id: data.vul_id,
                current_status: data.current_status,
                key: key
            }
            if (key === 'create_workflow') { this.scopeRow.data = data.expandData[key] }
            if (key === 'human_analysis') { this.scopeRow.data = data.expandData['human_analysis_workflow'] }
            if (key === 'process_transform') { this.scopeRow.data = data.expandData.vul_transform_workflow[key] }
            if (key === 'design_transform') { this.scopeRow.data = data.expandData.vul_transform_workflow[key] }
            if (key === 'white_transform') { this.scopeRow.data = data.expandData.vul_transform_workflow[key] }
            if (key === 'black_transform') { this.scopeRow.data = data.expandData.vul_transform_workflow[key] }
            this.dialogVisible = true
        },
        handleEnginner(engineer) {
            let arr = []
            this.SDLEngineers.forEach(item => {
                engineer.forEach(element => {
                    if (element === item.value) {
                        arr.push(item.label)
                    }
                })
            })
            return arr.join(', ')
        },
        handleProcessStatus(status) {
            let label = ''
            CONSTANTS.processTransformStatus.forEach(item => {
                if (item.value === status) {
                    label = item.label
                }
            })
            return label
        },
        handleChange(val) {
            this.queryParam.keywords.current_status = val[0]
            if (val[1]) {
                this.queryParam.keywords.transform_workflow = val[1]
            } else {
                this.queryParam.keywords.transform_workflow = ''
            }
        },
        getDialog(val) {
            this.dialogVisible = val
        },
        getData(val) {
            for (let i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i].vul_id === val.vul_id) {
                    this.tableData[i].current_status = val.data.current_status
                    this.tableData[i].expandData = val.data
                    this.$set(this.tableData, i, this.tableData[i])
                    this.expandRow = [val.vul_id]
                }
            }
        },
        handleStatus(status, json) {
            for (let i = 0; i < json.length; i++) {
                if (json[i].value === status) {
                    return json[i].label
                }
            }
            return '暂无状态'
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
  #cachalot-onlineVul {
        margin: auto;
        width: 100%;
        box-sizing: border-box;
        .dorado-btn {
            background: #FC9153;
            border-radius: 4px;
            width: 95px;
            height: 32px;
            border: none;
            color: white;
            margin-top: 5px;
            margin-left: 90px;
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
        .cutLine {
            margin-top: 5px;
            margin-bottom: 17px;
            width: 100%;
            border-top: 1px solid rgba(0, 0, 0, 0.20);
        }
        .flex-box {
                display: flex;
                &-left {
                    flex-grow: 1;
                    flex-basis: 25%
                }
                &-right {
                    flex-grow: 3
                }
        }
        .expand-box {
            border: 1px solid rgba(0, 0, 0, 0.10);
            border-radius: 10px;
            margin: 10px;
            &-input {
                width: 160px;
                margin-top: 5px;
                margin-left: 10px;
            }
            &-btn {
                background: #FC9153;
                border-radius: 4px;
                width: 95px;
                height: 32px;
                border: none;
                color: white;
                margin-top: 0px;
                margin-left: 10px;
                font-size: 13px;
                -webkit-font-smoothing: antialiased;
                cursor: pointer;
                span {
                    font-family: Avenir, Helvetica, Arial, sans-serif;
                }
            }
            .item {
                margin-left: 30px;
            }
            .items{
                margin-left: 50px;
            }
            .title{
                display: inline-block;
                font-size: 13px;
                margin-left: 10px;
                margin-bottom: 10px;
                &-link {
                    color: #fc9153;
                    cursor: pointer;
                }
            }
            .child-title{
                font-size: 13px;
                margin-left: 30px;
                color: green;
                &-link {
                    color: #fc9153;
                    cursor: pointer;
                }
            }
            .table-expand {
                .el-form-item {
                    margin-right: 0;
                    margin-bottom: 0;
                    width: 100%;
                    word-wrap: break-word;
                    span {
                        display: inline-block;
                        width: 100%;
                        font-size: 12.5px;
                    }
                }
                label {
                    // color: #7e8fa7;
                    color: #596385;
                    font-size: 12.5px;
                }
            }
        }
    }
    
</style>
<style>
.el-cascader-menu{
    height: 100% !important;
}
</style>
