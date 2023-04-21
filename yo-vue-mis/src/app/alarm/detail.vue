<template>
  <b-container class="alarm-detail">
    <b-row>
      <b-col>
        <label class="detail-label">{{$t('alarm.event.name')}}:</label>
        {{eventInfo.name}}
      </b-col>
      <b-col>
        <label class="detail-label">{{$t('alarm.event.number')}}:</label>
        {{eventInfo.id}}
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label class="detail-label">{{$t('alarm.event.eventTime')}}:</label>
        {{eventInfo.event_time}}
      </b-col>
      <b-col>
        <label class="detail-label">{{$t('alarm.event.status')}}:</label>
        {{eventInfo.status_name}}
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label class="detail-label">{{$t('alarm.event.creator')}}:</label>
        {{eventInfo.creator.name}}
      </b-col>
      <b-col>
        <label class="detail-label">{{$t('alarm.event.createTime')}}:</label>
        {{eventInfo.create_time}}
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label class="detail-label">{{$t('alarm.event.auditor')}}:</label>
        {{eventInfo.auditor && eventInfo.auditor.name}}
      </b-col>
      <b-col>
        <label class="detail-label">{{$t('alarm.event.auditTime')}}:</label>
        {{eventInfo.audit_time}}
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label class="detail-label">{{$t('alarm.event.description')}}:</label>
        <p class="detail-description" v-html="eventInfo.description"></p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label class="detail-label">{{$t('alarm.event.result')}}:</label>
        <div class="detail-table">
          <b-table
            bordered
            head-variant="light"
            :fields="fields"
            :items="eventInfo.alarms"
            :show-empty="true"
            :empty-text="$t('hint.no_record')"
            >
            <template slot="action" slot-scope="row">
              <b-button variant="primary" size="sm" @click.stop="showDetail(row)">
                {{ row.detailsShowing ? $t('buttons.toggleDetail') : $t('buttons.showDetail') }}
              </b-button>
            </template>
            <template slot="row-details" slot-scope="row">
              <b-container>
                <b-row>
                  <b-col>
                    <label class="detail-label">{{$t('alarm.id')}}:</label>
                    {{alarmInfo.alarm_id}}
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <label class="detail-label">{{$t('alarm.alarmTime')}}:</label>
                    {{alarmInfo.alarm_time}}
                  </b-col>
                  <b-col>
                    <label class="detail-label">{{$t('alarm.occuredTime')}}:</label>
                    {{alarmInfo.occured_time}}
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <label class="detail-label">{{$t('alarm.level')}}:</label>
                    {{alarmInfo.level_name}}
                  </b-col>
                  <b-col>
                    <label class="detail-label">{{$t('alarm.type')}}:</label>
                    {{alarmInfo.type_name}}
                  </b-col>
                </b-row>
                <b-row v-for="(row, index) in rows" :key="index">
                  <b-col>
                    <label class="detail-label">{{feature[2 * index].fieldNameZh}}:</label>
                    {{alarmInfo.alarmData && alarmInfo.alarmData[feature[2 * index].fieldNameEn]}}
                  </b-col>
                  <b-col v-if="feature[2 * index + 1]">
                    <label class="detail-label">{{feature[2 * index + 1].fieldNameZh}}:</label>
                    {{alarmInfo.alarmData &&  alarmInfo.alarmData[feature[2 * index + 1].fieldNameEn]}}
                  </b-col>
                </b-row>
              </b-container>
            </template>
          </b-table>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label class="detail-label">{{$t('alarm.event.remark')}}:</label>
        <p class="detail-description" v-html="eventInfo.remark"></p>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  props: {
    eventInfo: Object
  },
  data() {
    return {
      fields: {
        alarm_time: {
          label: this.$t('alarm.alarmTime')
        },
        occured_time: {
          label: this.$t('alarm.occuredTime')
        },
        type_name: {
          label: this.$t('alarm.type')
        },
        level_name: {
          label: this.$t('alarm.level')
        },
        action: {
          label: this.$t('buttons.action')
        }
      },
      feature: [],
      alarmInfo: {
        "alarm_id": null,
        "alarm_time": "",
        "occured_time": "",
        "level": null,
        "level_name": "",
        "type": null,
        "type_name": "",
        "alarmData": {}
      }
    }
  },
  computed: {
    rows() {
      return Math.ceil(this.feature.length / 2)
    }
  },
  methods: {
    showDetail({ item, toggleDetails, detailsShowing }) {

      if (!detailsShowing) {
        const { alarm_id, type } = item
        this.$http.get('alarm/getFields', { params: { alarmTypeId: type } }).then(({ body }) => {
          this.feature = body.data.fields
        })
        this.$http.get('event/findAlarmInfo', { params: { id: alarm_id } }).then(({ body }) => {
          this.alarmInfo = body.data
        })
      }

      toggleDetails()
    }
  }
}
</script>

<style lang="less">
.alarm-detail {
  max-height: 500px;
  overflow: auto;
  .detail-label {
    float: left;
    margin-right: 5px;
  }
  .detail-table {
    overflow: hidden;
  }
  .detail-description {
    overflow: auto;
  }
}
</style>

