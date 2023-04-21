<template>
  <div class="alarm-event">
    <toggle-form title="alarm.event.title">
      <form-field label="alarm.event.number" for-id="id">
        <input type="text" class="form-control" id="id" v-model="id">
      </form-field>

      <form-field label="alarm.event.createTime" for-id="createTime">
        <vue-datepicker-local v-model="create_time" clearable inputClass="form-control my-readonly" />
      </form-field>

      <form-field label="alarm.event.name" for-id="name">
        <input type="text" class="form-control" id="name" maxlength="100" v-model="name">
      </form-field>

      <form-field label="alarm.event.eventTime" for-id="eventTime">
        <vue-datepicker-local v-model="event_time" clearable inputClass="form-control my-readonly" />
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
          <b-button variant="primary" size="sm" @click.stop="showDetail(row.item.id)">
            {{ $t('buttons.link') }}
          </b-button>
          <router-link v-if="row.item.status == 1284" class="btn btn-primary btn-sm" :to="{name : 'AlarmJudge', params: {alarm_id : row.item.id}}">
            {{ $t('buttons.judge') }}
          </router-link>
        </template>
        <template slot="creator" slot-scope="props">
          <span>{{props.value && props.value.name}}</span>
        </template>
        <template slot="auditor" slot-scope="props">
          <span>{{props.value && props.value.name}}</span>
        </template>
      </b-table>
    </search-table>
    <b-modal
      class="alarm-event__modal"
      centered
      hide-footer
      :title="$t('alarm.event.detail')"
      v-model="modalShown">
      <alarm-detail :event-info="eventInfo"></alarm-detail>
    </b-modal>
  </div>
</template>
<style scoped>

</style>
<style lang="less" scoped>
.rd-max {
    max-width: 220px;
    >a {
        overflow-wrap: normal;
        margin-left: 5px;
        margin-right : 5px;
    }
}
</style>

<script>
import moment from 'moment'
import InitTableMixin from "commons/mixins/InitTableMixin.es6"
import {SDL_TASK_STATUS, GIT_PREFIX, DATE_FORMAT} from '@/constants.es6'
import TASK_CONFIG from './Event.es6'
import AlarmDetail from './detail.vue'
import FilterTab from 'commons/FilterTab.vue'

const AUDIT_URL = 'sdl/claim',
      reset = TASK_CONFIG.reset()

export default {

  name: "SDL-INDEX",

  mixins: [InitTableMixin],

  computed: {
    params: TASK_CONFIG.params(function () {
      const query_time ={}
      const [create_begin_time, create_end_time] = this.create_time
      const [event_begin_time, event_end_time] = this.event_time

      if (create_begin_time) {
        query_time.create_begin_time = moment(create_begin_time).format(DATE_FORMAT)
      }
      if (create_end_time) {
        query_time.create_end_time = moment(create_end_time).format(DATE_FORMAT)
      }
      if (event_begin_time) {
        query_time.event_begin_time = moment(event_begin_time).format(DATE_FORMAT)
      }
      if (event_end_time) {
        query_time.event_end_time = moment(event_end_time).format(DATE_FORMAT)
      }
      return query_time
    }),

    actionStatus () {
      return this.actionResult ? 'success' : 'danger'
    },

    inAudit () {
      return this.task_status == 1226
    }
  },

  created () {
    let project_id = this.$route.params.project_id
    if(project_id) {
      this.url = `${this.url}?project_id=${project_id}`
    }
    this.SDL_TASK_STATUS = SDL_TASK_STATUS
  },

  components : {
    FilterTab,
    AlarmDetail
  },

  data() {
    return Object.assign({
      url : 'event/queryEventList',
      modalShown : false,
      create_time: [],
      event_time: [],
      eventInfo: {
        'id': 0,
        'name': '',
        'event_time': '',
        'create_time': '',
        'audit_time': '',
        'creator': {},
        'auditor': {},
        'status': 0,
        'status_name': '',
        'description': ''
      },
      statusList: [
        {
          id: 0,
          label: '全部'
        },
        {
          id: 1284,
          label: '待受理'
        },
        {
          id: 1286,
          label: '已受理'
        },
        {
          id: 1288,
          label: '已撤销'
        },
        {
          id: 1290,
          label: '误报'
        }
      ],
      activeTab: 0
    }, TASK_CONFIG.data(), {
      fields: {
        id : {
          label: this.$t('alarm.event.number'),
        },
        status: {
          key: 'status_name',
          label: this.$t('alarm.event.status'),
        },
        name: {
          label: this.$t('alarm.event.name'),
        },
        event_time: {
          label: this.$t('alarm.event.eventTime'),
        },
        creator: {
          label: this.$t('alarm.event.creator'),
        },
        create_time: {
          label: this.$t('alarm.event.createTime'),
        },
        auditor: {
          label: this.$t('alarm.event.auditor')
        },
        audit_time: {
          label: this.$t('alarm.event.auditTime')
        },
        action: {
          label: this.$t('buttons.action')
        }
      }
    })
  },

  methods: {

    reset,
    /**
     * 查看详情
     */
    showDetail(id, toggleDetails) {
      this.modalShown = true
      this.$http.get('event/findEventInfo', {params: {id: id}}).then(({ body }) => {
        this.eventInfo = body.data
      });
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
    }

  }
}
</script>
<style lang="less">
  .alarm-event {
    &__modal {
      .modal-dialog {
        max-width: 1100px;
      }
    }
    .datepicker-range .datepicker-popup {
      width: 415px;
    }
  }
</style>


