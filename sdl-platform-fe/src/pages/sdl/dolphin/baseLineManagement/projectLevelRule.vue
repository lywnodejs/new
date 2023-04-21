<template>
  <div class="projectLevelRule">
    <div class="el-main">
      <div class="btnWrap">
        <button type="button" class='base-line-btn' @click="openTestDialog()"><span>测试项目等级规则</span></button>
        <button type="button" class='base-line-btn' @click="openDialog()"><span>新增项目等级规则</span></button>
      </div>
      <el-table
        ref="baseLineTable"
        :data="projectLevelRuleList"
        v-loading>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="table-expand" label-width="90px">
              <el-form-item label="ID:">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="项目等级:">
                <span>{{ props.row.project_level }}</span>
              </el-form-item>
              <el-form-item label="优先级:">
                <span>{{ props.row.match_order }}</span>
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
                <span>{{ handleParam(props.row.condition_is_internet, accessInternet, true) }}</span>
              </el-form-item>
              <el-form-item label="外包开发:">
                <span>{{ handleParam(props.row.condition_is_offshore, isOffshore, true) }}</span>
              </el-form-item>
              <el-form-item label="外采系统:">
                <span>{{ handleParam(props.row.condition_is_purchase, isPurchase, true) }}</span>
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
        <!-- <el-table-column
          prop="name"
          label="基线规则名称"
          align="center"
          width="180">
        </el-table-column> -->
        <el-table-column
          label="项目等级"
          align="center"
          width="100">
          <template slot-scope="scope">
            {{scope.row.project_level}}
          </template>
        </el-table-column>
        <el-table-column
          property="match_order"
          label="优先级"
          align="center">
        </el-table-column>
        <el-table-column
          label="数据等级"
          align="center"
          width="150">
          <template slot-scope="scope">
            {{scope.row.condition_data_level.join(', ')}}
          </template>
        </el-table-column>
        <el-table-column
          label="用户类型"
          align="center"
          width="160">
          <template slot-scope="scope">
            <li v-for="item in scope.row.condition_target_user" :key="item">{{item}}</li>
            <!-- {{scope.row.condition_target_user}} -->
          </template>
        </el-table-column>
        <el-table-column
          label="直接调用方"
          align="center"
          width="180">
          <template slot-scope="scope">
            <p v-for="item in scope.row.condition_service_invoker" :key="item">{{item}}</p>
            <!-- {{scope.row.condition_service_invoker}} -->
          </template>
        </el-table-column>
        <el-table-column
          label="外网访问"
          align="center"
          width="200">
          <template slot-scope="scope">
            <!-- {{scope.row.condition_is_internet}} -->
            <p v-for="item in handleParam(scope.row.condition_is_internet, accessInternet, false)" :key="item">{{item}}</p>
            <!-- {{handleParam(scope.row.condition_is_internet, accessInternet, false)}} -->
          </template>
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
          :page-sizes="[10,20,30,50]"
          :page-size="queryParam.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="num">
        </el-pagination>
      </div>
    </div>
    <!-- 编辑项目等级规则 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="460px">
      <el-form :inline="true" label-width="100px" :model="projectLevelRule" :rules="rules" label-position="left" ref="projectLevelRule">
        <!-- <el-col> -->
          <!-- <el-form-item label="基线规则名称">
            <el-input class="inputBaseLine"
                      v-model="projectLevelRule.name"
                      placeholder="请输入基线规则名称"
                      clearable>
            </el-input>
          </el-form-item> -->
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="优先级" prop="match_order">
            <el-input class="inputBaseLine"
                      v-model="projectLevelRule.match_order"
                      placeholder="请输入优先级，需输入整形数值"
                      clearable>
            </el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="项目类型" prop="condition_project_type">
            <el-select
              placeholder="请选择项目类型"
              multiple
              clearable
              v-model="projectLevelRule.condition_project_type">
              <el-option
                v-for="item in projectType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="项目属性" prop="condition_project_property">
            <el-select
              placeholder="请选择项目属性"
              multiple
              clearable
              v-model="projectLevelRule.condition_project_property">
              <el-option
                v-for="item in projectProperty"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目等级" prop="project_level">
            <el-select
              placeholder="请选择项目等级"
              clearable
              v-model="projectLevelRule.project_level">
              <el-option
                v-for="item in projectLevel"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="主要开发语言">
            <el-select
              placeholder="请选择主要开发语言"
              multiple
              clearable
              v-model="projectLevelRule.condition_language">
              <el-option
                v-for="item in projectLanguage"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="数据等级" prop="condition_data_level">
            <el-select
              placeholder="请选择数据等级"
              multiple
              clearable
              v-model="projectLevelRule.condition_data_level">
              <el-option
                v-for="item in dataLevel"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="目标用户" prop="condition_target_user">
            <el-select
              placeholder="请选择目标用户"
              multiple
              clearable
              v-model="projectLevelRule.condition_target_user">
              <el-option
                v-for="item in targetUser"
                :key="item.value"
                :disabled="projectLevelRule.condition_is_internet==0?item.disabled:false"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="直接调用方" prop="condition_service_invoker">
            <el-select
              placeholder="请选择直接调用方"
              multiple
              clearable
              v-model="projectLevelRule.condition_service_invoker">
              <el-option
                v-for="item in serviceInvoker"
                :key="item.value"
                :disabled="projectLevelRule.condition_is_internet!=0?item.disabled:false"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="是否对外网开发" prop="condition_is_internet">
            <el-select
              placeholder="请选择是否对外网开发"
              multiple
              clearable
              v-model="projectLevelRule.condition_is_internet">
              <el-option
                v-for="item in accessInternet"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="是否为外包系统">
            <el-select
              placeholder="请选择是否为外包系统"
              multiple
              clearable
              v-model="projectLevelRule.condition_is_offshore">
              <el-option
                v-for="item in isOffshore"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        <!-- </el-col>
        <el-col> -->
          <el-form-item label="是否为外采系统">
            <el-select
              placeholder="请选择是否为外采系统"
              multiple
              clearable
              v-model="projectLevelRule.condition_is_purchase">
              <el-option
                v-for="item in isPurchase"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        <!-- </el-col> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="base-line-diaolog-button" @click="dialogFormVisible = false">取消</el-button>
        <el-button class="base-line-diaolog-btn" type="warning" round @click="submitProjectLevelRuleInfo()">确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示"
               :visible.sync="dialogWarnVisible"
               width="30%">
      <span>是否确认删除此项目等级规则？</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="base-line-diaolog-button" @click="dialogWarnVisible = false">取消</el-button>
        <el-button class="base-line-diaolog-btn" type="primary" @click="deleteProjectLevelRuleInfo(projectLevelRule.id)">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="测试基线生成规则" :visible.sync="dialogTestRuleVisible" width="460px">
      <el-form :model="project" label-width="100px" ref="testBaselineRuleForm" label-position="left">
        <el-form-item class="createProjectDialog-input" prop="project_type" label="项目类型">
          <el-select
            v-model="project.project_type"
            filterable
            placeholder="请选择项目类型">
            <el-option
              v-for="item in projectType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="createProjectDialog-input" prop="project_property" label="项目属性">
          <app-permission>
            <el-select v-model="project.project_property" filterable placeholder="请选择项目属性">
              <el-option
                v-for="item in SDLProjectProperty"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="project.project_property" filterable placeholder="请选择项目属性">
              <el-option
                v-for="item in RDProjectProperty"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </app-permission>
        </el-form-item>
        <el-form-item class="createProjectDialog-input" prop="data_level" label="">
          <label slot="label">
            数据等级
            <a target="_blank" href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=150304086" style="color: #909399">
              <el-popover
                placement="right"
                width="200"
                trigger="hover"
                content="C1-C4，依据数据安全规范填写.  点击图标查看数据安全规范详情">
                <span slot="reference" class="app-color--info"><i class="iconfont icon-help"></i></span>
              </el-popover>
            </a>
          </label>
          <el-select
            placeholder="请选择数据等级"
            v-model="project.data_level">
            <el-option
              v-for="item in dataLevel"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="createProjectDialog-input" prop="language" label="主要开发语言">
          <el-select
            v-model="project.language"
            filterable
            placeholder="请选择主要开发语言">
            <el-option
              v-for="item in projectLanguage"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="createProjectDialog-input" prop="is_internet" label="提供外网访问">
          <el-select
            placeholder="请选择外网访问方式"
            v-model="project.is_internet">
            <el-option
              v-for="item in accessInternet"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="createProjectDialog-input" prop="service_invoker">
          <label slot="label">
            直接调用方
            <el-popover
              placement="right"
              width="200"
              trigger="hover"
              content="当通过API网关对外开放时，接口调用方请勿选择内网服务">
              <span slot="reference" class="app-color--info"><i class="iconfont icon-help"></i></span>
            </el-popover>
          </label>
          <el-select
            placeholder="请选择直接调用方"
            multiple
            v-model="project.service_invoker">
            <el-option
              v-for="item in projectServiceInvoker"
              :key="item.value"
              :disabled="project.is_internet!=0?item.disabled:false"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="createProjectDialog-input" prop="target_user" label="业务用户类型">
          <el-select
            placeholder="请选择业务用户类型"
            multiple
            v-model="project.target_user">
            <el-option
              v-for="item in targetUser"
              :key="item.value"
              :disabled="project.is_internet==0?item.disabled:false"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="createProjectDialog-input" style="margin-bottom: 0" label="是否外包开发" prop="is_offshore">
          <el-radio-group v-model="project.is_offshore">
            <el-radio class="label" label=1>是</el-radio>
            <el-radio class="label" label=0>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="createProjectDialog-input" label="是否外采系统" prop="is_purchase">
          <el-radio-group v-model="project.is_purchase">
            <el-radio class="label" label=1>是</el-radio>
            <el-radio class="label" label=0>否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTestRuleVisible = false" class="base-line-diaolog-button">取消</el-button>
        <el-button
          class="base-line-diaolog-btn"
          type="warning"
          round
          @click="submitTestRule()">
          测试规则
        </el-button>
      </div>
    </el-dialog>

    <el-dialog 
      title="项目等级规则测试结果"
      :visible.sync="dialogTestRuleResultlVisible"
      width="460px"
      append-to-body>
      <p>项目等级: {{ testProjectLevelRuleResult }} </p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTestRuleResultlVisible = false" class="base-line-diaolog-button">关闭</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import * as CONSTANTS from '@/commons/dolphin'

  export default connect(() => {
    return {
      projectLevelRuleList: 'dolphin_project_level_rule/projectLevelRuleList',
      num: 'dolphin_project_level_rule/projectLevelRuleListLength',
      testProjectLevelRuleResult: 'dolphin_project_level_rule/testProjectLevelRuleResult'
    }
  }, {
    getProjectLevelRuleList: 'dolphin_project_level_rule/getProjectLevelRuleList',
    updateProjectLevelRule: 'dolphin_project_level_rule/updateProjectLevelRule',
    createProjectLevelRule: 'dolphin_project_level_rule/createProjectLevelRule',
    deleteProjectLevelRule: 'dolphin_project_level_rule/deleteProjectLevelRule',
    testProjectLevelRule: 'dolphin_project_level_rule/testProjectLevelRule'
  })({
    name: 'projectLevelRule',
    data() {
      return {
        editable: true,
        dialogFormVisible: false,
        dialogWarnVisible: false,
        dialogTestRuleVisible: false,
        dialogTestRuleResultlVisible: false,
        title: '新建项目规则',
        projectLanguage: CONSTANTS.projectLanguage,
        projectLevel: CONSTANTS.projectLevel,
        targetUser: CONSTANTS.targetUser,
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
        projectLevelRule: {
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
          project_level: '',
          match_order: ''
        },
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

          // condition_project_type: {type: 'array', required: true, message: '', trigger: 'change'},
          // condition_project_property: {type: 'array', required: true, message: '', trigger: 'change'},
          // condition_data_level: {type: 'array', required: true, message: '', trigger: 'change'},
          // condition_target_user: {type: 'array', required: true, message: '', trigger: 'change'},
          // condition_service_invoker: {type: 'array', required: true, message: '', trigger: 'change'},
          // condition_is_internet: {type: 'array', required: true, message: '', trigger: 'change'},
          // project_level: {required: true, message: '', trigger: 'change'}
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        let queryParam = this.queryParam
        this.getProjectLevelRuleList(queryParam).then(res => {
        })
      },
      openDialog(data = '') {
        if (data) {
          console.log(data)
          this.title = '编辑项目等级规则'
          this.projectLevelRule = {
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
            project_level: data.project_level,
            match_order: data.match_order
          }
        } else {
          this.title = '新建项目等级规则'
          this.projectLevelRule = {
            condition_project_type: [],
            condition_project_property: [],
            condition_language: [],
            condition_data_level: [],
            condition_target_user: [],
            condition_service_invoker: [],
            condition_is_internet: [],
            condition_is_offshore: [],
            condition_is_purchase: [],
            project_level: '',
            match_order: ''
          }
        }
        this.dialogFormVisible = true
      },
      openWarnDialog(id) {
        this.dialogWarnVisible = true
        this.projectLevelRule.id = id
      },
      openTestDialog() {
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
        this.testProjectLevelRule(queryParam).then(res => {
          this.dialogTestRuleVisible = false
          this.dialogTestRuleResultlVisible = true
        })
      },
      handleProjectLevelRuleValue() {
        this.projectLevelRuleRequest = {
          id: this.projectLevelRule.id,
          condition_project_type: this.projectLevelRule.condition_project_type.join(','),
          condition_project_property: this.projectLevelRule.condition_project_property.join(','),
          condition_language: this.projectLevelRule.condition_language.join(','),
          condition_data_level: this.projectLevelRule.condition_data_level.join(','),
          condition_target_user: this.projectLevelRule.condition_target_user.join(','),
          condition_service_invoker: this.projectLevelRule.condition_service_invoker.join(','),
          condition_is_internet: this.projectLevelRule.condition_is_internet.join(','),
          condition_is_offshore: this.projectLevelRule.condition_is_offshore.join(','),
          condition_is_purchase: this.projectLevelRule.condition_is_purchase.join(','),
          project_level: this.projectLevelRule.project_level,
          match_order: parseInt(this.projectLevelRule.match_order)
        }
      },
      submitProjectLevelRuleInfo() {
        this.handleProjectLevelRuleValue()
        if (this.projectLevelRule.id) {
          this.updateProjectLevelRuleInfo(this.fetchData)
        } else {
          this.createProjectLevelRuleInfo(this.fetchData)
        }
        this.dialogFormVisible = false
      },
      createProjectLevelRuleInfo(callback) {
        this.createProjectLevelRule(this.projectLevelRuleRequest).then(res => {
          callback()
        })
      },
      updateProjectLevelRuleInfo(callback) {
        this.updateProjectLevelRule(this.projectLevelRuleRequest).then(res => {
          callback()
        })
      },
      deleteProjectLevelRuleInfo(id) {
        this.deleteProjectLevelRule({'id': id}).then(res => {
        })
        this.fetchData()
        this.dialogWarnVisible = false
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
      handleParam(data, params, inExpand) {
        let arr = []
        for (let i = 0; i < data.length; i++) {
          arr[i] = CONSTANTS.preHandleParam(data[i], params)
        }
        if (!inExpand) {
          return arr
        }
        return arr.join(', ')
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

  .projectLevelRule {
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

  .inputBaseLine {
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
</style>

<style lang="less">
.projectLevelRule {
  .table-expand label {
    // color: #7e8fa7;
    color: #596385;
    font-size: 12.5px;
  }
}
</style>
