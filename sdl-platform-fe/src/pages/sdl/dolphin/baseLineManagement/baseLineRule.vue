<template>
  <div class="baselineRule">
    <div class="el-main">
      <div class="btnWrap">
        <button type="button" class='base-line-btn' @click="openTestDialog()"><span>测试基线生成规则</span></button>
        <button type="button" class='base-line-btn' @click="openDialog()"><span>新增基线生成规则</span></button>
      </div>
      <el-table
        ref="baselineTable"
        :data="baselineRuleList"
        v-loading>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="table-expand" label-width="90px">
              <el-form-item label="ID:">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="项目类型:">
                <span>{{ props.row.condition_project_type.join(', ') }}</span>
              </el-form-item>
              <el-form-item label="项目属性:">
                <span>{{ props.row.condition_project_property.join(', ') }}</span>
              </el-form-item>
              <el-form-item label="主要开发语言:">
                <span>{{ props.row.condition_language.join(', ') }}</span>
              </el-form-item>
              <el-form-item label="数据等级:">
                <span>{{ props.row.condition_data_level.join(', ') }}</span>
              </el-form-item>
              <el-form-item label="用户类型:">
                <span>{{ props.row.condition_target_user.join(', ') }}</span>
              </el-form-item>
              <el-form-item label="直接调用方:">
                <span>{{ props.row.condition_service_invoker.join(', ') }}</span>
              </el-form-item>
              <el-form-item label="外网访问:">
                <span>{{ handleParam(props.row.condition_is_internet, accessInternet) }}</span>
              </el-form-item>
              <el-form-item label="外包开发:">
                <span>{{ handleParam(props.row.condition_is_offshore, isOffshore) }}</span>
              </el-form-item>
              <el-form-item label="外采系统:">
                <span>{{ handleParam(props.row.condition_is_purchase, isPurchase) }}</span>
              </el-form-item>
              <el-form-item label="添加基线:">
                <p v-for="item in props.row.add_baselines" :key="item">{{ handleOperationValue(item, true) }}</p>
              </el-form-item>
              <el-form-item label="移除基线:">
                <p v-for="item in props.row.remove_baselines" :key="item">{{ handleOperationValue(item, true) }}</p>
              </el-form-item>
              <el-form-item label="优先级:">
                <span>{{ props.row.match_order }}</span>
              </el-form-item>
              <el-form-item label="创建时间:">
                <span>{{ props.row.create_time }}</span>
              </el-form-item>
              <el-form-item label="更新时间:">
                <span>{{ props.row.update_time }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="id"
          label="ID"
          align="center"
          width="80">
        </el-table-column> -->
        <el-table-column
          label="添加基线">
          <template slot-scope="scope">
            <li class="lengthLimit" v-for="(item, index) in scope.row.add_baselines" :key="index">{{ handleOperationValue(item) }}</li>
          </template>
        </el-table-column>
        <el-table-column
          label="移除基线">
          <template slot-scope="scope">
            <li class="lengthLimit" v-for="(item, index) in scope.row.remove_baselines" :key="index">{{ handleOperationValue(item) }}</li>
          </template>
        </el-table-column>
        <el-table-column
          property="match_order"
          label="优先级"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="openDialog(scope.row)"
                       type="text"
                       size="mini">编辑
            </el-button>
            <el-button type="text"
                       size="mini"
                       @click="openWarnDialog(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div align="right" style="margin-top: 10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParam.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="queryParam.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="num">
        </el-pagination>
      </div>
    </div>
    <!-- 编辑基线生成规则 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="460px">
      <el-form :inline="true" :model="baselineRule" :rules="rules" ref="baselineRule" label-width="100px" label-position="left">
          <el-form-item label="优先级" prop="match_order">
            <el-input class="inputBaseline"
                      v-model="baselineRule.match_order"
                      placeholder="请输入优先级，需输入整形数值"
                      clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="项目类型" prop="condition_project_type">
            <el-select
              placeholder="请选择项目类型"
              multiple
              clearable
              v-model="baselineRule.condition_project_type">
              <el-option
                v-for="item in projectType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目属性" prop="condition_project_property">
            <el-select
              placeholder="请选择项目属性"
              multiple
              clearable
              v-model="baselineRule.condition_project_property">
              <el-option
                v-for="item in projectProperty"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主要开发语言">
            <el-select
              placeholder="请选择主要开发语言"
              multiple
              clearable
              v-model="baselineRule.condition_language">
              <el-option
                v-for="item in projectLanguage"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据等级" prop="condition_data_level">
            <el-select
              placeholder="请选择数据等级"
              multiple
              clearable
              v-model="baselineRule.condition_data_level">
              <el-option
                v-for="item in dataLevel"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目标用户" prop="condition_target_user">
            <el-select
              placeholder="请选择目标用户"
              multiple
              clearable
              v-model="baselineRule.condition_target_user">
              <el-option
                v-for="item in targetUser"
                :key="item.value"
                :disabled="false"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="直接调用方" prop="condition_service_invoker">
            <el-select  class="createProjectDialog-important-input"
            placeholder="请选择直接调用方"
            multiple
            v-model="baselineRule.condition_service_invoker">
            <el-option-group
              v-for="group in serviceInvoker"
              :key="group.label"
              :disabled="group.disabled"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="group.disabled"
                >
              </el-option>
            </el-option-group>
          </el-select>
          </el-form-item>
          <el-form-item label="是否对外网开发" prop="condition_is_internet">
            <el-select
              placeholder="请选择是否对外网开发"
              clearable 
              multiple
              v-model="baselineRule.condition_is_internet">
              <el-option
                v-for="item in accessInternet"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否为外包系统">
            <el-select
              placeholder="请选择是否为外包系统"
              multiple
              clearable
              v-model="baselineRule.condition_is_offshore">
              <el-option
                v-for="item in isOffshore"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否为外采系统">
            <el-select
              placeholder="请选择是否为外采系统"
              multiple
              clearable
              v-model="baselineRule.condition_is_purchase">
              <el-option
                v-for="item in isPurchase"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="添加基线" prop="add_baselines">
            <el-select
              placeholder="请选择添加基线"
              multiple
              clearable
              collapse-tags
              @change='slectChange($event, "add", "add_baselines")'
              v-model="baselineRule.add_baselines">
              <el-option
                v-for="item in baselineList"
                :key="item.baseline_name"
                :label="(item.baseline_no + item.baseline_name).length>20?(item.baseline_no +': '+ item.baseline_name).substring(0, 20)+'...':(item.baseline_no +': '+ item.baseline_name)"
                :value="item.baseline_no">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="删除基线" prop="remove_baselines">
            <el-select
              placeholder="请选择删除基线"
              multiple
              clearable
              collapse-tags
              @change='slectChange($event, "remove", "remove_baselines")'
              v-model="baselineRule.remove_baselines">
              <el-option
                v-for="item in baselineList"
                :key="item.baseline_name"
                :label="item.baseline_name =='添加所有'?'all: 删除所有':(item.baseline_no + item.baseline_name).length>20?(item.baseline_no +': '+ item.baseline_name).substring(0, 20)+'...':(item.baseline_no +': '+ item.baseline_name)"
                :value="item.baseline_no">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" v-if="title=='编辑基线生成规则'">
            <el-input class="inputBaseline"
                      v-model="baselineRule.create_time"
                      placeholder=""
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="更新时间" v-if="title=='编辑基线生成规则'">
            <el-input class="inputBaseline"
                      v-model="baselineRule.update_time"
                      placeholder=""
                      disabled></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="base-line-diaolog-button" @click="dialogFormVisible = false">取消</el-button>
        <el-button class="base-line-diaolog-btn" type="warning" round @click="submitForm('baselineRule')">确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示"
               :visible.sync="dialogWarnVisible"
               width="30%">
      <span>是否确认删除此基线生成规则？</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="base-line-diaolog-button" @click="dialogWarnVisible = false">取消</el-button>
        <el-button class="base-line-diaolog-btn" type="primary" @click="deleteBaselineRuleInfo(baselineRule.id)">确定</el-button>
      </span>
    </el-dialog>

    <baselineRule-dialog  :dialogVisible='dialogTestRuleVisible' @formVisible='getFormDialog' :dialogTestDialog='dialogTestRuleResultlVisible' @formTestVisible='getTestFormDialog'></baselineRule-dialog>

    <el-dialog 
      title="基线生成规则测试结果"
      :visible.sync="dialogTestRuleResultlVisible"
      width="460px"
      append-to-body>
      <el-table
      ref="testBaselineRuleResultTable"
      :data="testBaselineRuleResult"
      v-loading>
        <el-table-column
          prop="baseline_no"
          label="基线编号"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="baseline_name"
          label="基线名称"
          align="center">
        </el-table-column>
      </el-table>
       <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTestRuleResultlVisible = false" class="base-line-diaolog-button">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {connect} from '@/lib'
  import * as CONSTANTS from '@/commons/dolphin'
  import baselineRuleDialog from './components/baselineRuleDialog'

  // import TestRuleDialog from './components/testRuleDialog'
  // import dialog from '@/utils/dialog'

  export default connect(() => {
    return {
      baselineRuleList: 'dolphin_baseline_rule/baselineRuleList',
      num: 'dolphin_baseline_rule/baselineRuleListLength',
      baselines: 'dolphin_baseline/baselines',
      baselineList: 'dolphin_baseline/baselineList',
      testBaselineRuleResult: 'dolphin_baseline_rule/testBaselineRuleResult'
    }
  }, {
    getBaselineRuleList: 'dolphin_baseline_rule/getBaselineRuleList',
    updateBaselineRule: 'dolphin_baseline_rule/updateBaselineRule',
    createBaselineRule: 'dolphin_baseline_rule/createBaselineRule',
    deleteBaselineRule: 'dolphin_baseline_rule/deleteBaselineRule',
    testBaselineRule: 'dolphin_baseline_rule/testBaselineRule',
    getBaselineList: 'dolphin_baseline/getBaselineList'

    // prepareBaseline: 'dolphin_baseline/prepareBaseline'
  })({
    name: 'baselineRule',
    data() {
      return {
        editable: true,
        dialogFormVisible: false,
        dialogWarnVisible: false,
        dialogTestRuleVisible: false,
        dialogTestRuleResultlVisible: false,
        title: '新建基线生成规则',
        myBaselineList: [],
        oldOptions: [],
        removeOptions: [],
        projectLanguage: CONSTANTS.projectLanguage,
        targetUser: CONSTANTS.targetUser,
        projectTargetUser: CONSTANTS.targetUser,
        serviceInvoker: CONSTANTS.serviceInvoker,
        projectServiceInvoker: CONSTANTS.projectServiceInvoker,
        dataLevel: CONSTANTS.dataLevel,
        projectType: CONSTANTS.projectType,
        projectProperty: CONSTANTS.projectProperty,
        SDLProjectProperty: CONSTANTS.SDLProjectProperty,
        RDProjectProperty: CONSTANTS.projectProperty,
        accessInternet: CONSTANTS.accessInternet,
        isOffshore: CONSTANTS.isOffshore,
        isPurchase: CONSTANTS.isPurchase,
        baselineRule: {
          id: 0,
          condition_project_type: '',
          condition_project_property: '',
          condition_language: '',
          condition_data_level: '',
          condition_target_user: '',
          condition_service_invoker: '',
          condition_is_internet: '',
          condition_is_offshore: '',
          condition_is_purchase: '',
          add_baselines: '',
          remove_baselines: '',
          match_order: ''
        },
        baselineRuleRequest: {},
        queryParam: {
          page: 1,
          limit: 10,
          keywords: {}
        },
        project: {
          project_type: '',
          project_property: '',
          language: '',
          target_user: [],
          service_invoker: [],
          data_level: '',
          is_internet: '',
          is_offshore: '',
          is_purchase: ''
        },
        rules: {
          match_order: [
            {required: true, message: '', trigger: 'change'},
            {validator(rule, value, callback) {
              if (Number.isInteger(Number(value)) && Number(value) > 0 && Number(value) < 999) {
                callback()
              } else {
                callback(new Error('请输入1-999的正整数'))
              }
            },
            trigger: 'change'
          }]

          // condition_project_type: [{type: 'array', required: true, message: '', trigger: 'change'}],
          // condition_project_property: [{type: 'array', required: true, message: '', trigger: 'change'}],
          // condition_data_level: [{type: 'array', required: true, message: '', trigger: 'change'}],
          // condition_target_user: [{type: 'array', required: true, message: '', trigger: 'change'}],
          // condition_service_invoker: [{type: 'array', required: true, message: '', trigger: 'change'}],
          // condition_is_internet: [{type: 'array', required: true, message: '', trigger: 'change'}],
          // add_baselines: [{type: 'array', required: true, message: '', trigger: 'change'}],
          // remove_baselines: [{type: 'array', required: true, message: '', trigger: 'change'}]
        }
      }
    },
    created() {
      this.fetchData()
      let request = {
          page: 1,
          limit: 1000,
          keywords: {
            baseline_no: '',
            baseline_type1: '',
            baseline_type2: '',
            baseline_type3: '',
            baseline_name: '',
            is_forced: ''
          }
        }
      this.getBaselineList(request).then(res => {

        this.baselineList.unshift({baseline_no: 'all', baseline_name: '添加所有'})
      })
    },
    components: { baselineRuleDialog },
    mounted() {
    },
    watch: {
      'project.is_internet': {
        handler(val) {
          let that = this
          if (val == 2 || val == 1 || val == 3) {
            this.serviceInvoker = [
              {label: '没有前端页面',
                options: [
                  {value: '外网服务', label: '外网服务'},
                  {value: '不提供接口', label: '不提供接口'}
                ]},
                {label: '有前端页面',
                options: [
                  {value: '前端页面', label: '前端页面'},
                  {value: 'IOT设备', label: 'IOT设备'},
                  {value: '手机APP', label: '手机APP'},
                  {value: '手机H5', label: '手机H5'},
                  {value: '微信类小程序', label: '微信类小程序'}
                ]}
            ]
            that.project.service_invoker.splice(0, that.project.service_invoker.length)
          } else {
            this.projectServiceInvoker = CONSTANTS.projectServiceInvoker
          }
          if (val == 0) {
            this.projectTargetUser = [
            {value: '政府', label: '政府，如交管局、各地政府等'},
            {value: '正式员工', label: '滴滴正式员工'},
            {value: '外包员工', label: '滴滴外包员工'},
            {value: '实习生', label: '滴滴实习生'},
            {value: '其它', label: '其它服务或系统'}
            ]
            that.project.target_user.splice(0, that.project.target_user.length)
          } else {
            this.projectTargetUser = CONSTANTS.targetUser
          }
        }
      }
    },
    methods: {
      fetchData() {
        let queryParam = this.queryParam
        this.getBaselineRuleList(queryParam).then(res => {
        })
      },
      getFormDialog(val) {
        this.dialogTestRuleVisible = val
      },
      getTestFormDialog(val) {
        this.dialogTestRuleResultlVisible = val
      },
      openDialog(data = '') {
        if (this.$refs.baselineRule != undefined) {
          this.$refs.baselineRule.clearValidate()
        }
        if (data) {
          this.title = '编辑基线生成规则'
          this.baselineRule = {
            id: data.id,
            condition_project_type: data.condition_project_type,
            condition_project_property: data.condition_project_property,
            condition_language: data.condition_language,
            condition_data_level: data.condition_data_level,
            condition_target_user: data.condition_target_user,
            condition_service_invoker: data.condition_service_invoker,
            condition_is_internet: data.condition_is_internet,
            condition_is_offshore: data.condition_is_offshore,
            condition_is_purchase: data.condition_is_purchase,
            add_baselines: data.add_baselines,
            remove_baselines: data.remove_baselines,
            match_order: data.match_order,
            create_time: data.create_time,
            update_time: data.update_time
          }

          // this.baselineRule.add_baselines = this.baselineRule.add_baselines.map((value) => {
          //   return parseInt(value);
          // })
          // this.baselineRule.remove_baselines = this.baselineRule.remove_baselines.map((value) => {
          //   return parseInt(value);
          // })
        } else {
          this.title = '新建基线生成规则'
          this.baselineRule = {
            condition_project_type: [],
            condition_project_property: [],
            condition_language: [],
            condition_data_level: [],
            condition_target_user: [],
            condition_service_invoker: [],
            condition_is_internet: [],
            condition_is_offshore: [],
            condition_is_purchase: [],
            add_baselines: [],
            remove_baselines: [],
            match_order: null
          }
        }
        this.dialogFormVisible = true
      },
      openWarnDialog(id) {
        this.dialogWarnVisible = true
        this.baselineRule.id = id
      },
      slectChange(value, name, porperty) {
          let allValues = []
          for (let item of this.baselineList) {
              allValues.push(item.baseline_no)
          }
          let oldVal = []
          if (name === 'add') {
            oldVal = this.oldOptions
          } else if (name === 'remove') {
            oldVal = this.removeOptions
          }
          if (value.includes('all')) {
            this.baselineRule[porperty] = allValues
          }
          if (oldVal.includes('all') && !value.includes('all')) this.baselineRule[porperty] = []
          if (oldVal.includes('all') && value.includes('all')) {
              const index = value.indexOf('all')
              value.splice(index, 1)
              this.baselineRule[porperty] = value
          }

          //  全选未选,但是其他选项全部选上,则全选选上,上次和当前,都没有全选
          if (!oldVal.includes('all') && !value.includes('all')) {
              if (value.length === allValues.length - 1) this.baselineRule[porperty] = ['all'].concat(value)
          }

          //  储存当前最后的结果, 作为下次的老数据
          if (name === 'add') {
            this.oldOptions = this.baselineRule[porperty]
          } else if (name === 'remove') {
            this.removeOptions = this.baselineRule[porperty]
          }
      },
      openTestDialog() {

        // dialog({
        //   title: '测试基线生成规则',
        //   component: TestRuleDialog,
        //   width: '460px'
        // })
        this.project = {
          project_type: '',
          project_property: '',
          language: '',
          target_user: [],
          service_invoker: [],
          data_level: '',
          is_internet: '',
          is_offshore: '',
          is_purchase: ''
        }
        this.dialogTestRuleVisible = true
      },
      submitTestRule() {
        let queryParam = {
          project: this.project
        }
        this.testBaselineRule(queryParam).then(res => {
          this.dialogTestRuleVisible = false
          this.dialogTestRuleResultlVisible = true
        })
      },
      handleBaselineRuleValue() {
        this.baselineRuleRequest = {
          id: this.baselineRule.id,
          condition_project_type: this.baselineRule.condition_project_type.join(','),
          condition_project_property: this.baselineRule.condition_project_property.join(','),
          condition_language: this.baselineRule.condition_language.join(','),
          condition_data_level: this.baselineRule.condition_data_level.join(','),
          condition_target_user: this.baselineRule.condition_target_user.join(','),
          condition_service_invoker: this.baselineRule.condition_service_invoker.join(','),
          condition_is_internet: this.baselineRule.condition_is_internet.join(','),
          condition_is_offshore: this.baselineRule.condition_is_offshore.join(','),
          condition_is_purchase: this.baselineRule.condition_is_purchase.join(','),
          add_baselines: this.baselineRule.add_baselines.join(','),
          remove_baselines: this.baselineRule.remove_baselines.join(','),
          match_order: parseInt(this.baselineRule.match_order)
        }
      },
      submitBaselineRuleInfo() {
        this.handleBaselineRuleValue()
        if (this.title == '编辑基线生成规则') {
          this.updateBaselineRuleInfo(this.fetchData)
        } else {
          this.createBaselineRuleInfo(this.fetchData)
        }

        // this.fetchData()
        this.dialogFormVisible = false
      },
      createBaselineRuleInfo(callback) {
        this.createBaselineRule(this.baselineRuleRequest).then(res => {
          callback()
        })
      },
      updateBaselineRuleInfo(callback) {
        this.updateBaselineRule(this.baselineRuleRequest).then(res => {
          callback()
        })
      },
      deleteBaselineRuleInfo(id) {
        this.deleteBaselineRule({'id': id}).then(res => {
        })
        this.dialogWarnVisible = false
        this.fetchData()
      },
      handleSizeChange(val) {
        this.queryParam.limit = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryParam.page = val
        this.fetchData()
      },
      array2str(arr) {
        return arr.join(' ')
      },
      handleParam(data, params = this.baselines) {
        let arr = []
        for (let i = 0; i < data.length; i++) {
          arr[i] = CONSTANTS.preHandleParam(data[i], params)
        }
        return arr.join(', ')
      },
      handleOperationValue(data, inExpand) {
        for (let i = 0; i < this.baselineList.length; i++) {
          if (data == this.baselineList[i].baseline_no) {
            if (!inExpand) {
              data = this.baselineList[i].baseline_no + ': ' + this.baselineList[i].baseline_name

              // let data2 = this.baselineList[i].baseline_name
              // data = this.baselineList[i].baseline_no + ': ' + data2.length > 10 ? data2.substring(0, 10) + '...' : data2
            } else {
              data = this.baselineList[i].baseline_no + ': ' + this.baselineList[i].baseline_name
            }
          }
        }
        return data
      },
      submitForm(formname) {
        this.$refs[formname].validate((valid) => {
          if (valid) {
            console.log(valid)
            this.submitBaselineRuleInfo()
            this.fetchData()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  })
</script>
<style lang="less" scoped>
  .btnWrap {
    height: 40px;
    .base-line-btn {
      border: 1px solid #FC9153;
      border-radius: 4px;
      float: right;
      width: 120px;
      height: 32px;
      color: white;
      background: #FC9153;
      margin-left: 15px;
      cursor: pointer;
      -webkit-font-smoothing: antialiased;
      padding: 0;
      font-size: 13px;
      span {
        font-family: Avenir, Helvetica, Arial, sans-serif;
      }
    }
  }

  .base-line-diaolog-button {
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    font-size: 13px;
  }

  .base-line-diaolog-btn {
    background: #FC9153;
    border-radius: 4px;
    width: 80px;
    height: 32px;
    padding: 7px 15px;
    font-size: 13px;
    border: none;
  }

  .baselineRule {
    width: 100%;
    background: white;
    // margin-top: -10px;
    // padding: 5px;
    // padding-top: 10px;
    .el-main {
      width: 100%;
      box-sizing: border-box;
      // margin-top: -15px;
      // padding: 20px;
      // margin-left: -5px;
      .displayFlex {
        display: flex;
      }
      .searchForm {
        .searchInput {
          width: 230px;
        }
      }
    }
  }

  .inputBaseline {
    width: 320px;
  }

  .el-select {
    width: 320px;
  }

  .el-button--text {
    font-weight: 400;
  }

  .table-expand {
    font-size: 0;
    padding: 3px 20px;
  }

  .table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .cutLine {
    // border: 1px solid
    margin-top: 5px;
    margin-bottom: 17px;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0.10);
    // background: rgba(0, 0, 0, 0.10);
    // border-radius: 4px;
  }
  .lengthLimit {
    max-width: 360px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>

<style lang="less">
.baselineRule {
  .table-expand label {
    // color: #7e8fa7;
    color: #596385;
    font-size: 12.5px;
  }
}
</style>
