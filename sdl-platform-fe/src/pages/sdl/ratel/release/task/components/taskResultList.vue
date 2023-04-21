<template>
  <div id="ratel-task-result-list">
    <el-form  label-width="100px">
        <el-form-item label="是否返回全部：">
            <el-switch v-model="queryParam.is_return_all" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
    </el-form>
    <el-table
        :data="data"
        v-loading>
            <el-table-column
                label="项目ID"
                width="80"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.ratel_project_id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="ID"
                width="80"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.ratel_result_id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="漏洞级别"
                width="100"
                align="center">
                <template slot-scope="scope">
                <span>{{ judgeVulLevel(scope.row.vul_level_id) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="漏洞类型"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.mobile_rule_name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="检测规则名称"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.mobile_rule_name_en}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="类名"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.issue_class}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="方法名"
                align="center">
                <template slot-scope="scope">
                <span>{{scope.row.issue_method}}</span>
                </template>
            </el-table-column>
                <el-table-column
                    v-if="permission === 2"
                    label="SDL审计"
                    width="100"
                    align="center">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.sdl_audit_status"
                        class="selectInput"
                        type="text"
                        :disabled="status===3?false:true"
                        placeholder="请选择基线确认状态"
                        size="mini"
                        @change="changeSelect(scope.row.ratel_result_id, scope.row.sdl_audit_status)">
                            <el-option v-for="item in sdlAuditStatus"
                                :disabled="item.value===0"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                    v-else
                    label="SDL审计"
                    width="150"
                    align="center">
                    <template slot-scope="scope">
                        <span>{{ judgeAuditStatus(scope.row.sdl_audit_status) }}</span>
                    </template>
                </el-table-column>
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
  </div>
</template>
<script>
import {connect} from '@/lib'
import * as CONSTANTS from '@/commons/ratel'
export default connect(() => {
    return {
        permission: 'permission/permission'
    }
    }, {
        resultSDLMark: 'ratel_project/getResultSDLMark',
        getListByTaskId: 'ratel_project/getListByTaskId'
    })({
    data() {
      return {
        ratel_task_id: parseInt(this.$route.query.ratel_task_id),
        value: '',
        data: [],
        queryParam: {
            ratel_task_id: parseInt(this.$route.query.ratel_task_id),
            is_return_all: 0,
            page: 1,
            limit: 10
        },
        sdlAuditStatus: [{label: '未审计', value: 0}, {label: '漏洞', value: 2}, {label: '误报', value: 5}, {label: '忽略', value: 7}, {label: '自动误报', value: 4}, {label: '已推漏洞', value: 3}],
        num: 0
      }
    },
    created() {
        this.fetchData()
    },
    props: ['status'],
    watch: {
        'queryParam.is_return_all': {
            handler(val) {
                this.fetchData()
            }
        }
    },
    methods: {
        fetchData() {
            this.getListByTaskId(this.queryParam).then(res => {
                this.num = res.count
                this.data = res.ratel_result_list
            })
        },
        changeSelect(id, status) {
            let params = {
                ratel_result_id: id,
                sdl_audit_status: status
            }
            this.resultSDLMark(params).then(res => {
            })
        },
        judgeVulLevel(id) {
            for (let i = 0; i < CONSTANTS.vulLevel.length; i++) {
                if (CONSTANTS.vulLevel[i].value === id) {
                    return CONSTANTS.vulLevel[i].label
                }
            }
        },
        judgeAuditStatus(status) {
            for (let i = 0; i < this.sdlAuditStatus.length; i++) {
                if (this.sdlAuditStatus[i].value === status) {
                    return this.sdlAuditStatus[i].label
                }
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
  #ratel-task-result-list {
    margin: auto;
    width: 100%;
    height: 100%;
    background: white;
    // margin-top: -40px;
    box-sizing: border-box;
    .forward {
      padding-top: 10px;
      // margin-top: 30px;
      text-align: center;
      font-size: 20px;
    }
    .need {
      text-align: center;
      font-size: 15px;
      padding-top: 10px;
      margin-bottom: 20px;
    }
  }
</style>

