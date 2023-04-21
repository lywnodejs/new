<template>
  <div class="safety-review-detail">
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
  </div>
</template>
<script>

import appSection from '../../components/section/index.vue'

export default {
  name: 'review-detail',

  props: {
    eventId: [Number, String],
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
  components: {
    appSection
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

