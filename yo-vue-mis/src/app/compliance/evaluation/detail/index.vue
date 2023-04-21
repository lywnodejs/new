<template>
  <div class="evaluation-detail">
    <h6 class="evaluation-detail__title">安全评估项目详情</h6>
    <el-form label-width="120px" label-suffix="：">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.projectName')">{{detail.project_name}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.projectNumber')">{{detail.project_no}}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.department')">{{detail.dept_name}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.follower')">
            <user-link :email="follower.user_email" v-for="follower in (detail.follower||[])" :key="follower.user_id">{{follower.user_name}}&nbsp;&nbsp;</user-link>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.creator')">
            <user-link :email="detail.create_user_email">{{detail.create_user_name}}</user-link>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.createTime')">{{detail.create_time}}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.startTime')">{{detail.start_time}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compliance.evaluation.endTime')">{{detail.close_time}}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('自评估')">{{detail.assessment_self_enabled_name}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('信息反馈')">{{detail.feedback_enabled_name}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('compliance.evaluation.remark')">{{detail.description}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('compliance.evaluation.evalBusiness')">
            <el-table v-loading="bizLoading" :data="businessList" stripe style="width: 100%">
              <el-table-column prop="business_name" label="业务名称" width="180">
              </el-table-column>

              <el-table-column prop="business_mgr" label="业务负责人">
                <template slot-scope="scope">
                  <user-link v-for="f in scope.row.business_mgr" :key="f.user_id" :email="f.user_email">{{f.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column prop="security_user" label="信息安全接口人">
                <template slot-scope="scope">
                  <user-link v-for="f in scope.row.security_user" :key="f.user_id" :email="f.user_email">{{f.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column prop="product_user" label="产品技术负责人">
                <template slot-scope="scope">
                  <user-link v-for="f in scope.row.product_user" :key="f.user_id" :email="f.user_email">{{f.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column prop="product_user" label="产品对接人">
                <template slot-scope="scope">
                  <user-link v-for="f in scope.row.product_user" :key="f.user_id" :email="f.user_email">{{f.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column prop="qa" label="QA对接人">
                <template slot-scope="scope">
                  <user-link v-for="f in scope.row.qa" :key="f.user_id" :email="f.user_email">{{f.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column prop="bi" label="BI对接人">
                <template slot-scope="scope">
                  <user-link v-for="f in scope.row.bi" :key="f.user_id" :email="f.user_email">{{f.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column prop="ua" label="帐号管理员">
                <template slot-scope="scope">
                  <user-link v-for="f in scope.row.ua" :key="f.user_id" :email="f.user_email">{{f.user_name}}&nbsp;&nbsp;</user-link>
                </template>

              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('compliance.evaluation.evalTarget')">
            <el-table v-loading="objLoading" :data="objectList" border max-height="500" style="width: 100%">
              <el-table-column prop="business_name" :label="$t('compliance.evaluation.businessName')" width="180"></el-table-column>
              <el-table-column prop="object_name" :label="$t('compliance.evaluation.evalTarget')" width="180"></el-table-column>
              <!-- <el-table-column prop="address"
                               :label="$t('compliance.evaluation.address')"
                               width="220"></el-table-column> -->
              <el-table-column :label="$t('compliance.evaluation.evalInterface')">
                <template slot-scope="scope">
                  <user-link :email="user.user_email" v-for="user in scope.row.users" :key="user.user_id">{{user.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column :sortable="true" :sort-method="(a,b)=>sortByRisk('risk_high',a,b)" prop="risk_high" :label="$t('compliance.evaluation.highRisk')" width="100">
                <template slot-scope="scope">
                  <custom-tip :value="scope.row.risk_high">{{riskTip(scope.row.risk_high)}}</custom-tip>
                </template>
              </el-table-column>
              <el-table-column :sortable="true" :sort-method="(a,b)=>sortByRisk('risk_middle',a,b)" prop="risk_middle" :label="$t('compliance.evaluation.middleRisk')" width="100">
                <template slot-scope="scope">
                  <custom-tip :value="scope.row.risk_middle">{{riskTip(scope.row.risk_middle)}}</custom-tip>
                </template>
              </el-table-column>
              <el-table-column :sortable="true" :sort-method="(a,b)=>sortByRisk('risk_lower',a,b)" prop="risk_lower" :label="$t('compliance.evaluation.lowRisk')" width="100">
                <template slot-scope="scope">
                  <custom-tip :value="scope.row.risk_lower">{{riskTip(scope.row.risk_lower)}}</custom-tip>
                </template>
              </el-table-column>
              <el-table-column :sortable="true" :sort-method="(a,b)=>sortFit('no_risk',a,b)" prop="no_risk" :label="$t('compliance.evaluation.conform')" width="80"></el-table-column>
              <el-table-column :sortable="true" :sort-method="(a,b)=>sortFit('not_applicable',a,b)" prop="not_applicable" :label="$t('compliance.evaluation.exclusion')" width="95"></el-table-column>
              <el-table-column prop="action" :label="$t('操作')" width="110">
                <template slot-scope="scope">
                  <el-button v-if="detail.feedback_enabled==1851" type="primary" size="small" @click="showObjectBasicInfo(scope.row, scope.$index)">{{$t('基础信息')}}</el-button>
                  <span v-else>-</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-footer-container" v-if="(objectList||[]).length>0">
              <span class="table-summary-info">评估对象共计 {{objectList.length}} 条</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item :label="$t('compliance.evaluation.evaluate')">
            <el-table v-loading="contentLoading" :data="contentList" max-height="500" border>
              <el-table-column prop="name" :label="$t('compliance.evaluation.evalContent')" width="180"></el-table-column>
              <el-table-column :label="$t('compliance.evaluation.evalManager')">
                <template slot-scope="scope">
                  <user-link :email="mgr.user_email" v-for="mgr in scope.row.mgrs" :key="mgr.user_id">{{mgr.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </el-table-column>
              <el-table-column prop="assessment" :label="$t('compliance.evaluation.evalSchedule')" width="150">
                <template slot-scope="scope">
                  <custom-tip :value="scope.row.assessment">{{evalTip(scope.row.assessment)}}</custom-tip>
                </template>
              </el-table-column>
              <el-table-column prop="rectification" :label="$t('compliance.evaluation.reformSchedule')" width="150">
                <template slot-scope="scope">
                  <custom-tip :value="scope.row.rectification">{{rectificationTip(scope.row.rectification)}}</custom-tip>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="status_name" :label="$t('compliance.evaluation.evalState')" width="100"></el-table-column> -->
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('compliance.evaluation.threat')">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item>
                <el-select multiple v-model="search.business_ids" :placeholder="$t('compliance.evaluation.businessName')" clearable size="small">
                  <el-option v-for="item in businessList" :key="item.business_id" :label="item.business_name" :value="item.business_id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select multiple v-model="search.object_ids" :placeholder="$t('compliance.evaluation.evalTarget')" clearable size="small">
                  <el-option v-for="item in objectList" :key="item.object_id" :label="item.object_name" :value="item.object_id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select multiple v-model="search.scope_ids" :placeholder="$t('compliance.evaluation.evalContent')" clearable size="small">
                  <el-option v-for="item in contentList" :key="item.id" :label="item.name" :value="item.type"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select multiple v-model="search.risk_levels" :placeholder="$t('compliance.evaluation.riskLevel')" clearable size="small">
                  <el-option v-for="item in riskOptions" :key="item.id" :label="item.dName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select multiple v-model="search.assessment_rets" :placeholder="$t('评估结果')" clearable size="small">
                  <el-option v-for="item in assessmentOptions" :key="item.id" :label="item.dName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select multiple v-model="search.repair_rets" :placeholder="$t('compliance.evaluation.reformResult')" clearable size="small">
                  <el-option v-for="item in stateOptions" :key="item.id" :label="item.dName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <b-button variant="primary" size="sm" @click="handleSearch">{{$t('buttons.query')}}</b-button>
              </el-form-item>
            </el-form>
            <app-table :show-custom-list="true" :url="url" border style="width: 100%" :query-params="queryParam" tooltip-effect="light" ref="evaluationTable">
              <app-table-column default prop="business_name" :label="$t('compliance.evaluation.businessName')"></app-table-column>
              <app-table-column default prop="object_name" :label="$t('compliance.evaluation.evalTarget')"></app-table-column>
              <app-table-column default prop="scope_name" :label="$t('compliance.evaluation.evalContent')"></app-table-column>
              <app-table-column default prop="question" :label="$t('compliance.evaluation.description')" show-overflow-tooltip></app-table-column>
              <app-table-column default prop="risk_level_name" :label="$t('compliance.evaluation.riskLevel')"></app-table-column>
              <app-table-column default prop="revision_plan" :label="$t('compliance.evaluation.reformPlan')" show-overflow-tooltip></app-table-column>
              <app-table-column default prop="plan_time" :label="$t('compliance.evaluation.planTime')"></app-table-column>
              <app-table-column default prop="assessment_ret_name" :label="$t('评估结果')"></app-table-column>
              <app-table-column default prop="repair_ret_name" :label="$t('整改结果')"></app-table-column>

              <app-table-column prop="check_type" :label="$t('检查项分类')"></app-table-column>
              <app-table-column prop="check_subtype" :label="$t('检查项子类')"></app-table-column>
              <app-table-column prop="assessment_self_ret_name" :label="$t('自评结果')"></app-table-column>
              <app-table-column prop="assessment_self_time" :label="$t('自评完成时间')"></app-table-column>
              <app-table-column prop="repair_user" :label="$t('整改负责人')">
                <template slot-scope="scope" v-if="scope.row && scope.row.repair_user">
                  <user-link v-for="f in (scope.row.repair_user||[])" :email="f.user_email" :key="f.user_id">{{f.user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </app-table-column>
              <app-table-column prop="assessment_self_user_id" :label="$t('自评操作人')">
                <template slot-scope="scope">
                  <user-link :email="scope.row.assessment_self_user_email" :key="scope.row.assessment_self_user_id">{{scope.row.assessment_self_user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </app-table-column>

              <app-table-column prop="assessment_user_id" :label="$t('评估操作人')">
                <template slot-scope="scope">
                  <user-link :email="scope.row.assessment_user_email" :key="scope.row.assessment_user_id">{{scope.row.assessment_user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </app-table-column>
              <app-table-column prop="proposal" :label="$t('整改建议')" show-overflow-tooltip></app-table-column>
              
              <app-table-column prop="repair_time" :label="$t('整改完成时间')"></app-table-column>
              <app-table-column prop="repair_user_id" :label="$t('整改操作人')">
                <template slot-scope="scope">
                  <user-link :email="scope.row.repair_user_email" :key="scope.row.repair_user_id">{{scope.row.repair_user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </app-table-column>
              <app-table-column prop="repair_description" :label="$t('整改备注')" show-overflow-tooltip></app-table-column>
              <app-table-column prop="check_ret_name" :label="$t('检查结果')"></app-table-column>
              <app-table-column prop="check_user_id" :label="$t('检查操作人')">
                <template slot-scope="scope">
                  <user-link :email="scope.row.check_user_email" :key="scope.row.check_user_id">{{scope.row.check_user_name}}&nbsp;&nbsp;</user-link>
                </template>
              </app-table-column>
              <app-table-column prop="check_description" :label="$t('检查备注')" show-overflow-tooltip></app-table-column>

              <app-table-column default prop="action" :label="$t('buttons.action')" width="150px">
                <template slot-scope="scope">
                  <b-button variant="outline-primary" size="sm" @click.stop="showEventDetail(scope.row.id)">{{ $t('buttons.link') }}</b-button>
                </template>
              </app-table-column>
            </app-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="text-center">
          <el-button @click="returnBack()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog title="安全合规评估详细信息" :visible.sync="dialogVisible" width="65%">
      <p style="padding:15px;">
        <el-form :model="vulDetail" label-suffix="：">
          <el-form-item label="业务名称" prop="business_name" :label-width="formLabelWidth">
            {{vulDetail.business_name}}
          </el-form-item>
          <el-form-item label="评估对象" prop="object_name" :label-width="formLabelWidth">
            {{vulDetail.object_name}}
          </el-form-item>
          <el-form-item label="评估内容" prop="scope_name" :label-width="formLabelWidth">
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
            <el-col :span="12">
              <el-form-item label="整改结果" prop="repair_ret_name" :label-width="formLabelWidth">
                {{vulDetail.repair_ret_name?vulDetail.repair_ret_name:'-'}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="整改完成时间" prop="repair_time" :label-width="formLabelWidth">
                {{vulDetail.repair_time?vulDetail.repair_time:'-'}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="整改操作人" prop="repair_user_name" :label-width="formLabelWidth">
                <user-link v-if="vulDetail.repair_user_email" :email="vulDetail.repair_user_email">{{vulDetail.repair_user_name}}&nbsp;&nbsp;</user-link>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">

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
          <!-- 检查结果 -->
          <el-row>
            <el-col :span="24">
              <hr />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="检查结果" prop="check_ret_name" :label-width="formLabelWidth">
                {{vulDetail.check_ret_name?vulDetail.check_ret_name:'-'}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检查完成时间" prop="check_time" :label-width="formLabelWidth">
                {{vulDetail.check_time?vulDetail.check_time:'-'}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="检查操作人" prop="check_user_name" :label-width="formLabelWidth">
                <user-link v-if="vulDetail.check_user_email" :email="vulDetail.check_user_email">{{vulDetail.check_user_name}}&nbsp;&nbsp;</user-link>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="检查描述">
                <p v-if="vulDetail.check_description" class="check_item_content" v-html="vulDetail.check_description"></p>
                <span v-else>-</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </p>

    </el-dialog>
  </div>
</template>

<script>

import { userLink, customTip } from './FnComponent.es6'
import data from '../mixins/data';
import moment from 'moment';

const dictUrl = 'dictionary/listByDataAuth/'

export default {
  data() {
    return {
      source: -1,
      projectId: null,
      vId: null,
      detail: {},

      dialogVisible: false,
      url: '/sa/vulnerability/list',
      search: {
        business_id: null,
        object_id: null,
        scope_id: null,
        risk_level: null,
        status: null,
        business_ids: [],
        object_ids: [],
        scope_ids: [], //评估内容
        risk_levels: [], //风险等级
        repair_rets: [], //整改结果
        assessment_rets: [] //评估结果
      },
      contentOptions: [],
      riskOptions: [],
      stateOptions: [],
      assessmentOptions: [], //评估结果字典
      vulDetail: {
        repair_user: []
      },
      formLabelWidth: '130',

      bizLoading: false,
      objLoading: false,
      contentLoading: false,

      businessList: [],
      objectList: [],
      contentList: [],
    }
  },
  computed: {
    followers() {
      return this.detail.follower ? this.detail.follower.map(p => p.user_name).join('，') : ''
    }
  },
  components: {
    userLink,
    customTip
  },
  methods: {
    showObjectBasicInfo(row) {
      const { id, project_id, business_id, object_id } = row
      const { href } = this.$router.resolve({
        path: '/compliance/evaluation/user/feedback/view',
        query: { id, source: this.source, project_id, business_id, object_id }
      })
      window.open(href, '_blank')
    },
    sortFit(type, a, b) {
      return a[type] - b[type]
    },
    sortByRisk(type, a, b) {
      return a[type][1] - b[type][1];
    },
    riskTip(value = []) {
      return `安全隐患数量${value[1]}个，已整改隐患数量${value[0]}个`
    },
    evalTip(value) {
      return `待评估项${value[1]}个，已评估项${value[0]}个`
    },
    rectificationTip(value) {
      return `待整改项${value[1]}，已整改项${value[0]}个`
    },
    getEvaluationDetail(id, source) {
      this.$http.get('sa/findInfo', { params: { id, source } }).then(({ body }) => {
        this.detail = body.data
      })
    },

    getBusinessList(project_id, source) {
      this.bizLoading = true
      this.$http.get('sa/business/list', { params: { project_id, source } }).then(({ body }) => {
        this.businessList = body.data
      }).finally(() => {
        this.bizLoading = false
      })
    },
    getObjectList(project_id, source, stat = 0) {
      this.objLoading = true
      this.$http.get('sa/object/list', { params: { project_id, stat, source } }).then(({ body }) => {
        this.objectList = body.data
      }).finally(() => {
        this.objLoading = false
      })
    },
    getContentList(project_id, source, stat = 0) {
      this.contentLoading = true
      this.$http.get('sa/assessment/list', { params: { project_id, stat, source } }).then(({ body }) => {
        this.contentList = body.data
      }).finally(() => {
        this.contentLoading = false
      })
    },

    getDictByContent() {
      this.$http.get(dictUrl + 1730).then(({ body }) => this.contentOptions = body.data)
    },
    getDictByRisk() {
      this.$http.get(dictUrl + 1710).then(({ body }) => this.riskOptions = body.data)
    },
    // 整改结果
    getDictRepairState() {
      this.$http.get(dictUrl + 1950).then(({ body }) => this.stateOptions = body.data)
    },
    // 评估结果
    getDictAssessmentState() {
      this.$http.get(dictUrl + 1720).then(({ body }) => this.assessmentOptions = body.data)
    },

    getDict() {
      this.getDictByRisk()
      this.getDictRepairState()
      this.getDictAssessmentState()
    },
    handleSearch() {
      this.$refs.evaluationTable.reload()
    },
    queryParam() {
      let params = {
        business_id: this.search.business_id,
        object_id: this.search.object_id,
        project_id: this.projectId * 1,
        page_type: 1,
        source: this.source * 1,
        scope_id: this.search.scope_id,
        risk_level: this.search.risk_level,
        repair_ret: this.search.status,
      }
      let { business_ids, object_ids, scope_ids, risk_levels, repair_rets, assessment_rets } = this.search
      if (business_ids && business_ids.length) {
        params['business_ids'] = business_ids.join(',')
      }
      if (object_ids && object_ids.length) {
        params['object_ids'] = object_ids.join(',')
      }
      if (scope_ids && scope_ids.length) {
        // params['scope_ids'] = scope_ids.join(',')
        params['scope_types'] = scope_ids.join(',')
      }
      if (risk_levels && risk_levels.length) {
        params['risk_levels'] = risk_levels.join(',')
      }
      if (assessment_rets && assessment_rets.length) {
        params['assessment_rets'] = assessment_rets.join(',')
      }
      if (repair_rets && repair_rets.length) {
        params['repair_rets'] = repair_rets.join(',')
      }
      return params
    },
    showEventDetail(id = '') {
      this.$http.get('sa/vulnerability/info', { params: { id, source: this.source } }).then(({ body }) => {
        if (body.errno == 0 && body.data) {
          let data = body.data
          if (!data.repair_time) {
            data.repair_time = ""
          } else {
            data.repair_time = moment(data.repair_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')
            console.log(data.repair_time)
          }
          if (!data["repair_user"]) {
            data["repair_user"] = []
          }
          this.vulDetail = data
          this.dialogVisible = true
        }

      })
    },
    returnBack() {
      if (this.source == 2) {
        this.$router.push('/compliance/evaluation/')
      } else if (this.source == 1) {
        this.$router.push('/compliance/evaluation/common')
      }
    }
  },

  created() {
    this.projectId = this.$route.query.id
    const source = this.$route.query.source
    this.source = source
    if (this.projectId) {
      this.getDict()
      this.getEvaluationDetail(this.projectId, source)
      this.getBusinessList(this.projectId, source)
      this.getObjectList(this.projectId, source)
      this.getContentList(this.projectId, source)
    }
  }
}
</script>

<style lang="less">
.evaluation-detail {
  &__title {
    margin-bottom: 20px;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  .el-form-item__label,
  .el-form-item__content {
    line-height: 1.5;
    word-wrap: break-word;
    word-break: break-all;
  }
  .table-footer-container {
    text-align: right;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-right: 10px;
    margin-bottom: 10px;
    background-color: #f3f4f5;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    .table-summary-info {
      display: inline-block;
      font-size: 14px;
      color: #606266;
    }
  }
}
</style>
