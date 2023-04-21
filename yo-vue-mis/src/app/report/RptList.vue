<template>
	<div class="report-main">
		<!-- 表格查询条件 -->
		<toggle-form title="report.title">
			<form-field label="report.id" for-id="id">
				<input type="number" class="form-control" id="id" v-model="id">
			</form-field>

			<form-field label="report.create_time" for-id="create_time">
        <vue-datepicker-local v-model="q_create_time" inputClass="form-control my-readonly"></vue-datepicker-local>
			</form-field>

			<form-field label="report.name" for-id="name">
				<input type="text" class="form-control" id="name" v-model="name">
			</form-field>

			<form-field label="report.event_time" for-id="event_time">
				<vue-datepicker-local v-model="q_event_time" inputClass="form-control my-readonly"/>
			</form-field>

			<form-action>
				<search-button :action="query" :status="searching"/>
				<button class="btn btn-secondary" @click="reset"><i class="fa fa-undo" aria-hidden="true"></i> {{$t('buttons.reset')}}</button>
			</form-action>
		</toggle-form>
	
    <filter-tab :tabs="statusList" :active-tab="activeTab" @change="changeStatus" />
		
		<!-- 事件上报按钮 -->
		<router-link class="btn btn-sm btn-primary add-report" :to="{name : 'RptEdit'}">
			{{$t('report.add_event')}}
		</router-link>

		<!-- 表格 -->
		<search-table :url="url" @load="onload" ref="searchTable" :params="params">
			<b-table slot="table" bordered head-variant="light"
				:items="items"
				:show-empty="true"
				:empty-text="$t('hint.no_record')"
				:fields="fields">

				<!-- 编辑操作列表 -->
				<template slot="action" slot-scope="row">
					<!-- 查看 -->
					<b-button variant="primary" size="sm" @click="detailModalShowClick(row.item.id)">
							{{ $t('buttons.link') }}
					</b-button>
					<!-- 撤销 -->
					<b-button v-if="row.item.status === 1284" variant="danger" size="sm" @click.stop="undoReport(row.item.id)">
							{{ $t('buttons.undo') }}
					</b-button>
					<!-- 编辑按钮 -->
					<router-link v-if="row.item.status === 1288" class="btn btn-sm btn-primary" :to="{name : 'RptEdit', query: {id: row.item.id}}">
						{{$t('buttons.edit')}}
					</router-link>
				</template>

				<template slot="status" slot-scope="row">
					{{row.item.status_name}}
				</template>
			</b-table>
		</search-table>

		<!-- 查看详情 -->
		<b-modal v-model="detailModalShow" class="event-detail-modal" id="eventDetail" size="lg" :no-close-on-backdrop="true" :title="$t('report.event_detail_title')" centered hide-footer>
			<b-row>
				<b-col sm="2">
					<label for="id">{{ $t('report.id') }}</label>
				</b-col>
				<b-col sm="4">{{ detailEventData.id }}</b-col>
				<b-col sm="2">
					<label for="id">{{ $t('report.status') }}</label>
				</b-col>
				<b-col sm="4">{{ detailEventData.status_name }}</b-col>
			</b-row>
			<b-row>
				<b-col sm="2">
					<label for="id">{{ $t('report.event_time') }}</label>
				</b-col>
				<b-col sm="4">{{ detailEventData.event_time }}</b-col>
				<b-col sm="2">
					<label for="id">{{ $t('report.create_time') }}</label>
				</b-col>
				<b-col sm="4">{{ detailEventData.create_time }}</b-col>
			</b-row>
			<b-row>
				<b-col sm="2">
					<label for="id">{{ $t('report.name') }}</label>
				</b-col>
				<b-col sm="10">{{ detailEventData.name }}</b-col>
			</b-row>
			<b-row>
				<b-col sm="2">
					<label for="id">{{ $t('report.description') }}</label>
				</b-col>
				<b-col sm="10" class="event-detail-modal__description" v-html="detailEventData.description"></b-col>
			</b-row>
		</b-modal>

		<!-- 撤销弹出确认框 -->
		<b-modal :no-close-on-backdrop="true" centered 
			v-model="undoModalShow"
			:ok-title="$t('buttons.confirm')"
			@ok="sureUndoReport"
			@cancel="cancelUndoReport"
			:cancel-title="$t('buttons.cancel')">
			<div>
				<!-- <img src="" alt=""> -->
				{{ $t('report.undo_tip') }}
			</div>
		</b-modal>
	</div>
</template>

<script>
import InitTableMixin from "commons/mixins/InitTableMixin.es6"
import EVENT_REPORT_CONFIG from "./RptList.es6"
import moment from "moment"
import FilterTab from 'commons/FilterTab.vue'

export default {
  name: "EVENT_REPORT",

  mixins: [InitTableMixin],

  components: {
    FilterTab
  },

  data() {
    return Object.assign(
      {
        url: "event/queryMyEventList",
        readonly: false,

        q_create_time: [],
        q_event_time: [],

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
        activeTab: 0,
        undoModalShow: false,
        undoEventId: null,

        detailModalShow: false,
        detailEventData: {}
      },
      EVENT_REPORT_CONFIG.data()
    );
  },

  watch: {
    id: function (val, old) {
      if (val) {
        let value = val + ''
        if (value.indexOf('-') !== -1 || value.indexOf('.') !== -1) {
          this.$message.error('事件编号只能输入正整数')
          this.id = null
        }
      }
    }
  },

  computed: {
    params: function () {
      // 绑定上下文
      let fn = EVENT_REPORT_CONFIG.params().bind(this)
      let paramData = fn()
      if (this.q_create_time.length > 0) {
        paramData.create_begin_time = moment(this.q_create_time[0]).format("YYYY-MM-DD")
        paramData.create_end_time = moment(this.q_create_time[1]).format("YYYY-MM-DD")
      }

      if (this.q_event_time.length > 0) {
        paramData.event_begin_time = moment(this.q_event_time[0]).format("YYYY-MM-DD")
        paramData.event_end_time = moment(this.q_event_time[1]).format("YYYY-MM-DD")
      }
      return paramData
    }

  },

  methods: {
    // 重置查询参数
    reset() {
      this.id = null
      this.name = ''
      this.status = 0
      this.q_create_time = []
      this.q_event_time = []
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

    // 弹出撤销确认框
    undoReport(id) {
      this.undoModalShow = true
      this.undoEventId = id
    },

    // 确认撤销
    sureUndoReport() {
      this.$http
        .post("event/revokeMyEvent", { id: this.undoEventId }, {
          emulateJSON: true
        })
        .then(res => {
          let status = 'error'
          if (res.data.errno == 0) {
            status = 'success'
            this.query()
          }
          this.$message({
            message: res.data.errmsg,
            type: status
          })
        })
    },

    // 取消撤销
    cancelUndoReport() { },

    // 显示详情
    detailModalShowClick(id) {
      this.$http.get("event/findMyEventInfo", { params: { 'id': id } }).then(res => {
        if (res.data.errno == 0) {
          this.detailModalShow = true
          this.detailEventData = res.data.data
        } else {
          this.$message.error(res.data.errmsg)
        }
      });
    }
  }
};
</script>

<style lang="less">
.report-main {
  .event-tab {
    float: left;
    margin-top: 15px;

    .card-header {
      padding: 0;
      background-color: #fff;
      border-bottom: none;

      .nav-pills {
        margin-left: 0;

        .nav-link {
          color: black;

          &.active,
          &:hover {
            background-color: #fff;
            border-bottom: 2px solid #007bff;
            border-radius: 0;
          }
        }
      }
    }
  }

  .datepicker-range .datepicker-popup {
    width: 420px;
  }

  .add-report {
    float: right;
    margin: 0 0 10px;
  }
  .event-detail-modal {
    .modal-dialog {
      max-width: 1100px;
    }
    &__description {
      overflow: auto;
    }
    .modal-content .modal-body .row .col-sm-2 > label {
      float: right;

      &::after {
        content: ":";
      }
    }
  }
}
</style>