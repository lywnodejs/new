<template>
  <div id="codeBlack" style="margin-top: 20px;">
    <!-- 白盒盒扫描信息提交 -->
    <div>
      <span class="fontBlack">测试环境</span>
      <app-permission>
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          class="codeBlackFunc-btn"
          v-show="!isBaselineWorkflow"
          @click="editable=!editable">
          编辑
        </el-button>
      </app-permission>
      <app-permission>
        <el-button
          @click="openDialog('add')"
          type="warning"
          class="el-icon-circle-plus-outline codeBlackFunc-btn"
          v-show="isBaselineWorkflow"
          size="mini">
          添加
        </el-button>
        <el-button
          @click="openDialog('add')"
          type="warning"
          class="el-icon-circle-plus-outline codeBlackFunc-btn"
          v-show="isBaselineWorkflow"
          size="mini">
          添加
        </el-button>
      </app-permission>
      <el-button
        @click="getBlackScanStatus"
        type="warning"
        class="el-icon-refresh codeBlackFunc-btn"
        v-show="editable && !isBaselineWorkflow"
        size="mini">
        状态同步
      </el-button>
      <el-button
        @click="startBlackScan"
        type="warning"
        class="el-icon-caret-right codeBlackFunc-btn"
        v-show="editable && !isBaselineWorkflow"
        size="mini">
        开启扫描
      </el-button>
    </div>
    <el-table @cell-click='cellClick'
              :cell-style="cellStyle"
              :data="tableData"
              show-header
              style="margin-top: 15px;width: 100%">
      <el-table-column
        prop="black_eva_id"
        label="ID"
        width="70">
      </el-table-column>
      <el-table-column
        prop="test_address"
        label="测试域名"
        width="250">
      </el-table-column>
      <el-table-column
        prop="test_user_pass"
        label="测试账号"
        width="200">
      </el-table-column>
      <el-table-column
        label="接口文档地址">
        <template slot-scope="scope">
          <span class="gitURL" @click="bounceUrl(scope.row.api_doc)">{{scope.row.api_doc}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="bind_ip_port"
        label="绑定信息"
        width="180">
      </el-table-column>
      <el-table-column
        v-if="editable"
        prop="octopus_task_id"
        label="octopusTaskId"
        width="120">
      </el-table-column>
      <el-table-column
        v-if="editable"
        prop="octopus_task_status"
        label="扫描状态"
        width="100">
      </el-table-column>
      <el-table-column
        v-if="currentStatus==5 || currentStatus==101"
        align="center"
        label="操作"
        width="90">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="blackEvaluation.black_eva_id = scope.row.black_eva_id;openDialog('edit');">
          </el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="deleteDialogVisible = true;blackEvaluation.black_eva_id = scope.row.black_eva_id">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <app-permission v-if="!isBaselineWorkflow">
      <table class="codeWhite-table">
        <tr class="el-icon-circle-plus-outline" @click="openDialog('add')">添加</tr><span>（添加代码仓库、测试环境信息后请点击下方 "<strong>确认提交</strong>" 按钮）</span>
      </table>
      <table class="codeWhite-table" v-if="currentStatus==5">
        <tr class="el-icon-circle-plus-outline" @click="openDialog('add')">添加</tr><span>（添加代码仓库、测试环境信息后请点击下方 "<strong>确认提交</strong>" 按钮）</span>
      </table>
    </app-permission>

    <!-- 删除黑盒扫描信息dialog -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%">
      <span>确定删除该项？</span>
      <span slot="footer" class="dialog-footer clearfloat">
        <el-button style="float:right;" class="blackEvalu-btn margin" type="primary" @click="deleteCodeBlackEvaluation">确 定</el-button>
        <el-button style="float:right;margin-right:15px;" class="blackEvalu-button margin"
                   @click="deleteDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 添加或更新黑盒扫描信息dialog -->
    <el-dialog title="测试环境信息" :visible.sync="dialogFormVisible" width="460px">
      <el-form :inline="true" :model="blackEvaluation" :rules='rules' ref="blackEvaluation"
               label-width="100px" label-position="left">
        <!-- <el-col> -->
          <el-form-item label="测试地址" prop="test_address">
            <el-input
              placeholder="可以填域名、IP地址、或者IP:PORT的形式"
              v-model="blackEvaluation.test_address"
              clearable>
            </el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="测试账号">
            <el-input
              placeholder="例如: admin1/password1, admin2/password2"
              v-model="blackEvaluation.test_user_pass"
              clearable>
            </el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="接口文档地址">
            <el-input
              placeholder="请输入接口文档或 Swagger 地址"
              v-model="blackEvaluation.api_doc"
              clearable>
            </el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="绑定HOST">
            <el-radio-group
              v-model="blackEvaluation.need_bind_host"
              @change="toggleHostBindView">
              <el-radio :label=1>是</el-radio>
              <el-radio :label=0>否</el-radio>
            </el-radio-group>
          </el-form-item>
        <!-- </el-col> -->
        <!-- <el-col > -->
          <el-form-item v-if="need_bind" label="绑定信息">
            <el-input
              placeholder="例如: 10.10.10.1:8080"
              v-model="blackEvaluation.bind_ip_port"
              clearable>
            </el-input>
          </el-form-item>
        <!-- </el-col> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="blackEvalu-button" @click="dialogFormVisible = false">取消</el-button>
        <el-button class="blackEvalu-btn" type="warning" round @click="submitForm('blackEvaluation')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ajax from '@/plugin/ajax'
  import * as API from '@/commons/api/dorado'

  export default {
    name: 'code-black-evaluation',
    data() {
      return {
        formLabelWidth: '120px',
        deleteDialogVisible: false,
        dialogFormVisible: false,
        editable: false,
        isUpdate: false,
        need_bind: false,
        blackEvaluation: {
          black_eva_id: 0,
          test_address: '',
          test_user_pass: '',
          api_doc: '',
          need_bind_host: 0,
          bind_ip_port: '',
          sdl_project_id: ''
        },
        tableData: [],
        rules: {
          test_address: [{required: true, message: '请输入测试域名', trigger: 'blur'}]
        }
      }
    },
    props: ['currentStatus', 'isBaselineWorkflow'],
    created() {
      this.blackEvaluation.sdl_project_id = this.$route.query['projectId']
      this.fetchData()
    },
    methods: {
      fetchData() {
        let postJson = {
          sdl_project_id: this.blackEvaluation.sdl_project_id
        }
        if (this.isBaselineWorkflow) {
          ajax.post(API.fecthBaselineCodeBlackEvaluation, postJson).then(response => {
            const errno = response.errno
            const errmsg = response.errmsg
            if (errno === 0) {
              if (response.data) {
                this.tableData = response.data.black_eva_list
              }
            } else {
              this.$notify({
                title: '失败',
                message: errmsg,
                type: 'error'
              })
            }
          })
        } else {
          ajax.post(API.fecthCodeBlackEvaluation, postJson).then(response => {
            const errno = response.errno
            const errmsg = response.errmsg
            if (errno === 0) {
              if (response.data) {
                this.tableData = response.data.black_eva_list
              }
            } else {
              this.$notify({
                title: '失败',
                message: errmsg,
                type: 'error'
              })
            }
          })
        }
      },
      toggleHostBindView(value) {
        this.need_bind = value
      },
      openDialog(action = 'add') {
        if (action === 'edit') {
          this.getCodeBlackEvaluationDetail()
        } else {
          this.blackEvaluation = {
            black_eva_id: 0,
            test_address: '',
            test_user_pass: '',
            api_doc: '',
            need_bind_host: 0,
            bind_ip_port: '',
            sdl_project_id: 0
          }
          this.blackEvaluation.sdl_project_id = this.$route.query['projectId']
        }
        this.dialogFormVisible = true
      },
      submitBlackEvaluation() {
        if (this.blackEvaluation.black_eva_id) {
          this.updateCodeBlackEvaluation()
        } else {
          this.createCodeBlackEvaluation()
        }
      },
      getBlackScanStatus() {
        let postJson = {
          sdl_project_id: this.blackEvaluation.sdl_project_id
        }
        ajax.post(API.getBlackScanStatus, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '成功',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.dialogFormVisible = false
        })
      },
      startBlackScan() {
        let postJson = {
          sdl_project_id: this.blackEvaluation.sdl_project_id
        }
        ajax.post(API.startBlackScan, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '成功',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.dialogFormVisible = false
        })
      },
      createCodeBlackEvaluation() {
        let postJson = {
          black_evaluation: this.blackEvaluation
        }
        if (this.isBaselineWorkflow) {
          ajax.post(API.createBaselineCodeBlackEvaluation, postJson).then(response => {
            const errno = response.errno
            const errmsg = response.errmsg
            if (errno === 0) {
              this.fetchData()
            } else {
              this.$notify({
                title: '失败',
                message: errmsg,
                type: 'error'
              })
            }
            this.dialogFormVisible = false
          })
        } else {
          ajax.post(API.createCodeBlackEvaluation, postJson).then(response => {
            const errno = response.errno
            const errmsg = response.errmsg
            if (errno === 0) {
              this.fetchData()
            } else {
              this.$notify({
                title: '失败',
                message: errmsg,
                type: 'error'
              })
            }
            this.dialogFormVisible = false
          })
        }
      },
      updateCodeBlackEvaluation() {
        let postJson = {
          black_evaluation: this.blackEvaluation
        }
        if (this.isBaselineWorkflow) {
          ajax.post(API.updateBaselineCodeBlackEvaluation, postJson).then(response => {
            const errno = response.errno
            const errmsg = response.errmsg
            if (errno === 0) {
              this.fetchData()
            } else {
              this.$notify({
                title: '失败',
                message: errmsg,
                type: 'error'
              })
            }
          })
        } else {
          ajax.post(API.updateCodeBlackEvaluation, postJson).then(response => {
            const errno = response.errno
            const errmsg = response.errmsg
            if (errno === 0) {
              this.fetchData()
            } else {
              this.$notify({
                title: '失败',
                message: errmsg,
                type: 'error'
              })
            }
          })
        }
        this.dialogFormVisible = false
      },
      getCodeBlackEvaluationDetail() {
        let postJson = {
          black_eva_id: this.blackEvaluation.black_eva_id,
          sdl_project_id: this.blackEvaluation.sdl_project_id
        }
        if (this.isBaselineWorkflow) {
          ajax.post(API.getBaselineCodeBlackEvaluationDetail, postJson).then(response => {
            const errno = response.errno
            const errmsg = response.errmsg
            if (errno === 0) {
              this.blackEvaluation = response.data.black_data
              this.toggleHostBindView(this.blackEvaluation.need_bind_host)
            } else {
              this.$notify({
                title: '失败',
                message: errmsg,
                type: 'error'
              })
            }
          })
        } else {
          ajax.post(API.getCodeBlackEvaluationDetail, postJson).then(response => {
            const errno = response.errno
            const errmsg = response.errmsg
            if (errno === 0) {
              this.blackEvaluation = response.data.black_data
              this.toggleHostBindView(this.blackEvaluation.need_bind_host)
            } else {
              this.$notify({
                title: '失败',
                message: errmsg,
                type: 'error'
              })
            }
          })
        }
      },
      deleteCodeBlackEvaluation() {
        let postJson = {
          black_eva_id: this.blackEvaluation.black_eva_id,
          sdl_project_id: this.blackEvaluation.sdl_project_id
        }
        if (this.isBaselineWorkflow) {
          ajax.post(API.deleteBaselineCodeBlackEvaluationById, postJson).then(response => {
            const errno = response.errno
            const errmsg = response.errmsg
            if (errno === 0) {
              this.fetchData()
            } else {
              this.$notify({
                title: '失败',
                message: errmsg,
                type: 'error'
              })
            }
          })
        } else {
          ajax.post(API.deleteCodeBlackEvaluationById, postJson).then(response => {
            const errno = response.errno
            const errmsg = response.errmsg
            if (errno === 0) {
              this.fetchData()
            } else {
              this.$notify({
                title: '失败',
                message: errmsg,
                type: 'error'
              })
            }
          })
        }
        this.deleteDialogVisible = false
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitBlackEvaluation()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      cellClick(row, column, cell, event) {
        if (column.property == 'api_doc' && row.api_doc != '') {
          window.open(row.api_doc, '_blank')
        }
      },
      cellStyle({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 3) {
          return 'cursor:pointer'
        }
      },
      bounceUrl(url) {
        window.open(url)
      }
    }
  }
</script>

<style lang="less">
  #codeBlack {
    -webkit-font-smoothing: antialiased;
    .el-input {
      width: 320px;
    }
    .el-select {
      width: 320px;
    }
    .fontBlack {
      font-size: 13px;
      // color: #333333;
      color: gray;
      -webkit-font-smoothing: antialiased;
    }
    .blackEvalu-button {
      font-size: 13px;
      height: 32px;
      width: 80px;
      padding: 0px;
      // font-weight: 100;
    }
    .blackEvalu-btn {
      background: #fc9153;
      border-radius: 4px;
      font-size: 13px;
      height: 32px;
      width: 80px;
      padding: 0px;
      border: none;
      // font-weight: 100;
      // margin-right: 13px;
    }
    .margin {
      margin-top: -30px;
    }
    .codeWhite-table {
      border: 1px solid rgb(226, 226, 226);
      border-top: none;
      width: 100%;
      min-height: 40px;
      line-height: 40px;
      text-align: left;
      font-size: 12px;
    }
    .codeWhite-table span {
    color: red;
    // font-weight: 100;
  }
  .codeWhite-table tr {
    margin-left: 10px;
    color: #fc9153;
    padding: 5px;
    cursor: pointer;
  }
  .codeWhite-table strong{
    // font-weight: 400;
    font-weight: normal
  }
    .codeWhite-table tr:hover {
      color: orange;
    }
    .codeBlackFunc-btn {
      background: white;
      color: #fc9153 !important;
      border-radius: 4px;
      float: right;
      margin-left: 15px;
      border: 1px solid #fc9153;
      height: 28px;
      width: 96px;
    }
    .codeBlackFunc-btn:hover {
      background: #fff7f2;
    }
    .gitURL {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .gitURL:hover {
      color: #fc9153;
    }
  }
  /*清除浮动代码*/
  .clearfloat:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .clearfloat {
    zoom: 1;
  }
</style>
