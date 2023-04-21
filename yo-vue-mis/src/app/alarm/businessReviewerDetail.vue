<template>
  <div class="business-review-detail">
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
  </div>
</template>
<script>

import appSection from '../../components/section/index.vue'

export default {
  name: 'business-review-detail',

  props: {
    eventId: [Number, String],
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

