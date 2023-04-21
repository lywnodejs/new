<template>
  <div class="alarm-detail">
    <el-form label-width="120px">
      <el-row :gutter="20">
        <el-col :offset="2" :span="11">
          <el-form-item :label="$t('alarm.id')">
            {{ alarmInfo.id }}
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('alarm.state_name')">
            {{ alarmInfo.state_name }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="11">
          <el-form-item :label="$t('alarm.type')">
            {{ alarmInfo.type_name }}
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('alarm.level')">
            {{ alarmInfo.level_name }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="11">
          <el-form-item :label="$t('alarm.alarmTime')">
            {{ alarmInfo.alarm_time }}
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('alarm.occuredTime')">
            {{ alarmInfo.occured_time }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="11">
          <el-form-item :label="$t('alarm.update_time')">
            {{ alarmInfo.update_time }}
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('alarm.merge_num')">
            {{ alarmInfo.merge_num }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-for="(row, index) in rows" :key="index">
        <el-col :offset="2" :span="11">
          <el-form-item :label="feature[2 * index].fieldNameZh">
            {{alarmInfo.alarmData && alarmInfo.alarmData[feature[2 * index].fieldNameEn]}}
          </el-form-item>
        </el-col>
        <el-col :span="11" v-if="feature[2 * index + 1]">
          <el-form-item :label="feature[2 * index + 1].fieldNameZh">
            {{alarmInfo.alarmData &&  alarmInfo.alarmData[feature[2 * index + 1].fieldNameEn]}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="11">
          <el-form-item :label="$t('alarm.audit_name')">
            {{ alarmInfo.audit_name }}
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('alarm.mode_name')">
            <p :class="alarmInfo.event == 0 ? 'alarm-detail--event' : ''">{{ alarmInfo.mode_name }}</p>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :offset="2" :span="20">
          <el-form-item :label="$t('alarm.event.remark')">
            {{ alarmInfo.remark }}
          </el-form-item>
        </el-col>
      </el-row>

       <el-row :gutter="20">
        <el-col :offset="2" :span="20">
          <el-form-item :label="$t('alarm.relative_to_event')">
            <sdl-table
              url="secEvent/queryListByAlarmId"
              :query-params="alarmParamQueryList"
              border
              style="width: 100%">

              <el-table-column
                prop="name"
                :label="$t('manage.name')">
              </el-table-column>

              <el-table-column
                prop="level_name"
                :label="$t('manage.serious_level')">
              </el-table-column>

              <el-table-column
                prop="status_name"
                :label="$t('manage.event_status')">
              </el-table-column>

              <el-table-column
                prop="id"
                :label="$t('buttons.action')"
                width="100px">
                <template slot-scope="scope">
                  <el-button @click="handleEventDetailClick(scope.row)" type="text" size="small">{{$t('buttons.link')}}</el-button>
                </template>
              </el-table-column>
            </sdl-table>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog :title="modelEventTitle" :visible.sync="dialogEventVisible" width="70%" append-to-body>
      <event-detail v-if="reloadEventDetail" :event-id="event_id"></event-detail>
    </el-dialog>
  </div>
</template>

<script>

export default {

  name: 'alarm-detail',

  props: {
    alarmRow: Object
  },

  data() {
    return {
      alarmInfo: {},
      feature: [],

      modelEventTitle: this.$t('manage.detail'),
      dialogEventVisible: false,
      event_id: {},
      reloadEventDetail: false
    }
  },

  computed: {
    rows() {
      return Math.ceil(this.feature.length / 2)
    }
  },

  methods: {
    alarmParamQueryList() {
      return {
        alarm_id: this.alarmRow.id
      }
    },
    /**
     * 查看关联告警详情
     */
    handleEventDetailClick(row) {
      // this.$emit('dialogSwitch', {
      //   num: 1,
      //   id: row.id
      // })
      this.reloadEventDetail = false
      this.$nextTick(() => {
        this.reloadEventDetail = true
        this.dialogEventVisible = true
        this.event_id = row.id
      })
    },

    getAlarmDetail() {
      if(this.alarmRow.id) {
        this.$http.get('alarm/getFields', { params: { alarmTypeId: this.alarmRow.type } }).then(({ body }) => {
          this.feature = body.data.fields
        })
        this.$http.get('alarm/findInfo', { params: { alarm_id: this.alarmRow.id } }).then(({ body }) => {
          this.alarmInfo = body.data
        });
      }
    }
  },

  created() {
    this.getAlarmDetail()
  }
}
</script>


<style lang="less">
  .alarm-detail {
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

    &--event {
      color: red;
    }
  }
</style>

