<template>
  <div class="safety-reviewer">
    <app-section :title="$t('manage.reviewer.safeTitle')" >
      <el-form :model="reviewerSafeForm" ref="reviewerSafeForm" label-width="100px" :rules="safeRules">
        <el-row :gutter="10" >
          <el-col :span="20">
            <el-form-item :label="$t('manage.reviewer.wetherReview')" prop="isReview">
              <el-radio-group v-model="reviewerSafeForm.isReview">
                <el-radio v-for="item in isOptions" :key="item.value" :label="item.value">{{translateByName('event', item.label)}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="reviewerSafeForm.isReview">
          <el-row :gutter="10">
            <el-col :span="20">
              <el-form-item :label="$t('manage.reviewer.reviewTime')" prop="reviewTime">
                <el-date-picker
                  v-model="reviewerSafeForm.reviewTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :placeholder="$t('manage.selectDate')">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" >
            <el-col :span="20">
              <el-form-item :label="$t('manage.reviewer.participant')" prop="reviewParticipantList">
                <el-select v-model="reviewerSafeForm.reviewParticipantList" remote reserve-keyword :remote-method="reviewSafeSearchList" :placeholder="$t('manage.select')" filterable multiple style="width: 100%;">
                  <el-option
                    v-for="item in empSafeListOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" >
            <el-col :span="20">
              <el-form-item :label="$t('manage.reviewer.reviewResult')" prop="reviewResult">
                <el-input type="textarea" v-model="reviewerSafeForm.reviewResult"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" >
            <el-col :span="20">
              <el-form-item :label="$t('manage.reviewer.file')" prop="reviewAttachments" ref="fileValidate">
                <el-upload
                  class="upload-demo"
                  action="/file/upload"
                  :on-remove="handleSafeFileRemove"
                  multiple
                  :limit="3"
                  :on-success="handleSafeSuccess"
                  :on-preview="handleSafePreview"
                  :file-list="reviewSafeAttachments">
                  <el-button size="small" type="primary">{{ $t('manage.upload') }}</el-button>
                <div slot="tip" class="el-upload__tip">{{ $t('manage.supportFile') }}</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </template >
        <el-row :gutter="10" v-if="reviewerSafeForm.isReview == 0" >
          <el-col :span="20">
            <el-form-item :label="$t('manage.reviewer.notReviewReason')" prop="notReviewReason">
              <el-input type="textarea" v-model="reviewerSafeForm.notReviewReason"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :offset="5" :span="10">
            <el-form-item>
              <el-button type="primary" @click="saveReview('reviewerSafeForm', 1)">{{$t('manage.save')}}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </app-section>
  </div>
</template>

<script>
import appSection from '../../components/section/index.vue'
import _ from 'lodash'
import { mapState } from 'vuex'

/**
 * 复盘负责人
 */
export default {
  props: {
    secureInformationReview: {
      type: Object,
      default: {
        id: null,
        isReview: null,
        reviewTime: '',
        reviewParticipant: [],
        reviewResult: '',
        reviewAttachments: [],
        notReviewReason: '',
        reviewParticipantHtml: ''
      }
    }
  },
  data() {
    return {
      reviewerSafeForm: {
        id: '',
        isReview: 2,
        reviewType: null,
        reviewTime: '',
        reviewParticipantList: [],
        reviewResult: '',
        reviewAttachments: [],
        notReviewReason: ''
      },

      safeRules: {},
      isOptions: [{
        label: '是',
        value: 1
      }, {
        label: '否',
        value: 0
      }],

      empSafeListOptions: [],
      reviewSafeAttachments: [],
    }
  },

  components: {
    appSection
  },

  watch: {
    lang: {
      handler(val) {

        this.safeRules = {
          isReview: [
            { required: true, message: this.$t('manage.reviewer.warning.isReviewRequired'), trigger: 'change' }
          ],
          reviewTime: [
            { required: true, message: this.$t('manage.reviewer.warning.reviewTimeRequired'), trigger: 'blur' }
          ],
          reviewParticipantList: [
            { required: true, message: this.$t('manage.reviewer.warning.reviewParticipantRequired'), trigger: 'change' }
          ],
          reviewResult: [
            { required: true, message: this.$t('manage.reviewer.warning.reviewResultRequired'), trigger: 'blur' }
          ],
          notReviewReason: [
            { required: true, message: this.$t('manage.reviewer.warning.notReviewReasonRequired'), trigger: 'blur' }
          ]
        }
      },
      immediate: true
    },
    secureInformationReview: function() {
      this.getReviewInfo()
    }
  },

  computed: {
    ...mapState(['lang']),
    computedSafeReviewMember: function() {
      let accounts = []
      if (this.reviewerSafeForm.reviewParticipantList && this.reviewerSafeForm.reviewParticipantList.length > 0) {
        this.reviewerSafeForm.reviewParticipantList.forEach(item => {
          accounts.push(item.split('(')[1].split('@')[0])
        })
      }
      return accounts.join(',')
    }
  },

  methods: {

    // 暂时废弃，附件不是必填项
    validateSafeAttachments(rule, value, callback) {
      if (this.reviewSafeAttachments.length > 0) {
        callback()
      } else {
        callback(new Error(this.$t('manage.reviewer.warning.fileRequired')))
      }
    },

    reviewSafeSearchList(query) {
      if(query !== '') {
        this.$http.get('secEvent/searchEmpList', {params: {'account': query}}).then(res => {
          if (res.data.errno == 0) {
            this.empSafeListOptions = []
            this.empSafeListOptions = res.data.data.map((item) => {
              return {
                value: item.name + '(' + item.email+ ')',
                label: item.name + '(' + item.email+ ')'
              }
            })
          } else {
            this.empSafeListOptions = []
          }
        })
      } else {
        this.empSafeListOptions = []
      }
    },

    handleSafeFileRemove(file, fileList) {
      this.reviewSafeAttachments = fileList
    },

    handleSafeSuccess(response, file, fileList) {
      if (response && response.errno == 0) {
        this.reviewSafeAttachments.push({
          name: file.name,
          url: response.data
        })
      } else {
        this.$message.error(response.errmsg)
        this.reviewSafeAttachments = _.remove(fileList, function(item) {
          return item.uid != file.uid
        })
      }
    },

    handleSafePreview(file) {
      window.location = file.url
    },

    // 信息安全复盘
    saveReview(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {}, url = 'secEvent/review/save'

          // 信息安全复盘

          params = this.reviewerSafeForm
          params.reviewType = 1991

          if (this.reviewSafeAttachments.length > 0) {
            /** let fileUrl = []
            this.reviewSafeAttachments.forEach(item => {
              fileUrl.push(item.url)
            }) */
            params.reviewAttachments = JSON.stringify(this.reviewSafeAttachments)
          }

          params.reviewParticipant = this.computedSafeReviewMember
          if (params.id) {
            url = 'secEvent/review/update'
          }
          params.eventId = this.$route.query.id

          this.$http.post(url, params, { emulateJSON: true }).then(res => {
            let type = 'error'
            if (res.data.errno == 0) {
              type = "success"
            }
            this.$message({
              message: res.data.errmsg,
              type: type
            })
          }).catch(exp => {
            this.$message.error(exp)
          })
        }
      })
    },

    getReviewInfo() {
      let secureInformationReview = this.secureInformationReview
      if (secureInformationReview.id) {
        this.reviewerSafeForm.id = secureInformationReview.id || ''
        this.reviewerSafeForm.isReview = secureInformationReview.isReview
        this.reviewerSafeForm.reviewType = secureInformationReview.reviewType
        this.reviewerSafeForm.reviewTime = secureInformationReview.reviewTime
        this.reviewerSafeForm.reviewResult = secureInformationReview.reviewResult
        this.reviewerSafeForm.notReviewReason = secureInformationReview.notReviewReason

        // 参加人
        if (secureInformationReview.reviewParticipant && secureInformationReview.reviewParticipant.length > 0) {
          secureInformationReview.reviewParticipant.forEach(item => {
            this.reviewerSafeForm.reviewParticipantList.push(item.name + '(' + item.email+ ')')
            this.empSafeListOptions.push({
              value: item.name + '(' + item.email+ ')',
              label: item.name + '(' + item.email + ')'
            })
          })
        }

        // 附件列表
        this.reviewSafeAttachments = secureInformationReview.reviewAttachments || []
      }
    }
  },

  created() {
    let eventId = this.$route.query.id
    if (eventId) {
      this.getReviewInfo()
    }
  }
}
</script>

<style lang="less">
  .safety-reviewer {
    .el-form-item {
      margin-bottom: 18px;
    }
  }
</style>
