<template>
  <div class="review-detail">
    <el-row :gutter="10" >
      <el-col :span="12">
        <el-form-item label="">
          <app-section :title="$t('manage.reviewer.safeTitle')" >
            <el-form ref="reviewerSafeForm" label-width="100px" v-if="secureInformationReview.id">
              <el-row :gutter="10" >
                <el-col :span="20">
                  <el-form-item :label="$t('manage.reviewer.wetherReview')" prop="isReview">
                    {{secureInformationReview.isReview == 1 ? translateByName('event', '是')  : translateByName('event', '否') }}
                  </el-form-item>
                </el-col>
              </el-row>
              <template v-if="secureInformationReview.isReview == 1">
                <el-row :gutter="10">
                  <el-col :span="20">
                    <el-form-item :label="$t('manage.reviewer.reviewTime')" prop="reviewTime">
                      {{secureInformationReview.reviewTime}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10" >
                  <el-col :span="20">
                    <el-form-item :label="$t('manage.reviewer.participant')" prop="reviewParticipant">
                      <span v-html="secureInformationReview.reviewParticipantHtml"></span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10" >
                  <el-col :span="20">
                    <el-form-item :label="$t('manage.reviewer.reviewResult')" prop="reviewResult">
                      {{secureInformationReview.reviewResult}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10" >
                  <el-col :span="20">
                    <el-form-item :label="$t('manage.reviewer.file')" prop="reviewAttachments">
                      <div v-for="(file, index) in secureInformationReview.reviewAttachments" :key="index">
                        <a :href="file.url">{{file.name}}</a>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template >
              <el-row :gutter="10" v-if="secureInformationReview.isReview == 0">
                <el-col :span="20">
                  <el-form-item :label="$t('manage.reviewer.notReviewReason')" prop="notReviewReason">
                    {{secureInformationReview.notReviewReason}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div v-else>暂无复盘信息</div>
          </app-section>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="">
          <app-section :title="$t('manage.reviewer.businessTitle')">
            <el-form ref="reviewerBusinessForm" label-width="100px" v-if="businessReview.id">
              <el-row :gutter="10" >
                <el-col :span="20">
                  <el-form-item :label="$t('manage.reviewer.wetherReview')" prop="isReview">
                    {{businessReview.isReview  == 1 ? translateByName('event', '是')  : translateByName('event', '否') }}
                  </el-form-item>
                </el-col>
              </el-row>
              <template v-if="businessReview.isReview == 1">
                <el-row :gutter="10">
                  <el-col :span="20">
                    <el-form-item :label="$t('manage.reviewer.reviewTime')" prop="reviewTime">
                      {{businessReview.reviewTime}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10" >
                  <el-col :span="20">
                    <el-form-item :label="$t('manage.reviewer.participant')" prop="reviewParticipant">
                      <span v-html="businessReview.reviewParticipantHtml"></span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10" >
                  <el-col :span="20">
                    <el-form-item :label="$t('manage.reviewer.reviewResult')" prop="reviewResult">
                      {{businessReview.reviewResult}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10" >
                  <el-col :span="20">
                    <el-form-item :label="$t('manage.reviewer.file')" prop="reviewAttachments">
                      <div v-for="(file, index) in businessReview.reviewAttachments" :key="index">
                        <a :href="file.url">{{file.name}}</a>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template >
              <el-row :gutter="10" v-if="businessReview.isReview == 0">
                <el-col :span="20">
                  <el-form-item :label="$t('manage.reviewer.notReviewReason')" prop="notReviewReason">
                    {{businessReview.notReviewReason}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div v-else>暂无复盘信息</div>
          </app-section>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import appSection from '../../components/section/index.vue'

export default {
  name: 'review-detail',

  props: {
    eventId: [Number, String]
  },

  components: {
    appSection
  },

  data() {
    return {

      businessReview: {
        id: null,
        isReview: null,
        reviewTime: '',
        reviewParticipant: [],
        reviewResult: '',
        reviewAttachments: [],
        notReviewReason: '',
        reviewParticipantHtml: ''
      },
      secureInformationReview: {
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

  methods: {
    getReviewDetail(id) {
      this._id = id || this.eventId
      if(this._id) {
        this.$http.get('secEvent/review/get', { params: { eventId: this._id } }).then(({ body }) => {
          this.secureInformationReview = body.data.secureInformationReview
          this.businessReview = body.data.businessReview
          // 参加人
          this.secureInformationReview.reviewParticipantHtml = ''
          if (this.secureInformationReview.reviewParticipant instanceof Array && this.secureInformationReview.reviewParticipant.length > 0) {
            this.secureInformationReview.reviewParticipant.forEach(item => {
              let name = item.email.substr(0, item.email.indexOf('@'))
              this.secureInformationReview.reviewParticipantHtml += ` <a target="_blank" href="http://i.xiaojukeji.com/space/personal/${name}?lang=zh-CN">${item.name}</a>` + ','
            })
            this.secureInformationReview.reviewParticipantHtml = this.secureInformationReview.reviewParticipantHtml.substring(0, this.secureInformationReview.reviewParticipantHtml.length - 1)
          }
          this.businessReview.reviewParticipantHtml = ''
          if (this.businessReview.reviewParticipant instanceof Array && this.businessReview.reviewParticipant.length > 0) {
            this.businessReview.reviewParticipant.forEach(item => {
              let name = item.email.substr(0, item.email.indexOf('@'))
              this.businessReview.reviewParticipantHtml += ` <a target="_blank" href="http://i.xiaojukeji.com/space/personal/${name}?lang=zh-CN">${item.name}</a>` + ','
            })
            this.businessReview.reviewParticipantHtml = this.businessReview.reviewParticipantHtml.substring(0, this.businessReview.reviewParticipantHtml.length - 1)
          }
        })
      }
    }
  },

  created() {
    const id = this.$route.query.id
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
  }
</style>

