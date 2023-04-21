<template>
  <div class="evaluation-selfeva">
    <h6 class="evaluation-selfeva__title">安全评估项目-评估对象自评估</h6>
    <el-form>
      <el-row>
        <el-col :span="8">
          <el-form-item label="评估对象">
            {{evaObjInfo.object_name}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="评估接口人">
            <user-link v-for="f in evaObjInfo.users"
                       :key="f.user_id"
                       :email="f.user_email">{{f.user_name}}&nbsp;&nbsp;</user-link>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="自评估列表"
                        class="eval-list-container">
            <el-form :inline="true"
                     v-model="form"
                     class="demo-form-inline">
              <el-form-item label="评估分类">
                <el-select clearable
                           v-model="form.evaKind"
                           placeholder="选择分类">
                  <el-option v-for="o in dictEvaContents"
                             :key="o.id"
                             :label="o.dName"
                             :value="o.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="整改结果">
                <el-select v-model="form.repairResult"
                           clearable
                           placeholder="选择结果">
                  <el-option v-for="o in dictSelfEvaRs"
                             :key="o.id"
                             :label="o.dName"
                             :value="o.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"
                           @click="onSearch">查询</el-button>
              </el-form-item>
              <sdl-table :url="url"
                         :query-params="vulListParams"
                         ref="selfEvaTableList"
                         border
                         style="width: 100%">
                <el-table-column prop="scope_name"
                                 label="评估内容"
                                 width="180">
                </el-table-column>
                <el-table-column prop="name"
                                 min-width="240"
                                 label="检查项/问题描述">
                  <template slot-scope="scope">
                    <p class="check_item_content"
                       v-html="scope.row.check_item.content"></p>
                  </template>
                </el-table-column>
                <el-table-column prop="assessment_self_ret_name"
                                 width="100"
                                 label="自评结果">
                </el-table-column>
                <el-table-column prop="assessment_self_user_name"
                                 width="100"
                                 label="自评操作人">
                </el-table-column>
                <el-table-column prop="assessment_ret_name"
                                 width="100"
                                 label="评估结果">
                </el-table-column>
                <el-table-column prop="assessment_user_name"
                                 width="100"
                                 label="评估操作人">
                </el-table-column>
                <el-table-column prop="repair_ret_name"
                                 width="100"
                                 label="整改结果">
                </el-table-column>
                <el-table-column prop="repair_user_name"
                                 width="100"
                                 label="整改操作人">
                </el-table-column>

                <el-table-column prop="action"
                                 width="150"
                                 label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini"
                               @click="()=>showDetail(scope.row)">查看</el-button>
                    <el-button size="mini"
                               type="primary"
                               @click="()=>showSelfEva(scope.row)">整改</el-button>
                  </template>
                </el-table-column>
              </sdl-table>
            </el-form>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24"
                class="text-center">
          <el-button type="primary"
                     @click="onSubmit">提交</el-button>
          <el-button @click="back()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 查看详情 -->
    <el-dialog title="安全合规评估 - 安全评估详细信息"
               @closed="onCloseDlg"
               width="65%"
               :visible.sync="dialogDetailV">
      <el-form :model="vulDetail">
        <el-form-item label="评估分类"
                      prop="scope_name"
                      :label-width="formLabelWidth">
          {{vulDetail.scope_name}}
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="检查项"
                          :label-width="formLabelWidth">
              <p class="check_item_content"
                 v-html="vulDetail.check_item && vulDetail.check_item.content"></p>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 分隔符 -->
        <el-row>
          <el-col :span="24">
            <hr />
          </el-col>
        </el-row>
        <!-- 自评结果 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="自评结果"
                          prop="assessment_self_ret_name"
                          :label-width="formLabelWidth">
              {{vulDetail.assessment_self_ret_name}}
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自评完成时间"
                          prop="assessment_self_time"
                          :label-width="formLabelWidth">
              {{vulDetail.assessment_self_time}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="整改负责人"
                          prop="revision_mgrs"
                          :label-width="formLabelWidth">
              <user-link v-for="f in vulDetail.revision_mgrs"
                         :key="f.user_id"
                         :email="f.user_email">{{f.user_name}}&nbsp;&nbsp;</user-link>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自评操作人"
                          :label-width="formLabelWidth">
              <user-link :email="vulDetail.assessment_self_user_email">{{vulDetail.assessment_self_user_name}}&nbsp;&nbsp;</user-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划完成时间"
                          prop="plan_time"
                          :label-width="formLabelWidth">
              {{vulDetail.plan_time}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改计划"
                          :label-width="formLabelWidth">
              <p class="check_item_content"
                 v-html="vulDetail.revision_plan"></p>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 分隔符 -->
        <el-row>
          <el-col :span="24">
            <hr />
          </el-col>
        </el-row>
        <!-- 评估结果 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="评估结果"
                          prop="assessment_ret_name"
                          :label-width="formLabelWidth">
              {{vulDetail.assessment_ret_name}}
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="风险等级"
                          prop="risk_level_name"
                          :label-width="formLabelWidth">
              {{vulDetail.risk_level_name}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="评估人"
                          prop="assessment_user_name"
                          :label-width="formLabelWidth">
              <user-link :email="vulDetail.assessment_user_email">{{vulDetail.assessment_user_name}}&nbsp;&nbsp;</user-link>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="评估完成时间"
                          prop="assessment_time"
                          :label-width="formLabelWidth">
              {{vulDetail.assessment_time}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述"
                          :label-width="formLabelWidth">
              <p class="check_item_content"
                 v-html="vulDetail.question"></p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改建议"
                          :label-width="formLabelWidth">
              <p class="check_item_content"
                 v-html="vulDetail.proposal"></p>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 分隔符 -->
        <el-row>
          <el-col :span="24">
            <hr />
          </el-col>
        </el-row>
        <!-- 整改 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="整改操作人"
                          prop="repair_user_name"
                          :label-width="formLabelWidth">
              <user-link :email="vulDetail.repair_user_email">{{vulDetail.repair_user_name}}&nbsp;&nbsp;</user-link>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="整改完成时间"
                          prop="repair_time"
                          :label-width="formLabelWidth">
              {{vulDetail.repair_time}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改备注"
                          :label-width="formLabelWidth">
              <p class="check_item_content"
                 v-html="vulDetail.repair_description"></p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 整改 -->
    <el-dialog title="安全合规评估 - 安全隐患整改"
               width="70%"
               @closed="onCloseDlg"
               :visible.sync="dialogSelfEvaV">
      <el-form :model="vulDetail">
        <el-form-item label="评估分类"
                      prop="scope_name"
                      :label-width="formLabelWidth">
          {{vulDetail.scope_name}}
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="检查项"
                          :label-width="formLabelWidth">
              <p class="check_item_content"
                 v-html="vulDetail.check_item && vulDetail.check_item.content"></p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <hr />
          </el-col>
        </el-row>
        <!-- 自评结果 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="自评结果"
                          prop="assessment_self_ret_name"
                          :label-width="formLabelWidth">
              {{vulDetail.assessment_self_ret_name}}
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自评完成时间"
                          prop="assessment_self_time"
                          :label-width="formLabelWidth">
              {{vulDetail.assessment_self_time}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="整改负责人"
                          prop="revision_mgrs"
                          :label-width="formLabelWidth">
              <user-link v-for="f in vulDetail.revision_mgrs"
                         :key="f.user_id"
                         :email="f.user_email">{{f.user_name}}&nbsp;&nbsp;</user-link>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自评操作人"
                          :label-width="formLabelWidth">
              <user-link :email="vulDetail.assessment_self_user_email">{{vulDetail.assessment_self_user_name}}&nbsp;&nbsp;</user-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划完成时间"
                          prop="plan_time"
                          :label-width="formLabelWidth">
              {{vulDetail.plan_time}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改计划"
                          :label-width="formLabelWidth">
              <p class="check_item_content"
                 v-html="vulDetail.revision_plan"></p>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 分隔符 -->
        <el-row>
          <el-col :span="24">
            <hr />
          </el-col>
        </el-row>
        <!-- 评估结果 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="评估结果"
                          prop="assessment_ret_name"
                          :label-width="formLabelWidth">
              {{vulDetail.assessment_ret_name}}
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="风险等级"
                          prop="risk_level_name"
                          :label-width="formLabelWidth">
              {{vulDetail.risk_level_name}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="评估人"
                          prop="assessment_user_name"
                          :label-width="formLabelWidth">
              <user-link :email="vulDetail.assessment_user_email">{{vulDetail.assessment_user_name}}&nbsp;&nbsp;</user-link>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="评估完成时间"
                          prop="assessment_time"
                          :label-width="formLabelWidth">
              {{vulDetail.assessment_time}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述"
                          :label-width="formLabelWidth">
              <p class="check_item_content"
                 v-html="vulDetail.question"></p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改建议"
                          :label-width="formLabelWidth">
              <p class="check_item_content"
                 v-html="vulDetail.proposal"></p>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 分隔符 -->
        <el-row>
          <el-col :span="24">
            <hr />
          </el-col>
        </el-row>
        <!-- 整改 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="整改结果"
                          prop="repair_ret"
                          :label-width="formLabelWidth">
              <el-select v-model="vulDetail.repair_ret"
                         clearable
                         placeholder="选择结果">
                <el-option v-for="o in dictSelfEvaRs"
                           :key="o.id"
                           :label="o.dName"
                           :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="整改完成时间"
                          prop="repair_time"
                          :label-width="formLabelWidth">
              <el-date-picker v-model="vulDetail.repair_time"
                              type="datetime"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改备注"
                          prop="repair_description"
                          :label-width="formLabelWidth">
              <el-input type="textarea"
                        :rows="5"
                        resize="none"
                        placeholder="请输入内容"
                        v-model="vulDetail.repair_description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="saveEvaItem">保 存</el-button>
        <el-button @click="closeDlg">关闭</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>

import dataMixin from '../../mixins/data'
import moment from 'moment'
export default {

  mixins: [dataMixin],
  data() {
    return {
      url: '/sa/vulnerability/list_repair', //安全隐患列表查询
      form: {
        evaKind: '', //评估分类
        repairResult: '' //自评结果
      },
      evaObjInfo: {},

      dictEvaContents: [],
      dictSelfEvaRs: [],

      dialogDetailV: false,
      dialogSelfEvaV: false,
      formLabelWidth: '110px',
      //   安全隐患数据详情
      vulDetail: {},
      revision_mgrs: []
    }
  },
  computed: {
    queryParams: function () {
      let paramStr = ''
      for (let [key, value] of Object.entries(this.vulListParams())) {
        paramStr += key + '=' + value + '&'
      }
      return paramStr.substring(0, paramStr.length - 1)
    },
    showMore() {
      if (this.vulDetail.assessment_self_ret && (this.vulDetail.assessment_self_ret == 1743 || this.vulDetail.assessment_self_ret == 1742)) {
        return true
      }
      return false
    }
  },
  methods: {
    //   保存评估检查项
    saveEvaItem() {
      let { id, repair_ret } = this.vulDetail
      if (repair_ret == '' || repair_ret == null) {
        this.$message({
          message: '请选整改结果',
          type: 'warning'
        });
        return false
      }
      if (!this.vulDetail.repair_time) {
        this.$message({
          message: '请选择修复时间',
          type: 'warning'
        });
        return false
      }
      let params = {}
      params['id'] = id;
      params['repair_ret'] = repair_ret
      params['repair_time'] = this.vulDetail.repair_time
      params['repair_description'] = this.vulDetail.repair_description
      this.$http.post('sa/project/object/scope/repair', params)
        .then((data) => {
          this.closeDlg()
        })
    },
    vulListParams() {
      let params = {
        page_type: 4 // 安全整改
      }
      params['project_id'] = this.$route.params.projectId
      params['source'] = 1
      //   scope_type 评估分类 
      // assessment_self_ret 自评结果
      if (this.form.evaKind) {
        params['scope_type'] = this.form.evaKind
      }
      if (this.form.repairResult) {
        params['repair_ret'] = this.form.repairResult
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
    onSearch() {
      this.$refs.selfEvaTableList.reload()
    },
    // 保存 评估对象 自评估提交
    onSubmit() {
      const id = this.$route.query.id
      this.$http.post('sa/project/repair', { id })
        .then((data) => {
          this.back()
        })
    },
    back() {
      this.$router.back()
    },
    // 获取评估分类（评估内容）
    getDictEvaContent() {
      this.$http.get('/dictionary/listByDataAuth/1730').then(({ body }) => {
        this.dictEvaContents = body.data
      })
    },
    // 获取自评估结果
    getDictSelfEvaRs() {
      this.$http.get('/dictionary/listByDataAuth/1950').then(({ body }) => {
        this.dictSelfEvaRs = body.data
        console.log(body.data)
      })
    },
    // 获取评估对象详情
    getEvaObjectDetail(id) {
      this.$http.get('sa/project/object/info_1', { params: { id } }).then(({ body }) => {
        const data = body.data
        this.evaObjInfo = data
      })
    },
    // 安全隐患列表查询 自评估的
    _initPage() {
      const { id, projectId } = this.$route.query
      this.getEvaObjectDetail(id)
      this.getDictEvaContent()
      this.getDictSelfEvaRs()
    },
    // show detail
    showDetail(row) {

      const { id } = row
      this.getVulDetail(id, 1)
        .then((data) => {
          this.vulDetail = data;
          this.dialogDetailV = true
        })
    },
    // show selfEva
    showSelfEva(row) {
      const { id } = row
      this.getVulDetail(id, 1)
        .then((data) => {
          //   data.repair_time = moment(data.repair_time, 'YYYY-MM-DD')
          //   console.log(data.repair_time)
          this.vulDetail = data;
          this.dialogSelfEvaV = true
        })
    },
    closeDlg() {
      this.dialogDetailV = false
      this.dialogSelfEvaV = false
      this.vulDetail = {}
      this.revision_mgrs = []
    },
    onCloseDlg() {
      // 关闭对话框
      this.closeDlg()
    },
    getVulDetail(id, st) {
      return this.$http.get('sa/vulnerability/info_repair', { params: { id, source: 1 } }).then(({ body }) => {
        const data = body.data
        return data;
      })
    }
  },

  created() {
    this._initPage()
  }
}
</script>

<style lang="less">
.evaluation-selfeva {
  &__title {
    margin-bottom: 20px;
  }
  .eval-list-container {
    .el-form-item__content {
      text-align: right;
    }
  }

  .check_item_content {
    white-space: normal;
    text-align: left;
    word-break: break-all;
  }
  .el-select--small {
    width: 85%;
  }
}
</style>
