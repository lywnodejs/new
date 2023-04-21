<template>
  <div class="evaluation-edit">
    <h6 class="evaluation-edit__title">创建安全评估项目</h6>
    <el-form :model="project" label-width="120px" :rules="rules" ref="projectForm" label-suffix="：">
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
              <el-option v-for="item in empOptions" :key="item.label" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('compliance.evaluation.evalBusiness')">
            <div class="evaluation-edit__oper">
              <el-button type="primary" @click="handleAddBusiness">{{$t('buttons.add')}}</el-button>
            </div>
            <el-table :data="project.business" border style="width: 100%">
              <el-table-column prop="business_name" :label="$t('compliance.evaluation.businessName')" width="180"></el-table-column>
              <el-table-column :label="$t('compliance.evaluation.businessManager')">
                <template slot-scope="scope">
                  <user-link :email="mgr.user_email" v-for="mgr in formatEmployee(scope.row.business_mgr)" :key="mgr.user_id">{{mgr.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('compliance.evaluation.infoSecInterface')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in formatEmployee(scope.row.security_user)" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('compliance.evaluation.productTechManager')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in formatEmployee(scope.row.product_mgr)" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('compliance.evaluation.productInterface')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in formatEmployee(scope.row.product_user)" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('compliance.evaluation.qaInterface')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in formatEmployee(scope.row.qa)" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('compliance.evaluation.biInterface')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in formatEmployee(scope.row.bi)" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('compliance.evaluation.accountManager')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in formatEmployee(scope.row.ua)" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('buttons.action')" width="150">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="handleEditBusiness(scope.row, scope.$index)">{{$t('buttons.update')}}</el-button>
                  <el-button type="danger" size="small" @click="handleRemoveBusiness(scope.$index)">{{$t('buttons.delete')}}</el-button>
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
            <el-table :data="project.object" border max-height="500" style="width: 100%">
              <el-table-column prop="business_name" :label="$t('compliance.evaluation.businessName')" width="180"></el-table-column>
              <el-table-column prop="object_name" :label="$t('compliance.evaluation.evalTarget')" width="180"></el-table-column>
              <el-table-column :label="$t('compliance.evaluation.evalInterface')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in formatEmployee(scope.row.users)" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('buttons.action')" width="150">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="handleEditObject(scope.row, scope.$index)">{{$t('buttons.update')}}</el-button>
                  <el-button type="danger" size="small" @click="handleRemoveObject(scope.$index)">{{$t('buttons.delete')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item :label="$t('compliance.evaluation.evalContent')">
          <el-checkbox-group v-model="project.scope">
            <el-checkbox v-for="item in contentOptions" :key="item.id" :label="item.id">{{item.dName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row v-if="source==2">
        <el-col :span="6">
          <el-form-item :label="$t('compliance.evaluation.selfEval')" prop="assessment_self_enabled">
            <el-select v-model="project.assessment_self_enabled" placeholder="请选择" style="width: 100%;" clearable>
              <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="source==2">
        <el-col :span="6">
          <el-form-item :label="$t('compliance.evaluation.msgFeedback')" prop="feedback_enabled">
            <el-select v-model="project.feedback_enabled" placeholder="请选择" style="width: 100%;" clearable>
              <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
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
      <el-button type="primary" @click="handleSaveProject">{{$t('buttons.save')}}</el-button>
      <el-button @click="back">{{$t('buttons.back')}}</el-button>
    </div>

    <el-dialog title="添加评估业务" top="5vh" :close-on-click-modal="false" :visible.sync="businessDialogVisible">
      <business-edit v-model="currentBusiness" :business-list="project.business" v-if="businessDialogVisible" ref="businessEdit"></business-edit>
      <div class="evaluation-edit__business__buttons">
        <el-button type="primary" @click="handleSaveBusiness">{{$t('buttons.save')}}</el-button>
        <el-button @click="handleBusinessClose">{{$t('buttons.offset')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加评估对象" top="10vh" :close-on-click-modal="false" :visible.sync="objectDialogVisible">
      <object-edit v-model="currentObject" :business-list="project.business" :object-list="project.object" v-if="objectDialogVisible" ref="objectEdit"></object-edit>
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

const dictUrl = 'dictionary/listByDataAuth/'
const defaultBusiness = {
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
  business_name: '',
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
      source: '',
      // 评估项目对象
      project: {
        business: [],
        object: [],
        scope: []
      },
      currentBusiness: {},
      currentObject: {},

      deptOptions: [], // 业务部门选项
      empOptions: [], // 关注人选项
      contentOptions: [], // 评估内容选项
      stateOptions: [], // 状态选项

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
  components: {
    BusinessEdit,
    ObjectEdit
  },
  methods: {
    formatByEmpStr(emp) {
      const separator = '&'
      const [user_id, user_name, user_email] = emp.split(separator)

      return {
        user_id,
        user_name,
        user_email
      }
    },

    /**
     * 由于添加业务的时候，需要前端获取完整人员信息
     * 对各人员字段进行处理，拼接完整信息
     */
    formatEmployee(emps) {
      return emps.map(emp => this.formatByEmpStr(emp))
    },

    /**
     * 用于格式化提交数据
     */
    formatData(fields, obj) {
      let result = {}

      fields.forEach(field => {
        result[field] = obj[field].map(emp => {
          return this.formatByEmpStr(emp)
        })
      })
      return result
    },

    /**
     * 查询业务部门
     */
    deptSearchList(query) {
      if (query !== '') {
        this.$http.get('sdl/dept', { params: { 'name': query } }).then(res => {
          if (res.status == 200) {
            this.deptOptions = []
            this.deptOptions = res.data
          } else {
            this.deptOptions = []
          }
        })
      } else {
        this.deptOptions = []
      }
    },

    /**
     * 查询关注人
     */
    empSearchList(query) {
      if (query !== '') {
        this.$http.get('secEvent/searchEmpList', { params: { 'account': query } }).then(res => {
          if (res.data.errno == 0) {
            this.empOptions = []
            this.empOptions = res.data.data.map((item) => {
              return {
                value: item.id,
                label: item.name + '(' + item.email + ')'
              }
            })
          } else {
            this.empOptions = []
          }
        })
      } else {
        this.empOptions = []
      }
    },

    /**
     * 获取评估内容
     */
    getDictByContent() {
      this.$http.get(dictUrl + 1730).then(({ body }) => this.contentOptions = body.data)
    },
    /**
     * 数据启用状态
      */
    getDictDataStartState() {
      let that = this;
      this.$http.get(dictUrl + 1850).then(({ body }) => {
        that.stateOptions = (body.data || []).map(item => {
          item['label'] = item.dName
          item['value'] = item.id
          return item
        })
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
     * 保存评估业务
     */
    handleSaveBusiness() {
      this.$refs.businessEdit.validate((valid) => {
        if (valid) {
          if (this.currentBusinessIndex != null) {

            // 修改操作
            this.project.business.splice(this.currentBusinessIndex, 1, this.currentBusiness)
          } else {

            // 保存操作
            this.project.business.push(this.currentBusiness)
          }
          this.businessDialogVisible = false
        }
      })
    },

    /**
     * 关闭评估业务对话框
     */
    handleBusinessClose() {
      this.businessDialogVisible = false
    },

    /**
     * 编辑评估业务
     */
    handleEditBusiness(business, index) {
      this.currentBusinessIndex = index
      this.currentBusiness = business
      this.businessDialogVisible = true
    },

    /**
     * 删除评估业务
     */
    handleRemoveBusiness(index) {
      this.project.business.splice(index, 1)
    },

    /**
     * 添加评估对象
     */
    handleAddObject() {
      this.currentObjectIndex = null
      this.currentObject = defaultObject
      this.objectDialogVisible = true
    },

    /**
     * 保存评估对象
     */
    handleSaveObject() {
      this.$refs.objectEdit.validate((valid) => {
        if (valid) {
          if (this.currentObjectIndex != null) {

            // 修改操作
            this.project.object.splice(this.currentObjectIndex, 1, this.currentObject)
          } else {

            // 保存操作
            this.project.object.push(this.currentObject)
          }
          this.objectDialogVisible = false
        }
      })
    },

    /**
     * 删除评估对象
     */
    handleRemoveObject(index) {
      this.project.object.splice(index, 1)
    },

    /**
     * 编辑评估业务
     */
    handleEditObject(object, index) {
      this.currentObjectIndex = index
      this.currentObject = object
      this.objectDialogVisible = true
    },

    /**
     * 关闭评估对象对话框
     */
    handleObjectClose() {
      this.objectDialogVisible = false
    },

    /**
     * 创建评估项目
     */
    handleSaveProject() {
      const source = this.source
      const that = this;
      this.$refs.projectForm.validate((valid) => {
        if (valid) {
          let postObj = {
            ...that.project, // 基本信息
            follower: that.project.follower.map(user_id => { return { user_id } }), // 关注人格式化
            business: that.project.business.map(item => {
              return {
                business_name: item.business_name,
                ...that.formatData(['business_mgr', 'security_user', 'product_mgr', 'product_user', 'qa', 'bi', 'ua'], item)
              }
            }), // 评估业务格式化
            object: that.project.object.map(item => {
              return {
                business_name: item.business_name,
                object_name: item.object_name,
                ...that.formatData(['users'], item)
              } // 评估对象格式化
            })
          }
          postObj['source'] = source
          if (that.project.scope && that.project.scope.length > 0) {
            postObj['scope'] = that.project.scope
          }
          if (that.source == 2 && that.project.feedback_enabled) {
            postObj['feedback_enabled'] = that.project.feedback_enabled
          } else if (that.source == 1) {
            postObj['feedback_enabled'] = 1851;
          }
          if (that.source == 2 && that.project.assessment_self_enabled) {
            postObj['assessment_self_enabled'] = that.project.assessment_self_enabled
          } else if (that.source == 1) {
            postObj['assessment_self_enabled'] = 1851
          }
          if (that.project.description != '') {
            postObj['description'] = that.project.description
          }
          that.$http.post('sa/project/add', postObj)
            .then(({ body }) => {
              if (body.errno == 0) {
                that.$message({
                  message: '创建成功',
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
    this.source = this.$route.query.source * 1
    this.getDictByContent()
    this.getDictDataStartState()
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
