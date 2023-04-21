<template>
  <div style="margin-top: 20px;">
    <!-- 白盒盒扫描信息提交 -->
    <div>
      <span class="spanWhite">代码仓库</span>
      <app-permission>
        <el-button
          @click="editable=!editable"
          type="primary"
          icon="el-icon-edit"
          size="mini"
          v-show="!isBaselineWorkflow"
          class="codeWhiteFunc-btn">
          编辑
        </el-button>
      </app-permission>
      <app-permission>
        <el-button
          @click="openDialog('add')"
          type="warning"
          class="el-icon-circle-plus-outline codeWhiteFunc-btn"
          v-show="isBaselineWorkflow"
          size="mini">
          添加
        </el-button>
        <el-button
          @click="openDialog('add')"
          type="warning"
          class="el-icon-circle-plus-outline codeWhiteFunc-btn"
          v-show="isBaselineWorkflow && currentStatus === 101"
          size="mini">
          添加
        </el-button>
      </app-permission>
      <el-button
        @click="getWhiteScanStatus"
        type="warning"
        class="el-icon-refresh codeWhiteFunc-btn"
        v-show="editable && !isBaselineWorkflow"
        size="mini">
        状态同步
      </el-button>
      <el-button
        @click="startWhiteScan"
        type="warning"
        class="el-icon-caret-right codeWhiteFunc-btn"
        v-show="editable && !isBaselineWorkflow"
        size="mini">
        开启扫描
      </el-button>
    </div>
    <el-table
      :data="tableData"
      show-header
      style="margin-top: 15px;width: 100%">
      <el-table-column
        prop="white_eva_id"
        label="ID"
        width="70">
      </el-table-column>
      <el-table-column
        prop="git_module_name"
        label="模块名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="git_url"
        label="Git地址">
        <template slot-scope="scope">

          <span id="gitUrl" class="gitUrl" @click="bounceUrl(scope.row.git_url)">{{scope.row.git_url}}</span>
          <span>
            <img src="./../../../../../static/code-search.png"
                 class="codeSearch"
                 @click="openCodeSearch(scope.row.git_url)">
          </span>
           <!-- <el-popover
            placement="top-start"
            width="80"
            trigger="hover"
            content="点击复制">
            <span slot="reference" class="iconfont icon-copy copyIcon" @click="copy(scope.row.git_url)"></span>
          </el-popover> -->
          <el-tooltip content="点击复制" placement="top" effect="light">
            <span class="iconfont icon-copy copyIcon" @click="copy(scope.row.git_url)"></span>
          </el-tooltip>
          <el-tooltip content="查看数据库字段" placement="top" effect="light">
            <!-- <span class="iconfont icon-dorado-sensitive dorado-sensitive" @click='sensitiveDetail(scope.row)'></span> -->
            <span v-show="scope.row.dataMaxLevel" class="dorado-sensitive" @click='sensitiveDetail(scope.row)'>{{scope.row.dataMaxLevel}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="git_branch"
        label="分支"
        width="80">
      </el-table-column>
      <el-table-column
        prop="git_relative_path"
        width="80"
        label="相对路径">
      </el-table-column>
      <el-table-column
        prop="language"
        label="开发语言"
        width="80">
      </el-table-column>
      <el-table-column
        prop="framework"
        label="开发框架"
        width="100">
      </el-table-column>

      <el-table-column
        v-if="editable"
        width="80"
        label="扫描状态">
        <template slot-scope="scope">
          <a :href='scope.row.anquan_cx_task_fast_link' target='_blank'><span>{{scope.row.cx_task_status}}</span></a>
        </template>
      </el-table-column>
      <app-permission>
        <el-table-column
        align="center"
        label="操作"
        width="90">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="whiteEvaluation.white_eva_id = scope.row.white_eva_id;openDialog('edit');">
          </el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="deleteDialogVisible = true;whiteEvaluation.white_eva_id = scope.row.white_eva_id">
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        v-if="currentStatus == 5 || currentStatus == 101"
        align="center"
        label="操作"
        width="90">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="whiteEvaluation.white_eva_id = scope.row.white_eva_id;openDialog('edit');">
          </el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="deleteDialogVisible = true;whiteEvaluation.white_eva_id = scope.row.white_eva_id">
          </el-button>
        </template>
      </el-table-column>
      </app-permission>
    </el-table>
    <app-permission v-if="!isBaselineWorkflow">
      <table class="codeWhite-table">
        <tr class="el-icon-circle-plus-outline" @click="openDialog('add')">添加</tr><span>（添加代码仓库、测试环境信息后请点击下方 "<strong>确认提交</strong>" 按钮）</span>
      </table>
      <table class="codeWhite-table" v-if="currentStatus==5">
        <tr class="el-icon-circle-plus-outline" @click="openDialog('add')">添加</tr><span>（添加代码仓库、测试环境信息后请点击下方 "<strong>确认提交</strong>" 按钮）</span>
      </table>
    </app-permission>
    <!-- 删除白盒扫描信息dialog -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%">

      <!-- :before-close="handleClose" -->
      <span>确定删除该项？</span>
      <span class="dialog-footer clearfloat">
        <br>
        <el-button style="float:right" class="whiteEvalu-btn" type="primary"
                   @click="deleteCodeWhiteEvaluation">确 定</el-button>
        <el-button style="float:right;margin-right:15px; " class="whiteEvalu-button"
                   @click="deleteDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加或更新白盒扫描信息dialog -->
    <el-dialog title="代码仓库信息" :visible.sync="dialogFormVisible" width="460px">
      <el-form :model="whiteEvaluation" label-width="100px" :rules='rules' ref="whiteEvaluation" label-position="left">
        <el-form-item label="模块名称">
          <el-input class="codeWhite"
                    v-model="whiteEvaluation.git_module_name"
                    placeholder="Git仓库名称，默认为模块名"
                    clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="开发语言">
          <el-select class="codeWhite" v-model="whiteEvaluation.language" placeholder="请选择开发语言">
            <el-option
              v-for="item in language"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Git地址" prop="git_url">
          <el-input class="codeWhite"
                    v-model="whiteEvaluation.git_url"
                    placeholder="SSH形式，如 git@git.xiaojukeji.com:group/demo.git"
                    clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="分支">
          <el-input class="codeWhite"
                    v-model="whiteEvaluation.git_branch"
                    placeholder="Git仓库分支，默认为master"
                    clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="相对路径" prop="git_relative_path">
          <!-- <el-input class="codeWhite"
                    v-model="whiteEvaluation.git_relative_path"
                    @focus="getRepo"
                    placeholder="代码相对路径以'/'开头，默认为根目录"
                    clearable>
          </el-input> -->
          <el-select class="codeWhite"
              v-model="whiteEvaluation.git_relative_path"
              @focus="getRepo"
              placeholder="代码相对路径以'/'开头，默认为根目录">
            <el-option
              v-for="item in repoTree"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <div v-if="whiteEvaluation.language !== 'Golang'" class="git-relative-path-warning">
            该路径下需要有 build.sh，请添加 build 脚本后提交，详情见 <a class="git-relative-path-a" href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=74353060" target="_blank">SCMPF提供的build.sh模板</a>
            ，请您确认是否选择 ./ 提交。
          </div>
          <div v-if="whiteEvaluation.language === 'Golang'" class="git-relative-path-warning">
            该路径下需要有 main.go 文件，此路径为您构建项目时的构建路径 ，填错会导致项目扫描失败，请您确认是否选择 ./ 提交。
          </div>
        </el-form-item>
        <el-form-item label="开发框架">
          <el-select class="codeWhite" v-model="whiteEvaluation.framework" placeholder="请选择开发框架">
            <el-option
              v-for="item in framework"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="codeWhite"
                    type="textarea"
                    v-model="whiteEvaluation.description"
                    auto-complete="off"
                    placeholder="备注">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="whiteEvalu-button" @click="dialogFormVisible = false">取消</el-button>
        <el-button class="whiteEvalu-btn" type="warning" round @click="submitForm('whiteEvaluation')">确定</el-button>
      </div>
    </el-dialog>
    <sensitive-detail-dialog :dialogVisible='sensitiveDialog' :scopeRow='scopeRow' @getVisible='getDialogVisible'></sensitive-detail-dialog>
  </div>
</template>

<script>
  import ajax from '@/plugin/ajax'
  import {connect} from '@/lib'
  import * as API from '@/commons/api/dorado'
  import * as CONSTANTS from '@/commons/dorado'
  import sensitiveDetailDialog from './dialogs/sensitiveDetailDialog'

  export default connect(() => {
    return {
      myWhiteEvaluation: 'baseline_requirement/whiteEvaluation'
    }
  }, {
    fecthBaselineCodeWhiteEvaluation: 'baseline_requirement/fecthBaselineCodeWhiteEvaluation',
    getRepoTree: 'baseline_requirement/getRepoTree',
    fecthCodeWhiteEvaluation: 'baseline_material/fecthCodeWhiteEvaluation',
    getBaselineCodeWhiteEvaluationDetail: 'baseline_material/getBaselineCodeWhiteEvaluationDetail',
    getCodeWhiteEvaluationDetail: 'baseline_material/getCodeWhiteEvaluationDetail',
    getOutputSensitive: 'baseline_requirement/getOutputSensitive'
  })({
    name: 'code-white-evalution',
    data() {
      return {
        formLabelWidth: '120px',
        deleteDialogVisible: false,
        dialogFormVisible: false,
        framework: CONSTANTS.framework,
        language: CONSTANTS.language,
        editable: false,
        isUpdate: false,
        whiteEvaluation: {
          white_eva_id: 0,
          git_module_name: '',
          git_http_url: '',
          git_url: '',
          language: '',
          git_branch: '',
          framework: '',
          description: '',
          git_relative_path: '',
          sdl_project_id: 0
        },
        tableData: [],
        database66: null,
        rules: {
          git_url: [{required: true, message: '请输入Git地址', trigger: 'blur'}],
          git_relative_path: [{required: true, message: '请输入相对路径', trigger: 'blur'}]
        },
        repoTree: [],
        scopeRow: {},
        sensitiveDialog: false,
        dataLevel: ''
      }
    },
    props: ['currentStatus', 'isBaselineWorkflow'],
    components: {sensitiveDetailDialog},
    created() {
      this.whiteEvaluation.sdl_project_id = this.$route.query['projectId']
      this.fetchData()
    },
    methods: {
      fetchData() {
        let postJson = {
          sdl_project_id: this.whiteEvaluation.sdl_project_id
        }
        if (this.isBaselineWorkflow) {
          this.fecthBaselineCodeWhiteEvaluation(postJson).then(response => {
              this.tableData = this.myWhiteEvaluation.white_eva_list
              this.judgeDatalevel(this.tableData)
          })
        } else {
          this.fecthCodeWhiteEvaluation(postJson).then(response => {
            const errno = response.errno
            const errmsg = response.errmsg
            if (errno === 0) {
              this.tableData = response.data.white_eva_list
              this.judgeDatalevel(this.tableData)
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
      async judgeDatalevel(data) {
        data.forEach(item => {
          let param = {
            sdl_project_id: this.$route.query['projectId'],
            git_url: item.git_url,
            git_branch: item.git_branch
          }
          this.$set(item, 'dataMaxLevel', '')
          this.getOutputSensitive(param).then(res => {

            //  如果响应数据为空数据则对应的Git仓库无C3C4数据，如果data为null则解析不出来
              if (res === null) return
              if (res.length === 0) {
                item.dataMaxLevel = 'C3'
                return
              }
              res.forEach(element => {
                let keys = Object.keys(element)
                for (let i = 0; i < keys.length; i++) {
                  if (element[keys[i]].fields) {
                    element[keys[i]].fields.forEach(items => {
                      if (items.level === 40) {
                        item.dataMaxLevel = 'C4'
                      }
                    })
                  }
                }
              })
              if (res.length > 0 && !item.dataMaxLevel) {
                item.dataMaxLevel = 'C3'
              }
          })
        })
      },
      openDialog(action = 'add') {
        if (action === 'edit') {
          this.getCodeWhiteEvaluationDetail()
        } else {
          this.whiteEvaluation = {
            git_module_name: '',
            git_url: '',
            language: '',
            git_branch: '',
            framework: '',
            description: '',
            git_relative_path: '',
            sdl_project_id: 0
          }
          this.whiteEvaluation.sdl_project_id = this.$route.query['projectId']
        }
        this.dialogFormVisible = true
      },
      submitCodeWhiteEvaluation() {
        if (this.whiteEvaluation.white_eva_id) {
          this.updateCodeWhiteEvaluation()
        } else {
          this.createCodeWhiteEvaluation()
        }
        this.$alert('如有“提交评估材料”按钮，请点击提交！', '提示', {
          confirmButtonText: '确定'
        });
      },
      getWhiteScanStatus() {
        let postJson = {
          sdl_project_id: this.whiteEvaluation.sdl_project_id
        }
        ajax.post(API.getWhiteScanStatus, postJson).then(response => {
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
      startWhiteScan() {
        let postJson = {
          sdl_project_id: this.whiteEvaluation.sdl_project_id
        }
        ajax.post(API.startWhiteScan, postJson).then(response => {
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
      createCodeWhiteEvaluation() {
        let postJson = {
          white_evaluation: this.whiteEvaluation
        }
        if (this.isBaselineWorkflow) {
          ajax.post(API.createBaselineCodeWhiteEvaluation, postJson).then(response => {
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
          ajax.post(API.createCodeWhiteEvaluation, postJson).then(response => {
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
      updateCodeWhiteEvaluation() {
        let postJson = {
          white_evaluation: this.whiteEvaluation,
          sdl_project_id: this.whiteEvaluation.sdl_project_id
        }
        if (this.isBaselineWorkflow) {
          ajax.post(API.updateBaselineCodeWhiteEvaluation, postJson).then(response => {
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
          ajax.post(API.updateCodeWhiteEvaluation, postJson).then(response => {
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
      getCodeWhiteEvaluationDetail() {
        let postJson = {
          white_eva_id: this.whiteEvaluation.white_eva_id,
          sdl_project_id: this.whiteEvaluation.sdl_project_id
        }
        if (this.isBaselineWorkflow) {
          this.getBaselineCodeWhiteEvaluationDetail(postJson).then(response => {
            const errno = response.errno
            const errmsg = response.errmsg
            if (errno === 0) {
              this.whiteEvaluation = response.data.white_data
            } else {
              this.$notify({
                title: '失败',
                message: errmsg,
                type: 'error'
              })
            }
          })
        } else {
          this.getCodeWhiteEvaluationDetail(postJson).then(response => {
            const errno = response.errno
            const errmsg = response.errmsg
            if (errno === 0) {
              this.whiteEvaluation = response.data.white_data
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
      deleteCodeWhiteEvaluation() {
        let postJson = {
          white_eva_id: this.whiteEvaluation.white_eva_id,
          sdl_project_id: this.whiteEvaluation.sdl_project_id
        }
        if (this.isBaselineWorkflow) {
          ajax.post(API.deleteBaselineCodeWhiteEvaluationById, postJson).then(response => {
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
          ajax.post(API.deleteCodeWhiteEvaluationById, postJson).then(response => {
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
            this.submitCodeWhiteEvaluation()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      bounceUrl(url) {
        let uu = 'https://git.xiaojukeji.com/'
        let urll = uu + url.split(':')[1]
        window.open(urll)
      },
      openCodeSearch(url) {
        let baseUrl = 'http://studio.xiaojukeji.com/s?repo='
        let gitUri = url.split(':')[1]
        console.log(gitUri)
        console.log(gitUri.split('.'))
        let repoUri = baseUrl + gitUri.split('.')[0]
        console.log(repoUri)
        window.open(repoUri)
      },
      getRepo() {
        let param = {
          git_url: this.whiteEvaluation.git_url,
          git_branch: this.whiteEvaluation.git_branch
        }
        this.getRepoTree(param).then(res => {
          this.repoTree = res
        })
      },
      copy(url) {
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.setAttribute('value', url);
        input.select();
        if (document.execCommand('copy')) {
          document.execCommand('copy');
          console.log('复制成功');
        }
        document.body.removeChild(input);
      },
      sensitiveDetail(val) {
        this.scopeRow = val
        this.sensitiveDialog = true
      },
      getDialogVisible(val) {
        this.sensitiveDialog = val
      }
    }
  })
</script>

<style  lang="less" scoped>
  .el-input {
    width: 400px;
  }
  .el-select {
    width: 400px;
  }
  .dialog-footer {
    /* height: 36px;  */
  }
  .spanWhite {
    font-size: 13px;
    color: gray;
    -webkit-font-smoothing: antialiased;
  }
  .whiteEvalu-button {
    width: 80px;
    height: 32px;
    font-size: 13px;
    padding: 0px;
    /* font-weight: 100; */
  }
  .whiteEvalu-btn {
    background: #fc9153;
    border-radius: 4px;
    height: 32px;
    font-size: 13px;
    width: 80px;
    padding: 0px;
    border: none;
    /* font-weight: 100; */
    /* margin-right: 15px; */
  }
  .codeWhite {
    width: 320px;
  }
  .codeWhite-table {
    border: 1px solid rgb(226, 226, 226);
    border-top: none;
    width: 100%;
    min-height: 40px;
    line-height: 40px;
    text-align: left;
    -webkit-font-smoothing: antialiased;
    font-size: 12px;
  }
  .codeWhite-table span {
    color: red;
    /* font-weight: 100; */
  }
  .codeWhite-table tr {
    margin-left: 10px;
    color: #fc9153;
    padding: 5px;
    cursor: pointer;
  }
  .codeWhite-table strong{
    /* font-weight: 400; */
    font-weight: normal;
  }
  .codeWhite-table tr:hover {
    color: orange;
  }
  .codeWhiteFunc-btn {
    background: white;
    width: 96px;
    color: #fc9153;
    border-radius: 4px;
    float: right;
    margin-left: 15px;
    border: 1px solid #fc9153;
    height: 28px;
  }
  .codeWhiteFunc-btn:hover {
    background: #fff7f2;
  }
  .dialog-footer {
    /* margin-top: -30px; */
    /* margin-bottom: 10px; */
  }
  .gitUrl {
    cursor: pointer;
  }
  .gitUrl:hover {
    color: #fc9153;
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
  .codeSearch {
    margin-left: 6px;
    cursor: pointer;
    height: 15px;
    width: 15px;
    vertical-align: middle;
  }
  .copyIcon{
    cursor: pointer;
    font-size: 16px;
    position: relative;
    top: 3px;
  }
  .dorado-sensitive{
    cursor: pointer;
    font-size: 13px;
    position: relative;
    top: 3px;
  }
  .git-relative-path-warning{
    margin-top: 10px;
    border: 1px solid rgb(236, 147, 70);
    background-color: #fff7e6;
    border-radius: 6px;
    line-height: 17px;
    padding: 5px;
    font-size: 10px;;
    color: rgb(236, 147, 70);
    .git-relative-path-a{
      color: rgb(91, 153, 243) !important;
    }
  }
</style>
