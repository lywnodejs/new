<template>
  <div class="manage-event">
    <div class="manage-event__bu">

      <a class="btn btn-primary manage-event__import"  :href="eventDownloadURL">
        {{ $t('buttons.export') }}
      </a>

      <b-button v-if="hasWriteAuthority" class="manage-event__import" variant="primary"  @click.stop="importEvent()">
        {{ $t('buttons.import') }}
      </b-button>

      <router-link v-if="hasWriteAuthority" class="btn btn-primary manage-event__import" :to="{name : 'ManageEventEdit'}">
        {{$t('manage.add_event')}}
      </router-link>

    </div>

    <toggle-form title="manage.title">
      <form-field label="manage.event_no" for-id="id">
        <input type="text" class="form-control" id="id" v-model="event_no" maxlength="100" >
      </form-field>

      <form-field label="manage.event_time" for-id="event_time">
        <!-- <vue-datepicker-local v-model="occured_time" clearable inputClass="form-control my-readonly" /> -->
        <el-date-picker
          v-model="occured_time"
          type="daterange"
          :picker-options="DATE_OPTIONS"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </form-field>

      <form-field label="manage.name" for-id="name">
        <input type="text" class="form-control" id="name" maxlength="100" :placeholder="$t('hint.vagues_search')" v-model="event_name">
      </form-field>

      <form-field label="manage.confirm_time" for-id="confirm_time">
        <!-- <vue-datepicker-local v-model="confirm_time" clearable inputClass="form-control my-readonly" /> -->
        <el-date-picker
          v-model="confirm_time"
          type="daterange"
          :picker-options="DATE_OPTIONS"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </form-field>

      <form-field label="manage.event_type" for-id="event_type">
        <el-select v-model="types" placeholder="请选择" multiple style="width: 100%;" clearable>
          <el-option v-for="item in levelOptions" :key="item.value" :label="item.text" :value="item.value" ></el-option>
        </el-select>
      </form-field>

      <form-field label="manage.repair_time" for-id="confirm_time">
        <!-- <vue-datepicker-local v-model="repair_time" clearable inputClass="form-control my-readonly" /> -->
        <el-date-picker
          v-model="repair_time"
          type="daterange"
          :picker-options="DATE_OPTIONS"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </form-field>

      <form-field label="manage.serious_level" for-id="serious_level">
        <!-- <b-form-select v-model="level" :options="seriousOptions"/> -->
        <el-select v-model="levels" placeholder="请选择" multiple  style="width: 100%;" clearable>
          <el-option v-for="item in seriousOptions" :key="item.value" :label="item.text" :value="item.value" ></el-option>
        </el-select>
      </form-field>

      <form-field label="manage.found_source" for-id="found_source">
        <!-- <b-form-select v-model="source" :options="sourceOptions"/> -->
        <el-select v-model="source" placeholder="请选择" style="width: 100%;" clearable>
          <el-option v-for="item in sourceOptions" :key="item.value" :label="item.text" :value="item.value" ></el-option>
        </el-select>
      </form-field>

      <form-field label="manage.department" for-id="dept_id">
        <!-- <input type="text" class="form-control" id="dept_id" maxlength="100" v-model="dept_id"  :placeholder="$t('manage.hint_department')" > -->
        <AutoSelect v-model="dept_id" :param-reset="empParamReset" url="/sdl/dept"></AutoSelect>
      </form-field>

      <form-field label="manage.member" for-id="emp_id">
        <!-- <input type="text" class="form-control" id="emp_id" maxlength="100" v-model="emp_id"  :placeholder="$t('manage.hint_member')" > -->
        <!-- <AutoSelect v-model="emp_id" :param-reset="empParamReset" param-name="account" url="/secEvent/searchEmpList"></AutoSelect> -->
        <el-select v-model="emp_id" remote reserve-keyword :remote-method="empSearchList" placeholder="请选择" filterable multiple style="width: 100%;">
          <el-option
            v-for="item in empOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </form-field>

      <form-field label="manage.system_source" for-id="system_source">
        <input type="text" class="form-control" id="system" maxlength="100" v-model="system"  :placeholder="$t('hint.vagues_search')" >
      </form-field>

      <form-action>
        <search-button :action="query" :status="searching" />
        <button class="btn btn-secondary" @click="reset">
          <i class="fa fa-undo" aria-hidden="true"></i> {{$t('buttons.reset')}}</button>
      </form-action>
    </toggle-form>

    <filter-tab :tabs="statusList" :active-tab="activeTab" @change="changeStatus" />

    <search-table :url="url" @load="onload" ref="searchTable" :params="params">
      <b-table slot="table" bordered head-variant="light" :items="items" :show-empty="true" :empty-text="$t('hint.no_record')"
        :fields="fields">
        <template slot="action" slot-scope="row">
          <b-button variant="primary" size="sm" @click.stop="showEventDetail(row.item.id)">
            {{ $t('buttons.link') }}
          </b-button>
          <router-link v-if="hasWriteAuthority" class="btn btn-primary btn-sm" :to="{name : 'ManageEventEdit', query: { id: row.item.id }}">
            {{$t('buttons.update')}}
          </router-link>
        </template>
      </b-table>
    </search-table>

    <el-dialog :title="modelEventTitle" :visible.sync="dialogEventVisible" width="70%">
      <event-detail v-if="dialogEventVisible" :event-id="event_id"></event-detail>
    </el-dialog>

    <b-modal
      class="manage-event__import__modal"
      centered
      hide-footer
      :title="$t('manage.import_title')"
      v-model="modalImportShown">
      <div id="manage-event__import__form">
        <b-form-file v-model="event_import_file" ref="fileinput" placeholder="请选择要上传文件"/>
        <b-button class="manage-event__import__form--save" variant="primary" @click="saveImportFile">{{ $t('buttons.sure') }}</b-button>
      </div>
    </b-modal>
  </div>
</template>
<style scoped>

</style>
<style lang="less" scoped>
.rd-max {
  max-width: 220px;
  > a {
    overflow-wrap: normal;
    margin-left: 5px;
    margin-right: 5px;
  }
}
</style>

<script>
import moment from 'moment'
// import InitTableMixin from "commons/mixins/InitTableMixin.es6"
import { SDL_TASK_STATUS, GIT_PREFIX, DATE_FORMAT, DATE_OPTIONS } from '@/constants.es6'
import MANAGE_EVENT_CONFIG from './ManageEvent.es6'
import FilterTab from 'commons/FilterTab.vue'
import AutoSelect from 'commons/AutoSelect.vue'
import { infoUrl } from '../sdl/utils.es6'

import ToggleForm from 'commons/ToggleForm.vue'
import SearchTable from 'commons/SearchTable.vue'
import FormField from 'commons/FormField.vue'
import FormAction from 'commons/FormAction.vue'
import SearchButton from 'commons/SearchButton.vue'
import RowDetail from 'commons/RowDetail.vue'
import VueDatepickerLocal from 'vue-datepicker-local'

// const AUDIT_URL = 'sdl/claim',
//   reset = MANAGE_EVENT_CONFIG.reset()

export default {

  name: "MANAGE-EVENT-INDEX",

  // mixins: [InitTableMixin],

  computed: {
    params: MANAGE_EVENT_CONFIG.params(function () {
      const query_time = {}
      const [occured_begin_time, occured_end_time] = this.occured_time
      const [confirm_begin_time, confirm_end_time] = this.confirm_time
      const [repair_begin_time, repair_end_time] = this.repair_time

      if (occured_begin_time) {
        query_time.occured_begin_time = moment(occured_begin_time).format(DATE_FORMAT)
      }
      if (occured_end_time) {
        query_time.occured_end_time = moment(occured_end_time).format(DATE_FORMAT)
      }
      if (confirm_begin_time) {
        query_time.confirm_begin_time = moment(confirm_begin_time).format(DATE_FORMAT)
      }
      if (confirm_end_time) {
        query_time.confirm_end_time = moment(confirm_end_time).format(DATE_FORMAT)
      }

      if (repair_begin_time) {
        query_time.repair_begin_time = moment(repair_begin_time).format(DATE_FORMAT)
      }
      if (repair_end_time) {
        query_time.repair_end_time = moment(repair_end_time).format(DATE_FORMAT)
      }

      query_time.types = this.types.join(',')
      query_time.levels = this.levels.join(',')

      return query_time
    }),

    eventDownloadURL: function() {

      let paramUrl = ''
      for(let [key, value] of Object.entries(this.params)) {
        paramUrl += key + '=' + value + '&'
      }
      return '/secEvent/download?' + paramUrl.substring(0, paramUrl.length-1)
    }
  },

  components: {
    FilterTab,
    AutoSelect,
    SearchTable,
    ToggleForm,
    FormField,
    FormAction,
    SearchButton,
    RowDetail,
    VueDatepickerLocal
  },

  data() {
    return Object.assign({
      url: 'secEvent/queryList',
      modalShown: false,
      modalImportShown: false,

      modelEventTitle: this.$t('manage.detail'),
      modelAlarmTitle: this.$t('manage.alarm.detail_title'),
      dialogEventVisible: false,
      dialogAlarmVisible: false,

      occured_time: [], // 发生时间
      confirm_time: [], // 确认时间
      repair_time: [], //修复时间

      levelOptions: [], //事件类型
      sourceOptions: [],//发现方式
      statusOptions: [],//事件状态
      seriousOptions: [], //严重程度

      empParamReset: false,

      event_id: '',

      searching : false,
      searchTime : 0,
      items : [],

      statusList: [
        {
          id: 0,
          label: '全部'
        },
        {
          id: 1321,
          label: '调查中'
        },
        {
          id: 1322,
          label: '处置中'
        },
        {
          id: 1323,
          label: '已关闭'
        }
      ],

      activeTab: 0,

      event_import_file: null,

      hasWriteAuthority: true, // 当用户授权只有sec_event_guest并且不包含sec_event_user和sec_event_admin时，需要将添加、修改、导入按钮隐藏不显示

      DATE_OPTIONS
    }, MANAGE_EVENT_CONFIG.data(), {
        fields: {
          event_no: {
            label: this.$t('manage.event_no'),
          },
          status: {
            key: 'status_name',
            label: this.$t('manage.event_status'),
          },
          name: {
            label: this.$t('manage.name'),
          },
          type: {
            key: 'type_name',
            label: this.$t('manage.event_type')
          },
          level: {
            key: 'level_name',
            label: this.$t('manage.serious_level')
          },
          source: {
            key: 'source_name',
            label: this.$t('manage.found_source'),
          },
          confirm_time: {
            label: this.$t('manage.confirm_time')
          },
          mttd: {
            label: this.$t('manage.mttd')
          },
          mttr: {
            label: this.$t('manage.mttr')
          },
          action: {
            label: this.$t('buttons.action')
          }
        }
      })
  },

  methods: {
    eventDownload() {
      let params = this.params

    },

    showEventDetail(id) {
      this.event_id = id
      this.dialogEventVisible = true
    },

    reset() {
      if (this.emp_id || this.dept_id) {
        this.empParamReset = true
      }

      this.event_no = null
      this.levels = []
      this.event_name = ''
      this.types = []
      this.source = null
      this.system = null
      this.dept_id = null
      this.emp_id = null
      this.occured_time = []
      this.confirm_time = []
      this.repair_time = []
      this.$nextTick(() => {
        this.empParamReset = false
      })
    },

    infoUrl,

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
            _this.query()
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
        this.query()
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
          }
          resolve(body)
        })
      })
    },

    onload (items, datas) {
      const OVER_TIME = 100
      let consumeTime = Date.now() - this.searchTime
      this.items = items
      if(consumeTime < OVER_TIME) {
        setTimeout(() => {
          this.searching = false
        }, OVER_TIME)
      } else {
        this.searching = false
      }
    },

    query () {
      this.searching = true
      this.searchTime = Date.now()
      this.$nextTick(() => {
        this.$refs.searchTable.$emit('refresh')
      })
    },

    // 当用户授权只有sec_event_guest并且不包含sec_event_user和sec_event_admin时，需要将添加、修改、导入按钮隐藏不显示
    getUserAuthority() {
      this.$http.get('userInfo').then(rsp => {
          let roles = rsp.body.roles, roleNames = []

          if(Array.isArray(roles) && roles.length > 0) {
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
    let typeUrl = this.getSelectOptions(1330) //levelOptions
    let levelUrl = this.getSelectOptions(1300) //seriousOptions
    let sourceUrl = this.getSelectOptions(1310) //sourceOptions

    // 获取用户信息，权限判断
    this.getUserAuthority()

    // 安全事件指标带过来的参数
    let query = this.$route.query

    if (Object.keys(query).length !== 0) {
      Promise.all([typeUrl, levelUrl, sourceUrl]).then(res => {
        this.occured_time = [moment(query.occured_begin_time), moment(query.occured_end_time)]
        this.source = query.source ? Number(query.source) : null
        if (query.level) {
          let levelArray = query.level.split(',')
          this.levels = levelArray.map(value => {
            return Number(value)
          })
        }
        if (query.type) {
          let typeArray = query.type.split(',')
          this.types = typeArray.map(value => {
            return Number(value)
          })
        }

        if (query.status) {
          this.activeTab = Number(query.status)
          this.status = Number(query.status)
        }
        this.status = query.status
        if(query.dept_id && query.dept_id != 'null' && query.dept_id != 'undefined') {
          this.dept_id = query.dept_id
        }

        this.$nextTick(() => {
          this.query()
        })
      })
    } else {
      this.query()
    }
  }
}
</script>
<style lang="less">
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


