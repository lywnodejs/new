<template>
  <div class="event-detail">
    <header class="col-xs-2" v-if="isBlank">
        {{$t('manage.detail_event_title')}}
    </header>
    <el-form label-width="120px">
      <el-row :gutter="20">
        <el-col :offset="2" :span="11">
          <el-form-item :label="$t('manage.event_no')">
            {{ eventInfo.event_no }}
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('manage.event_status')">
            {{ translateByName('event', eventInfo.status_name) }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="20">
          <el-form-item :label="$t('manage.name')">
            {{ eventInfo.name }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="11">
          <el-form-item :label="$t('manage.event_type')">
            {{ translateByName('event', eventInfo.type_name) }}
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('manage.serious_level')">
            {{ translateByName('event', eventInfo.level_name) }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="11">
          <el-form-item :label="$t('manage.found_source')">
            {{ translateByName('event', eventInfo.source_name) }}
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('manage.system_source')">
            {{ eventInfo.system }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="11">
          <el-form-item :label="$t('manage.event_time')">
            {{ eventInfo.occured_time }}
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('manage.create_time')">
            {{ eventInfo.create_time }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="11">
          <el-form-item :label="$t('manage.confirm_time')">
            {{ eventInfo.confirm_time }}
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t(repairTimeText)">
            {{ eventInfo.repair_time }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="11">
          <el-form-item :label="$t('manage.close_time')">
            {{ eventInfo.close_time }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="11">
          <el-form-item :label="$t('manage.mttd')">
            {{ eventInfo.mttd }}
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('manage.mttr')">
            {{ eventInfo.mttr }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="11">
          <el-form-item :label="$t('manage.mttxx')">
            {{ eventInfo.mtth }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="11">
          <el-form-item :label="$t('manage.member')">
            <p v-html="eventInfo.emps.emp_name"></p>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="20">
          <el-form-item :label="$t('manage.department')">
            {{ eventInfo.emps.dept_name }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="20">
          <el-form-item :label="$t('manage.founder')">
            {{ eventInfo.create_user }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="20">
          <el-form-item :label="$t('manage.survey_members')">
            <!-- <p v-for="item in eventInfo.survey_members_list" :key="item.id">
              <a target="_blank" href="http://i.xiaojukeji.com/space/personal/${name}?lang=zh-CN">${item.emp_name}</a>
            </p> -->
             <p v-html="eventInfo.survey_members_list_html"></p>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="11">
          <el-form-item :label="$t('manage.label_ids')">
            {{ translateByName('event', eventInfo.labels, ', ') }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="20">
          <el-form-item :label="$t('manage.submit_rccd')">
            {{ eventInfo.submit_rccd == 1 ? translateByName('event', '是')  : translateByName('event', '否') }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="eventInfo.submit_rccd == 1">
        <el-col :offset="2" :span="20">
          <el-form-item :label="$t('manage.rccd_time')">
            {{ eventInfo.rccd_time }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="eventInfo.submit_rccd == 1">
        <el-col :offset="2" :span="20">
          <el-form-item :label="$t('manage.rccd')">
            {{ eventInfo.rccd_result }}
          </el-form-item>
        </el-col>
      </el-row>

       <el-row :gutter="20">
        <el-col :offset="2" :span="20">
          <el-form-item :label="$t('manage.survey_result')">
            <!-- <p v-html="eventInfo.survey_result"></p> -->
            <pre class="event-detail--pre">{{ eventInfo.survey_result }}</pre>
            <!-- {{ eventInfo.survey_result }} -->
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="20">
          <el-form-item :label="$t('manage.punish_result')">
            <!-- {{ eventInfo.punish_result }} -->
            <pre class="event-detail--pre">{{ eventInfo.punish_result }}</pre>
          </el-form-item>
        </el-col>
      </el-row>

       <el-row :gutter="20">
        <el-col :offset="2" :span="20">
          <el-form-item :label="$t('manage.remark')">
            {{ eventInfo.remark }}
          </el-form-item>
        </el-col>
      </el-row>
      <!--//附件-->
      <el-row :gutter="20">
        <el-col :offset="2" :span="20">
          <el-form-item :label="$t('manage.reviewer.file')">
            <li class="file_listLi" v-for="item in eventInfo.attachmentList"><a target="_blank" :href="item">{{item}}</a></li>
          </el-form-item>
        </el-col>
      </el-row>

       <el-row :gutter="20">
        <el-col :offset="2" :span="22">
          <el-form-item :label="$t('manage.relative_to_alarm')">
            <sdl-table
              url="alarm/queryListByEventId"
              :query-params="eventParamQueryList"
              border
              style="width: 100%">

              <el-table-column
                prop="id"
                :label="$t('alarm.id')">
              </el-table-column>

              <el-table-column
                prop="type_name"
                :label="$t('alarm.type')">
              </el-table-column>

              <el-table-column
                prop="level_name"
                :label="$t('alarm.level')">
              </el-table-column>

              <el-table-column
                prop="alarm_time"
                :label="$t('alarm.alarmTime')">
              </el-table-column>

              <el-table-column
                prop="occured_time"
                :label="$t('alarm.occuredTime')">
              </el-table-column>

              <el-table-column
                prop="id"
                :label="$t('manage.action')"
                width="100px">
                <template slot-scope="scope">
                  <el-button @click="handleAlarmDetailClick(scope.row)" type="text" size="small">{{$t('manage.link')}}</el-button>
                </template>
              </el-table-column>
            </sdl-table>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="22">
          <el-form-item :label="$t('manage.relative_to_order')">
            <sdl-table
              url="/alarm/workOrder/list"
              :query-params="orderParamQueryList"
              border
              style="width: 100%">

              <el-table-column
                prop="id"
                :label="$t('order.orderId')">
              </el-table-column>

              <el-table-column
                prop="alarmType"
                :label="$t('order.alarmType')">
              </el-table-column>

              <el-table-column
                prop="riskLevel"
                :label="$t('order.riskLevel')">
              </el-table-column>

              <el-table-column
                prop="name"
                :label="$t('order.name')">
              </el-table-column>

              <el-table-column
                prop="postTime"
                :label="$t('order.postTime')">
              </el-table-column>

              <el-table-column
                prop="id"
                :label="$t('manage.action')"
                width="100px">
                <template slot-scope="scope">
                  <a class="el-button el-button--text el-button--small" target="_blank" :href="'http://anquan.didichuxing.com/project/portals/pages/alarm-order-detail.html?id=' + scope.row.id"  type="text" size="small">{{$t('manage.link')}}</a>
                </template>
              </el-table-column>
            </sdl-table>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-row :gutter="20">
        <el-col :offset="2" :span="20">
          <el-form-item :label="$t('manage.create_user')">
            {{ eventInfo.create_user }}
          </el-form-item>
        </el-col>
      </el-row> -->

        <template v-if="eventInfo.level == 1304 && eventInfo.status != 1322">
          <el-row :gutter="10">
            <el-col :offset="2" :span="11">
              <el-form-item :label="$t('manage.reviewer.safety_leader')">
                <p v-html="eventInfo.survey_members_list_html"></p>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item :label="$t('manage.reviewer.business_leader')">
                <p v-html="eventInfo.review_members_list_html"></p>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="$route.query.review == 2">
            <!-- <el-col :offset="2" :span="22">
              <event-reviewer></event-reviewer>
            </el-col> -->
            <el-col :offset="2" :span="11">
              <el-form-item label="">
                <safety-review-detail :secure-information-review="safetyReviewData"></safety-review-detail>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="">
                <business-review :business-review="businessReviewData"></business-review>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-else>
            <!-- <el-col :offset="2" :span="22">
              <review-detail></review-detail>
            </el-col> -->
             <el-col :offset="2" :span="11">
              <el-form-item label="">
                <safety-review-detail :secure-information-review="safetyReviewData"></safety-review-detail>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="">
                <business-review-detail :business-review="businessReviewData"></business-review-detail>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

      <el-row :gutter="10" v-if="isBlank" style="margin-top: 15px;">
        <el-col :offset="9" :span="10">
          <el-form-item>
            <router-link class="el-button el-button--info" :to="{name : 'ManageEvent', query: backQueryParams}">{{ $t('manage.back') }}</router-link>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :offset="2" :span="20">
          <el-form-item>
            <div :style=" eventInfo && eventInfo.recordList && eventInfo.recordList.length > 4 ? 'height: 500px; line-height: 0;' : 'height: 300px; line-height: 0;'">
              <el-steps direction="vertical" :active="eventInfo && eventInfo.recordList && eventInfo.recordList.length">
                <el-step v-for="item in eventInfo.recordList" :key="item.id">
                  <template slot="title">
                    <div :style="item.type == 1 ? 'color: red;' : ''">
                      {{ item.statusName}}
                    </div>
                  </template>
                  <template slot="description">
                    <div style="color: #666666;">
                      <div>{{item.operatorUser + ' ' + item.remark}}</div>
                      <div>{{item.createTime}}</div>
                    </div>
                  </template>
                </el-step>
              </el-steps>
              </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>


    <el-dialog :title="modelAlarmTitle" :visible.sync="dialogAlarmVisible" width="70%" append-to-body>
      <alarm-detail :alarm-row="alarm_row"></alarm-detail>
    </el-dialog>
  </div>
</template>

<script>
import appSection from '../../components/section/index.vue'
import reviewDetail from './reviewDetail.vue'
import eventReviewer from './eventReviewer.vue'
import safetyReviewDetail from './safetyReviewerDetail.vue'
import businessReviewDetail from './businessReviewerDetail.vue'
import businessReview from './businessReviewer.vue'

export default {
  name: 'event-detail',

  props: {
    eventId: [Number, String]
  },

  components: {
    appSection,
    reviewDetail,
    eventReviewer,
    safetyReviewDetail,
    businessReviewDetail,
    businessReview
  },

  data() {
    return {
      eventInfo: {
        'event_no': null,
        'status_name': '',
        'name': '',
        'type_name': '',
        'level_name': '',
        'source_name': '',
        'system': '',
        'occured_time': '',
        'create_time': '',
        'confirm_time': '',
        'repair_time': '',
        'emps': {
          'dept_name': '',
          'emp_name': ''
        },
        'auth_labels': '',
        'rccds': '',
        'labels': '',
        'survey_resoult': '',
        'punish_result': '',
        'remark': '',
        'create_user': '',

        'close_time': '',
        'rccd_time': '',
        'cttxx': '',
        'submit_rccd': '',
        'rccd': '',
        'rccd_result': '',
        'review_members_list_html': '',
        'review_members_list': '',
        'survey_members_list_html': '',
        'survey_members_list': ''
      },
      modelAlarmTitle: this.$t('manage.alarm.detail_title'),
      dialogAlarmVisible: false,
      alarm_row: {},
      reloadAlarmDetail: false,

      repairTimeText: '',

      businessReviewData: {},
      safetyReviewData: {}
    }
  },

  computed: {
    isBlank() {
      return !!this.$route.query.id
    },

    backQueryParams() {
      let backParams = {}
      let params = this.$route.query.params
      if (params && params.length > 0) {
        params.split('&').length > 0 ? params.split('&').forEach(item => {
          backParams[item.split('=')[0]] = item.split('=')[1]
        }) : {}
      }
      return backParams
    },

    eventStepOptions: function() {
      let setpOptions = []
      if (this.eventInfo.recordList && this.eventInfo.recordList.length > 0) {
        this.eventInfo.recordList.forEach(item => {
          if (item.type == 0) {
            setpOptions.push(item)
          }
        })
      }
      return setpOptions
    }
  },

  methods: {
    /**
     * 查看关联告警详情
     */
    handleAlarmDetailClick(row) {
      // this.$emit('dialogSwitch', {
      //   num: 0,
      //   id: row
      // })
      this.reloadAlarmDetail = false
      this.$nextTick(() => {
        this.reloadAlarmDetail = true
        this.dialogAlarmVisible = true
        this.alarm_row = row
      })

    },

    eventParamQueryList() {
      return {
        event_id: this._id
      }
    },

    orderParamQueryList() {
      return {
        eventId: this._id
      }
    },

    getEventDetail(id) {
      this._id = id || this.eventId
      if(this._id) {
        this.$http.get('secEvent/findInfo', { params: { event_id: this._id } }).then(({ body }) => {
          this.eventInfo = body.data
          let emps = body.data.emps, emp_name = [], dept_name = [], emp_name_html = ''

          // 调查结果正则替换
          // if (this.eventInfo.survey_result) {

          //   var reg = /\s{10,}/g
          //   console.log(this.eventInfo.survey_result.match(reg))
          //   this.eventInfo.survey_result = this.eventInfo.survey_result.replace(/\s{10,}/g, ' ')
          // }
          // console.log(eventInfo.survey_result)

          if (emps instanceof Array && emps.length > 0) {
            emps.forEach(item => {
              // emp_name.push(item.emp_name)
              let name = item.emp_email.substr(0, item.emp_email.indexOf('@'))
              emp_name_html += ` <a target="_blank" href="http://i.xiaojukeji.com/space/personal/${name}?lang=zh-CN">${item.emp_name}</a>（${item.isEmpExamCompletedName}）` + ','
              if (!dept_name.includes(item.dept_name)) {
                dept_name.push(item.dept_name)
              }
            })
            this.eventInfo.emps.emp_name = emp_name_html.substring(0, emp_name_html.length - 1)
            // this.eventInfo.emps.dept_name = dept_name.join()
          }
          // if (body.data.auth_labels instanceof Array && body.data.auth_labels.length > 0) {
          //   let names = []
          //   body.data.auth_labels.forEach(item => {
          //     names.push(item.name)
          //   })
          //   this.eventInfo.auth_labels = names.join(', ')
          // }
          // if (body.data.rccds instanceof Array && body.data.rccds.length > 0) {
          //   let names = []
          //   body.data.rccds.forEach(item => {
          //     names.push(item.name)
          //   })
          //   this.eventInfo.rccds = names.join(', ')
          // }
          if (body.data.labels instanceof Array && body.data.labels.length > 0) {
            let names = []
            body.data.labels.forEach(item => {
              names.push(item.name)
            })
            this.eventInfo.labels = names.join(', ')
          }
          if (this.eventInfo.depts && this.eventInfo.depts.length > 0) {
            this.eventInfo.emps.dept_name = this.eventInfo.depts.map(function (depts) { return depts.dept_name}).join(',')
          }
          this.eventInfo.survey_members_list_html = ''
          if (this.eventInfo.survey_members_list instanceof Array && this.eventInfo.survey_members_list.length > 0) {
            this.eventInfo.survey_members_list.forEach(item => {
              let name = item.emp_email.substr(0, item.emp_email.indexOf('@'))
              this.eventInfo.survey_members_list_html += ` <a target="_blank" href="http://i.xiaojukeji.com/space/personal/${name}?lang=zh-CN">${item.emp_name}</a>` + ','
            })
            this.eventInfo.survey_members_list_html = this.eventInfo.survey_members_list_html.substring(0, this.eventInfo.survey_members_list_html.length - 1)
          }
          this.eventInfo.review_members_list_html = ''
          if (this.eventInfo.review_members_list instanceof Array && this.eventInfo.review_members_list.length > 0) {
            this.eventInfo.review_members_list.forEach(item => {
              let name = item.emp_email.substr(0, item.emp_email.indexOf('@'))
              this.eventInfo.review_members_list_html += ` <a target="_blank" href="http://i.xiaojukeji.com/space/personal/${name}?lang=zh-CN">${item.emp_name}</a>` + ','
            })
            this.eventInfo.review_members_list_html = this.eventInfo.review_members_list_html.substring(0, this.eventInfo.review_members_list_html.length - 1)
          }

          this.computedCurrentRepairTimeText(this.eventInfo.type)
        })
      }
    },

    computedCurrentRepairTimeText(currentValue) {
      // 在以下事件类型中，“修复时间”改为“调查结束时间”
      let eventType = [1331, 1332, 1337, 1338, 1339, 1355, 1358, 1530, 1545]
      if (eventType.indexOf(currentValue) != -1) {
        this.repairTimeText = 'manage.repair_survey_time'
      } else {
        this.repairTimeText = 'manage.repair_time'
      }
    },

    getReviewDetail(id) {
      this._id = id || this.eventId
      if(this._id) {
        this.$http.get('secEvent/review/get', { params: { eventId: this._id } }).then(({ body }) => {
          this.safetyReviewData = body && body.data && body.data.secureInformationReview || {}
          this.businessReviewData = body && body.data && body.data.businessReview || {}
          // 参加人
          this.safetyReviewData.reviewParticipantHtml = ''
          if (this.safetyReviewData.reviewParticipant instanceof Array && this.safetyReviewData.reviewParticipant.length > 0) {
            this.safetyReviewData.reviewParticipant.forEach(item => {
              let name = item.email.substr(0, item.email.indexOf('@'))
              this.safetyReviewData.reviewParticipantHtml += ` <a target="_blank" href="http://i.xiaojukeji.com/space/personal/${name}?lang=zh-CN">${item.name}</a>` + ','
            })
            this.safetyReviewData.reviewParticipantHtml = this.safetyReviewData.reviewParticipantHtml.substring(0, this.safetyReviewData.reviewParticipantHtml.length - 1)
          }
          this.businessReviewData.reviewParticipantHtml = ''
          if (this.businessReviewData.reviewParticipant instanceof Array && this.businessReviewData.reviewParticipant.length > 0) {
            this.businessReviewData.reviewParticipant.forEach(item => {
              let name = item.email.substr(0, item.email.indexOf('@'))
              this.businessReviewData.reviewParticipantHtml += ` <a target="_blank" href="http://i.xiaojukeji.com/space/personal/${name}?lang=zh-CN">${item.name}</a>` + ','
            })
            this.businessReviewData.reviewParticipantHtml = this.businessReviewData.reviewParticipantHtml.substring(0, this.businessReviewData.reviewParticipantHtml.length - 1)
          }
        })
      }
    }
  },

  created() {
    const id = this.$route.query.id
    this.getEventDetail(id)
    this.getReviewDetail(id)
  }
}
</script>


<style lang="less">
  .event-detail {
    .el-table__header th {
      color: #494b55;
      text-align: center;
      background-color: #f3f4f5;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__label::after {
      content: ":"
    }

    &--pre {
      white-space: pre-wrap;
    }
    .file_listLi{
      list-style: none;
    }
  }
</style>

