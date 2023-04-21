<template>
  <div class="evaluation-selfeva">
    <h6 class="evaluation-selfeva__title">安全评估项目 - 评估对象自评估</h6>
    <!-- 评估内容 -->
    <el-form label-suffix="：">
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
          <el-form-item label="自评估列表" style="margin-bottom:0px;">
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
                    <el-form-item label="自评结果">
                      <el-select v-model="form.selfAssessmentResult" clearable placeholder="自评结果">
                        <el-option v-for="o in dictAssessmentSelf" :key="o.id" :label="o.dName" :value="o.id"></el-option>
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
            <el-table-column prop="check_item" min-width="240" label="检查项">
              <template slot-scope="scope">
                <p class="check_item_content" v-html="scope.row.check_content"></p>
              </template>
            </el-table-column>
            <el-table-column prop="assessment_self_ret_name" width="100" label="自评结果">
            </el-table-column>
            <el-table-column prop="" width="150" label="整改负责人">
              <template slot-scope="scope">
                <div style="white-space:normal;">
                  <user-link v-for="item in (scope.row.repair_user||[])" :key="item.data_id" :email="item.user_email">{{item.user_name}}&nbsp;&nbsp;</user-link>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="assessment_ret_name" width="100" label="评估结果">
            </el-table-column> -->
            <!-- <el-table-column prop="assessment_user_name" width="100" label="评估操作人">
            </el-table-column> -->
            <!-- <el-table-column prop="repair_ret_name" width="100" label="整改结果">
            </el-table-column> -->
            <!-- <el-table-column prop="repair_user_name" width="90" label="整改操作人">
              <template slot-scope="scope">
                <user-link :email="scope.row.repair_user_email" :key="scope.row.repair_user_id">{{scope.row.repair_user_name}}&nbsp;&nbsp;</user-link>
              </template>
            </el-table-column> -->
            <el-table-column prop="assessment_self_time" width="160" label="自评时间">
            </el-table-column>
            <el-table-column prop="assessment_self_user_name" width="120" label="自评操作人">
              <template slot-scope="scope">
                <user-link :key="scope.row.assessment_self_user_id" :email="scope.row.assessment_self_user_email">{{scope.row.assessment_self_user_name}}&nbsp;&nbsp;</user-link>
              </template>
            </el-table-column>
            <el-table-column prop="action" width="160" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="()=>showDetail(scope.row)">查看</el-button>
                <el-button size="mini" type="primary" @click="()=>showSelfEva(scope.row)">自评</el-button>
              </template>
            </el-table-column>
          </sdl-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="text-center" style="margin-top:20px;">
          <el-button type="primary" @click="submit()">提交</el-button>
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
            <el-form-item label="整改负责人" prop="revision_mgrs" :label-width="formLabelWidth">
              <span v-if="vulDetail.repair_user">
                <user-link v-for="item in (vulDetail.repair_user||[])" :key="item.data_id" :email="item.user_email">{{item.user_name}}&nbsp;&nbsp;</user-link>
              </span>
              <span v-else>-</span>
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

      </el-form>
    </el-dialog>

    <!-- 自评估 -->
    <el-dialog title="安全合规评估 - 安全评估详细信息" width="65%" :visible.sync="dialogSelfEvaV">
      <el-form :model="vulDetail" label-suffix="：" label-width="140px">
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
          <el-col :span="12">
            <el-form-item class="is-required" label="自评结果" prop="assessment_self_ret" :label-width="'120px'">
              <el-select clearable v-model="vulDetail.assessment_self_ret" placeholder="选择结果" @change="changeSelfRet">
                <el-option v-for="o in dictAssessmentSelf" :key="o.id" :label="o.dName" :value="o.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="selfEvaFieldShow">
            <el-form-item class="is-required" label="计划完成时间" prop="plan_time" :label-width="'120px'">
              <el-date-picker v-model="vulDetail.plan_time" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" v-if="selfEvaFieldShow">
            <el-form-item class="is-required" label="整改负责人" prop="repair_user" :label-width="'120px'">
              <el-select v-model="vulDetail.repair_user" remote multiple reserve-keyword :remote-method="empSearchList" :placeholder="$t('manage.select')" filterable style="width: 100%;" clearable>
                <el-option v-for="item in empOptions" :key="item.user_id" :label="item.user_name" :value="item.user_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" v-if="selfEvaFieldShow">
            <el-form-item label="整改计划" :label-width="'120px'">
              <el-input type="textarea" :autosize="{minRows:4}" placeholder="请输入" v-model="vulDetail.revision_plan"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text-center">
            <el-button type="primary" @click="saveEvaItem()">保存</el-button>
            <el-button @click="closeDlg()">取消</el-button>
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

      dictEvaContents: [], // 评估分类

      dictAssessment: [], // 评估
      dictReapir: [], // 整改
      dictCheck: [], // 检查
      dictAssessmentSelf: [], // 自评结果

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
    },
    selfEvaFieldShow() {
      if (this.vulDetail.assessment_self_ret
        && (
          this.vulDetail.assessment_self_ret == 1942
          || this.vulDetail.assessment_self_ret == 1943)) {
        return true

      } else {
        return false
      }
    }
  },
  methods: {
    //   保存评估检查项
    saveEvaItem() {
      let { id, assessment_self_ret, plan_time } = this.vulDetail
      if (assessment_self_ret == '' || assessment_self_ret == null) {
        this.$message({
          message: '请选择自评结果',
          type: 'warning'
        });
        return false
      }
      if (this.selfEvaFieldShow && !plan_time) {
        this.$message({
          message: '请选择计划完成时间',
          type: 'warning'
        });
        return false
      }
      if (this.vulDetail.repair_user && this.vulDetail.repair_user.length == 0 && this.selfEvaFieldShow) {
        this.$message({
          message: '请选择整改负责人',
          type: 'warning'
        });
        return false
      }
      let params = {}
      params['id'] = id;
      params['assessment_self_ret'] = assessment_self_ret
      if (this.selfEvaFieldShow) {
        params['plan_time'] = this.vulDetail.plan_time
        params['repair_user'] = this.vulDetail.repair_user.map((item) => ({ user_id: item }))
        params['revision_plan'] = this.vulDetail.revision_plan
      }


      const that = this;
      this.$http.post('sa/project/object/scope/assessmentSelf', params)
        .then(({ body }) => {
          if (body.errno == 0) {
            that.$message({
              type: 'success',
              message: '保存成功!'
            });
            that.search()
            that.closeDlg()
          } else {
            that.$message({
              type: 'warning',
              message: '错误：' + body.errmsg
            });
          }
        })
    },
    vulListParams() {
      let params = {
        page_type: 2 // 安全评估页面
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
    onSearch() {
      this.$refs.selfEvaTableList.reload(false)
    },
    search() {
      this.$refs.selfEvaTableList.reload(false)
    },
    // 保存 评估对象 自评估提交
    submit() {
      const id = this.$route.query.id
      let that = this;
      this.$http.post('sa/project/object/assessmentSelf', { id })
        .then(({ body }) => {
          if (body.errno == 0) {
            that.$message({
              type: 'success',
              message: '保存成功!'
            });
            this.back()
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
        path: `/compliance/evaluation/bp/selfeva?source=1&id=${this.project_id}`
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
    // 自评结果
    getDictAssessmentSelf() {
      this.$http.get('/dictionary/listByDataAuth/1940').then(({ body }) => {
        if (body.errno == 0) {
          this.dictAssessmentSelf = body.data
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
    // 检查结果
    getDictCheck() {
      this.$http.get('/dictionary/listByDataAuth/1960').then(({ body }) => {
        if (body.errno == 0) {
          this.dictCheck = body.data
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
      this.id = id;
      this.project_id = project_id
      this.business_id = business_id;
      this.object_id = object_id;
      this.source = source

      this.getEvaObjectDetail(id)
      this.getDictEvaContent()

      this.getDictAssessment()
      this.getDictAssessmentSelf()
      this.getDictReapir()
      this.getDictCheck()
      this.getDictDataStartState()
    },
    // show detail
    showDetail(row) {
      const { id } = row
      this.getVulDetail(id)
        .then((data) => {
          this.vulDetail = data
          this.dialogDetailV = true
        })
    },
    // show selfEva
    showSelfEva(row) {
      const { id } = row
      this.getVulDetail(id)
        .then((data) => {
          if (data.plan_time) {
            data.plan_time = moment(data.plan_time).format('YYYY-MM-DD')
          }
          if (!data.repair_user) {
            data.repair_user = []
          } else {
            this.empOptions = data.repair_user.map((item) => ({
              user_id: item.user_id,
              user_name: item.user_name + '(' + item.user_email + ')'
            }))
            data.repair_user = data.repair_user.map((item) => item.user_id)
          }
          if (data.assessment_self_ret == 0) {
            data.assessment_self_ret = ''
          }
          this.vulDetail = data;
          this.dialogSelfEvaV = true

        })
    },
    closeDlg() {
      this.dialogDetailV = false
      this.dialogSelfEvaV = false
      this.selfEvaFieldShow = true
    },
    getVulDetail(id) {
      return this.$http.get('/sa/vulnerability/info', { params: { id, source: this.source } }).then(({ body }) => {
        if (body.errno == 0) {
          const data = body.data
          return data;
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
