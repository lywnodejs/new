<template>
  <div class="manage-event">
    <toggle-form title="compliance.evaluation.title">

      <!-- 项目编号 -->
      <form-field label="compliance.evaluation.projectNumber"
                  for-id="project_no">
        <input type="text"
               class="form-control"
               v-model="project_no">
      </form-field>

      <!-- 部门名称 -->
      <form-field label="compliance.evaluation.department"
                  for-id="dept_id">
        <el-select v-model="dept_id"
                   remote
                   reserve-keyword
                   :remote-method="deptSearchList"
                   placeholder="请选择"
                   filterable
                   style="width: 100%;"
                   clearable>
          <el-option v-for="item in deptOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </form-field>

      <!-- 项目名称 -->
      <form-field label="compliance.evaluation.projectName"
                  for-id="project_name">
        <input type="text"
               class="form-control"
               id="project_name"
               maxlength="100"
               :placeholder="$t('hint.vagues_search')"
               v-model="project_name">
      </form-field>

      <!-- 启动时间 -->
      <form-field label="compliance.evaluation.startTime"
                  for-id="start_time">
        <el-date-picker v-model="start_time"
                        type="daterange"
                        :picker-options="DATE_OPTIONS"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
        </el-date-picker>
      </form-field>
      <form-action>
        <button class="btn btn-primary"
                @click="search">
          <i class="fa fa-search"
             aria-hidden="true"></i> {{$t('buttons.query')}}
        </button>
        <button class="btn btn-secondary"
                @click="reset">
          <i class="fa fa-undo"
             aria-hidden="true"></i> {{$t('buttons.reset')}}</button>
      </form-action>
    </toggle-form>

    <filter-tab :tabs="statusList"
                :active-tab="activeTab"
                @change="changeStatus">
      <button class="btn btn-primary"
              @click="createProject">
        {{$t('compliance.evaluation.createEvalProject')}}
      </button>
    </filter-tab>

    <sdl-table :url="url"
               border
               style="width: 100%"
               ref="projectListTable"
               :query-params="projectParamQueryList">
      <el-table-column prop="project_no"
                       width="110"
                       :label="$t('compliance.evaluation.projectNumber')">
      </el-table-column>

      <el-table-column prop="status_name"
                       width="90"
                       :label="$t('compliance.evaluation.status')">
      </el-table-column>

      <el-table-column prop="project_name"
                       width="150"
                       :label="$t('compliance.evaluation.projectName')">
      </el-table-column>

      <el-table-column prop="dept_name"
                       width="150"
                       :label="$t('compliance.evaluation.department')">
      </el-table-column>

      <el-table-column prop="risk_high"
                       width="90"
                       :label="$t('compliance.evaluation.highRisk')">
        <template slot-scope="scope">
          <custom-tip :value="scope.row.risk_high">{{riskTip(scope.row.risk_high)}}</custom-tip>
        </template>
      </el-table-column>

      <el-table-column prop="risk_middle"
                       width="90"
                       :label="$t('compliance.evaluation.middleRisk')">
        <template slot-scope="scope">
          <custom-tip :value="scope.row.risk_middle">{{riskTip(scope.row.risk_middle)}}</custom-tip>
        </template>
      </el-table-column>

      <el-table-column prop="risk_lower"
                       width="90"
                       :label="$t('compliance.evaluation.lowRisk')">
        <template slot-scope="scope">
          <custom-tip :value="scope.row.risk_lower">{{riskTip(scope.row.risk_lower)}}</custom-tip>
        </template>
      </el-table-column>

      <el-table-column prop="risk_total"
                       width="90"
                       :label="$t('compliance.evaluation.riskTotal')">
        <template slot-scope="scope">
          <custom-tip :value="scope.row.risk_total">{{riskTip(scope.row.risk_total)}}</custom-tip>
        </template>
      </el-table-column>

      <el-table-column prop="create_time"
                       width="160"
                       :label="$t('compliance.evaluation.createTime')">
      </el-table-column>

      <el-table-column prop="create_user_name"
                       :label="$t('compliance.evaluation.createUserName')">
        <template slot-scope="scope">
          <user-link :email="scope.row.create_user_email"
                     :key="scope.row.create_user_email">{{scope.row.create_user_name}}</user-link>
        </template>
      </el-table-column>

      <el-table-column prop="start_time"
                       width="160"
                       :label="$t('compliance.evaluation.startTime')">
      </el-table-column>

      <el-table-column prop="action"
                       fixed="right"
                       width="240"
                       :label="$t('buttons.action')">
        <template slot-scope="scope">
          <!-- 查看 -->
          <b-button variant="primary"
                    size="sm"
                    @click.stop="showProjectDetail(scope.row.id)">
            {{ $t('buttons.link') }}
          </b-button>
          <!-- 数据状态==待确认1701 显示确认 -->
          <b-button v-if="scope.row.status==1701"
                    variant="primary"
                    size="sm"
                    @click.stop="confirmProject(scope.row.id)">
            {{ $t('buttons.confirm') }}
          </b-button>
          <!-- 待评估 和 评估中 显示编辑 -->
          <b-button variant="primary"
                    v-if="(scope.row.status==1703 || scope.row.status==1702 || scope.row.status==1704)"
                    size="sm"
                    @click.stop="editProject(scope.row.id)">
            {{ $t('buttons.edit') }}
          </b-button>
          <!-- 待评估 显示启动 -->
          <b-button variant="primary"
                    v-if="scope.row.status==1702"
                    size="sm"
                    @click.stop="activateProject(scope.row.id)">
            {{ $t('buttons.start') }}
          </b-button>
          <!-- 评估 【评估状态==待评估1821】-->
          <b-button variant="primary"
                    v-if="scope.row.assessment_status==1821"
                    size="sm"
                    @click.stop="showEvaluation(scope.row.id)">
            {{ $t('buttons.evaluation') }}
          </b-button>
          <!-- 检查  【检查状态==待检查1841】-->
          <b-button variant="primary"
                    v-if="scope.row.check_status==1841"
                    size="sm"
                    @click.stop="showCheck(scope.row.id)">
            {{ $t('buttons.check') }}
          </b-button>
          <!-- 待确认 待评估 显示撤销 -->
          <b-button variant="primary"
                    v-if="(scope.row.status==1701 || scope.row.status==1702)"
                    size="sm"
                    @click.stop="undo(scope.row.id)">
            {{ $t('buttons.undo') }}
          </b-button>
        </template>
      </el-table-column>
    </sdl-table>
  </div>
</template>

<script>
import moment from 'moment'
import { DATE_FORMAT, DATE_OPTIONS } from '@/constants.es6'
import FilterTab from 'commons/FilterTab.vue'

import ToggleForm from 'commons/ToggleForm.vue'
import FormField from 'commons/FormField.vue'
import FormAction from 'commons/FormAction.vue'
import _ from 'lodash'
import { userLink, customTip } from './detail/FnComponent.es6'

const reqSource = 2

export default {

  name: "COMPLIANCE-EVALUATION-LIST",

  computed: {
    queryParams: function () {
      let paramStr = ''
      for (let [key, value] of Object.entries(this.projectParamQueryList())) {
        paramStr += key + '=' + value + '&'
      }
      return paramStr.substring(0, paramStr.length - 1)
    }
  },

  components: {
    FilterTab,
    ToggleForm,
    FormField,
    FormAction,
    userLink,
    customTip
  },

  data() {
    return {
      url: 'sa/queryList',
      showTable: false,

      status: 0,
      project_no: '',
      project_name: '',
      dept_id: '',
      start_time: [], // 启动时间

      statusOptions: [], // 项目状态
      statusList: [],
      activeTab: 0,

      DATE_OPTIONS,
      deptOptions: []
    }
  },

  methods: {
    riskTip(value) {
      return `安全隐患数量${value[1]}个，已整改隐患数量${value[0]}个`
    },
    /**
     * 查询参数
     */
    projectParamQueryList() {
      let params = {
        project_no: this.project_no,
        project_name: this.project_name,
        dept_id: this.dept_id,
        status: this.status,
        source: reqSource,
        start_begin_time: this.start_time && this.start_time.length > 0 ? moment(this.start_time[0]).format(DATE_FORMAT) : '',
        start_end_time: this.start_time && this.start_time.length > 0 ? moment(this.start_time[1]).format(DATE_FORMAT) : '',
      }
      return this.dealElement(params)
    },

    dealElement(obj) {
      var param = {}
      if (obj === null || obj === undefined || obj === "") return param;
      for (var key in obj) {
        if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
          param[key] = obj[key]
        }
      }
      return param
    },

    search() {
      this.$refs.projectListTable.reload()
    },

    deptSearchList(query) {
      if (query !== '') {
        this.$http.get('sdl/dept', { params: { 'name': query } }).then(res => {
          if (res.status == 200) {
            this.deptOptions = []
            this.deptOptions = res.data
          } else {
            this.deptOptions = []
          }
        })
      } else {
        this.deptOptions = []
      }
    },

    showProjectDetail(id) {
      this.$router.push({ path: '/compliance/evaluation/detail?id=' + id, query: { source: reqSource } })
    },

    confirmProject(id) {
      this.$router.push({ path: '/compliance/evaluation/bp/confirm?id=' + id, query: { source: reqSource } })
    },

    activateProject(id) {
      this.$router.push({ path: '/compliance/evaluation/bp/activate?id=' + id, query: { source: reqSource } })
    },

    // 安全评估 管理端
    showEvaluation(id) {
      this.$router.push({ path: '/compliance/evaluation/assessment/evachk', query: { source: reqSource, id } })
    },
    // 检查 管理端
    showCheck(id) {
      this.$router.push({ path: '/compliance/evaluation/assessment/evachk', query: { source: reqSource, id } })
    },
    // 撤销
    undo(id) {
      this.$confirm('此操作将撤销该项安全评估, 是否撤销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/sa/project/delete?id=' + id)
          .then(({ body: data }) => {
            console.log(data, "????")
            if (data.errno == 0) {
              this.$message({
                type: 'success',
                message: '撤销成功!'
              });
              this.search()
            }
          })

      }).catch(() => {

      });
    },

    reset() {
      this.project_no = ''
      this.project_name = ''
      this.dept_id = null
      this.start_time = []
      this.search()
    },

    /**
     * 过滤状态
     */
    changeStatus(id) {
      this.activeTab = id
      this.status = id
      this.$nextTick(() => {
        this.search()
      })
    },

    getSelectOptions(id) {
      let url = 'dictionary/listByDataAuth/' + id
      this.$http.get(url).then(({ body }) => {
        let options = body.data.map(({ id: id, dName: label }) => {
          return {
            id,
            label
          }
        })
        this.statusList.push({
          id: 0,
          label: '全部'
        })
        options.sort(function (a, b) {
          if (a.id < b.id) {
            return -1
          }
          if (a.id > b.id) {
            return 1
          }
          return 0
        })
        this.statusList.push(...options)
      })
    },

    createProject() {
      this.$router.push({ path: '/compliance/evaluation/bp/create', query: { source: reqSource } })
    },

    editProject(id) {
      this.$router.push({ path: '/compliance/evaluation/bp/edit', query: { source: reqSource, id: id } })
    },
  },

  created() {
    // 获取数据字典，初始化查询下拉参数
    this.getSelectOptions(1700) //项目状态
  },

  mounted() {
    let query = this.$route.query

    if (Object.keys(query).length !== 0) {

      // 事件编号
      if (query.event_no) {
        this.event_no = query.event_no
      }
      // 项目名称
      if (query.project_name) {
        this.project_name = query.project_name
      }

      // 启动时间
      if (query.start_begin_time && query.start_end_time) {
        this.start_time = [moment(query.start_begin_time), moment(query.start_end_time)]
      }

      if (query.status) {
        this.activeTab = Number(query.status)
        this.status = Number(query.status)
      }

      // 部门名称
      if (query.dept_id != 'null' && query.dept_id != 'undefined') {
        this.dept_id = query.dept_id
        this.deptOptions.push({
          value: this.dept_id,
          label: query.dept_name
        })
      }
    }
  }
}
</script>
<style lang="less">
.compliance-evaluation {
  .datepicker-range .datepicker-popup {
    width: 415px;
  }
  .el-table__header th {
    color: #494b55;
    text-align: center;
    background-color: #f3f4f5;
  }
}
</style>


