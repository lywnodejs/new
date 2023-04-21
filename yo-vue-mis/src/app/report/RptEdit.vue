<template>
	<div class="rpt-event-edit">
    
    <header class="col-xs-2">{{$t('report.add_event')}}</header>
    <div class="event-report">
			<b-form class="event-report__form" ref="eventReportForm"> 
				<b-row>
					<b-col sm="2">
						<label for="name">{{ $t('report.name') }}</label>
					</b-col>
					<b-col sm="7">
						<b-form-input v-model="name" required />
					</b-col>
				</b-row>

				<b-row>
					<b-col sm="2">
						<label for="event_time">{{ $t('report.event_time') }}</label>
					</b-col>
					<b-col sm="8">
						<vue-datepicker-local v-model="event_time" inputClass="form-control my-readonly" format="YYYY-MM-DD HH:mm:ss" :disabled-date="disabledDateFn"/>
					</b-col>
				</b-row>

				<b-row>
					<b-col sm="2">
						<label for="event_time">{{ $t('report.description') }}</label>
					</b-col>
					<b-col sm="8">
						<vue-editor v-model="description"></vue-editor>
					</b-col>
				</b-row>

				<b-row>
					<b-col sm="10">
						<b-button variant="primary" @click.stop="saveReportEvent">{{ $t('buttons.submit') }}</b-button>
						<router-link class="btn btn-secondary" :to="{name : 'RptList'}">{{ $t('buttons.back') }}</router-link>
					</b-col>
				</b-row>
			</b-form>
    </div>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor"
import VueDatepickerLocal from "vue-datepicker-local"
import moment from 'moment'

export default {
  components: {
    VueEditor,
    VueDatepickerLocal
  },

  data() {
    return {
      id: null,
      name: "",
      event_time: new Date(),
      description: ""
    }
  },

  methods: {
    disabledDateFn(time) {
      return moment(time).isAfter(moment())
    },
    fmtLongDate(date, fmt) {
      return moment(date).format(fmt)
    },
    saveReportEvent() {
      let postData = {
        name: this.name,
        event_time: this.fmtLongDate(this.event_time, "YYYY-MM-DD HH:mm:ss"),
        description: this.description
      },
        url = "event/addMyEvent"
      if (this.id) {
        postData["id"] = this.id
        url = "event/modifyMyEvent"
      }
      if (this.validateName() && this.validateDescrition()) {
        this.$http.post(url, postData, { emulateJSON: true }).then(res => {
          let type = 'error'
          if (res.data.errno == 0) {
            type = "success"
          }
          this.$message({
            message: res.data.errmsg,
            type: type
          })
          this.$router.push("/report/list")
        })
      }
    },

    validateName() {
      if (!this.name) {
        this.$message.error('必须填写事件标题！')
      }
      else if (this.name && this.name.length > 100) {
        this.$message.error('事件标题不能超过100个字符')
      } else {
        return true
      }
    },

    validateDescrition() {
      if (!this.description) {
        this.$message.error('必须填写事件描述！')
      } else {
        return true
      }
    },

    detailEventDate(id) {
      this.$http.get("event/findMyEventInfo", { params: { 'id': id } }).then(res => {
        if (res.data.errno == 0) {
          let eventData = res.data.data
          this.id = eventData.id
          this.name = eventData.name
          this.description = eventData.description
        } else {
          this.$message.error(res.data.errmsg)
        }
      })
    }
  },

  created() {
    let id = this.$route.query.id
    if (id) {
      this.detailEventDate(id)
    }
  }
}
</script>

<style lang="less">
.rpt-event-edit header {
  margin-bottom: 20px;
  margin-left: 35px;
}
.event-report__form .row {
  margin-bottom: 15px;
}

.event-report__form .row:last-child {
  text-align: center;
}

.event-report__form label {
  float: right;
}

.event-report__form label::after {
  content: ":";
}
</style>



