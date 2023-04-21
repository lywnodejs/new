<template>
  <div class="evaluation-selfeva">
    <h6 class="evaluation-selfeva__title">安全评估项目 - 安全隐患整改</h6>
    <!-- 评估内容 -->
    <el-form label-suffix=": ">
      <el-row>
        <el-col :span="8">
          <el-form-item label="评估对象">
            {{evaObjInfo.object_name}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="评估接口人">
            <user-link v-for="f in (evaObjInfo.users||[])" :key="f.user_id" :email="f.user_email">{{f.user_name}}&nbsp;&nbsp;</user-link>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="自评估列表" class="eval-list-container">
            <p>
              <el-form v-model="form" class="demo-form-inline" label-suffix=": " :label-width="'100px'">
                <el-row type="flex" class="row-bg" justify="end">

                  <el-col :span="5">
                    <el-form-item label="评估分类">
                      <el-select clearable v-model="form.evaKind" placeholder="选择分类">
                        <el-option v-for="o in dictEvaContents" :key="o.id" :label="o.dName" :value="o.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="5">
                    <el-form-item label="整改结果">
                      <el-select v-model="form.repairResult" clearable placeholder="选择结果">
                        <el-option v-for="o in dictReapir" :key="o.id" :label="o.dName" :value="o.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="2" class="text-center">
                    <el-button type="primary" @click="onSearch">查询</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </p>

          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <sdl-table :url="url" :query-params="vulListParams" ref="selfEvaTableList" border style="width: 100%">
            <el-table-column prop="scope_name" label="评估内容" width="180">
            </el-table-column>
            <el-table-column prop="check_item" min-width="240" label="检查项/问题描述">
              <template slot-scope="scope">
                <p class="check_item_content" v-html="scope.row.check_content"></p>
              </template>
            </el-table-column>
            <el-table-column prop="assessment_self_ret_name" width="100" label="自评结果">
            </el-table-column>
            <el-table-column prop="assessment_self_user_name" width="110" label="自评操作人">
              <template slot-scope="scope">
                <user-link :email="scope.row.assessment_self_user_email" :key="scope.row.assessment_self_user_id">{{scope.row.assessment_self_user_name}}&nbsp;&nbsp;</user-link>
              </template>
            </el-table-column>
            <el-table-column prop="assessment_ret_name" width="110" label="评估结果">
            </el-table-column>
            <el-table-column prop="assessment_user_name" width="110" label="评估操作人">
            </el-table-column>
            <el-table-column prop="repair_ret_name" width="110" label="整改结果">
            </el-table-column>
            <el-table-column prop="repair_user_name" width="110" label="整改操作人">
              <template slot-scope="scope">
                <user-link :email="scope.row.repair_user_email" :key="scope.row.repair_user_id">{{scope.row.repair_user_name}}&nbsp;&nbsp;</user-link>
              </template>
            </el-table-column>

            <el-table-column prop="action" width="160" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="()=>showDetail(scope.row)">查看</el-button>
                <el-button size="mini" type="primary" @click="()=>showSelfEva(scope.row)">整改</el-button>
              </template>
            </el-table-column>
          </sdl-table>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-col :span="24" class="text-center">
          <el-button type="primary" @click="onSubmit()">提交</el-button>
          <el-button @click="back()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 查看详情 -->
    <el-dialog title="安全合规评估 - 安全评估详细信息" width="65%" :visible.sync="dialogDetailV">
      <el-form :model="vulDetail" label-suffix="：" label-width="130px">
        <el-form-item label="评估分类" prop="scope_name" :label-width="formLabelWidth">
          {{vulDetail.scope_name}}
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="检查项" :label-width="formLabelWidth">
              <p class="check_item_content" v-html="vulDetail.check_content"></p>
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
            <el-form-item label="自评结果" prop="assessment_self_ret_name" :label-width="formLabelWidth">
              {{vulDetail.assessment_self_ret_name?vulDetail.assessment_self_ret_name:'-'}}
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自评完成时间" prop="assessment_self_time" :label-width="formLabelWidth">
              {{vulDetail.assessment_self_time?vulDetail.assessment_self_time:'-'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="整改负责人" prop="repair_user" :label-width="formLabelWidth">
              <user-link v-for="f in (vulDetail.repair_user||[])" :key="f.user_id" :email="f.user_email">{{f.user_name}}&nbsp;&nbsp;</user-link>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自评操作人" :label-width="formLabelWidth">
              <user-link v-if="vulDetail.assessment_self_user_email" :email="vulDetail.assessment_self_user_email">{{vulDetail.assessment_self_user_name}}&nbsp;&nbsp;</user-link>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划完成时间" prop="plan_time" :label-width="formLabelWidth">
              {{vulDetail.plan_time?vulDetail.plan_time:'-'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改计划" :label-width="formLabelWidth">
              <p v-if="vulDetail.revision_plan" class="check_item_content" v-html="vulDetail.revision_plan"></p>
              <span v-else>-</span>
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
            <el-form-item label="评估结果" prop="assessment_ret_name" :label-width="formLabelWidth">
              {{vulDetail.assessment_ret_name?vulDetail.assessment_ret_name:'-'}}
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="风险等级" prop="risk_level_name" :label-width="formLabelWidth">
              {{vulDetail.risk_level_name?vulDetail.risk_level_name:'-'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="评估人" prop="assessment_user_name" :label-width="formLabelWidth">
              <user-link v-if="vulDetail.assessment_user_email" :email="vulDetail.assessment_user_email">{{vulDetail.assessment_user_name}}&nbsp;&nbsp;</user-link>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="评估完成时间" prop="assessment_time" :label-width="formLabelWidth">
              {{vulDetail.assessment_time?vulDetail.assessment_time:'-'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述" :label-width="formLabelWidth">
              <p v-if="vulDetail.question" class="check_item_content" v-html="vulDetail.question"></p>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改建议" :label-width="formLabelWidth">
              <p v-if="vulDetail.proposal" class="check_item_content" v-html="vulDetail.proposal"></p>
              <span v-else>-</span>
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
            <el-form-item label="整改操作人" prop="repair_user_name" :label-width="formLabelWidth">
              <user-link v-if="vulDetail.repair_user_email" :email="vulDetail.repair_user_email">{{vulDetail.repair_user_name}}&nbsp;&nbsp;</user-link>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="整改完成时间" prop="repair_time" :label-width="formLabelWidth">
              {{vulDetail.repair_time?vulDetail.repair_time:'-'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改备注" :label-width="formLabelWidth">
              <p v-if="vulDetail.repair_description" class="check_item_content" v-html="vulDetail.repair_description"></p>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 整改 -->
    <el-dialog title="安全合规评估 - 安全隐患整改" width="70%" :visible.sync="dialogSelfEvaV">
      <el-form :model="vulDetail" label-suffix="：" label-width="130px">
        <el-form-item label="评估分类" prop="scope_name" :label-width="formLabelWidth">
          {{vulDetail.scope_name}}
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="检查项" :label-width="formLabelWidth">
              <p class="check_item_content" v-html="vulDetail.check_content"></p>
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
            <el-form-item label="自评结果" prop="assessment_self_ret_name" :label-width="formLabelWidth">
              {{vulDetail.assessment_self_ret_name}}
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自评完成时间" prop="assessment_self_time" :label-width="formLabelWidth">
              {{vulDetail.assessment_self_time}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="整改负责人" prop="repair_user" :label-width="formLabelWidth">
              <user-link v-for="f in (vulDetail.repair_user||[])" :key="f.user_id" :email="f.user_email">{{f.user_name}}&nbsp;&nbsp;</user-link>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="自评操作人" :label-width="formLabelWidth">
              <user-link :email="vulDetail.assessment_self_user_email">{{vulDetail.assessment_self_user_name}}&nbsp;&nbsp;</user-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划完成时间" prop="plan_time" :label-width="formLabelWidth">
              {{vulDetail.plan_time}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改计划" :label-width="formLabelWidth">
              <p class="check_item_content" v-html="vulDetail.revision_plan"></p>
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
            <el-form-item label="评估结果" prop="assessment_ret_name" :label-width="formLabelWidth">
              {{vulDetail.assessment_ret_name}}
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="风险等级" prop="risk_level_name" :label-width="formLabelWidth">
              {{vulDetail.risk_level_name}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="评估人" prop="assessment_user_name" :label-width="formLabelWidth">
              <user-link :email="vulDetail.assessment_user_email">{{vulDetail.assessment_user_name}}&nbsp;&nbsp;</user-link>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="评估完成时间" prop="assessment_time" :label-width="formLabelWidth">
              {{vulDetail.assessment_time}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述" :label-width="formLabelWidth">
              <p class="check_item_content" v-html="vulDetail.question"></p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="整改建议" :label-width="formLabelWidth">
              <p class="check_item_content" v-html="vulDetail.proposal"></p>
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
            <el-form-item label="整改结果" prop="repair_ret" :label-width="formLabelWidth">
              <el-select v-model="vulDetail.repair_ret" clearable placeholder="选择结果">
                <el-option v-for="o in dictReapir" :key="o.id" :label="o.dName" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-if="vulDetail.repair_ret==1952">
            <el-form-item label="整改完成时间" prop="repair_time" :label-width="formLabelWidth">
              <el-date-picker v-model="vulDetail.repair_time" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="vulDetail.repair_ret==1952">
          <el-col :span="24">
            <el-form-item label="整改备注" prop="repair_description" :label-width="formLabelWidth">
              <el-input type="textarea" :rows="5" resize="none" placeholder="请输入内容" v-model="vulDetail.repair_description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="text-center">
            <el-button type="primary" @click="saveEvaItem">保 存</el-button>
            <el-button @click="closeDlg">关闭</el-button>
          </el-col>
        </el-row>
      </el-form>
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
      url: '/sa/vulnerability/list', //安全隐患列表查询
      form: {
        evaKind: '', //评估分类
        selfAssessmentResult: '', //自评结果
        assessmentResult: '',// 评估结果
        reapirResult: '',// 整改结果
        checkResult: '',// 检查结果
      },
      evaObjInfo: {},
      dictAssessmentSelf: [], //自评估结果
      dictEvaContents: [], // 评估分类
      dictAssessment: [], // 评估
      dictReapir: [], // 整改
      dictCheck: [], // 检查

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
    showRepair() {
      this.dialogSelfEvaV = true
    },
    hideRepair() {
      this.dialogSelfEvaV = false
    },
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
      if (this.vulDetail.repair_ret == 1952 && !this.vulDetail.repair_time) {
        this.$message({
          message: '请选择整改完成时间',
          type: 'warning'
        });
        return false
      }
      let params = {}
      params['id'] = id;
      params['repair_ret'] = repair_ret
      if (repair_ret == 1952) {
        params['repair_time'] = moment(this.vulDetail.repair_time).format('YYYY-MM-DD')
        params['repair_description'] = this.vulDetail.repair_description
      }
      /*  else {
        params['repair_time'] = moment().format('YYYY-MM-DD')
      } */
      let that = this;

      this.$http.post('/sa/project/object/scope/repair', params)
        .then(({ body }) => {
          if (body.errno == 0) {
            that.$message({
              type: 'success',
              message: '保存成功!'
            });
            that.search(false)
            that.closeDlg()
          } else {
            that.$message({
              type: 'warning',
              message: '删除失败：' + body.errmsg
            });
          }
        })
    },
    vulListParams() {
      let params = {
        page_type: 4 // 整改页面
      }
      params['project_id'] = this.project_id
      params['business_id'] = this.business_id
      params['object_id'] = this.object_id
      params['source'] = this.source
      //   scope_type 评估分类 
      // assessment_self_ret 自评结果
      if (this.form.evaKind) {
        params['scope_type'] = this.form.evaKind
      }
      if (this.form.repairResult) {
        params['repair_ret'] = this.form.repairResult
      }
      if (this.form.assessmentResult) {
        params['assessment_ret'] = this.form.assessmentResult
      }
      if (this.form.checkResult) {
        params['check_ret'] = this.form.checkResult
      }
      if (this.form.selfAssessmentResult) {
        params['assessment_self_ret'] = this.form.selfAssessmentResult
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
    onSearch(st = true) {
      this.$refs.selfEvaTableList.reload(st)
    },
    search(st = true) {
      this.$refs.selfEvaTableList.reload(st)
    },
    // 保存 评估对象 自评估提交
    onSubmit() {
      const id = this.id
      const that = this;
      this.$http.post('/sa/project/object/repair', { id })
        .then(({ body }) => {
          if (body.errno == 0) {
            that.$message({
              type: 'success',
              message: '保存成功!'
            });
            that.back()
          } else {
            that.$message({
              type: 'warning',
              message: '删除失败：' + body.errmsg
            });
          }
        })
    },
    back() {
      this.$router.push({
        path: `/compliance/evaluation/bp/repair?source=1&id=${this.project_id}`
      })
    },
    // 获取评估分类（评估内容）
    getDictEvaContent() {
      this.$http.get('/dictionary/listByDataAuth/1730').then(({ body }) => {
        if (body.errno == 0) {
          this.dictEvaContents = body.data
        }
      })
    },

    // 评估结果
    getDictAssessment() {
      this.$http.get('/dictionary/listByDataAuth/1720').then(({ body }) => {
        if (body.errno == 0) {
          this.dictAssessment = body.data
        }
      })
    },
    // 整改结果
    getDictReapir() {
      this.$http.get('/dictionary/listByDataAuth/1950').then(({ body }) => {
        if (body.errno == 0) {
          this.dictReapir = body.data
        }
      })
    },
    // 检查
    getDictCheck() {
      this.$http.get('/dictionary/listByDataAuth/1960').then(({ body }) => {
        if (body.errno == 0) {
          this.dictCheck = body.data
        }
      })
    },
    // 自评结果
    getDictAssessmentSelf() {
      this.$http.get('/dictionary/listByDataAuth/1940').then(({ body }) => {
        if (body.errno == 0) {
          this.dictAssessmentSelf = body.data
        }
      })
    },
    // 获取评估对象详情
    getEvaObjectDetail(id) {
      this.$http.get('sa/project/object/info', { params: { id } }).then(({ body }) => {
        if (body.errno == 0) {
          const data = body.data
          this.evaObjInfo = data
        } else {
          this.$message({
            type: 'error',
            message: '错误' + data.errmsg
          });
        }

      })
    },

    // 安全隐患列表查询 自评估的
    _initPage() {
      const { id, project_id, business_id, object_id, source } = this.$route.query
      this.id = id * 1;
      this.project_id = project_id * 1
      this.business_id = business_id * 1;
      this.object_id = object_id * 1;
      this.source = source

      this.getEvaObjectDetail(id)
      this.getDictEvaContent()
      this.getDictAssessmentSelf()
      this.getDictAssessment()
      this.getDictReapir()
      this.getDictCheck()
      this.getDictDataStartState()
    },
    // show detail
    showDetail(row) {
      const { id } = row
      this.getVulDetail(id)
        .then((data) => {
          if (!data) {
            return false
          }
          this.vulDetail = data
          this.dialogDetailV = true
        })
    },
    // show selfEva
    showSelfEva(row) {
      const { id } = row
      this.getVulDetail(id)
        .then((data) => {
          if (!data) {
            return false
          }
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
    getVulDetail(id) {
      return this.$http.get('/sa/vulnerability/info', { params: { id, source: this.source } }).then(({ body }) => {
        if (body.errno == 0 && body.data) {
          let dt = body.data
          if (dt.repair_ret == 0) {
            dt.repair_ret = ''
          }
          if (!dt.repair_time) {
            dt.repair_time = ""
          } else {
            dt.repair_time = moment(dt.repair_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')
          }
          return dt;
        } else {
          this.$message({
            type: 'error',
            message: '错误' + body.errmsg
          });
        }
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
