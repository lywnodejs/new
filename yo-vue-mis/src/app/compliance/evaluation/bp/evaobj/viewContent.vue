<template>
  <div class="evaluation-selfeva">
    <h6 class="evaluation-selfeva__title">安全评估项目 - 详细信息</h6>
    <!-- 评估内容 -->
    <el-form>
      <el-row>
        <el-col :span="24">
          <el-form-item label="" class="eval-list-container">

            <el-form v-model="form" class="demo-form-inline" label-suffix=": " :label-width="'100px'">
              <el-row type="flex" class="row-bg" justify="start">
                <el-col :span="4">
                  <el-form-item label="评估业务">
                    <el-select clearable v-model="form.business_id" placeholder="请选择">
                      <el-option v-for="o in businessList" :key="o.id" :label="o.business_name" :value="o.business_id"></el-option>
                    </el-select>
                  </el-form-item>

                </el-col>
                <el-col :span="4">
                  <el-form-item label="评估对象">
                    <el-select clearable v-model="form.object_id" placeholder="选择分类">
                      <el-option v-for="o in objectList" :key="o.id" :label="o.object_name" :value="o.object_id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item label="自评结果">
                    <el-select v-model="form.assessment_self_ret" clearable placeholder="请选择">
                      <el-option v-for="o in dictSelfAssessment" :key="o.id" :label="o.dName" :value="o.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="评估结果">
                    <el-select v-model="form.assessment_ret" clearable placeholder="评估结果">
                      <el-option v-for="o in dictAssessment" :key="o.id" :label="o.dName" :value="o.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="整改结果">
                    <el-select v-model="form.repair_ret" clearable placeholder="选择结果">
                      <el-option v-for="o in dictReapir" :key="o.id" :label="o.dName" :value="o.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="检查结果">
                    <el-select v-model="form.check_ret" clearable placeholder="检查结果">
                      <el-option v-for="o in dictCheck" :key="o.id" :label="o.dName" :value="o.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" class="row-bg" justify="end">
                <el-col :span="4" class="text-right">
                  <el-button type="primary" @click="onSearch">查询</el-button>
                </el-col>
              </el-row>
            </el-form>

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
            <el-table-column prop="assessment_self_user_name" width="100" label="自评操作人">
              <template slot-scope="scope">
                <user-link :email="scope.row.assessment_self_user_email" :key="scope.row.assessment_self_user_id">{{scope.row.assessment_self_user_name}}&nbsp;&nbsp;</user-link>
              </template>
            </el-table-column>
            <el-table-column prop="assessment_ret_name" width="100" label="评估结果">
            </el-table-column>
            <el-table-column prop="assessment_user_name" width="100" label="评估操作人">
            </el-table-column>
            <el-table-column prop="repair_ret_name" width="100" label="整改结果">
            </el-table-column>
            <el-table-column prop="repair_user_name" width="90" label="整改操作人">
              <template slot-scope="scope">
                <user-link :email="scope.row.repair_user_email" :key="scope.row.repair_user_id">{{scope.row.repair_user_name}}&nbsp;&nbsp;</user-link>
              </template>
            </el-table-column>

            <el-table-column prop="action" width="110" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="()=>showDetail(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </sdl-table>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-col :span="24" class="text-center">
          <el-button @click="back()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 查看详情 -->
    <el-dialog title="安全合规评估 - 安全评估详细信息" @closed="onCloseDlg" width="65%" :visible.sync="dialogDetailV">
      <el-form :model="vulDetail" label-suffix=": ">
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
        business_id: '',
        object_id: '',
        scope_type: '', //评估分类编号
        assessment_self_ret: '', //自评结果
        assessment_ret: '',// 评估结果
        repair_ret: '',// 整改结果
        check_ret: '',// 检查结果
      },
      evaObjInfo: {},

      businessList: [],  // 评估业务
      objectList: [], // 评估对象
      dictSelfAssessment: [], // 自评估结果
      dictAssessment: [], // 评估结果
      dictReapir: [], // 整改结果
      dictCheck: [], // 检查结果




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
    //   评估业务
    getBusinessList(project_id, source) {
      this.$http.get('sa/business/list', { params: { project_id, source } }).then(({ body }) => {
        this.businessList = body.data
      })
    },
    // 评估对象
    getObjectList(project_id, source, stat = 0) {
      this.$http.get('sa/object/list', { params: { project_id, stat, source } }).then(({ body }) => {
        this.objectList = body.data
      })
    },
    // 获取自评估结果
    getDictSelfAssessment() {
      this.$http.get('/dictionary/listByDataAuth/1940').then(({ body }) => {
        if (body.errno == 0) {
          this.dictSelfAssessment = body.data
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
    // 检查结果
    getDictCheck() {
      this.$http.get('/dictionary/listByDataAuth/1960').then(({ body }) => {
        if (body.errno == 0) {
          this.dictCheck = body.data
        }
      })
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
      params['repair_time'] = moment(this.vulDetail.repair_time).format('YYYY-MM-DD')
      params['repair_description'] = this.vulDetail.repair_description
      this.$http.post('sa/project/object/scope/repair', params)
        .then((data) => {
          this.closeDlg()
        })
    },
    vulListParams() {
      let params = {
        page_type: 1 // 安全评估页面
      }
      params['project_id'] = this.project_id
      params['scope_id'] = this.id // 评估内容刻录编号
      params['source'] = this.source
      //   scope_type 评估分类 
      // assessment_self_ret 自评结果
      /* 
       business_id: '',
        object_id: '',
        scope_type: '', //评估分类编号
        assessment_self_ret: '', //自评结果
        assessment_ret: '',// 评估结果
        repair_ret: '',// 整改结果
        check_ret: '',// 检查结果
      */
      if (this.form.business_id) {
        params['business_id'] = this.form.business_id
      }
      if (this.form.object_id) {
        params['object_id'] = this.form.object_id
      }
      if (this.form.assessment_self_ret) {
        params['assessment_self_ret'] = this.form.assessment_self_ret
      }
      if (this.form.assessment_ret) {
        params['assessment_ret'] = this.form.assessment_ret
      }
      if (this.form.repair_ret) {
        params['repair_ret'] = this.form.repair_ret
      }
      if (this.form.repair_ret) {
        params['check_ret'] = this.form.check_ret
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

    back() {
      this.$router.push({
        path: '/compliance/evaluation/'
      })
    },


    // 安全隐患列表查询 自评估的
    _initPage() {
      const { id, project_id, business_id, object_id, source } = this.$route.query
      this.id = id; //记录内容id
      this.project_id = project_id
      this.business_id = business_id;
      this.object_id = object_id;
      this.source = source
      this.getBusinessList(project_id, source)
      this.getObjectList(project_id, source)
      this.getDictSelfAssessment()
      this.getDictAssessment()
      this.getDictReapir()
      this.getDictCheck()

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
    getVulDetail(id) {
      return this.$http.get('/sa/vulnerability/info', { params: { id, source: this.source } }).then(({ body }) => {
        if (body.errno == 0) {
          const data = body.data
          if (data.repair_time) {
            data.repair_time = moment(data.repair_time).format('YYYY-MM-DD')
          }
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
