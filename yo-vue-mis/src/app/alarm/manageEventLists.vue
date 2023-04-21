<template>
  <div class="manage-event">
    <div class="manage-event__bu">

      <a class="btn btn-primary manage-event__import" :href="eventDownloadURL">
        {{ $t('manage.export') }}
      </a>

      <!-- <b-button v-if="hasWriteAuthority" class="manage-event__import" variant="primary" @click.stop="importEvent()">
        {{ $t('manage.import') }}
      </b-button> -->

      <router-link v-if="hasWriteAuthority" class="btn btn-primary manage-event__import" :to="{name : 'ManageEventEdit'}">
        {{$t('manage.add_event')}}
      </router-link>

      <a class="btn btn-primary manage-event__import" :href="'http://anquan.didichuxing.com/project/portals/pages/spec-detail.html?id=1059'" target="_blank">
         {{ $t('buttons.security_incident') }}
<!--        安全事件录入标准-->
      </a>
    </div>

    <toggle-form :icon-only="true" title="manage.title">
      <form-field label="manage.event_no" for-id="id">
        <input type="text" class="form-control" id="id" v-model="event_no" maxlength="100">
      </form-field>

      <form-field label="manage.name" for-id="name">
        <input type="text" class="form-control" id="name" maxlength="100" :placeholder="$t('manage.vagues_search')" v-model="event_name">
      </form-field>

      <form-field label="manage.event_type" for-id="event_type">
        <el-select v-model="types" :placeholder="$t('manage.select')" multiple style="width: 100%;" clearable>
          <el-option v-for="item in levelOptions" :key="item.value" :label="translateByName('event', item.text)" :value="item.value"></el-option>
        </el-select>
      </form-field>

      <form-field label="manage.serious_level" for-id="serious_level">
        <el-select v-model="levels" :placeholder="$t('manage.select')" multiple style="width: 100%;" clearable>
          <el-option v-for="item in seriousOptions" :key="item.value" :label="translateByName('event', item.text)" :value="item.value"></el-option>
        </el-select>
      </form-field>

      <form-field label="manage.create_time" for-id="create_time">
        <el-date-picker v-model="create_time" type="daterange" :picker-options="DATE_OPTIONS" :range-separator="$t('manage.rangeSep')" :start-placeholder="$t('manage.startTime')" :end-placeholder="$t('manage.endTime')" align="right">
        </el-date-picker>
      </form-field>

      <form-field label="manage.confirm_time" for-id="confirm_time">
        <el-date-picker v-model="confirm_time" type="daterange" :picker-options="DATE_OPTIONS" :range-separator="$t('manage.rangeSep')" :start-placeholder="$t('manage.startTime')" :end-placeholder="$t('manage.endTime')" align="right">
        </el-date-picker>
      </form-field>

      <form-field label="manage.repair_time" for-id="confirm_time">
        <el-date-picker v-model="repair_time" type="daterange" :picker-options="DATE_OPTIONS" :range-separator="$t('manage.rangeSep')" :start-placeholder="$t('manage.startTime')" :end-placeholder="$t('manage.endTime')" align="right">
        </el-date-picker>
      </form-field>

      <form-field label="manage.event_time" for-id="event_time">
        <el-date-picker v-model="occured_time" type="daterange" :picker-options="DATE_OPTIONS" :range-separator="$t('manage.rangeSep')" :start-placeholder="$t('manage.startTime')" :end-placeholder="$t('manage.endTime')" align="right">
        </el-date-picker>
      </form-field>

      <form-field label="manage.close_time" for-id="close_time">
        <el-date-picker v-model="close_time" type="daterange" :picker-options="DATE_OPTIONS" :range-separator="$t('manage.rangeSep')" :start-placeholder="$t('manage.startTime')" :end-placeholder="$t('manage.endTime')" align="right">
        </el-date-picker>
      </form-field>

      <form-field label="manage.rccd_time" for-id="rccd_time">
        <el-date-picker v-model="rccd_time" type="daterange" :picker-options="DATE_OPTIONS" :range-separator="$t('manage.rangeSep')" :start-placeholder="$t('manage.startTime')" :end-placeholder="$t('manage.endTime')" align="right">
        </el-date-picker>
      </form-field>

       <form-field label="manage.submit_rccd" for-id="submit_rccd">
        <el-select v-model="submit_rccd" :placeholder="$t('manage.select')" style="width: 100%;" clearable>
          <el-option v-for="item in submitRCCDOptions" :key="item.value" :label="translateByName('event', item.text)" :value="item.value"></el-option>
        </el-select>
      </form-field>

       <form-field label="manage.rccd" for-id="rccds">
        <el-select v-model="rccds" :placeholder="$t('manage.select')" multiple style="width: 100%;" clearable>
          <el-option v-for="item in rccdsOptions" :key="item.value" :label="translateByName('event', item.text)" :value="item.value"></el-option>
        </el-select>
      </form-field>

      <form-field label="manage.found_source" for-id="found_source">
        <el-select v-model="source" :placeholder="$t('manage.select')" style="width: 100%;" clearable>
          <el-option v-for="item in sourceOptions" :key="item.value" :label="translateByName('event', item.text)" :value="item.value"></el-option>
        </el-select>
      </form-field>

      <form-field label="manage.system_source" for-id="system_source">
        <input type="text" class="form-control" id="system" maxlength="100" v-model="system" :placeholder="$t('manage.vagues_search')">
      </form-field>

      <!-- <form-field label="manage.auth_label" for-id="auth_label_ids">
        <el-select v-model="auth_label_ids" :placeholder="$t('manage.select')" multiple  style="width: 100%;" clearable>
          <el-option v-for="item in authLabelOptions" :key="item.value" :label="item.text" :value="item.value" ></el-option>
        </el-select>
      </form-field>

      <form-field label="manage.rccd" for-id="rccd_ids">
        <el-select v-model="rccd_ids" :placeholder="$t('manage.select')" multiple style="width: 100%;" clearable>
          <el-option v-for="item in rccdOptions" :key="item.value" :label="item.text" :value="item.value" ></el-option>
        </el-select>
      </form-field> -->

      <form-field label="manage.department" for-id="dept_id">
        <el-select v-model="dept_id" remote reserve-keyword :remote-method="deptSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" clearable>
          <el-option v-for="item in deptOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </form-field>

      <form-field label="manage.member" for-id="emp_id">
        <el-select v-model="emp_id" remote reserve-keyword :remote-method="empSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" clearable>
          <el-option v-for="item in empOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </form-field>

      <form-field label="manage.label_ids" for-id="label_ids">
        <el-select v-model="label_ids" :placeholder="$t('manage.select')" multiple style="width: 100%;" clearable>
          <el-option v-for="item in labelIdsOptions" :key="item.value" :label="translateByName('event', item.text)" :value="item.value"></el-option>
        </el-select>
      </form-field>

      <form-action>
        <button class="btn btn-primary" @click="search">
          <i class="fa fa-search" aria-hidden="true"></i> {{$t('manage.query')}}
        </button>
        <button class="btn btn-secondary" @click="reset">
          <i class="fa fa-undo" aria-hidden="true"></i> {{$t('manage.reset')}}</button>
      </form-action>
    </toggle-form>

    <filter-tab :tabs="statusByLang" :active-tab="activeTab" @change="changeStatus" />

    <sdl-table
      v-if="showTable"
      :url="url"
      border
      style="width: 100%"
      ref="eventListTable"
      :default-sort="{prop: 'confirm_time', order: 'descending'}"
      :query-params="eventParamQueryList">
      <el-table-column prop="event_no" sortable="custom" :label="$t('manage.event_no')">
      </el-table-column>

      <el-table-column prop="status" sortable="custom" :label="$t('manage.event_status')">
        <template slot-scope="scope">
          {{translateByName('event', scope.row.status_name)}}
        </template>
      </el-table-column>

      <el-table-column prop="name" sortable="custom" :label="$t('manage.name')">
      </el-table-column>

      <el-table-column prop="type" sortable="custom" :label="$t('manage.event_type')">
        <template slot-scope="scope">
          {{translateByName('event', scope.row.type_name)}}
        </template>
      </el-table-column>

      <el-table-column prop="level" sortable="custom" :label="$t('manage.serious_level')">
        <template slot-scope="scope">
          {{translateByName('event', scope.row.level_name)}}
        </template>
      </el-table-column>

      <el-table-column prop="source" sortable="custom" :label="$t('manage.found_source')">
        <template slot-scope="scope">
          {{translateByName('event', scope.row.source_name)}}
        </template>
      </el-table-column>

      <el-table-column prop="confirm_time" sortable="custom" :label="$t('manage.confirm_time')">
      </el-table-column>

      <el-table-column prop="mttd" sortable="custom" :label="$t('manage.mttd')">
      </el-table-column>

      <el-table-column prop="mttr" sortable="custom" :label="$t('manage.mttr')">
      </el-table-column>

      <el-table-column prop="action" :label="$t('manage.action')" width="290px">
        <template slot-scope="scope">
          <!-- <b-button variant="primary" size="sm" @click.stop="showEventDetail(scope.row.id)">
            {{ $t('manage.link') }}
          </b-button> -->
          <router-link tag="a" target="_blank" class="btn btn-primary btn-sm" :to="{name : 'ManageEventDetail', query: { id: scope.row.id, params: queryParams }}">
            {{ $t('manage.link') }}
          </router-link>
          <router-link v-if="hasWriteAuthority && scope.row.survey_status" tag="a" target="_blank" class="btn btn-primary btn-sm" :to="{name : 'ManageEventEdit', query: { id: scope.row.id, params: queryParams }}">
            {{$t('manage.update')}}
          </router-link>

          <!-- <button v-if="hasWriteAuthority && scope.row.review_status" tag="a" target="_blank" class="btn btn-primary btn-sm" :to="{name : 'ManageEventDetail', query: { id: scope.row.id, review: 1, params: queryParams }}">
            {{$t('manage.review')}}
          </button> -->
          <button v-if="hasWriteAuthority && scope.row.review_status" class="btn btn-primary btn-sm" @click="handleReview(scope.row)">
            {{$t('manage.review')}}
          </button>

          <button v-if="hasWriteAuthority && scope.row.apply_status == 1" class="btn btn-primary btn-sm" @click="handleAppeal(scope.row)">
            {{$t('buttons.appeal')}}
          </button>
          <button v-if="hasWriteAuthority && scope.row.apply_status == 2" class="btn btn-primary btn-sm" @click="handleUndoAppeal(scope.row)">
            {{$t('buttons.undoAppeal')}}
          </button>
        </template>
      </el-table-column>
    </sdl-table>

    <el-dialog :title="eventDialogTitle" :visible.sync="dialogEventVisible" width="70%">
      <event-detail v-if="dialogEventVisible && isDetail" :event-id="event_id"></event-detail>
      <event-appeal v-if="dialogEventVisible && !isDetail" :event-id="event_id" :is-appeal="isAppeal" @close="handleDialogEventClose"></event-appeal>
    </el-dialog>

    <b-modal class="manage-event__import__modal" centered hide-footer :title="$t('manage.import_title')" v-model="modalImportShown">
      <div id="manage-event__import__form">
        <b-form-file v-model="event_import_file" ref="fileinput" placeholder="请选择要上传文件" />
        <b-button class="manage-event__import__form--save" variant="primary" @click="saveImportFile">{{ $t('manage.sure') }}</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { DATE_FORMAT, DATE_OPTIONS } from '@/constants.es6'
import FilterTab from 'commons/FilterTab.vue'

import ToggleForm from 'commons/ToggleForm.vue'
import FormField from 'commons/FormField.vue'
import FormAction from 'commons/FormAction.vue'
import _ from 'lodash'

import eventAppeal from './eventAppeal.vue'

const statusMapping = {
  '全部': 'All',
  '调查中': 'Under Investigation',
  '处置中': 'Processing',
  '已关闭': 'Closed',
  '终止': 'Stopped',
  '误报': 'Misreport'
}

export default {
  name: "MANAGE-EVENT-INDEX",

  computed: {
    ...mapState(['lang']),
    eventDownloadURL: function () {
      let paramUrl = ''
      for (let [key, value] of Object.entries(this.eventParamQueryList())) {
        paramUrl += key + '=' + value + '&'
      }
      return '/secEvent/download?' + paramUrl.substring(0, paramUrl.length - 1)
    },

    queryParams: function () {
      let paramStr = ''
      for (let [key, value] of Object.entries(this.eventParamQueryList())) {
        paramStr += key + '=' + value + '&'
      }
      return paramStr.substring(0, paramStr.length - 1)
    },

    statusByLang: function () {
      if (this.lang === 'en') {
        return this.statusList.map(status => {
          return { ...status, label: statusMapping[status.label] || status.label }
        })
      }

      return this.statusList
    }
  },

  components: {
    FilterTab,
    ToggleForm,
    FormField,
    FormAction,
    eventAppeal
  },

  data() {
    return {
      url: '/secEvent/queryList',
      showTable: false,
      modalShown: false,
      modalImportShown: false,

      modelAlarmTitle: this.$t('manage.alarm.detail_title'),
      dialogEventVisible: false,
      dialogAlarmVisible: false,

      status: 0,
      event_no: '',
      event_name: '',
      system: null,
      dept_id: '',
      emp_id: {},
      types: [],
      levels: [],
      source: '',
      label_ids: [],
      // auth_label_ids: [],
      // rccd_ids: [],

      occured_time: [], // 发生时间
      create_time: [], // 录入时间
      confirm_time: [], // 确认时间
      repair_time: [], //修复时间
      close_time: [], // 关闭时间
      rccd_time: [], // RCCD处罚时间

      rccds: [], // rccd处罚结果
      submit_rccd: '', // 是否提交rccd

      levelOptions: [], //事件类型
      sourceOptions: [],//发现方式
      statusOptions: [],//事件状态
      seriousOptions: [], //严重程度
      rccdsOptions: [],

      // 去掉 by huangxiaomei 2019-03-11
      // authLabelOptions: [], // 权限标签
      // rccdOptions: [], // rccd处罚结果
      // 新增 by huangxiaomei 2019-03-11
      labelIdsOptions: [], // 关注重点

      event_id: '',

      statusList: [],
      activeTab: 0,
      event_import_file: null,
      hasWriteAuthority: true, // 当用户授权只有sec_event_guest并且不包含sec_event_user和sec_event_admin时，需要将添加、修改、导入按钮隐藏不显示
      DATE_OPTIONS,
      deptOptions: [],
      empOptions: [],

      submitRCCDOptions: [{
        text: '是',
        value: 1
      }, {
        text: '否',
        value: 0
      }],

      isDetail: true, // 展示的是否是详情
      isAppeal: true, // true: 申诉， false: 撤销申诉

      eventDialogTitle: ''
    }
  },

  methods: {

    handleDialogEventClose(isReflesh) {
      this.dialogEventVisible = false
      if (isReflesh) {
        this.search()
      }
    },

    // 申诉
    handleAppeal(row) {
      this.event_id = row.id
      this.isDetail = false
      this.isAppeal = true
      this.dialogEventVisible = true
      this.eventDialogTitle = this.$t('manage.appeal_dialog_title')
    },

    // 撤销申诉
    handleUndoAppeal(row) {
      this.event_id = row.id
      this.isDetail = false
      this.isAppeal = true
      this.dialogEventVisible = true
      this.eventDialogTitle = this.$t('manage.undo_appeal_dialog_title')
    },

    handleReview(row) {
      let status = row.review_status, path = '/secEvent/edit', queryParams = {id: row.id}
      switch(status) {
        case 1: // 信息安全复盘
          queryParams['review'] = 1
          path = '/secEvent/edit'
          break
        case 2: // 业务线复盘
          queryParams['review'] = 2
          path = '/secEvent/detail'
          break
        case 3:
          queryParams['review'] = 3
          path = '/secEvent/edit'
          break
        default:
          this.$message.warning('当前暂无权限访问')
      }
      let routeData = this.$router.resolve({
        path: path,
        query: queryParams
      })
      window.open(routeData.href, '_blank')
    },
    /**
     * 查询参数
     */
    eventParamQueryList() {
      let params = {
        event_no: this.event_no,
        event_name: this.event_name,
        types: this.types ? this.types.join(',') : '',
        levels: this.levels ? this.levels.join(',') : '',
        source: this.source,
        system: this.system,
        dept_id: this.dept_id,
        emp_id: this.emp_id && this.emp_id.id,
        status: this.status,
        label_ids: this.label_ids.join(','),
        // auth_label_ids: this.auth_label_ids.join(','),
        rccds: this.rccds ? this.rccds.join(',') : '',
        submit_rccd: this.submit_rccd,
        occured_begin_time: this.occured_time && this.occured_time.length > 0 ? moment(this.occured_time[0]).format(DATE_FORMAT) : '',
        occured_end_time: this.occured_time && this.occured_time.length > 0 ? moment(this.occured_time[1]).format(DATE_FORMAT) : '',
        create_begin_time: this.create_time && this.create_time.length > 0 ? moment(this.create_time[0]).format(DATE_FORMAT) : '',
        create_end_time: this.create_time && this.create_time.length > 0 ? moment(this.create_time[1]).format(DATE_FORMAT) : '',
        confirm_begin_time: this.confirm_time && this.confirm_time.length > 0 ? moment(this.confirm_time[0]).format(DATE_FORMAT) : '',
        confirm_end_time: this.confirm_time && this.confirm_time.length > 0 ? moment(this.confirm_time[1]).format(DATE_FORMAT) : '',
        repair_begin_time: this.repair_time && this.repair_time.length > 0 ? moment(this.repair_time[0]).format(DATE_FORMAT) : '',
        repair_end_time: this.repair_time && this.repair_time.length > 0 ? moment(this.repair_time[1]).format(DATE_FORMAT) : '',
        close_begin_time: this.close_time && this.close_time.length > 0 ? moment(this.close_time[0]).format(DATE_FORMAT) : '',
        close_end_time: this.close_time && this.close_time.length > 0 ? moment(this.close_time[1]).format(DATE_FORMAT) : '',
        rccd_begin_time: this.rccd_time && this.rccd_time.length > 0 ? moment(this.rccd_time[0]).format(DATE_FORMAT) : '',
        rccd_end_time: this.rccd_time && this.rccd_time.length > 0 ? moment(this.rccd_time[1]).format(DATE_FORMAT) : ''
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

    search(arg) {
      // console.log(arg)
      this.$refs.eventListTable.reload()
    },
    /**
     * 涉及人员
     */
    empSearchList(query) {
      if (query !== '') {
        this.$http.get('secEvent/searchEmpList', { params: { 'account': query } }).then(res => {
          if (res.data.errno == 0) {
            this.empOptions = []
            this.empOptions = res.data.data.map((item) => {
              return {
                value: item.id,
                label: item.name + '(' + item.email + ')'
              }
            })
          } else {
            this.empOptions = []
          }
        })
      } else {
        this.empOptions = []
      }
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

    // eventDownload() {
    //   let params = this.params
    // },

    showEventDetail(id) {
      this.event_id = id
      this.isDetail = true
      this.dialogEventVisible = true
      this.eventDialogTitle = this.$t('manage.detail')
    },

    reset() {
      this.event_no = null
      this.levels = []
      this.event_name = ''
      this.types = []
      this.source = null
      this.system = null
      this.dept_id = null
      this.emp_id = ''
      this.occured_time = []
      this.create_time = []
      this.confirm_time = []
      this.repair_time = []
      this.label_ids = []
      this.rccd_time = []
      this.close_time = []
      this.submit_rccd = null
      this.rccds = []
    },

    /**
     * 导入数据弹框
     */
    importEvent() {
      this.modalImportShown = true
    },

    /**
     * 导入数据文件保存
     */
    saveImportFile() {
      if (this.event_import_file) {
        let formData = new FormData(), _this = this
        formData.append("file", this.event_import_file)

        let request = new XMLHttpRequest();
        request.responseType = 'json'
        request.open("POST", "/secEvent/upload")
        request.onload = function (oEvent) {
          let type = 'error'
          if (request.status == 200 && request.readyState === 4 && request.response.errno === 0) {
            type = "success"
            _this.modalImportShown = false
            _this.search()
          }
          _this.$message({
            message: request.response.errmsg,
            type: type
          })
        }
        request.send(formData)
      } else {
        this.$message.error('请选择要上传的文件！')
      }
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
      return new Promise((resolve, reject) => {
        this.$http.get(url).then(({ body }) => {
          // body.data.splice(0, 1, { id: null, dName: this.$t('hint.select') });
          let options = body.data.map(({ id: value, dName: text }) => {
            return {
              value,
              text
            };
          });
          // options.splice(0, 0, { id: null, text: this.$t('hint.select') })
          switch (id) {
            case 1330:
              this.levelOptions = options
              break
            case 1300:
              this.seriousOptions = options
              break;
            case 1310:
              this.sourceOptions = options
              break
            case 1320:
              let optionStatusList = options.map(item => {
                return {
                  id: item.value,
                  label: item.text
                }
              })
              this.statusList.push({
                id: 0,
                label: '全部'
              })
              optionStatusList.sort(function (a, b) {
                if (a.id < b.id) {
                  return -1
                }
                if (a.id > b.id) {
                  return 1
                }
                return 0
              })
              this.statusList.push(...optionStatusList)
              break
            case 1550:
              this.labelIdsOptions = options
              break
            // case 1500:
            //   this.authLabelOptions = options
            //   break
            case 1510:
              this.rccdsOptions = options
              break
          }
          resolve(body)
        })
      })
    },

    // 当用户授权只有sec_event_guest并且不包含sec_event_user和sec_event_admin时，需要将添加、修改、导入按钮隐藏不显示
    getUserAuthority() {
      this.$http.get('userInfo').then(rsp => {
        let roles = rsp.body.roles, roleNames = []

        if (Array.isArray(roles) && roles.length > 0) {
          roles.forEach(item => {
            roleNames.push(item.name)
          })

          if (roleNames.includes('sec_event_guest') && !roleNames.includes('sec_event_user') && !roleNames.includes('sec_event_admin')) {
            this.hasWriteAuthority = false
          } else {
            this.hasWriteAuthority = true
          }
        } else {
          this.hasWriteAuthority = false
        }
      })
    }
  },

  created() {
    // 获取数据字典，初始化查询下拉参数
    this.getSelectOptions(1330) //levelOptions
      .catch(() => {
        this.getSelectOptions(1330)
      })
    this.getSelectOptions(1300) //seriousOptions
      .catch(() => {
        this.getSelectOptions(1300)
      })
    this.getSelectOptions(1310) //sourceOptions
      .catch(() => {
        this.getSelectOptions(1310)
      })
    this.getSelectOptions(1320) //sourceOptions
      .catch(() => {
        this.getSelectOptions(1320)
      })
    this.getSelectOptions(1550)
      .catch(() => {
        this.getSelectOptions(1550)
      })
    // this.getSelectOptions(1500) // 权限标签
    this.getSelectOptions(1510).catch(() => {
        this.getSelectOptions(1510)
      }) // rccd处罚结果

    // 获取用户信息，权限判断
    this.getUserAuthority()
  },
  mounted() {
    // 安全事件指标带过来的参数
    let query = this.$route.query

    if (Object.keys(query).length !== 0) {

      // 事件编号
      if (query.event_no) {
        this.event_no = query.event_no
      }

      // 发生时间
      if (query.occured_begin_time && query.occured_end_time) {
        this.occured_time = [moment(query.occured_begin_time), moment(query.occured_end_time)]
      }

      // 录入时间
      if (query.create_begin_time && query.create_end_time) {
        this.create_time = [moment(query.create_begin_time), moment(query.create_end_time)]
      }

      // 事件名称
      if (query.event_name) {
        this.event_name = query.event_name
      }

      // 确认时间
      if (query.confirm_begin_time && query.confirm_end_time) {
        this.confirm_time = [moment(query.confirm_begin_time), moment(query.confirm_end_time)]
      }

      // 事件类型
      if (query.type || query.types) {
        let typeArray = query.type ? query.type.split(',') : query.types.split(',')
        this.types = typeArray.map(value => {
          return Number(value)
        })
      }

      // 修复时间
      if (query.repair_begin_time && query.repair_end_time) {
        this.repair_time = [moment(query.repair_begin_time), moment(query.repair_end_time)]
      }

      // 关闭时间
      if (query.close_begin_time && query.close_end_time) {
        this.close_time = [moment(query.close_begin_time), moment(query.close_end_time)]
      }

      // 处罚时间
      if (query.rccd_begin_time && query.rccd_end_time) {
        this.rccd_time = [moment(query.rccd_begin_time), moment(query.rccd_end_time)]
      }

      this.submit_rccd = query.submit_rccd

      // rccd处罚结果
      if (query.rccds) {
        let rccdsArray = query.rccds.split(',')
        this.rccds = rccdsArray.map(value => {
          return Number(value)
        })
      }

      // 严重程度
      if (query.level || query.levels) {
        let levelArray = query.level ? query.level.split(',') : query.levels.split(',')
        this.levels = levelArray.map(value => {
          return Number(value)
        })
      }

      // 发现方式
      this.source = query.source ? Number(query.source) : null

      if (query.status) {
        this.activeTab = Number(query.status)
        this.status = Number(query.status)
      }

      this.status = query.status

      // 涉及部门
      if (query.dept_id != 'null' && query.dept_id != 'undefined') {
        this.dept_id = query.dept_id
        this.deptOptions.push({
          value: this.dept_id,
          label: query.dept_name
        })
      }

      // 涉及人员
      if (query.emp_id != 'null' && query.emp_id != 'undefined') {
        this.emp_id = query.emp_id
        this.empOptions.push({
          value: this.emp_id,
          label: query.emp_name
        })
      }

      // 发现系统
      this.system = query.system ? query.system : ''
      this.showTable = true // ??

      //   this.search()

    } else {
      // this.search()
      this.showTable = true
    }
  }
}
</script>
<style lang="less">
.rd-max {
  max-width: 220px;
  > a {
    overflow-wrap: normal;
    margin-left: 5px;
    margin-right: 5px;
  }
}
.manage-event {
  &__import {
    float: right;
    margin-left: 10px;
  }
  &__modal {
    .modal-dialog {
      max-width: 1100px;
    }
  }
  .datepicker-range .datepicker-popup {
    width: 415px;
  }

  .el-table__header th {
    color: #494b55;
    text-align: center;
    background-color: #f3f4f5;
  }

  .el-range-separator {
    width: 10%;
  }
}

.manage-event__modal {
  a {
    margin-right: 5px;
  }
  .modal-dialog {
    max-width: 1100px;
  }
  .modal-content .modal-body .row .col-sm-2 > label {
    float: right;

    &::after {
      content: ":";
    }
  }
}

.manage-event__import__form--save {
  float: right;
  margin-top: 15px;
}
</style>


