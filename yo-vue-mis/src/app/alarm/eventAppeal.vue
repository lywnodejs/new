<template>
  <div class="event-detail">
    <el-form :model="appealForm" ref="appealForm" :rules="appealRules" label-width="200px">
      <el-row>
        <el-col :span="20">
          <el-form-item :label="$t('manage.name')">
            {{ eventInfo.eventName }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item :label="$t('manage.event_type')">
            {{ eventInfo.eventTypeName }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item :label="$t('manage.serious_level')">
            {{ eventInfo.eventLevelName }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item :label="$t('manage.member')">
            <p v-html="eventInfo.emp_list"></p>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item :label="$t('manage.department')">
            {{ eventInfo.dept_list }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="isAppeal == true && eventInfo.applyRemark">
        <el-col :span="20">
          <el-form-item :label="$t('manage.appeal_remark')">
            {{ eventInfo.applyRemark }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="isAppeal == true" >
        <el-col :span="20">
          <el-form-item :label="isAppeal == true && !eventInfo.applyRemark ? $t('manage.appeal_remark') : $t('manage.undo_appeal_remark')" prop="remark">
            <el-input type="textarea" v-model="appealForm.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="text-align: center;">
        <el-col>
            <!-- <router-link class="el-button el-button--info" :to="{name : 'ManageEvent', query: backQueryParams}">{{ $t('manage.back') }}</router-link> -->
            <el-button @click="$emit('close')">{{$t('manage.back')}}</el-button>
            <el-button type="primary" @click="saveAppeal">{{$t('manage.submit')}}</el-button>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>
import appSection from '../../components/section/index.vue'

export default {
  name: 'event-appeal',

  props: {
    eventId: [Number, String],
    isAppeal: Boolean
  },

  components: {
    appSection
  },

  data() {
    return {
      eventInfo: {
        eventId: null,
        eventName: '',
        eventTypeName: '',
        eventLevelName: '',
        emps: '',
        managerEmps: [],
        depts: [],
        applyUser: '',
        applyTime: '',
        applyRemark: '',
        remark: '',
        'emp_list': '',
        'dept_list': ''
      },
      appealForm: {
        remark: '',
        eventId: ''
      },
      appealRules: {
        remark: [{ required: true, message: this.$t('manage.appeal_remark_hint'), trigger: 'blur' }]
      }
    }
  },

  methods: {

    saveAppeal() {
      this.$refs.appealForm.validate((valid) => {
        if (valid) {
          let params = this.appealForm, url = 'secEvent/apply'
          this.$http.post(url, params, { emulateJSON: true }).then(res => {
            let type = 'error'
            if (res.data.errno == 0) {
              type = "success"
            }
            this.$message({
              message: res.data.errmsg,
              type: type
            })
            this.$emit('close', true)
          }).catch(exp => {
            this.$message.error(exp)
          })
        }
      })
    },

    getEventAppeal(id) {
      let _this = this
      this._id = id || this.eventId
      if(this._id) {
        this.$http.get('secEvent/apply/info', { params: { eventId: this._id } }).then(({ body }) => {
          _this.eventInfo = body.data
          _this.appealForm.eventId = _this.eventInfo.eventId
          let emps = body.data.emps, emp_name = [], dept_name = [], emp_name_html = ''
          if (emps instanceof Array && emps.length > 0) {
            emps.forEach(item => {
              // emp_name.push(item.emp_name)
              let name = item.emp_email.substr(0, item.emp_email.indexOf('@'))
              emp_name_html += ` <a target="_blank" href="http://i.xiaojukeji.com/space/personal/${name}?lang=zh-CN">${item.emp_name}</a>` + ','
              if (!dept_name.includes(item.dept_name)) {
                dept_name.push(item.dept_name)
              }
            })
            this.eventInfo.emp_list = emp_name_html.substring(0, emp_name_html.length - 1)
          }

          if (this.eventInfo.depts && this.eventInfo.depts.length > 0) {
            this.eventInfo.dept_list = this.eventInfo.depts.map(function (depts) { return depts.dept_name}).join(',')
          }
        })
      }
    }
  },

  created() {
    const id = this.$route.query.id
    this.getEventAppeal(id)
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
    .el-form-item__label::after {
      content: ":"
    }

    &--pre {
      white-space: pre-wrap;
    }
  }
</style>

