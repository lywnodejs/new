<template>
  <div class="evaluation-activate">
    <h6 class="evaluation-activate__title">安全评估项目 - 安全隐患整改</h6>
    <el-form :model="project" label-width="120px" :rules="rules" ref="projectForm" label-suffix="：">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.projectName')">
            {{project.project_name}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.projectNumber')">
            {{project.project_no}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.department')">
            {{project.dept_name}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.follower')">
            <user-link :email="user.user_email" v-for="user in (project.followerObj||[])" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.creator')">
            {{project.create_user_name}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.createTime')">
            {{project.create_time}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目启动时间">
            {{project.start_time}}
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('compliance.evaluation.evalBusiness')">
            <el-table :data="pj.business" border style="width: 100%">
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
        <el-col :span="20">
          <el-form-item :label="$t('compliance.evaluation.evalTarget')">
            <div class="evaluation-activate__oper">
            </div>
            <el-table :data="pj.object" border max-height="500" style="width: 100%">
              <el-table-column prop="business_name" :label="$t('compliance.evaluation.businessName')" width="180"></el-table-column>
              <el-table-column prop="object_name" :label="$t('compliance.evaluation.evalTarget')" width="150"></el-table-column>
              <el-table-column :label="$t('compliance.evaluation.evalInterface')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in scope.row.users" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column prop="feedback_status_name" :label="$t('反馈状态')">
              </el-table-column>
              <el-table-column prop="assessment_self_status_name" :label="$t('自评状态')">
              </el-table-column>
              <el-table-column prop="assessment_status_name" :label="$t('评估状态')">
              </el-table-column>
              <el-table-column prop="repair_status_name" :label="$t('整改状态')">
              </el-table-column>
              <el-table-column :label="$t('buttons.action')" width="110">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.repair_status==1831" type="primary" size="small" @click="showObjectRepair(scope.row, scope.$index)">{{$t('整改')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="false">
        <el-col :span="14">
          <el-form-item :label="$t('compliance.evaluation.evalContent')">
            <el-table :data="project.scope" border max-height="500" style="width: 100%">
              <el-table-column prop="name" :label="$t('compliance.evaluation.evalContent')" width="180"></el-table-column>
              <el-table-column :label="$t('compliance.evaluation.evalManager')">
                <template slot-scope="scope">
                  <user-link :email="mgr.user_email" v-for="mgr in scope.row.mgrs" :key="mgr.user_id">{{mgr.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column prop="assessment" :label="$t('compliance.evaluation.evalSchedule')" width="150">
                <template slot-scope="scope">
                  <custom-tip :value="scope.row.assessment">{{evalTip(scope.row.assessment)}}</custom-tip>
                </template>
              </el-table-column>
              <el-table-column prop="rectification" :label="$t('compliance.evaluation.reformSchedule')" width="150">
                <template slot-scope="scope">
                  <custom-tip :value="scope.row.rectification">{{rectificationTip(scope.row.rectification)}}</custom-tip>
                </template>
              </el-table-column>
              <el-table-column :label="$t('buttons.action')" width="100">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="showContentDetail(scope.row, scope.$index)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="false">
        <el-col :span="6">
          <el-form-item :label="$t('compliance.evaluation.selfEval')">
            {{project.assessment_self_enabled_name}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="false">
        <el-col :span="6">
          <el-form-item :label="$t('compliance.evaluation.msgFeedback')">
            {{project.feedback_enabled_name}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="false">
        <el-form-item :label="$t('compliance.evaluation.remark')">
          <el-input v-model="project.description" type="textarea" :autosize="{ minRows: 4}"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="evaluation-activate__business__buttons">
      <!-- <el-button type="primary" @click="handleSaveProject">{{$t('buttons.submit')}}</el-button> -->
      <el-button @click="back">{{$t('buttons.back')}}</el-button>
    </div>

  </div>
</template>

<script>
import BusinessEdit from './businessEdit.vue'
import ObjectEdit from './objectEdit.vue'
import ContentEdit from './contentEdit.vue'
import dataMixin from '../../mixins/data'

const businessFields = ['business_mgr', 'security_user', 'product_mgr', 'product_user', 'qa', 'bi', 'ua']
const separator = '&'
const defaultBusiness = {
  id: null,
  business_name: '',
  business_mgr: [],
  security_user: [],
  product_mgr: [],
  product_user: [],
  qa: [],
  bi: [],
  ua: []
}
const defaultObject = {
  id: null,
  business_name: '',
  business_id: '',
  object_name: '',
  mgrs: []
}
const defaultContent = {
  id: null,
  type: null,
  name: '',
  mgrs: []
}

export default {
  props: {

    // 评估项目信息
    value: {
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      source: 2,
      currentBusiness: {},
      currentObject: {},
      currentContent: {},
      pj: {
        object: [],
        business: []
      },

      // 对话框状态
      businessDialogVisible: false,
      objectDialogVisible: false,
      contentDialogVisible: false,

      // 表单验证
      rules: {
        assessment_self_enabled: [
          { required: true, message: '请确认是否开启自评估', trigger: 'change' }
        ],
        feedback_enabled: [
          { required: true, message: '请确认是否开启信息反馈', trigger: 'change' }
        ],
      }
    }
  },
  mixins: [dataMixin],
  components: {
    BusinessEdit,
    ObjectEdit,
    ContentEdit
  },
  methods: {

    /**
     * 由于添加业务的时候，需要前端获取完整人员信息
     * 对各人员字段进行处理，拼接完整信息
     */
    formatEmployee(emps) {
      return emps.map(emp => {
        if (typeof emp === 'string') {
          const [user_id, user_name, user_email] = emp.split(separator)

          return {
            user_id,
            user_name,
            user_email
          }
        }
        return emp
      })
    },

    /**
     * 覆盖默认内容获取接口
     */
    getContentList(project_id, source, stat = 0) {
      this.$http.get('sa/assessment/list', { params: { project_id, source, stat } }).then(({ body }) => {
        this.project.scope = body.data
      })
    },


    showObjectBasicInfo(row) {
      console.log('ssss')
      const { id, project_id, business_id, object_id } = row
      const { href } = this.$router.resolve({
        path: '/compliance/evaluation/user/feedback/view',
        query: { id, source: this.source, project_id, business_id, object_id }
      })
      window.open(href, '_blank')
    },
    // 查看
    showObjectDetail(row) {
      const { id, project_id, business_id, object_id } = row
      const { href } = this.$router.resolve({
        path: '/compliance/evaluation/bp/evaobj/view',
        query: { source: this.source, id, project_id, business_id, object_id }
      })
      window.open(href, '_blank')
    },
    showContentDetail(row) {
      const { id, project_id, business_id, object_id } = row
      const { href } = this.$router.resolve({
        path: '/compliance/evaluation/bp/evacontent/view',
        query: { source: this.source, id, project_id, business_id, object_id }
      })
      window.open(href, '_blank')
    },
    // 整改
    showObjectRepair(row) {
      const { id, project_id, business_id, object_id } = row
      this.$router.push({
        path: '/compliance/evaluation/bp/repair/detail',
        query: { source: this.source, id, project_id, business_id, object_id }
      })
    },


    /**
     * 获取项目信息
     */
    getEvaluationDetail(id, source) {
      this.getEvaluationBase(id, source)
      this.getBusinessList(id, source)
      this.getObjectList(id, source)
      //   this.getContentList(id, source)
    },
    getObjectList(project_id, source, stat = 0) {
      this.$http.get('sa/object/list', { params: { project_id, source, stat } }).then(({ body }) => {
        this.pj.object = body.data
      })
    },
    getBusinessList(project_id, source) {
      this.$http.get('sa/business/list', { params: { project_id, source } }).then(({ body }) => {
        this.pj.business = body.data
      })
    },

    handleSaveProject() {
      const { id, project_name, dept_id, description, follower, scope, assessment_self_enabled, feedback_enabled } = this.project
      this.$http.post('/sa/project/repair', { id })
        .then(({ body: data }) => {
          if (data.errno == 0) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.back()
          }
        })
    },

    back() {
      this.$router.push('/compliance/evaluation/common')
    }
  },
  created() {
    this.projectId = this.$route.query.id
    this.source = this.$route.query.source
    this.getDictByContent()

    if (this.projectId != null) {
      this.getEvaluationDetail(this.projectId, this.source)
    }
  }
}
</script>

<style lang="less">
.evaluation-activate {
  &__title {
    margin-bottom: 20px;
  }
  &__oper {
    margin-bottom: 15px;
  }
  &__business__buttons {
    text-align: center;
  }
  .el-table th {
    padding: 0;
  }
  .el-table td {
    padding: 5px 0;
  }
}
</style>
