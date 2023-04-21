<template>
  <div class="alarm-judge">
    <!-- 基础信息 -->
    <div class="judge-section">
      <b-row>
        <b-col>
          <label class="judge-label">{{$t('alarm.event.name')}}:</label>
          {{eventInfo.name}}
        </b-col>
        <b-col>
          <label class="judge-label">{{$t('alarm.event.number')}}:</label>
          {{eventInfo.id}}
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label class="judge-label">{{$t('alarm.event.eventTime')}}:</label>
          {{eventInfo.event_time}}
        </b-col>
        <b-col>
          <label class="judge-label">{{$t('alarm.event.createTime')}}:</label>
          {{eventInfo.create_time}}
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label class="judge-label">{{$t('alarm.event.creator')}}:</label>
          <a :href="getQueryName(eventInfo.creator.email)" target="_blank" v-if="eventInfo.creator">{{eventInfo.creator.name}}</a>
        </b-col>
        <b-col>
          <label class="judge-label">{{$t('alarm.event.status')}}:</label>
          {{eventInfo.status_name}}
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label class="judge-label">{{$t('alarm.event.description')}}:</label>
          <p class="jude-description" v-html="eventInfo.description"></p>
        </b-col>
      </b-row>
    </div>
    <!-- 研判操作 -->
    <div class="judge-section">
      <b-row>
        <b-col>
          <label class="judge-label">{{$t('alarm.event.result')}}:</label>
          <b-form-radio-group id="result" v-model="result" name="result">
            <b-form-radio :value="1">{{$t('alarm.1001')}}</b-form-radio>
            <b-form-radio :value="2">{{$t('alarm.1002')}}</b-form-radio>
            <b-form-radio :value="3">{{$t('alarm.1003')}}</b-form-radio>
          </b-form-radio-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="judge-list">
          <label class="judge-label">{{$t('alarm.list')}}:</label>
          <div class="judge-table">
            <b-table
              bordered
              head-variant="light"
              :fields="fields"
              :items="alarms"
              :show-empty="false"
              :empty-text="$t('hint.no_record')"
              >
              <template slot="alarmTime" slot-scope="row">
                {{timeFmt(alarm.alarmTime)}}
              </template>
              <template slot="occuredTime" slot-scope="row">
                {{timeFmt(alarm.occuredTime)}}
              </template>
              <template slot="type" slot-scope="row">
                {{typeFmt(row.value)}}
              </template>
              <template slot="level" slot-scope="row">
                {{levelFmt(row.value)}}
              </template>
              <template slot="action" slot-scope="row">
                <b-button variant="primary" size="sm" @click.stop="showAlarm(row.item)">
                  {{ $t('buttons.link') }}
                </b-button>
                <b-button variant="danger" size="sm" @click.stop="deleteAlarm(row.index)">
                  {{ $t('buttons.delete') }}
                </b-button>
              </template>
            </b-table>
          </div>
          <b-button class="judge-list__add" :disabled="disableAdd" variant="primary" @click.stop="open">
            {{ $t('buttons.add') }}
          </b-button>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <label class="judge-label judge-label--remark">{{$t('alarm.event.remark')}}:</label>
          <div class="judge-remark">
            <b-form-textarea id="remark"
              v-model="remark"
              :rows="3"
              :max-rows="6">
            </b-form-textarea>
          </div>
        </b-col>
      </b-row>
    </div>
    <!-- 按钮区 -->
    <div class="judge-buttons">
      <b-button variant="primary" @click="submit">{{$t('buttons.submit')}}</b-button>
      <b-button @click="back">{{$t('buttons.back')}}</b-button>
    </div>
    <!-- 告警详情 -->
    <b-modal
      class="alarm-event__modal"
      centered
      hide-footer
      :title="$t('alarm.event.detail')"
      v-model="modalShownDetail">
      <b-container>
        <b-row>
          <b-col>
            <label class="judge-label">{{$t('alarm.type')}}:</label>
            {{typeFmt(alarm.type)}}
          </b-col>
          <b-col>
            <label class="judge-label">{{$t('alarm.level')}}:</label>
            {{levelFmt(alarm.level)}}
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <label class="judge-label">{{$t('alarm.alarmTime')}}:</label>
            {{timeFmt(alarm.alarm_time)}}
          </b-col>
          <b-col>
            <label class="judge-label">{{$t('alarm.occuredTime')}}:</label>
            {{timeFmt(alarm.occured_time)}}
          </b-col>
        </b-row>
        <b-row v-for="(row, index) in rows" :key="index">
          <b-col>
            <label class="judge-label">{{feature[2 * index].fieldNameZh}}:</label>
            {{alarm.alarmData[feature[2 * index].fieldNameEn]}}
          </b-col>
          <b-col v-if="feature[2 * index + 1]">
            <label class="judge-label">{{feature[2 * index + 1].fieldNameZh}}:</label>
            {{alarm.alarmData[feature[2 * index + 1].fieldNameEn]}}
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
    <!-- 添加告警 -->
    <b-modal
      class="alarm-event__modal"
      centered
      hide-footer
      :no-close-on-backdrop="true"
      :title="$t('alarm.event.detail')"
      v-model="modalShownAdd"
      @show="handleDialogShow"
      @shown="handleDialogShown"
      @hidden="handleDialogHidden"
      >
        <form @submit.prevent="addAlarm" ref="form">
          <div class="form-group row">
            <form-field label="alarm.type" for-id="type">
              <b-form-select v-model="alarm.type"  @change="handleTypeChange" :options="typeOptions" required/>
            </form-field>
            <form-field label="alarm.level" for-id="level">
              <b-form-select v-model="alarm.level" :options="levelOptions" required/>
            </form-field>
            <form-field label="alarm.alarmTime" for-id="alarmTime">
              <vue-datepicker-local ref="alarmTime" v-model="alarm.alarm_time" inputClass="form-control my-readonly" :format="TIME_FORMAT" required clearable :disabled-date="disabledDate"/>
            </form-field>
            <form-field label="alarm.occuredTime" for-id="occuredTime">
              <vue-datepicker-local ref="occuredTime" v-model="alarm.occured_time" inputClass="form-control my-readonly" :format="TIME_FORMAT" required clearable :disabled-date="disabledDate"/>
            </form-field>
            <template v-for="(row, index) in rows">
              <form-field :label="feature[2 * index].fieldNameZh" :key="2 * index">
                <input type="text" class="form-control" required :id="feature[2 * index].fieldNameEn" v-model="alarm.alarmData[feature[2 * index].fieldNameEn]">
              </form-field>
              <form-field :label="feature[2 * index + 1].fieldNameZh" :key="2 * index + 1" v-if="feature[2 * index + 1]">
                <input type="text" class="form-control" required :id="feature[2 * index + 1].fieldNameEn" v-model="alarm.alarmData[feature[2 * index + 1].fieldNameEn]">
              </form-field>
            </template>
          </div>
          <div class="judge-buttons">
            <b-button class="btn" type="submit" variant="primary">{{$t('buttons.save')}}</b-button>
            <b-button class="btn" @click="close">{{$t('buttons.cancel')}}</b-button>
          </div>
        </form>
    </b-modal>
  </div>
</template>
<script>
import moment from 'moment';
import { TIME_FORMAT } from '@/constants.es6';
import FormField from 'commons/FormField.vue';
import VueDatepickerLocal from 'vue-datepicker-local';

export default {
  data() {
    return {
      modalShownDetail: false,
      modalShownAdd: false,
      result: 1, // 研判结果
      remark: '', //备注
      alarms: [], // 动态添加告警
      feature: [], // 告警特征字段
      TIME_FORMAT, // 时间格式字符串
      alarm: {
        type: null, // 告警类型
        level: null, // 告警等级
        alarm_time: null, // 告警时间
        occured_time: null, // 发生时间
        alarmData: {} // 特征字段需要动态添加
      },
      levelOptions: [
        { value: null, text: this.$t('hint.select') },
        { value: 0, text: this.$t('alarm.2000') },
        { value: 1, text: this.$t('alarm.2001') },
        { value: 2, text: this.$t('alarm.2002') },
        { value: 3, text: this.$t('alarm.2003') },
        { value: 4, text: this.$t('alarm.2004') }
      ],
      typeOptions: [],
      eventInfo: {
        id: 0,
        name: '',
        event_time: '',
        create_time: '',
        audit_time: '',
        creator: {},
        auditor: {},
        status: 0,
        status_name: '',
        description: ''
      },
      fields: {
        alarmTime: {
          label: this.$t('alarm.alarmTime')
        },
        occuredTime: {
          label: this.$t('alarm.occuredTime')
        },
        type: {
          label: this.$t('alarm.type')
        },
        level: {
          label: this.$t('alarm.level')
        },
        action: {
          label: this.$t('buttons.action')
        }
      },
      alarmInfo: {
        alarm_id: null,
        alarm_time: '',
        occured_time: '',
        level: null,
        level_name: '',
        type: null,
        type_name: '',
        alarmData: {}
      }
    };
  },
  computed: {
    rows() {
      return Math.ceil(this.feature.length / 2);
    },
    disableAdd() {
      return this.result !== 1;
    }
  },
  components: {
    FormField,
    VueDatepickerLocal
  },
  watch: {
    disableAdd(value) {
      if (value) {
        this.alarms = [];
      }
    }
  },
  methods: {
    timeFmt(value) {
      return moment(value).format(TIME_FORMAT);
    },

    typeFmt(value) {
      const type = this.typeOptions.find(type => type.value == value);
      return type ? type.text : '';
    },

    levelFmt(value) {
      const level = this.levelOptions.find(level => level.value == value);
      return level ? level.text : '';
    },

    getLabel(key) {
      const label = this.feature.find(item => item.fieldNameEn === key);
      if (label) {
        return label.fieldNameZh;
      } else {
        key = key.replace(/_(\w)/g, (all, letter) => letter.toUpperCase());
        return this.$t('hint.not_null', { field: `alarm.${key}` });
      }
    },

    getQueryName(mail) {
      if (!mail) return null;
      return `http://home.didichuxing.com/person.html#/${mail.split('@')[0]}/1`;
    },

    disabledDate(time) {
      return moment(time).isAfter(new moment());
    },

    handleDialogShow() {
      if (!this.hasLoadType) {
        this.$http.get('dictionary/listByParentId/1103').then(({ body }) => {
          body.data.splice(0, 1, { id: null, dName: this.$t('hint.select') });
          this.typeOptions = body.data.map(({ id: value, dName: text }) => {
            return {
              value,
              text
            };
          });
          this.hasLoadType = true;
        });
      }
      this.reset();
    },

    /**
     * 处理modal和datepicker混用失效的hack
     */
    handleDialogShown() {
      const { form, alarmTime, occuredTime } = this.$refs;
      form.addEventListener('click', alarmTime.dc);
      form.addEventListener('click', occuredTime.dc);
    },
    handleDialogHidden() {
      const { form, alarmTime, occuredTime } = this.$refs;
      form.removeEventListener('click', alarmTime.dc);
      form.removeEventListener('click', occuredTime.dc);
    },

    /**
     * 处理告警类型变化
     */
    handleTypeChange(value) {
      this.$http
        .get('alarm/getFields', { params: { alarmTypeId: value } })
        .then(({ body }) => {
          this.feature = body.data.fields;
          this.feature.forEach(feature => {
            // 动态添加特征属性
            this.$set(this.alarm.alarmData, feature.fieldNameEn, '');
          });
        });
    },

    /**
     * 重置表单
     */
    reset() {
      this.alarm = {
        alarm_time: null, // 告警时间
        occured_time: null, // 发生时间
        level: null, // 告警等级
        type: null, // 告警类型
        alarmData: {} // 特征字段需要动态添加
      };
      this.feature = [];
    },

    /**
     * 打开告警弹窗
     */
    open() {
      this.modalShownAdd = true;
    },

    /**
     * 关闭告警弹窗
     */
    close() {
      this.modalShownAdd = false;
    },

    /**
     * 添加告警
     */
    addAlarm() {
      this.alarms.push(this.alarm);
      this.close();
    },

    /**
     * 展示告警详情
     */
    showAlarm(alarm) {
      const { type } = alarm;
      this.$http
        .get('alarm/getFields', { params: { alarmTypeId: type } })
        .then(({ body }) => {
          this.feature = body.data.fields;
        });
      this.alarm = alarm;
      this.modalShownDetail = true;
    },

    /**
     * 删除告警
     */
    deleteAlarm(index) {
      this.alarms.splice(index, 1);
    },

    /**
     * 提交研判
     */
    submit() {
      const id = this.$route.params.alarm_id;
      const status = this.result;
      const alarms = this.alarms;
      const remark = this.remark
      this.$http
        .post(
        'event/auditEvent',
        {
          id,
          status,
          remark,
          alarms: JSON.stringify(alarms, function (k, v) {
            if (k === 'alarm_time' || k === 'occured_time')
              return moment(v).format(TIME_FORMAT);
            return v;
          })
        },
        { emulateJSON: true }
        )
        .then(({ body }) => {
          const { errno, errmsg } = body;

          if (errno === 0) {
            this.$message({
              message: this.$t('hint.success'),
              type: 'success'
            });
          } else {
            this.$message({
              message: errmsg,
              type: 'error'
            });
          }
          this.$router.push({ name: 'AlarmEvent' });
        });
    },

    /**
     * 返回
     */
    back() {
      this.$router.back();
    }
  },
  created() {
    const alarm_id = this.$route.params.alarm_id;
    this.$http
      .get('event/findEventInfo', { params: { id: alarm_id } })
      .then(({ body }) => {
        this.eventInfo = body.data;
      });
    this.hasLoadType = false;
  },
  mounted() { }
};
</script>

<style lang="less">
.alarm-judge {
  overflow: auto;
  .judge-section {
    padding: 15px;
    margin-bottom: 15px;
    border: 1px solid #cccccc;
  }
  .judge-label {
    float: left;
    margin-right: 10px;
  }

  .judge-label--remark {
    width: 4%;
  }
  .judge-table {
    overflow: hidden;
  }
  .jude-description {
    overflow: auto;
  }

  .judge-remark {
    float: left;
    width: 95%;
  }
  .judge-buttons {
    width: 100%;
    text-align: center;
    margin-top: 15px;
    display: inline-block;
  }
  .judge-list {
    position: relative;
    padding-right: 90px;
    &__add {
      position: absolute;
      top: 0;
      right: 15px;
    }
  }
  .alarm-event__modal {
    .modal-dialog {
      max-width: 1100px;
    }
    .datepicker {
      width: 100%;
    }
  }
}
</style>

