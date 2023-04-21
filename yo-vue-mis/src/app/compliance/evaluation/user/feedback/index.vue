<template>
  <div class="evaluation-feedback">
    <h6 class="evaluation-feedback__title">安全评估项目信息反馈</h6>
    <el-form label-width="120px" label-suffix="：">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.projectName')">{{detail.project_name}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.projectNumber')">{{detail.project_no}}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.department')">{{detail.dept_name}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.follower')">
            <user-link :email="follower.user_email" v-for="follower in detail.follower" :key="follower.user_id">{{follower.user_name}}&nbsp;&nbsp;</user-link>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.creator')">
            <user-link :email="detail.create_user_email">{{detail.create_user_name}}</user-link>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.createTime')">{{detail.create_time}}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.startTime')">{{detail.start_time}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.endTime')">{{detail.close_time}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('compliance.evaluation.remark')">{{detail.description}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('compliance.evaluation.evalBusiness')">
            <el-table :data="businessList" border max-height="500" style="width: 100%">
              <el-table-column prop="business_name" :label="$t('compliance.evaluation.businessName')" width="180"></el-table-column>
              <el-table-column :label="$t('compliance.evaluation.businessManager')">
                <template slot-scope="scope">
                  <user-link :email="mgr.user_email" v-for="mgr in scope.row.business_mgr" :key="mgr.user_id">{{mgr.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('compliance.evaluation.infoSecInterface')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in scope.row.security_user" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('compliance.evaluation.productTechManager')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in scope.row.product_mgr" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('compliance.evaluation.productInterface')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in scope.row.product_user" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('compliance.evaluation.qaInterface')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in scope.row.qa" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('compliance.evaluation.biInterface')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in scope.row.bi" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('compliance.evaluation.accountManager')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in scope.row.ua" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item :label="$t('compliance.evaluation.evalTarget')">
            <el-table :data="objectList" border max-height="500" style="width: 100%">
              <el-table-column prop="business_name" :label="$t('compliance.evaluation.businessName')" width="180"></el-table-column>
              <el-table-column prop="object_name" :label="$t('compliance.evaluation.evalTarget')" width="180"></el-table-column>
              <el-table-column :label="$t('compliance.evaluation.evalInterface')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in scope.row.users" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column prop="not_applicable" :label="$t('compliance.evaluation.feedbackStatus')" width="100"></el-table-column>
              <el-table-column :label="$t('buttons.action')" width="80">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="handleFeedback(scope.row.id)">{{$t('compliance.evaluation.feedback')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

const dictUrl = 'dictionary/listByDataAuth/'

export default {
  data() {
    return {
      projectId: null,
      vId: null,
      detail: {},
      businessList: [],
      objectList: [],
      dialogVisible: false,
      url: 'sa/vulnerability/list'
    }
  },
  computed: {
    followers() {
      return this.detail.follower ? this.detail.follower.map(p => p.user_name).join('，') : ''
    }
  },
  components: {
  },
  methods: {
    getEvaluationDetail(id) {
      this.$http.get('sa/findInfo', { params: { id } }).then(({ body }) => {
        this.detail = body.data
      })
    },
    getBusinessList(project_id) {
      this.$http.get('sa/business/list', { params: { project_id } }).then(({ body }) => {
        this.businessList = body.data
      })
    },
    getObjectList(project_id, stat = 0) {
      this.$http.get('sa/object/list', { params: { project_id, stat } }).then(({ body }) => {
        this.objectList = body.data
      })
    },
    showEventDetail(id) {
      this.dialogVisible = true
      this.vId = id
    },
    handleFeedback(id) {
      this.$router.push('/compliance/evaluation/user/feedback/edit?id=' + id)
    }
  },
  activated() {
    this.projectId = this.$route.query.id

    if (this.projectId) {
      this.getEvaluationDetail(this.projectId)
      this.getBusinessList(this.projectId)
      this.getObjectList(this.projectId)
    }
  },
  created() {
    this.projectId = this.$route.query.id

    if (this.projectId) {
      this.getEvaluationDetail(this.projectId)
      this.getBusinessList(this.projectId)
      this.getObjectList(this.projectId)
    }
  }
}
</script>

<style lang="less">
.evaluation-feedback {
  &__title {
    margin-bottom: 20px;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  .el-form-item__label,
  .el-form-item__content {
    line-height: 1.5;
    word-wrap: break-word;
    word-break: break-all;
  }
}
</style>
