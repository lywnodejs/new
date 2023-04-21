<template>
	<div class="manage-event-edit">

    <div class="manage-event-edit__header">
      <header class="col-xs-2">
        <template v-if="manageForm.id">
          {{$t('manage.update_event_title')}}
        </template>
        <template v-if="!manageForm.id">
          {{$t('manage.add_event_title')}}
        </template>
      </header>
    </div>

    <div class="manage-event-edit__content">
      <el-form :model="manageForm" :rules="rules" ref="manageForm" label-width="125px" class="demo-ruleForm">
        <el-row :gutter="10" v-if="manageForm.id">
          <el-col :span="20">
            <el-form-item :label="$t('manage.event_no')" prop="event_no">
              {{ manageForm.event_no }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item :label="$t('manage.name')" prop="event_name">
              <el-input v-model="manageForm.event_name" :maxlength="100"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item :label="$t('manage.event_type')" prop="type">
              <el-select v-model="manageForm.type" :placeholder="$t('manage.select')" @change="onChangeEventType">
                <el-option v-for="item in levelOptions" :key="item.value" :label="translateByName('event', item.label)" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :label="$t('manage.serious_level')" prop="level">
              <el-select v-model="manageForm.level" :placeholder="$t('manage.select')" @change="onChangeSeriousLevel">
                <el-option v-for="item in seriousOptions" :key="item.value" :label="translateByName('event', item.label)" :value="item.value" :disabled="manageForm.id && disabledLevel"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item :label="$t('manage.found_source')" prop="source">
              <el-select v-model="manageForm.source" :placeholder="$t('manage.select')">
                <el-option v-for="item in sourceOptions" :key="item.value" :label="translateByName('event', item.label)" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item :label="$t('manage.system_source')" prop="system">
              <el-input v-model="manageForm.system"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item :label="$t('manage.event_time')" prop="occured_time" :rules="[
                { required: manageForm.status == 1323 || manageForm.status == '1323', message: $t('manage.warning.event.occuredTimeRequired'), trigger: 'change' }
              ]">
              <el-date-picker
                v-model="manageForm.occured_time"
                @blur="handleRepairTimeBlur"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :placeholder="$t('manage.selectDate')">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item :label="$t('manage.confirm_time')" prop="confirm_time">
              <el-date-picker
                v-model="manageForm.confirm_time"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :placeholder="$t('manage.selectDate')">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item :label="$t(computedRepaireTimeText)" prop="repair_time" :rules="[
                { required: manageForm.status == 1323 || manageForm.status == '1323', message: $t('manage.warning.event.repairTimeRequired'), trigger: 'change' }
              ]">
              <el-date-picker
                v-model="manageForm.repair_time"
                @blur="handleRepairTimeBlur"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :placeholder="$t('manage.selectDate')">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item :label="$t('manage.event_status')" prop="status">
              <el-select v-model="manageForm.status" :placeholder="$t('manage.select')">
                <el-option v-for="item in statusOptions" :key="item.value" :label="translateByName('event', item.label)" :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item :label="$t('manage.member')" prop="emps">
              <!-- <el-select v-model="empList" remote reserve-keyword :remote-method="empSearchList" value-key="id" :placeholder="$t('manage.select')" filterable multiple style="width: 100%;">
                <el-option
                  v-for="item in empOptions"
                  :key="item.value.id"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
              <app-employee style="width: 100%;" v-model="empList" :options="empOptions" multiple></app-employee>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item :label="$t('manage.department')" prop="dept_names">
              <!-- <el-input v-model="dept_names" :disabled="true"></el-input> -->
              <!-- <el-select v-model="deptList" remote reserve-keyword :remote-method="deptSearchList" :placeholder="$t('manage.select')" filterable multiple style="width: 100%;">
                <el-option
                  v-for="item in deptOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
              <app-department style="width: 100%;" v-model="deptList" :options="deptOptions" multiple></app-department>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 创建人 -->
        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item :label="$t('manage.founder')" prop="create_user">
              <span v-html="creater"></span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 调查负责人 -->
        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item :label="$t('manage.survey_members')" prop="surveyMemberList">
              <!-- <el-input v-model="dept_names" :disabled="true"></el-input> -->
              <el-select v-model="manageForm.surveyMemberList" remote reserve-keyword :remote-method="surveySearchList" :placeholder="$t('manage.select')" filterable multiple style="width: 100%;">
                <el-option
                  v-for="item in surveyMemberOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <!-- <el-col :span="10">
            <el-form-item :label="$t('manage.auth_label')" prop="auth_label_ids">
              <el-checkbox-group v-model="auth_label_idsList">
                <el-checkbox v-for="item in authLabelOptions" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item :label="$t('manage.rccd')" prop="rccd_ids">
              <el-checkbox-group v-model="rccd_idsList">
                <el-checkbox v-for="item in isRCCDOptions" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col> -->
          <el-col :span="20" v-if="isShowLabelIds">
            <el-form-item :label="$t('manage.label_ids')" prop="labelIdsList">
              <el-checkbox-group v-model="manageForm.labelIdsList">
                  <el-checkbox v-for="item in labelIdsOptions" :key="item.value" :label="item.value" :disabled="item.disabled">
                    <el-tooltip v-if="item.linkContent && item.linkContent.tip" :content="translateByName('event', item.linkContent.tip)" placement="bottom" effect="light">
                      <label>{{translateByName('event', item.label)}}</label>
                    </el-tooltip>
                    <label v-else>{{translateByName('event', item.label)}}</label>
                  </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 是否提交rccd -->
        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item :label="$t('manage.submit_rccd')" prop="submit_rccd">
              <el-radio-group v-model="manageForm.submit_rccd">
                <el-radio v-for="item in isRCCDOptions" :key="item.value" :label="item.value" >{{translateByName('event', item.label)}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="(manageForm.id || manageForm.status == 1323) && manageForm.submit_rccd == 1">
          <el-row :gutter="10" >
            <el-col :span="20">
              <el-form-item :label="$t('manage.rccd_time')" prop="rccd_time" :rules="[
                { required: manageForm.status == 1323 || manageForm.status == '1323', message: $t('manage.warning.event.rccdTimeRequired'), trigger: 'change' }
              ]">
                <el-date-picker
                  v-model="manageForm.rccd_time"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :placeholder="$t('manage.selectDate')">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" >
            <el-col :span="20">
              <el-form-item :label="$t('manage.rccd')" prop="rccd" :rules="[
                { required: manageForm.status == 1323 || manageForm.status == '1323', message: $t('manage.warning.event.rccdRequired'), trigger: 'change' }
              ]">
                <el-select v-model="manageForm.rccd" :placeholder="$t('manage.select')" clearable>
                  <el-option v-for="item in rccdsOptions" :key="item.value" :label="translateByName('event', item.label)" :value="item.value" >{{translateByName('event', item.label)}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item :label="$t('manage.survey_result')" prop="survey_result">
              <el-input type="textarea" v-model="manageForm.survey_result"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item :label="$t('manage.punish_result')" prop="punish_result">
              <el-input type="textarea" v-model="manageForm.punish_result"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item :label="$t('manage.remark')" prop="remark">
              <el-input type="textarea" v-model="manageForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" v-if="this.manageForm.status == 1322">
          <el-col :span="20">
            <el-form-item :label="$t('manage.reviewer.file')" prop="remark">
              <div class="upload">
                <el-upload
                  action="/file/upload"
                  :multiple="true"
                  :file-list="fileList"
                  accept="PDF,pdf,jpeg,JPEG,png,PNG,DOC,docx,zip,ZIP"
                  :on-error="handleAvatarError"
                  :before-remove="removeFileList"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="small" type="primary">{{$t('manage.reviewer.warning.fileRequired')}}</el-button>
                </el-upload>
              </div>

            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10" v-if="manageForm.id">
          <el-col :span="20">
            <el-form-item :label="$t('manage.relative_to_alarm')" prop="relative_to_alarm">
              <sdl-table
                :data="alarmListTableData"
                border>

                <el-table-column
                  prop="id"
                  :label="$t('alarm.id')">
                </el-table-column>

                <el-table-column
                  prop="type_name"
                  :label="$t('alarm.type')">
                </el-table-column>

                <el-table-column
                  prop="level_name"
                  :label="$t('alarm.level')">
                </el-table-column>

                <el-table-column
                  prop="alarm_time"
                  :label="$t('alarm.alarmTime')">
                </el-table-column>

                <el-table-column
                  prop="occured_time"
                  :label="$t('alarm.occuredTime')">
                </el-table-column>

                <el-table-column
                  prop="address"
                  :label="$t('manage.action')"
                  width="110px">
                  <template slot-scope="scope">
                    <el-button @click="handleDetailClick(scope.row)" type="text" size="small">{{$t('manage.link')}}</el-button>
                    <el-button @click="deletelEvent(scope.row)" type="text" size="small">{{$t('manage.delete')}}</el-button>
                  </template>
                </el-table-column>
              </sdl-table>
            </el-form-item>
          </el-col>

          <el-col :span="2">
            <el-button @click="openDialogList" type="primary" size="small">{{$t('manage.add')}}</el-button>
          </el-col>
        </el-row>

        <el-row :gutter="10" v-if="manageForm.id">
          <el-col :span="20">
            <el-form-item :label="$t('manage.relative_to_order')" prop="relative_to_order">
              <sdl-table
                :data="orderListTableData"
                border
                ref="orderListTable"
                style="width: 100%">

                <el-table-column
                  prop="id"
                  :label="$t('order.orderId')">
                </el-table-column>

                <el-table-column
                  prop="alarmType"
                  :label="$t('order.alarmType')">
                </el-table-column>

                <el-table-column
                  prop="riskLevel"
                  :label="$t('order.riskLevel')">
                </el-table-column>

                <el-table-column
                  prop="name"
                  :label="$t('order.name')">
                </el-table-column>

                <el-table-column
                  prop="postTime"
                  :label="$t('order.postTime')">
                </el-table-column>

                <el-table-column
                  prop="id"
                  :label="$t('manage.action')"
                  width="110px">
                  <template slot-scope="scope">
                    <a class="el-button el-button--text el-button--small" target="_blank" :href="'http://anquan.didichuxing.com/project/portals/pages/alarm-order-detail.html?id=' + scope.row.id"  type="text" size="small">{{$t('manage.link')}}</a>
                    <el-button @click="deletelOrder(scope.row)" type="text" size="small">{{$t('manage.delete')}}</el-button>
                  </template>
                </el-table-column>
              </sdl-table>
            </el-form-item>
          </el-col>

          <el-col :span="2">
            <el-button @click="openDialogOrderList" type="primary" size="small">{{$t('manage.add')}}</el-button>
          </el-col>
        </el-row>

        <!-- <el-row v-if="this.manageForm.id" :gutter="10">
          <el-col :span="20">
            <el-form-item :label="$t('manage.create_user')" prop="create_user">
              {{manageForm.create_user}}
            </el-form-item>
          </el-col>
        </el-row> -->

        <!-- 安全事件申诉部分 start -->
        <template v-if="eventData && eventData.id && eventData.applyRecord">
        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item :label="$t('manage.appeal_name')">
              {{ manageForm.appealName}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item :label="$t('manage.appeal_time')">
              {{ manageForm.appealTime}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item :label="$t('manage.appeal_remark')">
              {{ manageForm.appealReason }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item :label="$t('manage.appeal_status')" prop="applyStatus" v-if="eventData.applyRecord.status != 2045 && eventData.applyRecord.status != 2043 && eventData.applyRecord.status != 2044">
              <el-select v-model="manageForm.applyStatus" :placeholder="$t('manage.select')" >
                <el-option v-for="item in appealOptions" :key="item.value" :label="translateByName('event', item.label)" :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('manage.appeal_status')" v-else>
              {{ eventData.applyRecord.statusName }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item :label="$t('manage.appeal_reason')" prop="applyRemark" v-if="eventData.applyRecord.status != 2045 && eventData.applyRecord.status != 2043 && eventData.applyRecord.status != 2044">
              <el-input type="textarea" v-model="manageForm.applyRemark"></el-input>
            </el-form-item>
            <el-form-item :label="$t('manage.appeal_reason')" v-else>
              {{ eventData.applyRecord.responseRemark }}
            </el-form-item>
          </el-col>
        </el-row>
        </template>

         <!-- 安全事件申诉部分 end -->

        <el-row :gutter="10">
          <el-col :offset="7" :span="10">
            <el-form-item>
              <el-button type="primary" @click="saveEvent('manageForm')">{{$t('manage.submit')}}</el-button>
              <router-link class="el-button el-button--info" :to="{name : 'ManageEvent', query: backQueryParams}">{{ $t('manage.back') }}</router-link>
            </el-form-item>
          </el-col>
        </el-row>

        <template v-if="manageForm.id && manageForm.level == 1304 && manageForm.status != 1322">
          <el-row :gutter="10" v-if="manageForm.id">
            <el-col :span="12">
              <el-form-item :label="$t('manage.reviewer.safety_leader')">
                <span v-html="survey_members_list_html"></span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('manage.reviewer.business_leader')">
                <span v-html="computedReviewer"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 拥有复盘信息权限的用户可以修改复盘信息 -->
          <!-- <event-reviewer v-if="manageForm.id && manageForm.submit_rccd && $route.query.review == 1"></event-reviewer> -->
          <!-- 修改时显示的复盘信息，不可更改复盘信息，只可看 -->
          <!-- 只有四级事件显示复盘信息 -->
          <el-row :gutter="10" v-if="$route.query.review == 1">
            <el-col :span="12">
              <el-form-item label="">
                <safety-review :secureInformationReview="safetyReviewData"></safety-review>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="">
                <business-review-detail :business-review="businessReviewData"></business-review-detail>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="$route.query.review == 3">
            <el-col :span="12">
              <el-form-item label="">
                <safety-review :secureInformationReview="safetyReviewData"></safety-review>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="">
                <business-review :business-review="businessReviewData"></business-review>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="$route.query.review != 3 && $route.query.review != 1">
            <el-col :span="12">
              <el-form-item label="">
                <safety-review-detail :secureInformationReview="safetyReviewData"></safety-review-detail>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="">
                <business-review-detail :business-review="businessReviewData"></business-review-detail>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <review-detail></review-detail> -->
        </template>
      </el-form>

    </div>

    <el-dialog :title="modelAlarmTitle" :visible.sync="dialogAlarmVisible" width="70%">
      <alarm-detail v-if="dialogAlarmVisible"  @dialogSwitch="dialogSwitch" :alarm-row="alarm_row"></alarm-detail>
    </el-dialog>

    <el-dialog :title="modelSelectAlarmTitle" :visible.sync="dialogSelectAlarmVisible" width="70%">
      <select-alarm-list v-if="dialogSelectAlarmVisible" :alarm-ids="computedAlarmIds" @selection="selectionAlarm" @close="dialogSelectAlarmVisible=false"></select-alarm-list>
    </el-dialog>

    <el-dialog :title="modelSelectOrderTitle" :visible.sync="dialogSelectOrderVisible" width="70%">
      <select-order-list v-if="dialogSelectOrderVisible" :order-ids="computedOrderIds" @selection="selectionOrder" @close="dialogSelectOrderVisible=false"></select-order-list>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import selectAlarmList from './alarmList.vue'
import selectOrderList from './orderList.vue'
import _ from 'lodash'
import reviewDetail from './reviewDetail.vue'
import safetyReview from './safetyReviewer.vue'
import safetyReviewDetail from './safetyReviewerDetail.vue'
import businessReviewDetail from './businessReviewerDetail.vue'
import businessReview from './businessReviewer.vue'

export default {
  components: {
    selectAlarmList,
    selectOrderList,
    reviewDetail,
    safetyReview,
    businessReviewDetail,
    businessReview,
    safetyReviewDetail
  },

  data() {
    return {

      modelAlarmTitle: this.$t('manage.alarm.detail_title'),
      modelSelectAlarmTitle: this.$t('manage.alarm.add_title'),
      modelSelectOrderTitle: this.$t('manage.add_order'),
      dialogAlarmVisible: false,
      dialogSelectAlarmVisible: false,
      dialogSelectOrderVisible: false,

      rules: {},

      alarm_row: {},

      manageForm: {
        id: '',
        event_name: '', // 事件名称
        type: null, // 事件类型
        level: null, // 严重程度
        source: null, // 发现方式
        system: '', // 发现系统
        occured_time: null, // 发生时间
        confirm_time: null, // 确认时间
        repair_time: null, // 修复时间
        status: 1322, // 事件状态
        accounts: '', // 涉及人员列表, 保存时使用
        survey_result: '',
        punish_result: '',
        remark: '',
        /**
         * 2：多条告警创建一条安全事件
           3：无关联告警
         */
        mode: 3,   //alarm_ids不为空时，传 2
        alarm_ids: '',
        dept_ids: [],  // 涉及部门
        // auth_label_ids: '',
        // rccd_ids: '',
        // create_user: '',
        label_ids: [],
        labelIdsList: [],

        // add by huangxiaomei 2019-9-24
        survey_members: '', // 调查负责人
        submit_rccd: 0,
        surveyMemberList: [],
        rccd_time: '',
        rccd: null,
        applyRemark: '',
        applyStatus: null,
        appealName: '',
        appealTime: '',
        appealReason: ''
      },

      isShowLabelIds: false, // 控制是否显示员工违规标签
      isLabelIdsDisable: false,
      disabledLevel: false,

      // auth_label_idsList: [],
      // rccd_idsList: [],
      empList: [],
      empOptions: [],
      deptList: [],
      deptOptions: [],
      surveyMemberOption: [],

      // 下拉列表初始化参数
      levelOptions: [], //事件类型
      sourceOptions: [],//发现方式
      statusOptions: [],//事件状态
      seriousOptions: [], //严重程度
      appealOptions: [], // 申诉状态
      // authLabelOptions: [],
      isRCCDOptions: [{
        label: '是',
        value: 1,
      }, {
        label: '否',
        value: 0
      }],
      labelIdsOptions: [],
      rccdsOptions: [], // rccd处罚结果


      alarmListTableData: [],
      orderListTableData: [],

      reviewers: [], // 复盘负责人
      creater: '',  // 创建人信息

      businessReviewData: {},
      safetyReviewData: {},

      survey_members_list_html: '',

      eventData: {}, // 事件详情
      fileList:[] //上传文件列表
    }
  },

  computed: {
    ...mapState(['lang']),
    computedAlarmIds: function() {
      if (this.alarmListTableData.length > 0) {
        let ids = this.alarmListTableData.map(item => {
          return item.id
        })
        return ids.join()
      }
      return ''
    },

    computedOrderIds: function() {
      if (this.orderListTableData.length > 0) {
        let ids = this.orderListTableData.map(item => {
          return item.id
        })
        return ids.join()
      }
      return ''
    },

    backQueryParams() {
      let backParams = {}
      let params = this.$route.query.params
      if (params && params.length > 0) {
        params.split('&').length > 0 ? params.split('&').forEach(item => {
          backParams[item.split('=')[0]] = item.split('=')[1]
        }) : {}
      }
      return backParams
    },

    computedAccounts: function() {
      let accounts = []
      if (this.empList && this.empList.length > 0) {
        this.empList.forEach(item => {
          let content = item.email
          accounts.push(content.split('@')[0])
        })
      }
      return accounts.join(',')
    },

    computedSuveyMember: function() {
      let accounts = []
      if (this.manageForm.surveyMemberList && this.manageForm.surveyMemberList.length > 0) {
        this.manageForm.surveyMemberList.forEach(item => {
          accounts.push(item.split('(')[1].split('@')[0])
        })
      }
      return accounts.join(',')
    },

    computedDepts: function() {
      let depts = []
      if (this.deptList && this.deptList.length > 0) {
        depts = this.deptList.join(',')
      }
      return depts
    },

    computedRepaireTimeText: function() {
      return this.isShowLabelIds ? 'manage.repair_survey_time' : 'manage.repair_time'
    },

    // 计算提交rccd是否可以编辑，事件状态是否可以选择
    computedIsRCCDDisable: function() {
      if (this.manageForm.level == 1304) {
        return true
      }
      return false
    },

    computedReviewer: function() {
      let result = ''
      if (this.reviewers && this.reviewers.length > 0) {
        this.reviewers.forEach(item => {
          let email = item.emp_email || item.email
          let name = email.substring(0, email.indexOf('@'))
          result += ` <a target="_blank" href="http://i.xiaojukeji.com/space/personal/${name}?lang=zh-CN">${item.emp_name || item.name}</a>` + ','
        })
        result = result.substring(0, result.length - 1)
      }
      return result
    }
  },

  watch: {
    lang: {
      handler(val) {
        this.rules = {
          event_name: [
            { required: true, message: this.$t('manage.warning.event.nameRequired'), trigger: 'blur' },
            { min: 0, max: 100, message: this.$t('manage.warning.event.nameMax'), trigger: 'blur' }
          ],
          confirm_time: [
            { required: true, message: this.$t('manage.warning.event.confirmTimeRequired'), trigger: 'blur' }
          ],
          type: [
            { required: true, message: this.$t('manage.warning.event.typeRequired'), trigger: 'change' }
          ],
          level: [
            { required: true, message: this.$t('manage.warning.event.levelRequired'), trigger: 'change' }
          ],
          system: [
            { required: true, message: this.$t('manage.warning.event.systemRequired'), trigger: 'blur' },
            { min: 0, max: 100, message: this.$t('manage.warning.event.nameMax'), trigger: 'blur' }
          ],
          source: [
            { required: true, message: this.$t('manage.warning.event.sourceRequired'), trigger: 'change' }
          ],
          status: [
            { required: true, message: this.$t('manage.warning.event.statusRequired'), trigger: 'change' }
          ],
          labelIdsList: [
            { required: true, message: this.$t('manage.warning.event.tagRequired'), trigger: 'change' }
          ],
          surveyMemberList: [
            { required: true, message: this.$t('manage.warning.event.surveyMembers'), trigger: 'change' }
          ],
          submit_rccd: [
            { required: true, message: this.$t('manage.warning.event.sbumitRCCD'), trigger: 'change' }
          ],
          occured_time: [
            { required: true, message: this.$t('manage.warning.event.occuredTimeRequired'), trigger: 'blur' }
          ],
          repair_time: [
            { required: true, message: this.$t('manage.warning.event.repairTimeRequired'), trigger: 'change' }
          ],
          applyStatus: [
            { required: true, message: this.$t('manage.appealStatusRequired'), trigger: 'change' }
          ],
          applyRemark: [
            { required: true, message: this.$t('manage.appealReasonRequired'), trigger: 'blur' }
          ],
        }
      },
      immediate: true
    },
    empList: {
      handler: function (val, oldVal) {
        // let names = [], depts = [], _this = this
        // 增加人员时，将单位加入到dept中
        let len = val.length
        if (len > oldVal.length) {
          let newMember = len > 0 ? val[len - 1] : ''
          //将加入人员的单位加入到deptOptions中
          if (newMember && newMember.id) {
            this.deptOptions.push({
              value: Number(newMember.deptId),
              label: newMember.department
            })
            this.deptOptions = _.unionBy(this.deptOptions, {
              value: Number(newMember.deptId),
              label: newMember.department
            }, 'value')
            if (this.deptList.indexOf(Number(newMember.deptId)) === -1) {
              this.deptList.push(Number(newMember.deptId))
            }
          }
        }
      },
      deep: true
    },

    'manageForm.labelIdsList': function(val, oldVal) {
      if (val.indexOf(1554) !== -1 && val.length > 0) {
        this.labelIdsOptions = this.labelIdsOptions.map(item => {
          if (item.value !== 1554) {
            return {
              value: item.value,
              label: item.label,
              linkContent: item.linkContent,
              disabled: true
            }
          } else {
            return {
              value: item.value,
              label: item.label,
              linkContent: item.linkContent,
              disabled: false
            }
          }

        })
      } else if (val.indexOf(1554) == -1 && val.length > 0) {
        this.labelIdsOptions = this.labelIdsOptions.map(item => {
          if (item.value == 1554) {
            return {
              value: item.value,
              label: item.label,
              linkContent: item.linkContent,
              disabled: true
            }
          } else {
            return {
              value: item.value,
              label: item.label,
              linkContent: item.linkContent,
              disabled: false
            }
          }
        })
      } else {
        this.labelIdsOptions = this.labelIdsOptions.map(item => {
          return {
            value: item.value,
            label: item.label,
            linkContent: item.linkContent,
            disabled: false
          }
        })
      }
    }
  },

  methods: {

    handleRepairTimeBlur() {
      if (this.manageForm.occured_time || this.manageForm.repair_time) {
        if (moment(this.manageForm.occured_time).valueOf() > moment(this.manageForm.repair_time).valueOf()) {
          this.$message.error(this.$t('manage.warning.event.errorTime'))
        }
      }
    },

    /**
     * 文件上传成功
     */
    handleAvatarSuccess(res,file){
      console.log(this.fileList)
      console.log(res,file);
      this.fileList.push({
        name:res.data,
        url:res.data
      });
    },
    handleAvatarError(err){
        this.$message.error(this.$t('hint.upload_fail'));
    },
    /**
     * 文件上传之前的限制
     */
    beforeAvatarUpload(file) {
      let fileTypelist = ['image/jpeg','image/png','application/pdf','aplication/zip','application/msword','application/zip','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      let isFileType = fileTypelist.includes(file.type);
      if (!isFileType) {
        this.$message.error(this.$t("manage.warning.format"));
        return false;
      }
      return true;
    },
    /**
     * 删除文件操作
     */
    removeFileList(file,fileList){
      this.fileList = fileList;
    },

    /**
     * 根据告警类型判断是否显示重点关注标签
     */
    onChangeEventType(currentValue) {
      // 在以下事件类型中，“修复时间”改为“调查结束时间”
      let eventType = [1331, 1332, 1337, 1338, 1339, 1355, 1358, 1530, 1545, 2029]
      if (eventType.indexOf(currentValue) != -1) {
        this.isShowLabelIds = true
      } else {
        this.isShowLabelIds = false
        this.manageForm.labelIdsList = []
      }
    },

    /**
     * 当事件等级为四级事件时，1. “是否提交RCCD”为是，并且不能选择否(已去掉)
     *                     2. 事件状态只有调查中和处置中，其他等级事件只有调查中和已关闭状态
     */
    onChangeSeriousLevel(currentValue) {
      // 新添加页面设置默认状态为调查中
      if (!this.manageForm.id) {
        this.manageForm.status = 1322
      }
      // 四级事件ID ‘1304’
      if (currentValue == '1304') {
        // this.manageForm.submit_rccd = 1

        // 修改时，只有处置中的四级事件才可以关闭
        if (!this.manageForm.id) {
          // 事件状态只有调查中和处置中
          this.statusOptions.forEach(item => {
            if (item.value == 1323) {
              item.disabled = true
            } else {
              item.disabled = false
            }
          })
        } else {
          // 四级事件状态默认为调查中
          this.statusOptions.forEach(item => {
            if (item.value == 1323 && this.manageForm.status != 1321) {
              item.disabled = true
            } else {
              item.disabled = false
            }
          })
        }
      } else {
        // this.manageForm.submit_rccd = 0
        // 事件状态只有调查中和已关闭
        // TODO 修改时，其他事件是否可以进入处置中
        this.statusOptions.forEach(item => {
          if (item.value == 1321) {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      }
    },

    onChangeEventStatus(currentValue) {
      if (this.manageForm.id && this.manageForm.level == '1304') {
        this.statusOptions.forEach(item => {
          if (item.value == 1323 && this.manageForm.status != 1321) {
              item.disabled = true
          } else {
            item.disabled = false
          }
        })
      }
    },

    openDialogOrderList() {
      this.dialogSelectOrderVisible = true
    },

    deletelOrder(row) {
      this.$confirm(this.$t('manage.hint.confirm'), this.$t('manage.hint'), {
        confirmButtonText: this.$t('manage.confirm'),
        cancelButtonText: this.$t('manage.cancel'),
        type: 'warning'
      }).then(() => {
        let ids = this.orderListTableData.map(item => {
          return item.id
        })
        let index = ids.indexOf(row.id)
        if(index != -1) {
          this.orderListTableData.splice(index, 1)
          this.$this.$({
            type: 'success',
            message: this.$t('manage.hint.success')
          })
        }

      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('manage.hint.error')
        });
      });
    },

    selectionOrder(data) {
      this.orderListTableData = this.orderListTableData.concat(data)
      this.dialogSelectOrderVisible = false
    },

    /**
     * 将关联列表选中的告警添加到列表
     */
    selectionAlarm(data) {
      this.alarmListTableData = this.alarmListTableData.concat(data)
      this.dialogSelectAlarmVisible = false
    },

    surveySearchList(query) {
      if(query !== '') {
        this.$http.get('secEvent/searchEmpList', {params: {'account': query}}).then(res => {
          if (res.data.errno == 0) {
            this.surveyMemberOption = []
            this.surveyMemberOption = res.data.data.map((item) => {
              return {
                value: item.name + '(' + item.email+ ')',
                label: item.name + '(' + item.email+ ')'
              }
            })
          } else {
            this.surveyMemberOption = []
          }
        })
      } else {
        this.surveyMemberOption = []
      }
    },

    /**
     * 打开添加关联告警列表
     */
    openDialogList() {
      this.dialogSelectAlarmVisible = true
    },

    /**
     * 告警详情
     */
    handleDetailClick(row) {
      this.dialogAlarmVisible = true
      this.alarm_row = row
    },

    /**
     * 删除告警
     * 自己维护，不需要发请求
     */
    deletelEvent(row) {
      this.$confirm(this.$t('manage.hint.confirm'), this.$t('manage.hint'), {
        confirmButtonText: this.$t('manage.confirm'),
        cancelButtonText: this.$t('manage.cancel'),
        type: 'warning'
      }).then(() => {
        let ids = this.alarmListTableData.map(item => {
          return item.id
        })
        let index = ids.indexOf(row.id)
        if(index != -1) {
          this.alarmListTableData.splice(index, 1)
          this.$message({
            type: 'success',
            message: this.$t('manage.hint.success')
          })
        }

      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('manage.hint.error')
        });
      });
    },

    /**
     * 保存或修改安全事件
     * 调查中的事件，如果是四级事件，没有改变调查中状态，

	   * 需要提示是否进入处置中，如果选择是，则再提示事件进入处置中，复盘负责人XXX，如果选择确定，事件状态变为处置中并提交；
	       															                               如果选择取消，则不做任何操作，停留在修改页面；

					                如果选择否，则直接提交页面；
     */
    saveEvent() {
      let postData = this.manageForm,
        url = "secEvent/addSecEvent"
      if(this.manageForm.id) {
        url = 'secEvent/updateSecEvent'
        this.manageForm.alarm_ids = this.computedAlarmIds
        postData['alarmOrderIds'] = this.computedOrderIds
        if(this.manageForm.alarm_ids.length > 0) {
          this.manageForm.mode = 2
        }
      } else {
        delete this.manageForm.id
      }

      postData.dept_ids = this.computedDepts
      postData.accounts = this.computedAccounts
      postData.survey_members = this.computedSuveyMember
      // this.manageForm.auth_label_ids = this.auth_label_idsList.join(',')
      // this.manageForm.rccd_ids = this.rccd_idsList.join(',')

      this.$refs.manageForm.validate((valid) => {
        if (valid) {
          if (moment(this.manageForm.occured_time).valueOf() > moment(this.manageForm.repair_time).valueOf()) {
            this.$message.error(this.$t('manage.warning.event.errorTime'))
          } else {
            if (this.isShowLabelIds) {
              this.manageForm.label_ids = this.manageForm.labelIdsList.join(',')
            }
            // 1. 判断事件等级是否为4级事件(1304)并且事件状态为“调查中(1322)”
            if (this.manageForm.level == 1304 && this.manageForm.status == 1322) {
              this.$confirm(this.$t('manage.levelFourHint'), this.$t('manage.hint'), {
                distinguishCancelAndClose: true,
                confirmButtonText: this.$t('manage.confirm'),
                cancelButtonText: this.$t('manage.cancel'),
                type: 'default'
              }).then(() => {
                // 获取复盘负责人
                this.getReviewerAndSubmit(postData, url)
              }).catch((action) => {
                if (action == 'cancel') {
                  this.submitEvent(postData, url)
                }
              })
            } else {
              // 判断事件是否在处置中
              if (this.manageForm.status == 1321) {
                this.getReviewerAndSubmit(postData, url)
              } else {
                this.submitEvent(postData, url)
              }
            }
          }
        }
      })
    },

    getReviewerAndSubmit(postData, url) {
      // 获取复盘负责人
      // 当前无涉及部门,或者该部门无安全bp时，调查负责人则为复盘负责人
      let businessReviewer = '', securityReviewer = ''

      // 信息安全复盘负责人 == 调查负责人
      if (postData.surveyMemberList.length > 0) {
          postData.surveyMemberList.forEach(item => {
            securityReviewer += `<span style="color: #007bff;">${item.split('(')[0]}</span>`+ '，'
          })
          securityReviewer = securityReviewer.substring(0, securityReviewer.length-1) + '？'
        }
      if (postData.dept_ids && postData.dept_ids.length > 0) {
        this.$http.get('secEvent/reviewers/get', { params: { deptIds: postData.dept_ids, eventId: this.$route.query.id} }).then(res => {
          if (res.data && res.data.data && res.data.data.length > 0) {
            this.reviewers = res.data.data
            res.data.data.forEach(item => {
              businessReviewer += `<span style="color: #007bff;">${item.name}</span>`+ '，'
            })
            businessReviewer = businessReviewer.substring(0, businessReviewer.length-1) + '？'
          } else {
            businessReviewer = securityReviewer
          }
          this.$confirm('确认事件进入处置中状态，<br/>信息安全复盘负责人：' + securityReviewer + '<br/>业务线复盘负责人：' + businessReviewer, this.$t('manage.hint'), {
            confirmButtonText: this.$t('manage.confirm'),
            cancelButtonText: this.$t('manage.cancel'),
            type: 'default',
            dangerouslyUseHTMLString: true
          }).then(() => {
            // 修改事件状态为处置中
            postData.status = 1321
            this.submitEvent(postData, url)
          })
        })
      } else {
        businessReviewer = securityReviewer
        this.$confirm('确认事件进入处置中状态，<br/>信息安全复盘负责人：' + securityReviewer + '<br/>业务线复盘负责人：' + businessReviewer, this.$t('manage.hint'), {
          confirmButtonText: this.$t('manage.confirm'),
          cancelButtonText: this.$t('manage.cancel'),
          type: 'default',
          dangerouslyUseHTMLString: true
        }).then(() => {
          // 修改事件状态为处置中
          postData.status = 1321
          this.submitEvent(postData, url)
        })
      }
    },

    submitEvent(params, url) {
      delete params.surveyMemberList
      delete params.labelIdsList
      params.attachmentList =[]
      let arrList = [];
      if(this.fileList){
        this.fileList.map(item=>{
          arrList.push(item.url);
        })
        params.attachmentList = arrList.join(',')
      }
      this.$http.post(url, params, { emulateJSON: true }).then(res => {
        let type = 'error'
        if (res.data.errno == 0) {
          type = "success"
        }
        this.$message({
          message: res.data.errmsg,
          type: type
        })
        this.$router.push({path: "/secEvent/event", query: this.backQueryParams})
      }).catch(exp => {
        this.$message.error(exp)
      })
    },

    /**
     * 获取安全事件详情
     */
    detailEventDate(id) {
      let _this = this
      this.$http.get("secEvent/findInfo", { params: { 'event_id': id } }).then(res => {
        if (res.data.errno == 0) {
          let eventData = res.data.data
          this.eventData = eventData
          // this.manageForm = eventData
          this.manageForm.id = eventData.id
          this.manageForm.event_no = eventData.event_no
          this.manageForm.event_name = eventData.name
          this.manageForm.type = eventData.type
          this.manageForm.level = eventData.level
          this.manageForm.source = eventData.source
          this.manageForm.system = eventData.system
          this.manageForm.occured_time = eventData.occured_time
          this.manageForm.confirm_time = eventData.confirm_time
          this.manageForm.repair_time = eventData.repair_time
          this.manageForm.status = eventData.status
          this.manageForm.accounts = eventData.accounts
          // this.manageForm.depts = eventData.depts
          this.manageForm.survey_result = eventData.survey_result
          this.manageForm.punish_result = eventData.punish_result
          this.manageForm.remark = eventData.remark
          this.manageForm.alarm_ids = eventData.alarm_ids
          this.manageForm.dept_ids = eventData.dept_ids
          this.manageForm.create_user = eventData.create_user
          this.fileList = eventData.attachmentList
          this.fileList=[];
          if(eventData.attachmentList){
            eventData.attachmentList.map(item=>{
              this.fileList.push({
                name:item,
                url:item
              })
            })
          }

          // 黄晓梅(huangxiaomei@didiglobal.com)
          this.creater = eventData.create_user
          if (eventData.create_user) {
            let name = eventData.create_user.split('(')[0]
            let href = eventData.create_user.split('(')[1] ? eventData.create_user.split('(')[1].split('@')[0] : ''
            this.creater = href ? ` <a target="_blank" href="http://i.xiaojukeji.com/space/personal/${href}?lang=zh-CN">${name}</a>` : name
          }
          this.manageForm.submit_rccd = eventData.submit_rccd
          this.manageForm.rccd = eventData.rccd == 0 ? '' : eventData.rccd
          this.manageForm.rccd_time = eventData.rccd_time

          this.onChangeEventType(eventData.type)

          // 调查负责人
          if (eventData.survey_members_list && eventData.survey_members_list.length > 0) {
            eventData.survey_members_list.forEach(item => {
              this.surveyMemberOption.push({
                label: item.emp_name + '(' + item.emp_email +')',
                value: item.emp_name + '(' + item.emp_email +')'
              })
              this.manageForm.surveyMemberList.push(item.emp_name + '(' + item.emp_email +')')
              let name = item.emp_email.substr(0, item.emp_email.indexOf('@'))
              this.survey_members_list_html += ` <a target="_blank" href="http://i.xiaojukeji.com/space/personal/${name}?lang=zh-CN">${item.emp_name}</a>` + ','
            })
            this.survey_members_list_html = this.survey_members_list_html.substring(0, this.survey_members_list_html.length - 1)
          }

          // 复盘负责人
          this.reviewers = eventData.review_members_list || []

           // 权限标签
          // if (eventData.auth_labels && eventData.auth_labels.length > 0) {
          //   this.auth_label_idsList =  eventData.auth_labels.map(item => {return item.id })
          // }

          // if ( eventData.rccds && eventData.rccds.length > 0 ) {
          //   this.rccd_idsList = eventData.rccds.map(item => {return item.id })
          // }

          // 重点关注
          if (eventData.labels && eventData.labels.length > 0) {
            this.manageForm.labelIdsList = eventData.labels.map(item => { return item.id })
          } else {
            this.manageForm['labelIdsList'] = []
          }

          // 涉及人员
          if (eventData.emps && eventData.emps.length > 0) {
            eventData.emps.forEach(item => {
              let vitem = {
                id: item.emp_id,
                name: item.emp_name,
                email: item.emp_email,
                department: item.dept_name,
                deptId: item.dept_id
              }
              // let vitem = item.emp_email + ',' + item.dept_id + ',' + item.dept_name
              _this.empOptions.push({
                value: vitem,
                label: item.emp_name + "(" + item.emp_email+ ")"
              })
              _this.empList.push(vitem)
            })
          }

          // 涉及部门
          if (eventData.depts && eventData.depts.length > 0) {
            eventData.depts.forEach(item => {
              this.deptOptions.push({
                value: item.dept_id,
                label: item.dept_name
              })
              this.deptList.push(item.dept_id)
            })
          }

          // 计算事件等级是否可以更改（四级事件，在处置中状态，不允许修改事件等级）
          this.isChangeLevel()
          this.onChangeSeriousLevel(this.manageForm.level)
          this.onChangeEventStatus(this.manageForm.status)

          // 信息安全事件申诉部分
          if (eventData.applyRecord) {
            this.manageForm.appealName = eventData.applyRecord.operatorUser
            this.manageForm.appealTime = eventData.applyRecord.createTime
            this.manageForm.appealReason = eventData.applyRecord.remark
            // this.manageForm.applyStatus = eventData.applyRecord.status || ''
            // this.manageForm.applyRemark = eventData.applyRecord.remark || ''
          } else {
            this.manageForm.applyStatus = null
            this.manageForm.applyRemark = ''
          }
        } else {
          this.$message.error(res.data.errmsg)
        }
      })
    },

    /**
     * 获取关联告警列表
     */
    getRelativeAlarm(id) {
      this.$http.get("alarm/queryListByEventId", { params: { 'event_id': id } }).then(res => {
        if (res.data.errno == 0) {
          this.alarmListTableData = res.data.data
        } else {
          this.$message.error(res.data.errmsg)
        }
      })
    },

    /**
     * 获取关联工单列表
     */
    getRelativeOrder(id) {
      this.$http.get("alarm/workOrder/list", { params: { 'eventId': Number(id), 'page': 1, 'size': 1000 } }).then(res => {
        if (res.data.errno == 0) {
          this.orderListTableData = res.data.data
        } else {
          this.$message.error(res.data.errmsg)
        }
      })
    },

    /**
     * 获取下拉列表初始化参数
     */
    getSelectOptions(id) {
      let url = 'dictionary/listByDataAuth/' + id
      this.$http.get(url).then(({ body }) => {
        // body.data.splice(0, 1, { id: null, dName: this.$t('hint.select') });
        let options = body.data.map(({ id: value, dName: label, linkContent: linkContent }) => {
          return {
            value,
            label,
            linkContent,
            disabled: false
          };
        });
        switch (id) {
          case 1330:
            this.levelOptions = options
            break
          case 1300:
            this.seriousOptions = options
            break;
          case 1310:
            this.sourceOptions = options
            break
          case 1320:
            if (this.$route.query.id) {
              this.statusOptions = options
            } else {
              options && options.length > 0 && options.forEach(item => {
                if (Number(item.value) < 1324 ) {
                  this.statusOptions.push(item)
                }
              })
            }
            break
          case 1550:
            this.labelIdsOptions = options
            break
          // case 1500:
          //   this.authLabelOptions = options
          //   break
          case 1510:
            this.rccdsOptions = options
            break
          case 2040:
            options && options.length > 0 && options.forEach(item => {
                if (item.value == 2043 || item.value == 2044 ) {
                  this.appealOptions.push(item)
                }
            })
            break
        }
      })
    },

    getSurveyLeader() {
      this.$http.get('secEvent/surveyers/get').then(res => {
        let result = res.data.data
        if (result && result.surveyMembers && result.surveyMembers.length > 0) {
          this.surveyMemberOption = []
            result.surveyMembers.forEach(item => {
            this.manageForm.surveyMemberList.push(item.name + '(' + item.email + ')')
            this.surveyMemberOption.push({
              label: item.name + '(' + item.email + ')',
              value: item.name + '(' + item.email + ')'
            })
          })
        }
        let account = result && result.creater && result.creater.email && result.creater.email.split('@')[0]
        this.creater = ` <a target="_blank" href="http://i.xiaojukeji.com/space/personal/${account}?lang=zh-CN">${result.creater.name}</a>`
      })
    },

    // 计算事件等级是否可以更改（四级事件，在处置中, 已关闭状态，不允许修改事件等级）
    isChangeLevel: function() {
      if (this.manageForm.level == 1304 && (this.manageForm.status == 1321 || this.manageForm.status == 1323)) {
        this.disabledLevel = true
      } else {
        this.disabledLevel = false
      }
    },

    getReviewDetail(id) {
      this._id = id || this.eventId
      if(this._id) {
        this.$http.get('secEvent/review/get', { params: { eventId: this._id } }).then(({ body }) => {
          this.safetyReviewData = body && body.data && body.data.secureInformationReview || {}
          this.businessReviewData = body && body.data && body.data.businessReview || {}
          // 参加人
          this.safetyReviewData.reviewParticipantHtml = ''
          if (this.safetyReviewData.reviewParticipant instanceof Array && this.safetyReviewData.reviewParticipant.length > 0) {
            this.safetyReviewData.reviewParticipant.forEach(item => {
              let name = item.email.substr(0, item.email.indexOf('@'))
              this.safetyReviewData.reviewParticipantHtml += ` <a target="_blank" href="http://i.xiaojukeji.com/space/personal/${name}?lang=zh-CN">${item.name}</a>` + ','
            })
            this.safetyReviewData.reviewParticipantHtml = this.safetyReviewData.reviewParticipantHtml.substring(0, this.safetyReviewData.reviewParticipantHtml.length - 1)
          }
          this.businessReviewData.reviewParticipantHtml = ''
          if (this.businessReviewData.reviewParticipant instanceof Array && this.businessReviewData.reviewParticipant.length > 0) {
            this.businessReviewData.reviewParticipant.forEach(item => {
              let name = item.email.substr(0, item.email.indexOf('@'))
              this.businessReviewData.reviewParticipantHtml += ` <a target="_blank" href="http://i.xiaojukeji.com/space/personal/${name}?lang=zh-CN">${item.name}</a>` + ','
            })
            this.businessReviewData.reviewParticipantHtml = this.businessReviewData.reviewParticipantHtml.substring(0, this.businessReviewData.reviewParticipantHtml.length - 1)
          }
        })
      }
    }
  },

  created() {
    // 获取数据字典，初始化查询下拉参数
    this.getSelectOptions(1330) //levelOptions
    this.getSelectOptions(1300) //seriousOptions
    this.getSelectOptions(1310) //sourceOptions
    this.getSelectOptions(1320) //statusOptions
    this.getSelectOptions(1550)
    // this.getSelectOptions(1500)
    this.getSelectOptions(1510)
    this.getSelectOptions(2040)
    let id = this.$route.query.id
    this.manageForm.id = id
    if (id) {
      // 获取事件详情
      this.detailEventDate(id)

      // 获取关联告警
      this.getRelativeAlarm(id)

      // 获取关联工单
      this.getRelativeOrder(id)

      // 获取复盘信息
      this.getReviewDetail(id)
    } else {
      // 获取事件创建人以及调查负责人
      this.getSurveyLeader()
    }
  }
}
</script>

<style lang="less">

.manage-event-edit {
  &__content {
    width: 80%;
    margin: 0 auto;

    .el-form-item__label::after {
      content: ':'
    }
  }
  .el-table__header th {
    color: #494b55;
    text-align: center;
    background-color: #f3f4f5;
  }
}
.manage-event-edit header {
  margin-bottom: 20px;
  margin-left: 35px;
}
.manage-event__form .row {
  margin-bottom: 15px;
}

.manage-event__form .row:last-child {
  text-align: center;
}

.manage-event__form label {
  float: right;
}

.manage-event__form label::after {
  content: ":";
}

.select-alarm__modal {
  .modal-dialog {
    max-width: 1100px;
  }
}
</style>



