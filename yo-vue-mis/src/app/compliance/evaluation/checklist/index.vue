<template>
  <div class="compliance-evaluation-checklist">
    <toggle-form title="compliance.evaluation.title">

      <!--检查项编号 -->
      <form-field label="compliance.evaluation.projectNumber" for-id="check_no">
        <input type="text" placeholder="请输入项目编号" class="form-control" v-model="form.check_no">
      </form-field>

      <!-- 检查分类 -->
      <form-field :label="$t('检查分类')" for-id="scope">
        <el-select v-model="form.scope" placeholder="选择分类" style="width: 100%;" clearable>
          <el-option v-for="item in checkItemTypeOps" :key="item.id" :label="item.label" :value="item.id">
          </el-option>
        </el-select>
      </form-field>
      <!-- 数据状态 -->
      <form-field :label="$t('数据状态')" for-id="scope">
        <el-select v-model="form.status" placeholder="请选择" style="width: 100%;" clearable>
          <el-option v-for="item in dataStatsOps" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </form-field>

      <form-action>
        <button class="btn btn-primary" @click="search">
          <i class="fa fa-search" aria-hidden="true"></i> {{$t('buttons.query')}}
        </button>
        <button class="btn btn-secondary" @click="reset">
          <i class="fa fa-undo" aria-hidden="true"></i> {{$t('buttons.reset')}}</button>
      </form-action>
    </toggle-form>
    <!-- 操作按钮 -->
    <el-row>
      <el-col class="batch-op-buttons" :span="24">
        <button class="btn btn-primary" @click="_batchForbidden">
          {{$t('compliance.evaluationChecklist.batchForbidden')}}
        </button>
        <button class="btn btn-primary" @click="_batchStart">
          {{$t('compliance.evaluationChecklist.batchStart')}}
        </button>
        <button class="btn btn-danger" @click="_batchDelete">
          {{$t('compliance.evaluationChecklist.batchDelete')}}
        </button>
        <button class="btn btn-primary" @click="()=>this._showAddDlg()">
          {{$t('compliance.evaluationChecklist.creatCheckItem')}}
        </button>
      </el-col>
    </el-row>

    <sdl-table :url="url" border style="width: 100%" ref="projectListTable" @selection-change="handleSelectionChange" :query-params="projectParamQueryList">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="check_no" width="110" :label="$t('compliance.evaluation.projectNumber')">
      </el-table-column>

      <el-table-column prop="scope_name" width="110" :label="$t('compliance.evaluation.checkType')">
      </el-table-column>

      <el-table-column prop="type" width="150" :label="$t('compliance.evaluationChecklist.checkItemType')">
      </el-table-column>

      <el-table-column prop="sub_type" width="150" :label="$t('compliance.evaluationChecklist.checkItemChildType')">
      </el-table-column>

      <el-table-column prop="content" align="left" min-width="210" :label="$t('compliance.evaluation.checkList')">
        <template slot-scope="scope">
          <p class="check-list-content" v-html="_getContentHtml(scope.row.content)">
          </p>
        </template>
      </el-table-column>

      <el-table-column prop="create_user_name" width="110" :label="$t('compliance.evaluation.createUserName')">
        <template slot-scope="scope">
          <user-link :email="scope.row.create_user_email" :key="scope.row.create_user_email">{{scope.row.create_user_name}}</user-link>
        </template>
      </el-table-column>

      <el-table-column prop="status" width="110" :label="$t('compliance.evaluationChecklist.checkState')">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1">{{$t('启用')}}</span>
          <span v-if="scope.row.status==2">{{$t('禁用')}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="action" fixed="right" width="270" :label="$t('buttons.action')">
        <template slot-scope="scope">
          <b-button variant="primary" size="sm" @click.stop="_showAddDlg(scope.row,1)">
            {{ $t('buttons.link') }}
          </b-button>

          <b-button v-if="scope.row.status==2" variant="primary" size="sm" @click.stop="_enableOrDisable(scope.row,1)">
            {{ $t('manage.enable') }}
          </b-button>
          <b-button v-if="scope.row.status==1" variant="primary" size="sm" @click.stop="_enableOrDisable(scope.row,2)">
            {{ $t('manage.disable') }}
          </b-button>

          <b-button variant="primary" size="sm" @click.stop="_showAddDlg(scope.row,2)">
            {{ $t('buttons.edit') }}
          </b-button>

          <b-button variant="danger" size="sm" @click.stop="_deleteItem(scope.row)">
            {{ $t('buttons.delete') }}
          </b-button>
        </template>
      </el-table-column>
    </sdl-table>
    <!-- 新建检查项 -->
    <el-dialog :title="addDlgTitle" width="60%" :visible.sync="dialogAddVisible">
      <el-form ref="dlgForm" :disabled="isFormDisable" :rules="dlgRules" :model="dlgForm" label-suffix="：" label-width="110px">
        <el-row>
          <el-col :span="11">
            <el-form-item :label="$t('检查分类')" prop="scope">
              <el-select v-if="!isFormDisable" v-model="dlgForm.scope" :disabled="isFormDisable" placeholder="请选择" style="width: 100%;" clearable>
                <el-option v-for="item in checkItemTypeOps" :key="item.id" :label="item.label" :value="item.id">
                </el-option>
              </el-select>
              <span v-else>
                {{dlgForm.scope_name}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="12">
            <el-form-item :label="$t('数据状态')" prop="status">
              <el-select v-if="!isFormDisable" v-model="dlgForm.status" placeholder="请选择" :disabled="isFormDisable" style="width: 100%;" clearable>
                <el-option v-for="item in dataStatsOps" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <span v-else>
                <span v-if="dlgForm.status==1">{{$t('启用')}}</span>
                <span v-if="dlgForm.status==2">{{$t('禁用')}}</span>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('检查项类型')">
              <el-input v-if="!isFormDisable" v-model="dlgForm.type" :disabled="isFormDisable"></el-input>
              <span v-else>
                {{dlgForm.type}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('检查项子类')">
              <el-input v-if="!isFormDisable" v-model="dlgForm.sub_type" :disabled="isFormDisable"></el-input>
              <span v-else>
                {{dlgForm.sub_type}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('检查项')" v-if="dlgType!=1" prop="content">
              <app-ueditor ref="checkItem" class="ueditor-container" @change="_ueditorChange" :defaultMsg="dlgForm.content"></app-ueditor>
            </el-form-item>
            <el-form-item :label="$t('检查项')" v-if="dlgType==1">
              <app-ueditor-show ref="checkItemShow" :content="dlgForm.content"></app-ueditor-show>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="dlgType==1">
          <el-col :span="12">
            <el-form-item :label="$t('创建人')">
              <user-link v-if="dlgForm.create_user_email" :email="dlgForm.create_user_email">{{dlgForm.create_user_name}}&nbsp;&nbsp;</user-link>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('创建时间')">
              {{dlgForm.create_time?dlgForm.create_time:'-'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="dlgType==1">
          <el-col :span="12">
            <el-form-item :label="$t('修改人')">
              <user-link v-if="dlgForm.update_user_email" :email="dlgForm.update_user_email">{{dlgForm.update_user_name}}&nbsp;&nbsp;</user-link>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('修改时间')">
              {{dlgForm.update_time?dlgForm.update_time:'-'}}
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <el-row>
        <el-col :span="24" class="text-center">
          <el-button v-if="isFormDisable" @click="_closeAddDlg">{{$t('关闭')}}</el-button>
          <el-button v-if="!isFormDisable" @click="_closeAddDlg">{{$t('取消')}}</el-button>
          <el-button v-if="!isFormDisable" type="primary" @click="_creatCheckItem">{{$t('确定')}}</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { DATE_FORMAT, DATE_OPTIONS } from '@/constants.es6'


import ToggleForm from 'commons/ToggleForm.vue'
import FormField from 'commons/FormField.vue'
import FormAction from 'commons/FormAction.vue'
import AppUeditor from '../../../../components/appUeditor/index'
import AppUeditorShow from '../../../../components/appUeditorShow/index'
import _ from 'lodash'

export default {

  name: "COMPLIANCE-EVALUATION-LIST",

  computed: {
    queryParams: function () {
      let paramStr = ''
      for (let [key, value] of Object.entries(this.projectParamQueryList())) {
        paramStr += key + '=' + value + '&'
      }
      return paramStr.substring(0, paramStr.length - 1)
    }
  },

  components: {
    ToggleForm,
    FormField,
    FormAction,
    AppUeditor,
    AppUeditorShow
  },

  data() {
    return {
      url: 'sa/checkList/queryList',

      dialogAddVisible: false,
      checkItemTypeOps: [], //检查项分类编号
      dataStatsOps: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 2 }
      ],
      form: {
        check_no: '', //检查项编号
        scope: '', // 检查项分类编号
        status: '' //数据状态
      },
      addDlgTitle: '添加检查项',
      dlgType: 0, //0 新建 1 查看 2 编辑
      dlgForm: {
        id: '',
        scope: '', //检查项编号
        scope_name: '',
        status: '',
        status_name: '',
        type: '',//检查项类型
        sub_type: '', //检查子类
        content: '', //检查项内容
        create_time: '',
        create_user_id: '',
        create_user_name: '',
        create_user_email: '',
        update_user_id: '',
        update_user_name: '',
        update_user_email: '',
        update_time: '',
      },
      dlgRules: {
        scope: [
          { required: true, message: '检查项编号', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '数据状态不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '检查项内容不能为空', trigger: 'blur' }
        ],
      },
      multipleSelection: []
    }
  },
  computed: {
    isFormDisable() {
      console.log(this.dlgType)
      return this.dlgType == 1
    }
  },
  methods: {
    _batchForbidden() {
      // 批量禁用 2
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: '请选择相关数据再进行操作',
          type: 'warning'
        });
        return false
      }
      let that = this
      this.$confirm('禁用选项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = that.multipleSelection.map((item) => item.id)
        that._updateStatus(ids, 2)
          .then(({ body }) => {
            if (body.errno == 0) {
              that.$message({
                type: 'success',
                message: `成功!`
              });
              that.search(true)
            } else {
              that.$message({
                type: 'error',
                message: '错误:' + body.errmsg
              });
            }
          })
      })

    },
    _batchStart() {
      // 批量启用 1 
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: '请选择相关数据再进行操作',
          type: 'warning'
        });
        return false
      }
      let that = this;
      this.$confirm('启用选项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$nextTick(() => {
          let ids = that.multipleSelection.map((item) => item.id)
          that._updateStatus(ids, 1)
            .then(({ body }) => {
              if (body.errno == 0) {
                that.$message({
                  type: 'success',
                  message: `启动成功!`
                });
              } else {
                that.$message({
                  type: 'error',
                  message: '错误:' + body.errmsg
                });
              }
            })
            .finally(() => {
              this.search(true)
            })
        })
      })

    },
    _batchDelete() {
      // 批量删除 9
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: '请选择相关数据再进行操作',
          type: 'warning'
        });
        return false
      }
      this.$confirm('此操作将删除选中项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$nextTick(() => {
          let ids = this.multipleSelection.map((item) => item.id)
          this._updateStatus(ids, 9)
            .then(({ body }) => {
              if (body.errno == 0) {
                this.$message({
                  type: 'success',
                  message: `删除成功!`
                });
              } else {
                this.$message({
                  type: 'error',
                  message: '错误:' + body.errmsg
                });
              }
            })
            .finally(() => {
              this.search(true)
            })
        })
      })
    },
    _creatCheckItem() {
      // 创建新检查项
      let that = this;
      this.$refs.dlgForm.validate((valid) => {
        if (valid) {
          // add or update
          let postBody = {}
          postBody["scope"] = that.dlgForm.scope
          if (that.dlgForm.type) {

          }
          postBody["type"] = that.dlgForm.type ? that.dlgForm.type : ''
          postBody["sub_type"] = that.dlgForm.sub_type ? that.dlgForm.sub_type : ''
          postBody["content"] = that.dlgForm.content
          postBody["status"] = that.dlgForm.status
          if (that.dlgForm.id == '') {
            //   add
            that.$http.post('sa/checkList/insert', postBody).then(({ body }) => {
              if (body.errno == 0) {
                that.$message({
                  type: 'success',
                  message: `创建成功!`
                });
                that.search(true)
                that._closeAddDlg()
              } else {
                that.$message({
                  type: 'error',
                  message: '错误:' + body.errmsg
                });
              }
            })
          } else {
            postBody['id'] = that.dlgForm.id
            that.$http.post('sa/checkList/update', postBody).then(({ body }) => {
              if (body.errno == 0) {
                that.$message({
                  type: 'success',
                  message: `保存成功!`
                });
                that.search(false)
                that._closeAddDlg()
              } else {
                that.$message({
                  type: 'error',
                  message: '错误:' + body.errmsg
                });
              }
            })
          }

        } else {
          return false
        }
      })

    },

    _enableOrDisable(row, status) {
      // 启用 禁用
      let st = ''
      if (status == 1) {
        st = '启用'
      } else {
        st = '禁用'
      }
      this.$confirm(`${st}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._updateStatus([row.id], status)
          .then(({ body }) => {

            if (body.errno == 0) {
              this.$message({
                type: 'success',
                message: `${st}成功!`
              });
              this.search(true)
            } else {
              this.$message({
                type: 'error',
                message: '错误:' + body.errmsg
              });
            }
          })
      })

    },

    _deleteItem(row) {
      // 删除
      this.$confirm('此操作将删除选中项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._updateStatus([row.id], 9)
          .then(({ body }) => {
            if (body.errno == 0) {
              this.$message({
                type: 'success',
                message: `删除成功!`
              });
              this.search(true)
            } else {
              this.$message({
                type: 'error',
                message: '错误:' + body.errmsg
              });
            }
          })
      })

    },
    _updateStatus(ids = [], status) {
      return this.$http.post('/sa/checkList/updateStatus', { ids, status })
    },
    _showAddDlg(row = {}, type) {
      this._clearFormData()
      let { id } = row;
      if (id != null) {
        this.$http.get(`/sa/checkList/findInfo/${id}`)
          .then(({ body }) => {
            if (body.errno == 0 && body.data) {
              const dt = body.data;
              // 显示添加编辑对话框
              this.dialogAddVisible = true
              if (type == 1) {
                this.dlgType = 1
                this.addDlgTitle = "检查项详细信息"
              } else if (type == 2) {
                this.dlgType = 2
                this.addDlgTitle = "编辑检查项"
              }
              if (dt) {
                let keys = Object.keys(this.dlgForm)
                for (let key of keys) {
                  this.dlgForm[key] = dt[key]
                }
                if (this.dlgType == 2 && this.$refs.checkItem && this.$refs.checkItem.editor) {
                  this.$refs.checkItem.editor.setContent(this.dlgForm['content'])
                }

              } else {
                if (this.$refs.checkItem && this.$refs.checkItem.editor) {
                  this.$refs.checkItem.editor.setContent('')
                }
              }
            } else {
              this.$message({
                message: '错误：' + body.errmsg,
                type: 'error'
              });
            }
          })
      } else {
        //  添加 
        this.dialogAddVisible = true
        if (this.$refs.checkItem && this.$refs.checkItem.editor) {
          this.$refs.checkItem.editor.setContent('')
        }
      }


    },
    _closeAddDlg() {
      this._clearFormData()
    },
    _clearFormData() {
      if (this.$refs.checkItem && this.$refs.checkItem.editor) {
        this.$refs.checkItem.editor.setContent('')
      }
      this.dialogAddVisible = false
      this.dlgForm.id = ''
      this.dlgForm.scope = ''
      this.dlgForm.status = ''
      this.dlgForm.type = ''
      this.dlgForm.sub_type = ''
      this.dlgForm.content = ''
      this.addDlgTitle = '添加检查项'
      this.dlgType = 0
    },
    _ueditorChange() {
      this.dlgForm.content = this.$refs.checkItem.getUEContent()
      console.log(this.dlgForm.content)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 查询参数
     */
    projectParamQueryList() {
      let params = {
        check_no: this.form.check_no,
        scope: this.form.scope,
        status: this.form.status
      }
      return this.dealElement(params)
    },

    dealElement(obj) {
      var param = {}
      if (obj === null || obj === undefined || obj === "") return param;
      for (var key in obj) {
        if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
          param[key] = obj[key]
        }
      }
      return param
    },

    search(st = true) {
      this.$refs.projectListTable.reload2(st)
    },



    reset() {
      this.form.check_no = ''
      this.form.scope = ''
      this.form.status = ''
      this.form.page = 1
      this.search()
    },

    // 获取评估分类（评估内容）
    getDictEvaContent() {
      this.$http.get('/dictionary/listByDataAuth/1730').then(({ body }) => {
        if (body.errno == 0) {
          this.dictEvaContents = body.data
        }
      })
    },

    getSelectOptions(id) {
      let url = '/dictionary/listByDataAuth/1730'
      this.$http.get(url).then(({ body }) => {
        let options = body.data.map(({ id: id, dName: label }) => {
          return {
            id,
            label
          }
        })
        /*  this.checkItemTypeOps.push({
           id: 0,
           label: '全部'
         }) */
        options.sort(function (a, b) {
          if (a.id < b.id) {
            return -1
          }
          if (a.id > b.id) {
            return 1
          }
          return 0
        })
        this.checkItemTypeOps.push(...options)
      })
    },

    _getContentHtml(content) {
      content = content.replace(/[\r\n]+/g, '<br />')
      content = content.replace(/[\n]+/g, '<br />')
      return content
    }
  },

  created() {
    // 获取数据字典，初始化查询下拉参数
    this.getSelectOptions() //检查项分类
  },

  mounted() {

    let query = this.$route.query

    if (Object.keys(query).length !== 0) {

      // 事件编号
      if (query.event_no) {
        this.event_no = query.event_no
      }

    }
  }
}
</script>
<style lang="less">
.compliance-evaluation-checklist {
  .datepicker-range .datepicker-popup {
    width: 415px;
  }
  .el-table__header th {
    color: #494b55;
    text-align: center;
    background-color: #f3f4f5;
  }
  .batch-op-buttons {
    text-align: right;
    padding-bottom: 16px;
  }
  .cell {
    text-align: center;
  }
  .check-list-content {
    white-space: normal;
    text-align: left;
  }
  .ueditor-container {
    margin-bottom: 8px;
  }
  textarea#edit {
    display: none;
  }
}
</style>