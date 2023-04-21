<template>
  <div class="evaluation-edit">
    <h6 class="evaluation-edit__title">安全评估项目 - 项目信息确认</h6>
    <el-form :model="project" label-width="120px" :rules="rules" ref="projectForm" label-suffix="：">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.projectNumber')">
            {{project.project_no}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.projectName')" prop="project_name">
            <el-input v-model="project.project_name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.department')" prop="dept_id">
            <el-select v-model="project.dept_id" remote reserve-keyword :remote-method="deptSearchList" placeholder="请选择" filterable style="width: 100%;" clearable>
              <el-option v-for="item in deptOptions" :key="item.label" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.follower')">
            <el-select v-model="project.follower" remote reserve-keyword :remote-method="empSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" multiple clearable>
              <el-option v-for="item in empOptions" :key="item.user_id" :label="item.user_name" :value="item.user_id">
              </el-option>
            </el-select>
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
        <el-col :span="24">
          <el-form-item :label="$t('compliance.evaluation.evalBusiness')">
            <div class="evaluation-edit__oper">
              <el-button type="primary" @click="handleAddBusiness">{{$t('buttons.add')}}</el-button>
            </div>
            <el-table :data="business" border style="width: 100%">
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
              <el-table-column :label="$t('buttons.action')" width="150">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="handleEditBusiness(scope.row, scope.$index)">{{$t('buttons.update')}}</el-button>
                  <el-button type="danger" size="small" @click="handleRemoveBusiness(scope.row,scope.$index)">{{$t('buttons.delete')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item :label="$t('compliance.evaluation.evalTarget')">
            <div class="evaluation-edit__oper">
              <el-button type="primary" @click="handleAddObject">{{$t('buttons.add')}}</el-button>
            </div>
            <el-table :data="object" border max-height="500" style="width: 100%">
              <el-table-column prop="business_name" :label="$t('compliance.evaluation.businessName')" width="180"></el-table-column>
              <el-table-column prop="object_name" :label="$t('compliance.evaluation.evalTarget')" width="150"></el-table-column>
              <el-table-column :label="$t('compliance.evaluation.evalInterface')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in scope.row.users" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('buttons.action')" width="150">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="handleEditObject(scope.row, scope.$index)">{{$t('buttons.update')}}</el-button>
                  <el-button type="danger" size="small" @click="handleRemoveObject(scope.row,scope.$index)">{{$t('buttons.delete')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item :label="$t('compliance.evaluation.evalContent')">
          <el-checkbox-group v-model="scope">
            <el-checkbox v-for="item in contentOptions" :key="item.id" :value="item.id" :label="item.id">{{item.dName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('compliance.evaluation.selfEval')" prop="assessment_self_enabled">
            <el-select v-model="project.assessment_self_enabled" remote reserve-keyword :remote-method="deptSearchList" placeholder="请选择" style="width: 100%;" clearable>
              <el-option v-for="item in stateOptions" :key="item.label" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('compliance.evaluation.msgFeedback')" prop="feedback_enabled">
            <el-select v-model="project.feedback_enabled" remote reserve-keyword :remote-method="deptSearchList" placeholder="请选择" style="width: 100%;" clearable>
              <el-option v-for="item in stateOptions" :key="item.label" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item :label="$t('compliance.evaluation.remark')">
          <el-input v-model="project.description" type="textarea" :autosize="{ minRows: 4}"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="evaluation-edit__business__buttons">
      <el-button type="primary" @click="handleSaveProject">{{$t('buttons.submit')}}</el-button>
      <el-button @click="back">{{$t('buttons.back')}}</el-button>
    </div>
    <el-dialog title="添加评估业务" top="5vh" :close-on-click-modal="false" :visible.sync="businessDialogVisible">
      <business-edit v-model="currentBusiness" :business-list="business" v-if="businessDialogVisible" ref="businessEdit"></business-edit>
      <div class="evaluation-edit__business__buttons">
        <el-button type="primary" @click="handleSaveBusiness">{{$t('buttons.save')}}</el-button>
        <el-button @click="handleBusinessClose">{{$t('buttons.offset')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加评估对象" top="10vh" :close-on-click-modal="false" :visible.sync="objectDialogVisible">
      <object-edit v-model="currentObject" :business-list="business" :object-list="object" v-if="objectDialogVisible" ref="objectEdit"></object-edit>
      <div class="evaluation-edit__business__buttons">
        <el-button type="primary" @click="handleSaveObject">{{$t('buttons.save')}}</el-button>
        <el-button @click="handleObjectClose">{{$t('buttons.offset')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BusinessEdit from './businessEdit.vue'
import ObjectEdit from './objectEdit.vue'
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
  users: []
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

      bizLoading: false,
      objLoading: false,
      contentLoading: false,

      business: [],
      object: [],
      scope: [],

      // 对话框状态
      businessDialogVisible: false,
      objectDialogVisible: false,

      // 表单验证
      rules: {
        project_name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        dept_id: [
          { required: true, message: '请选择业务部门', trigger: 'change' }
        ]
      }
    }
  },
  mixins: [dataMixin],
  components: {
    BusinessEdit,
    ObjectEdit
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
     * 添加评估业务
     */
    handleAddBusiness() {
      this.currentBusinessIndex = null
      this.currentBusiness = defaultBusiness
      this.businessDialogVisible = true
    },

    /**
     * 编辑评估业务
     */
    handleEditBusiness(business, index) {
      this.currentBusinessIndex = index
      this.getBusinessInfo(business.id).then(({ body }) => {
        const { id, business_name, ...rest } = body.data

        this.currentBusiness = { id, business_name, ...this.fillOptionsByEmp(businessFields, rest) }
        this.businessDialogVisible = true
      })
    },

    /**
     * 保存评估业务
     */
    handleSaveBusiness() {
      this.$refs.businessEdit.validate((valid) => {
        if (valid) {
          const { id, business_name, ...rest } = this.currentBusiness
          const source = this.source
          const business = {
            id,
            source,
            business_name,
            project_id: this.projectId,
            ...this.formatDataById(businessFields, rest)
          }
          this.$http.post(business.id != null ? 'sa/project/business/update' : 'sa/project/business/add', business).then(() => {
            this.getBusinessList(this.projectId, source) // 刷新评估业务员列表
            this.businessDialogVisible = false
          })
        }
      })
    },
    /**
     * 覆盖默认内容获取接口
     */
    getContentList(project_id, source, stat = 0) {
      this.contentLoading = true;
      this.$http.get('sa/assessment/list', { params: { project_id, source, stat } }).then(({ body }) => {
        this.scope = (body.data || []).map((item) => item.type)
        console.log(this.scope)
      }).finally(() => {
        this.contentLoading = false;
      })
    },
    /**
    * 查询评估业务列表
    */
    getBusinessList(project_id, source) {
      this.bizLoading = true;
      this.$http.get('sa/business/list', { params: { project_id, source } }).then(({ body }) => {
        this.business = body.data
      }).finally(() => {
        this.bizLoading = false;
      })
    },

    /**
    * 查询评估对象列表
    */
    getObjectList(project_id, source, stat = 0) {
      this.objLoading = true;
      this.$http.get('sa/object/list', { params: { project_id, source, stat } }).then(({ body }) => {
        this.object = body.data
      }).finally(() => {
        this.objLoading = false;
      })
    },

    /**
     * 获取评估业务详情
     */
    getBusinessInfo(id) {
      return this.$http.get('sa/project/business/info', { params: { id } })
    },



    /**
     * 关闭评估业务对话框
     */
    handleBusinessClose() {
      this.businessDialogVisible = false
    },

    /**
     * 删除评估业务
     */
    handleRemoveBusiness(row, index) {
      const { id } = row
      this.$confirm('此操作将永久删除该业务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/sa/project/business/delete?id=' + id)
          .then(({ body: data }) => {
            if (data.errno == 0) {
              this.business.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          })
      })
    },

    /**
     * 添加评估对象
     */
    handleAddObject() {
      this.currentObjectIndex = null
      this.currentObject = {
        id: null,
        business_name: '',
        business_id: '',
        object_name: '',
        mgrs: []
      }
      this.objectDialogVisible = true
    },

    /**
     * 保存评估对象
     */
    handleSaveObject() {
      this.$refs.objectEdit.validate((valid) => {
        if (valid) {
          const { id, business_id, object_name, ...rest } = this.currentObject
          const source = this.source
          const object = {
            id,
            business_id,
            object_name,
            project_id: this.projectId * 1,
            ...this.formatDataById(['users'], rest)
          }

          this.$http.post(object.id != null ? 'sa/project/object/update' : 'sa/project/object/add', object).then(() => {
            this.getObjectList(this.projectId, source)
            this.objectDialogVisible = false
          })
        }
      })
    },

    /**
     * 删除评估对象
     */
    handleRemoveObject(row, index) {
      const { id } = row
      this.$confirm('此操作将永久删除该评估对象, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/sa/project/object/delete?id=' + id)
          .then(({ body: data }) => {
            if (data.errno == 0) {
              this.object.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          })
      })
    },

    /**
     * 编辑评估业务
     */
    handleEditObject(object, index) {
      this.currentObjectIndex = index
      this.getObjectInfo(object.id).then(({ body }) => {
        const { id, business_name, business_id, object_name, ...rest } = body.data

        this.currentObject = {
          id,
          business_name,
          business_id,
          object_name,
          ...this.fillOptionsByEmp(['users'], rest)
        }
        this.objectDialogVisible = true
      })
    },

    /**
     * 关闭评估对象对话框
     */
    handleObjectClose() {
      this.objectDialogVisible = false
    },

    /**
     * 获取项目信息
     */
    getEvaluationDetail(id, source) {
      this.getEvaluationBase(id, source)
      this.getBusinessList(id, source)
      this.getObjectList(id, source)
      this.getContentList(id, source)
      this.getDictDataStartState()
    },

    handleSaveProject() {
      const that = this;
      this.$refs.projectForm.validate((valid) => {
        if (valid) {
          const { id, project_name, dept_id, description, follower, assessment_self_enabled, feedback_enabled } = this.project
          this.$http.post('sa/project/confirm', {
            id,
            project_name,
            dept_id,
            description,
            assessment_self_enabled,
            feedback_enabled,
            scope: this.scope,
            follower: follower.map(user_id => { return { user_id } })
          })
            .then(({ body }) => {
              if (body.errno == 0) {
                that.$message({
                  message: '确认成功',
                  type: 'success'
                });
                that.back()
              }
            })
        }
      })
    },

    back() {
      this.$router.back()
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
.evaluation-edit {
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
