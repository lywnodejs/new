<template>
  <div class="evaluation-feedback-edit">
    <h6 class="evaluation-feedback-edit__title">安全评估项目 - 编辑反馈信息</h6>
    <el-form :model="feedback" label-width="120px" :rules="rules" ref="feedbackForm" label-suffix="：">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.evalTarget')">{{feedback.object_name}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.evalInterface')">
            <user-link :email="mgr.user_email" v-for="mgr in feedback.object_mgrs" :key="mgr.user_id">{{mgr.user_name}}&nbsp;&nbsp;</user-link>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('compliance.evaluation.outerDomain')">
            <el-input v-model="feedback.inner_domain" type="textarea" :autosize="{ minRows: 4}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('compliance.evaluation.internalDomain')">
            <el-input v-model="feedback.out_domain" type="textarea" :autosize="{ minRows: 4}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('compliance.evaluation.internalIp')">
            <el-input v-model="feedback.ip_address" type="textarea" :autosize="{ minRows: 4}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('compliance.evaluation.computerRoom')">
            <el-input v-model="feedback.room_location"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('compliance.evaluation.sysDescription')">
            <el-input v-model="feedback.description" type="textarea" :autosize="{ minRows: 4}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('compliance.evaluation.sensitiveInterface')">
            <el-input v-model="feedback.pr_interface" type="textarea" :autosize="{ minRows: 4}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.rdLeader')">
            <el-select v-model="feedback.dev_mgr_list" remote reserve-keyword :remote-method="(query) => empSearch(query, 'dev_mgr_list')" :placeholder="$t('manage.select')" filterable style="width: 100%;" multiple clearable>
              <el-option v-for="item in dev_mgr_listOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.qaLeader')">
            <el-select v-model="feedback.test_mgr_list" remote reserve-keyword :remote-method="(query) => empSearch(query, 'test_mgr_list')" :placeholder="$t('manage.select')" filterable style="width: 100%;" multiple clearable>
              <el-option v-for="item in test_mgr_listOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.proLeader')">
            <el-select v-model="feedback.product_mgr_list" remote reserve-keyword :remote-method="(query) => empSearch(query, 'product_mgr_list')" :placeholder="$t('manage.select')" filterable style="width: 100%;" multiple clearable>
              <el-option v-for="item in product_mgr_listOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.sysAdmin')">
            <el-select v-model="feedback.system_mgr_list" remote reserve-keyword :remote-method="(query) => empSearch(query, 'system_mgr_list')" :placeholder="$t('manage.select')" filterable style="width: 100%;" multiple clearable>
              <el-option v-for="item in system_mgr_listOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.sysUser')">
            <el-input v-model="feedback.system_scope"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.sysSensitive')">
            <el-select v-model="feedback.sensitive_level" reserve-keyword :placeholder="$t('manage.select')" style="width: 100%;">
              <el-option v-for="item in sysOptions" :key="item.id" :label="item.dName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.accountSys')">
            <el-select v-model="feedback.account_type" reserve-keyword :placeholder="$t('manage.select')" style="width: 100%;">
              <el-option v-for="item in accountOptions" :key="item.id" :label="item.dName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.permissionSys')">
            <el-select v-model="feedback.auth_type" reserve-keyword :placeholder="$t('manage.select')" style="width: 100%;">
              <el-option v-for="item in permissionOptions" :key="item.id" :label="item.dName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.permissionLevel')">
            <el-select v-model="feedback.auth_level" reserve-keyword :placeholder="$t('manage.select')" style="width: 100%;">
              <el-option v-for="item in permissionLevelOptions" :key="item.id" :label="item.dName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="200px" :label="$t('compliance.evaluation.logAccess')">
            <el-select v-model="feedback.sec_log" reserve-keyword :placeholder="$t('manage.select')" style="width: 100%;">
              <el-option v-for="item in booleanOptions" :key="item.id" :label="item.dName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.interfaceDoc')">
            <el-select v-model="feedback.api_doc" reserve-keyword :placeholder="$t('manage.select')" style="width: 100%;">
              <el-option v-for="item in booleanOptions" :key="item.id" :label="item.dName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.interfaceDocAddr')">
            <el-input v-model="feedback.api_doc_link"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.isOpen')">
            <el-select v-model="feedback.out_access" reserve-keyword :placeholder="$t('manage.select')" style="width: 100%;">
              <el-option v-for="item in booleanOptions" :key="item.id" :label="item.dName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.dataLevel')">
            <el-select v-model="feedback.data_level" reserve-keyword :placeholder="$t('manage.select')" style="width: 100%;">
              <el-option v-for="item in dataLevelOptions" :key="item.id" :label="item.dName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.qaURL')">
            <el-input v-model="feedback.test_env"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.qaAccount')">
            <el-input v-model="feedback.test_account"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.qaPassward')">
            <el-input v-model="feedback.test_password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item :label="$t('compliance.evaluation.moudleInfo')">
            <div class="evaluation-feedback-edit__oper">
              <el-button type="primary" @click="handleAddModule">{{$t('buttons.add')}}</el-button>
            </div>
            <sdl-table :url="url" border style="width: 100%" ref="gitTable" :query-params="queryParams">
              <el-table-column prop="module_name" :label="$t('compliance.evaluation.moduleName')"></el-table-column>

              <el-table-column prop="git_path" :label="$t('compliance.evaluation.repository')"></el-table-column>

              <el-table-column prop="action" width="115" :label="$t('buttons.action')">
                <template slot-scope="scope">
                  <b-button variant="primary" size="sm" @click.stop="updateModule(scope.row)">{{ $t('buttons.update') }}</b-button>
                  <b-button variant="danger" size="sm" @click.stop="removeModule(scope.row.id)">{{ $t('buttons.delete') }}</b-button>
                </template>
              </el-table-column>
            </sdl-table>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="evaluation-feedback-edit__buttons">
      <el-button type="primary" @click="handleSubmitFeedback">{{$t('buttons.submit')}}</el-button>
      <el-button type="primary" @click="handleSaveFeedback">{{$t('buttons.save')}}</el-button>
      <el-button @click="back">{{$t('buttons.back')}}</el-button>
    </div>
    <el-dialog title="添加模块" top="10vh" :close-on-click-modal="false" :visible.sync="moduleDialogVisible">
      <el-form :model="module" :rules="moduleRules" ref="moduleForm" label-width="80px" v-if="moduleDialogVisible">
        <el-form-item :label="$t('compliance.evaluation.moduleName')" prop="module_name">
          <el-input v-model="module.module_name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('compliance.evaluation.repository')" prop="git_path">
          <el-input v-model="module.git_path"></el-input>
        </el-form-item>
      </el-form>
      <div class="evaluation-feedback-edit__buttons">
        <el-button type="primary" @click="handleSaveModule">{{$t('buttons.save')}}</el-button>
        <el-button @click="handleModuleClose">{{$t('buttons.offset')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const dictUrl = 'dictionary/listByDataAuth/'
const restParams = [
  { k: 'inner_domain', v: '' },
  { k: 'out_domain', v: '' },
  { k: 'ip_address', v: '' },
  { k: 'room_location', v: '' },
  { k: 'description', v: '' },
  { k: 'pr_interface', v: '' },
  { k: 'system_scope', v: '' },
  { k: 'sensitive_level', v: 0 },
  { k: 'account_type', v: 0 },
  { k: 'auth_type', v: 0 },
  { k: 'auth_level', v: 0 },
  { k: 'sec_log', v: 0 },
  { k: 'api_doc', v: 0 },
  { k: 'api_doc_link', v: '' },
  { k: 'out_access', v: '' },
  { k: 'data_level', v: '' },
  { k: 'test_env', v: '' },
  { k: 'test_account', v: '' },
  { k: 'test_password', v: '' }
]
export default {
  data() {
    return {
      source: "",
      feedback: {
        "object_mgrs": [],
        "dev_mgr_list": [],
        "test_mgr_list": [],
        "product_mgr_list": [],
        "system_mgr_list": [],
      },
      "dev_mgr_listOptions": [],
      "test_mgr_listOptions": [],
      "product_mgr_listOptions": [],
      "system_mgr_listOptions": [],
      sysOptions: [],
      accountOptions: [],
      permissionOptions: [],
      permissionLevelOptions: [],
      dataLevelOptions: [],
      booleanOptions: [],
      rules: {},
      url: 'sa/project/object/info/git/list',
      moduleDialogVisible: false,
      module: {
        id: null,
        module_name: '',
        git_path: ''
      },
      moduleRules: {
        module_name: [
          { required: true, message: '请输入模块名称', trigger: 'blur' },
        ],
        git_path: [
          { required: true, message: '请输入仓库地址', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    /**
     * 初始化下拉框
     * @param {*} fields
     */
    initOption(fields) {
      fields.forEach(field => {
        const value = this.feedback[field] || []

        if (value) {
          this.feedback[field] = value.map(emp => emp.user_id)
          this[field + 'Options'] = value.map(emp => {
            const { user_id, user_name, user_email } = emp

            return {
              value: user_id,
              label: user_name + '(' + user_email + ')'
            }
          })
        }
      })
    },


    /**
     * 格式化接口数据
     * @param {*} emp
     */
    formatEmployee(emp) {
      return {
        value: emp.id,
        label: emp.name + '(' + emp.email + ')'
      }
    },

    /**
     * 查询匹配人员信息
     */
    empSearch(query, options) {
      if (query !== '') {
        const _options = options + 'Options'
        this.$http.get('secEvent/searchEmpList', { params: { 'account': query } }).then(res => {
          if (res.data.errno == 0) {
            this[_options] = []
            this[_options] = res.data.data.map((item) => {
              return this.formatEmployee(item)
            })
          } else {
            this[_options] = []
          }
        })
      } else {
        this[_options] = []
      }
    },
    getDictById() {
      this.$http.get(dictUrl + 1880).then(({ body }) => this.sysOptions = body.data)
      this.$http.get(dictUrl + 1890).then(({ body }) => this.accountOptions = body.data)
      this.$http.get(dictUrl + 1900).then(({ body }) => this.permissionOptions = body.data)
      this.$http.get(dictUrl + 1910).then(({ body }) => this.permissionLevelOptions = body.data)
      this.$http.get(dictUrl + 1920).then(({ body }) => this.booleanOptions = body.data)
      this.$http.get(dictUrl + 1930).then(({ body }) => this.dataLevelOptions = body.data)
    },
    search() {
      this.$refs.gitTable.reload()
    },
    queryParams() {
      return {
        object_id: this.object_id,
        business_id: this.business_id,
        project_id: this.project_id
      }
    },

    /**
     * 更新模块信息
     */
    updateModule({ id, module_name, git_path }) {
      this.module = {
        id,
        module_name,
        git_path
      }
      this.moduleDialogVisible = true
    },

    /**
     * 删除模块信息
     */
    removeModule(id) {

      this.$confirm('此操作将删除该模块信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('sa/project/object/info/git/delete?id=' + id).then(({ body }) => {
          if (body.errno == 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.search()
          } else {
            this.$message({
              type: 'warning',
              message: '删除失败：' + data.errmsg
            });
          }
        })
      })
    },

    /**
     * 打开对话框
     */
    handleAddModule() {
      this.moduleDialogVisible = true
    },

    /**
     * 保存模块修改
     */
    handleSaveModule() {
      this.$refs.moduleForm.validate((valid) => {
        if (valid) {
          const updateParam = { ...this.module }
          const { project_id, business_id, object_id } = this.$route.query
          const addParam = {
            project_id: project_id * 1,
            business_id: business_id * 1,
            object_id: object_id * 1,
            module_name: this.module.module_name,
            git_path: this.module.git_path
          }
          this.$http.post(this.module.id != null ? 'sa/project/object/info/git/update' : 'sa/project/object/info/git/add',
            this.module.id != null ? updateParam : addParam).then(({ body }) => {
              if (body.errno == 0) {
                this.handleModuleClose()
                this.search()
              } else {
                this.$message({
                  type: 'error',
                  message: '错误：' + data.errmsg
                });
              }

            })
        }
      })
    },

    /**
     * 关闭对话框
     */
    handleModuleClose() {
      this.moduleDialogVisible = false
      this.module = {
        id: null,
        module_name: '',
        git_path: ''
      }
    },
    // 保存
    handleSaveFeedback() {
      if (this.object_id != null) {
        const { object_mgrs, dev_mgr_list, test_mgr_list, product_mgr_list, system_mgr_list, ...rest } = this.feedback
        const types = ['account_type', 'api_doc', 'auth_level', 'auth_type', 'data_level', 'out_access', 'sec_log', 'sensitive_level']
        let postObj = {
          project_id: this.project_id,
          business_id: this.business_id,
          object_id: this.object_id,
          source: this.source
        }
        // 研发负责人
        if (dev_mgr_list.length) {
          postObj['dev_mgr_list'] = test_mgr_list.map(user_id => { return { user_id } })
        }
        // 测试负责人
        if (test_mgr_list.length) {
          postObj['test_mgr_list'] = test_mgr_list.map(user_id => { return { user_id } })
        }
        // 产品负责人
        if (product_mgr_list.length) {
          postObj['product_mgr_list'] = product_mgr_list.map(user_id => { return { user_id } })
        }
        // 系统管理员
        if (system_mgr_list.length) {
          postObj['system_mgr_list'] = system_mgr_list.map(user_id => { return { user_id } })
        }
        for (let item of restParams) {
          if (rest[item.k]) {
            postObj[item.k] = rest[item.k]
          }
        }

        this.$http.post('/sa/project/object/info/save', postObj)
          .then(({ body: data }) => {
            if (data.errno == 0) {
              this.$message({
                type: 'success',
                message: '保存成功'
              });
              this.back()
            } else {
              this.$message({
                type: 'error',
                message: '保存失败：' + data.errmsg
              });
            }
          })
      }
    },
    // 提交
    handleSubmitFeedback() {
      if (this.object_id != null) {
        const { object_mgrs, dev_mgr_list, test_mgr_list, product_mgr_list, system_mgr_list, ...rest } = this.feedback
        const types = ['account_type', 'api_doc', 'auth_level', 'auth_type', 'data_level', 'out_access', 'sec_log', 'sensitive_level']
        let postObj = {
          project_id: this.project_id,
          business_id: this.business_id,
          object_id: this.object_id,
          source: this.source
        }
        // 研发负责人
        if (dev_mgr_list.length) {
          postObj['dev_mgr_list'] = test_mgr_list.map(user_id => { return { user_id } })
        }
        // 测试负责人
        if (test_mgr_list.length) {
          postObj['test_mgr_list'] = test_mgr_list.map(user_id => { return { user_id } })
        }
        // 产品负责人
        if (product_mgr_list.length) {
          postObj['product_mgr_list'] = product_mgr_list.map(user_id => { return { user_id } })
        }
        // 系统管理员
        if (system_mgr_list.length) {
          postObj['system_mgr_list'] = system_mgr_list.map(user_id => { return { user_id } })
        }
        for (let item of restParams) {
          if (rest[item.k]) {
            postObj[item.k] = rest[item.k]
          }
        }

        this.$http.post('/sa/project/object/info/update', postObj)
          .then(({ body: data }) => {
            if (data.errno == 0) {
              this.$message({
                type: 'success',
                message: '保存成功'
              });
              this.back()
            } else {
              this.$message({
                type: 'error',
                message: '保存失败：' + data.errmsg
              });
            }
          })
      }
    },

    back() {
      this.$router.back()
    }
  },

  created() {
    this.object_id = this.$route.query.object_id * 1
    this.business_id = this.$route.query.business_id * 1
    this.project_id = this.$route.query.project_id * 1
    this.source = this.$route.query.source * 1
    const params = {
      object_id: this.object_id,
      business_id: this.business_id,
      project_id: this.project_id
    }
    this.getDictById()
    if (this.object_id != null) {
      this.$http.get('/sa/project/object/info/query', { params }).then(({ body }) => {
        if (body.errno == 0) {
          let dt = body.data
          const types = ['account_type', 'api_doc', 'auth_level', 'auth_type', 'data_level', 'out_access', 'sec_log', 'sensitive_level']
          const op = ['dev_mgr_list', 'test_mgr_list', 'product_mgr_list', 'system_mgr_list']
          types.forEach((item) => {
            if (dt[item] == 0) {
              dt[item] = ''
            }
          })
          op.forEach((item) => {
            if (dt[item] == null) {
              dt[item] = []
            }
          })
          this.feedback = dt
          this.initOption(op)
        } else {
          this.$message({
            type: 'error',
            message: '删除失败：' + body.errmsg
          });
        }

      })
    }
  }
}
</script>

<style lang="less">
.evaluation-feedback-edit {
  &__title {
    margin-bottom: 20px;
  }
  &__oper {
    margin-bottom: 15px;
  }
  &__buttons {
    text-align: center;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  .el-form-item__label,
  .el-form-item__content {
    word-wrap: break-word;
    word-break: break-all;
  }
}
</style>
