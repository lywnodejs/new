<template>
  <div class="business-reviewer">
    <app-section :title="$t('manage.reviewer.businessTitle')">
      <el-form :model="reviewerBusinessForm" ref="reviewerBusinessForm" label-width="100px" :rules="businessRules">
        <el-row :gutter="10" >
          <el-col :span="20">
            <el-form-item :label="$t('manage.reviewer.wetherReview')" prop="isReview">
              <el-radio-group v-model="reviewerBusinessForm.isReview">
                <el-radio v-for="item in isOptions" :key="item.value" :label="item.value">{{translateByName('event', item.label)}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="reviewerBusinessForm.isReview == null || reviewerBusinessForm.isReview">
        <el-row :gutter="10" >
          <el-col :span="20">
            <el-form-item :label="$t('manage.reviewer.reviewTime')" prop="reviewTime">
              <el-date-picker
                v-model="reviewerBusinessForm.reviewTime"
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
              <el-select v-model="reviewerBusinessForm.reviewParticipantList" remote reserve-keyword :remote-method="reviewBusinessSearchList" :placeholder="$t('manage.select')" filterable multiple style="width: 100%;">
                <el-option
                  v-for="item in empBusinessListOptions"
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
              <el-input type="textarea" v-model="reviewerBusinessForm.reviewResult"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" >
          <el-col :span="20">
            <el-form-item :label="$t('manage.reviewer.file')" prop="businessReviewAttachments" ref="fileBusinessValidate">
              <el-upload
                class="upload-demo"
                action="/file/upload"
                :on-remove="handleBusinessFileRemove"
                multiple
                :limit="3"
                :on-success="handleBusinessSuccess"
                :on-preview="handleBusinessPreview"
                :file-list="reviewBusinessAttachments">
                <el-button size="small" type="primary">{{ $t('manage.upload') }}</el-button>
                <div slot="tip" class="el-upload__tip">{{ $t('manage.supportFile') }}</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        </template>
        <el-row :gutter="10" v-if="reviewerBusinessForm.isReview == 0" >
          <el-col :span="20">
            <el-form-item :label="$t('manage.reviewer.notReviewReason')" prop="notReviewReason">
              <el-input type="textarea" v-model="reviewerBusinessForm.notReviewReason"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :offset="5" :span="10">
            <el-form-item>
              <el-button type="primary" @click="saveReview('reviewerBusinessForm', 2)">{{$t('manage.save')}}</el-button>
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
    businessReview: {
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
      businessRules: {},
      reviewerBusinessForm: {
        id: '',
        isReview: 2,
        reviewType: null,
        reviewTime: '',
        reviewParticipantList: [],
        reviewResult: '',
        reviewAttachments: [],
        notReviewReason: ''
      },

      isOptions: [{
        label: '是',
        value: 1
      }, {
        label: '否',
        value: 0
      }],

      empBusinessListOptions: [],
      reviewBusinessAttachments: []
    }
  },

  components: {
    appSection
  },

  watch: {
    lang: {
      handler(val) {

        this.businessRules = {
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
    businessReview: function() {
      this.getReviewInfo()
    }
  },

  computed: {
    ...mapState(['lang']),
    computedBusinessReviewMember: function() {
      let accounts = []
      if (this.reviewerBusinessForm.reviewParticipantList && this.reviewerBusinessForm.reviewParticipantList.length > 0) {
        this.reviewerBusinessForm.reviewParticipantList.forEach(item => {
          accounts.push(item.split('(')[1].split('@')[0])
        })
      }
      return accounts.join(',')
    }
  },

  methods: {

    // 暂时废弃，附件不是必填项
    validateBusinessAttachments(rule, value, callback) {
      if (this.reviewBusinessAttachments.length > 0) {
        callback()
      } else {
        callback(new Error(this.$t('manage.reviewer.warning.fileRequired')))
      }
    },

    reviewBusinessSearchList(query) {
      if(query !== '') {
        this.$http.get('secEvent/searchEmpList', {params: {'account': query}}).then(res => {
          if (res.data.errno == 0) {
            this.empBusinessListOptions = []
            this.empBusinessListOptions = res.data.data.map((item) => {
              return {
                value: item.name + '(' + item.email+ ')',
                label: item.name + '(' + item.email+ ')'
              }
            })
          } else {
            this.empBusinessListOptions = []
          }
        })
      } else {
        this.empBusinessListOptions = []
      }
    },

    handleBusinessFileRemove(file, fileList) {
      this.reviewBusinessAttachments = fileList
    },

    handleBusinessSuccess(response, fileObject, fileList) {
      if (response && response.errno == 0) {
        this.reviewBusinessAttachments.push({
          name: fileObject.name,
          url: response.data
        })
      } else {
        this.$message.error(response.errmsg)
        this.reviewBusinessAttachments = _.remove(fileList, function(item) {
          return item.uid != fileObject.uid
        })
      }
    },

    handleBusinessPreview(file) {
      window.location = file.url
    },

    // 信息安全复盘
    saveReview(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {}, url = 'secEvent/review/save'

          // 业务线复盘
          params = this.reviewerBusinessForm
          params.reviewType = 1992

          if (this.reviewBusinessAttachments.length > 0) {
            params.reviewAttachments = JSON.stringify(this.reviewBusinessAttachments)
          }

          params.reviewParticipant = this.computedBusinessReviewMember

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
      if (this.businessReview.id) {
        this.reviewerBusinessForm.id = this.businessReview.id || ''
        this.reviewerBusinessForm.isReview = this.businessReview.isReview
        this.reviewerBusinessForm.reviewType = this.businessReview.reviewType
        this.reviewerBusinessForm.reviewTime = this.businessReview.reviewTime
        this.reviewerBusinessForm.reviewResult = this.businessReview.reviewResult
        this.reviewerBusinessForm.notReviewReason = this.businessReview.notReviewReason

        // 参加人
        if (this.businessReview.reviewParticipant && this.businessReview.reviewParticipant.length > 0) {
          this.businessReview.reviewParticipant.forEach(item => {
            this.reviewerBusinessForm.reviewParticipantList.push(item.name + '(' + item.email+ ')')
            this.empBusinessListOptions.push({
              value: item.name + '(' + item.email+ ')',
              label: item.name + '(' + item.email + ')'
            })
          })
        }
        this.reviewBusinessAttachments = this.businessReview.reviewAttachments || []
      }
    }
  },

  created() {
    this.getReviewInfo()
  }
}
</script>

<style lang="less">
  .business-reviewer {
    .el-form-item {
      margin-bottom: 18px;
    }
  }
</style>
