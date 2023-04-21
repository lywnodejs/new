<template>
<el-dialog id="baseline-rule-form-dialog" title="测试基线生成规则"  :visible.sync="dialogFormVisible" width="900px">
    <span class="createProjectDialog-label">基本信息</span>
      <el-form :model="project" label-width="100px" ref="testBaselineRuleForm" label-position="left">
        <div class="createProjectDialog-display">
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
        <el-form-item class="createProjectDialog-input" prop="project_property" label="项目属性"  style="margin-left:20px;">
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
        </div>
        <div class="createProjectDialog-display">
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
            <el-form-item class="createProjectDialog-input" style="margin-bottom: 0;margin-left:20px;" label="是否外包开发" prop="is_offshore">
            <el-radio-group v-model="project.is_offshore">
                <el-radio class="label" label=1>是</el-radio>
                <el-radio class="label" label=0>否</el-radio>
            </el-radio-group>
            </el-form-item>
        </div>
        
        <el-form-item class="createProjectDialog-input" label="是否外采系统" prop="is_purchase">
            <el-radio-group v-model="project.is_purchase">
                <el-radio class="label" label=1>是</el-radio>
                <el-radio class="label" label=0>否</el-radio>
            </el-radio-group>
            </el-form-item>
      </el-form>
      <span class="createProjectDialog-label">关键信息--<span>您填写的信息会直接影响基线的准确性，请认真思考后再填写，如不确认请先查看<span class="app-color--info"  @click="bounceURL"><i class="iconfont icon-help"></i></span>或联系安全BP确认</span></span>
    <el-form  label-width="100px" label-position="top">
      <div class="createProjectDialog-display">
        <el-form-item prop="is_system" label="您当前评估的项目是一个独立的系统，还是一个系统中某个服务或模块">
        <el-select  class="createProjectDialog-important-input"
          placeholder="请选择"
          v-model="project.is_system">
          <el-option
            v-for="item in isSystem"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="is_internet" label="您的系统是否对外网开放"  style="margin-left:20px;">
        <el-select class="createProjectDialog-important-input"
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
      </div>
      <div class="createProjectDialog-display">
        <el-form-item prop="service_invoker">
        <label slot="label">
          系统是否有前端页面
        </label>
        <el-select  class="createProjectDialog-important-input"
          placeholder="请选择"
          multiple
          v-model="project.service_invoker">
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
              @change='valueChange(item, project.service_invoker)'
              >
              <el-checkbox v-model="project.service_invoker"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @change='valueChange(item, project.service_invoker)'></el-checkbox>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item prop="target_user" :label="labelConntext" style="margin-left:20px;">
        <el-select class="createProjectDialog-important-input"
          placeholder="请选择业务用户类型"
          multiple
          v-model="project.target_user">
          <el-option
            v-for="item in targetUser"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            <el-checkbox v-model="project.target_user" style="font-size: 13px;"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            @change='valueChange(item, project.target_user)'></el-checkbox>
          </el-option>
        </el-select>
      </el-form-item>
      </div>
      
      <el-form-item prop="data_level" label="">
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
        <el-select class="createProjectDialog-important-input"
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
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" class="base-line-diaolog-button">取消</el-button>
        <el-button
          class="base-line-diaolog-btn"
          type="warning"
          round
          @click="submitTestRule()">
          测试规则
        </el-button>
      </div>
    </el-dialog>
</template>

<script>
import { connect } from '@/lib'
import * as CONSTANTS from '@/commons/dolphin'

export default connect(() => {
  return {
  }
}, {
    testBaselineRule: 'dolphin_baseline_rule/testBaselineRule'
})({
  name: 'vul-type',
  props: ['dialogVisible', 'dialogTestDialog', 'scopeRow'],
  data() {
    return {
        dialogFormVisible: false,
        dialogTestRuleResultlVisible: false,
        project: {
          project_type: '',
          project_property: '',
          language: '',
          target_user: [],
          service_invoker: [],
          data_level: '',
          is_internet: '',
          is_offshore: '',
          is_purchase: '',
          is_system: ''
        },
        labelConntext: '使用该系统的用户类型',
        projectLanguage: CONSTANTS.projectLanguage,
        targetUser: CONSTANTS.targetUser1,
        verifyTargetUser: CONSTANTS.targetUser,
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
        isSystem: CONSTANTS.isSystem
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    dialogVisible(val) {
        this.dialogFormVisible = val
    },
    dialogTestDialog(val) {
        this.dialogTestRuleResultlVisible = val
    },
    dialogFormVisible(val) {
        this.$emit('formVisible', this.dialogFormVisible)
    },
    dialogTestRuleResultlVisible(val) {
        this.$emit('formTestVisible', this.dialogTestRuleResultlVisible)
    },
    'project.is_system': {
        handler(val) {
          if (val == 0) {
            this.labelConntext = '使用该系统的用户类型'
          } else if (val == 1) {
            this.labelConntext = '使用该服务或模块的用户类型'
          } else if (val == 2) {
            this.labelConntext = '使用该前端页面的用户类型'
            this.serviceInvoker = [
                {label: '有前端页面',
                options: [
                  {value: '前端页面', label: '前端页面'},
                  {value: 'IOT设备', label: 'IOT设备'},
                  {value: '手机APP', label: '手机APP'},
                  {value: '手机H5', label: '手机H5'},
                  {value: '微信类小程序', label: '微信类小程序'}
                ]}
            ]
            this.targetUser = [
              {value: '外网用户，如司机、乘客等', label: '外网用户，如司机、乘客等', disabled: true},
              {value: '企业用户，如高德、阿里等', label: '企业用户，如高德、阿里等', disabled: true},
              {value: '合作伙伴，如北京大数据局，各高校等', label: '合作伙伴，如北京大数据局，各高校等', disabled: true},
              {value: '政府，如交管局、各地政府等', label: '政府，如交管局、各地政府等'},
              {value: '滴滴正式员工', label: '滴滴正式员工'},
              {value: '滴滴外包员工', label: '滴滴外包员工'},
              {value: '滴滴实习生', label: '滴滴实习生'}
            ]
            this.project.target_user.splice(0, this.project.target_user.length)
            this.project.service_invoker.splice(0, this.project.service_invoker.length)
          }
          if ((val == 0 || val == 1) && (this.project.is_internet == 2 || this.project.is_internet == 1 || this.project.is_internet == 3)) {
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
            this.project.service_invoker.splice(0, this.project.service_invoker.length)
          } else if ((val == 0 || val == 1) && this.project.is_internet == 0) {
            this.serviceInvoker = CONSTANTS.serviceInvoker
          }
        }
      },
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
            this.serviceInvoker = CONSTANTS.serviceInvoker
          }
          if (this.project.is_system == 2) {
            this.serviceInvoker = [
                {label: '有前端页面',
                options: [
                  {value: '前端页面', label: '前端页面'},
                  {value: 'IOT设备', label: 'IOT设备'},
                  {value: '手机APP', label: '手机APP'},
                  {value: '手机H5', label: '手机H5'},
                  {value: '微信类小程序', label: '微信类小程序'}
                ]}
            ]
            that.project.target_user.splice(0, that.project.target_user.length)
          }
          if (val == 0 && this.project.is_system == 2) {
            this.targetUser = [
              {value: '政府，如交管局、各地政府等', label: '政府，如交管局、各地政府等'},
              {value: '滴滴正式员工', label: '滴滴正式员工'},
              {value: '滴滴外包员工', label: '滴滴外包员工'},
              {value: '滴滴实习生', label: '滴滴实习生'}
            ]
            that.project.target_user.splice(0, that.project.target_user.length)
          } else if (this.project.is_system == 2) {
            this.targetUser = [
              {value: '外网用户，如司机、乘客等', label: '外网用户，如司机、乘客等', disabled: true},
              {value: '企业用户，如高德、阿里等', label: '企业用户，如高德、阿里等', disabled: true},
              {value: '合作伙伴，如北京大数据局，各高校等', label: '合作伙伴，如北京大数据局，各高校等', disabled: true},
              {value: '政府，如交管局、各地政府等', label: '政府，如交管局、各地政府等'},
              {value: '滴滴正式员工', label: '滴滴正式员工'},
              {value: '滴滴外包员工', label: '滴滴外包员工'},
              {value: '滴滴实习生', label: '滴滴实习生'}
            ]
          } else {
            this.targetUser = CONSTANTS.targetUser1
          }
        }
      }
  },
  methods: {
      submitTestRule() {
        this.validateTargetUser()
        let queryParam = {
          project: this.project
        }
        delete this.project.is_system
        this.testBaselineRule(queryParam).then(res => {
          this.dialogFormVisible = false
          this.dialogTestRuleResultlVisible = true
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
        })
      },
      valueChange(item, array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i] == item.value) {
            array.splice(i, 1)
            return
          }
        }
        array.push(item.value)
      },
      bounceURL() {
        window.open('http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=163616033')
      },
      validateTargetUser() {
        let arr = copyArr(this.project.target_user)
        function copyArr(arr) {
          let res = []
          for (let i = 0; i < arr.length; i++) {
          res.push(arr[i])
          }
          return res
        }
        for (let i = 0; i < this.project.target_user.length; i++) {
          this.verifyTargetUser.forEach(element => {
            if (this.project.target_user[i] === element.label) {
              this.project.target_user[i] = element.value
            }
          })
        }
        return arr
      }
  }
})
</script>
<style lang="less">
#baseline-rule-form-dialog{
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

  .base-line-diaolog-btn.search-btn {
    margin-left: 15px;
    width: 95px;
  }
  .createProjectDialog-display{
    display: flex;
  }
  .createProjectDialog-important-input{
    width: 420px !important;
  }
  .createProjectDialog-label{
    font-weight: bold;
    margin-bottom: 20px;
    span{
      color: #FF0000;
    }
  }
  .inputBaseline {
    width: 320px;
  }

  .el-select {
    width: 320px;
  }
}
</style>