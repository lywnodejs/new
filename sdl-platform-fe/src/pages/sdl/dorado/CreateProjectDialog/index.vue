<template>
  <div id="createProjectDialog" class="createProjectDialog">
    <basic-info v-on:childByBasicInfo="childByBasicInfo"></basic-info>
    <span class="createProjectDialog-label">关键信息--<span>您填写的信息会直接影响基线的准确性，请认真思考后再填写，如不确认请先查看<span class="app-color--info" @click="bounceURL"><i class="iconfont icon-help"></i></span>或联系安全BP确认</span></span>
    <el-form :model="project" label-width="100px" :rules='rules' ref="project" label-position="top">
      <div class="createProjectDialog-display">
        <el-form-item prop="is_module" label="您当前评估的项目是一个独立的系统，还是一个系统中某个服务或模块">
        <el-select  class="createProjectDialog-important-input1"
          placeholder="请选择"
          v-model="project.is_module">
          <el-option
            v-for="item in isModule"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      </div>
      <div class="createProjectDialog-display">
        <el-form-item prop="is_gateway" label="是否有网关或Node代理">
            <el-select class="createProjectDialog-important-input"
            placeholder="是否有网关或Node代理"
            v-model="project.is_gateway">
            <el-option
                v-for="item in gateway"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="is_internet" label="从外网怎么访问您的服务或模块"  style="margin-left:20px;">
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
        <el-form-item prop="service_invoker" v-if="project.is_module!=3">
        <label slot="label">{{serviceInvokerLabel}}
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
      <el-form-item prop="service_invoker" v-else>
        <label slot="label">{{serviceInvokerLabel}}
        </label>
        <el-select class="createProjectDialog-important-input"
          clearable
          multiple
          placeholder="请选择"
          v-model="project.service_invoker"
          filterable>
          <el-option
            v-for="item in serviceInvoker"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            <el-checkbox v-model="project.service_invoker"
            :key="item.value"
            :label="item.value"
            :value="item.value"
            @change='valueChange(item, project.service_invoker)'>{{item.label}}</el-checkbox>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="target_user" :label="labelConntext" style="margin-left:20px;">

        <el-select class="createProjectDialog-important-input"
          placeholder="请选择业务用户类型"
          multiple
          v-model="project.target_user">
          <el-tooltip v-for="item in targetUser" :key="item.value"
              placement="left-start"
              class="tooltip"
              transition="bounce"
              :disabled="item.label!=='其它服务或系统'&&item.label!=='外网用户，如司机、乘客等'&&item.label!=='滴滴正式员工'&&item.label!=='政府，如交管局、各地政府等'||isDisabled">
              <div slot="content" >
                <!-- 基线操作说明 -->
                <span v-show="item.label==='其它服务或系统'">评估项目为系统中的某个服务或模块,如数据引擎等被其它服务调用,用户类型为"<span style="color:red">其它服务或系统</span>"</span>
                <span v-show="item.label==='外网用户，如司机、乘客等'">评估项目为系统中的某个服务或模块,如业务层且直接面向外网用户或面向API网关,用户类型为"<span style="color:red">外网用户</span>"</span>
                <span v-show="item.label==='滴滴正式员工'">评估项目为一个独立的系统,如专快Mis系统,用户类型为"<span style="color:red">滴滴正式员工</span>"等</span>
                <span v-show="item.label==='政府，如交管局、各地政府等'">评估项目为一个独立的服务,如给警方提供的数据查询api服务,用户类型为"<span style="color:red">政府</span>"</span>

                <!-- <button class="tooltip-button" @click="isDisabled = !isDisabled">确定</button> -->
              </div>
          <el-option
            :label="item.label"
            :value="item.value">
            <el-checkbox v-model="project.target_user" style="font-size: 13px;"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            @change='valueChange(item, project.target_user)'></el-checkbox>
          </el-option>
          </el-tooltip>
        </el-select>

      </el-form-item>
      </div>

      <el-form-item prop="data_level" label="">
        <label slot="label">数据等级
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
      <el-button @click="close" class="createProject-button">取消创建</el-button>
      <el-button
        class="createProject-btn"
        type="warning"
        round style="background: #FC9153;border-radius: 4px;"
        @click="submitForm('project')">
        创建项目
      </el-button>
    </div>
  </div>
</template>

<script>
  import {connect} from '@/lib'
  import ajax from '@/plugin/ajax'
  import * as DORADO_API from '@/commons/api/dorado'
  import * as CONSTANTS from '@/commons/dorado'
  import basicInfo from './components/basicInfo'

export default connect(() => {
    return {
    }
  }, {

    // queryNewUser: 'baseline_requirement/queryNewUser'
  })({
    name: 'Createprojectdialog',
    data() {
      return {
        targetUser: CONSTANTS.targetUser1,
        verifyTargetUser: CONSTANTS.targetUser,
        serviceInvoker: CONSTANTS.serviceInvoker1,
        dataLevel: CONSTANTS.dataLevel,
        accessInternet: CONSTANTS.accessInternet,
        isModule: CONSTANTS.isModule,
        gateway: CONSTANTS.isGateway,
        labelConntext: '使用该系统的用户类型',
        isInternetLabel: '您的系统是否对外网开放',
        serviceInvokerLabel: '系统是否有前端页面',
        serviceInvokerALabel: '有前端页面，上游调用方是',
        serviceInvokerBLabel: '没有前端页面，上游调用方是',
        flag: 0,
        isDisabled: false,
        basicProject: {},
        project: {
          is_module: '',
          is_gateway: '',
          target_user: [],
          data_level: '',
          service_invoker: [],
          is_internet: ''
        },
        rules: {
          is_module: [{required: true, message: '请选择', trigger: 'change'}],
          is_gateway: [{required: true, message: '请选择', trigger: 'change'}],
          is_internet: [{required: true, message: '', trigger: 'change'}],
          target_user: [{required: true, message: ' ', trigger: 'change'}],
          data_level: [{required: true, message: ' ', trigger: 'change'}],
          service_invoker: [{required: true, message: ' ', trigger: 'change'}]
        },
        clickCount: 0
      }
    },
    components: {basicInfo},
    created() {

      this.queryNewUser()

      // this.queryNewUser().then(res => {
      //   if (res.count <= 10) {
      //     this.isDisabled = false
      //   } else {
      //     this.isDisabled = true
      //   }
      // })
    },

    watch: {
      'project.is_module': {
        handler(val) {
          if (val == 1) {
            this.labelConntext = '使用该系统的用户类型'
            this.serviceInvokerLabel = '系统直接调用方'
            this.isInternetLabel = '您的系统是否对外网开放'
            this.serviceInvokerALabel = '有前端页面，上游调用方是'
            this.serviceInvokerBLabel = '没有前端页面，上游调用方是'
          } else if (val == 2) {
            this.labelConntext = '使用该服务或模块的用户类型'
            this.isInternetLabel = '您的服务或模块是否对外网开放'
            this.serviceInvokerLabel = '服务/模块直接调用方'
            this.serviceInvokerALabel = '有前端页面，上游调用方是'
            this.serviceInvokerBLabel = '没有前端页面，上游调用方是'
          } else if (val == 3) {
            this.labelConntext = '使用该前端页面的用户类型'
            this.isInternetLabel = '您的系统是否对外网开放'
            this.serviceInvokerLabel = '前端类型'
            this.serviceInvokerALabel = '有前端页面，上游调用方是'
            this.serviceInvokerBLabel = '没有前端页面，上游调用方是'
            this.serviceInvoker = [

                // {label: this.serviceInvokerALabel,
                // options: [
                // ]}
                {value: '前端页面', label: '前端页面'},
                  {value: 'IOT设备', label: 'IOT设备'},
                  {value: '手机APP', label: '手机APP'},
                  {value: '手机H5', label: '手机H5'},
                  {value: '微信类小程序', label: '微信类小程序'}
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
                {label: this.serviceInvokerALabel,
                options: [
                  {value: '前端页面', label: '前端页面'},
                  {value: 'IOT设备', label: 'IOT设备'},
                  {value: '手机APP', label: '手机APP'},
                  {value: '手机H5', label: '手机H5'},
                  {value: '微信类小程序', label: '微信类小程序'}
                ]},
                {label: this.serviceInvokerBLabel,
                options: [
                  {value: '外网服务', label: '外网服务'},
                  {value: '不提供接口', label: '不提供接口'}
                ]}
            ]
            this.project.service_invoker.splice(0, this.project.service_invoker.length)
          } else if ((val == 0 || val == 1) && this.project.is_internet == 0) {
            this.serviceInvoker = CONSTANTS.serviceInvoker1
          }
        }
      },
      'project.is_internet': {
        handler(val) {
          let that = this
          if (val == 2 || val == 1 || val == 3) {
            this.serviceInvoker = [
                {label: this.serviceInvokerALabel,
                options: [
                  {value: '前端页面', label: '前端页面'},
                  {value: 'IOT设备', label: 'IOT设备'},
                  {value: '手机APP', label: '手机APP'},
                  {value: '手机H5', label: '手机H5'},
                  {value: '微信类小程序', label: '微信类小程序'}
                ]},
                {label: this.serviceInvokerBLabel,
                options: [
                  {value: '外网服务', label: '外网服务'},
                  {value: '不提供接口', label: '不提供接口'}
                ]}
            ]
            that.project.service_invoker.splice(0, that.project.service_invoker.length)
          } else {
            this.serviceInvoker = CONSTANTS.serviceInvoker1
          }
          if (this.project.is_module == 3) {

            // {label: this.serviceInvokerALabel,
                // options: [
                // ]}
            this.serviceInvoker = [
                {value: '前端页面', label: '前端页面'},
                  {value: 'IOT设备', label: 'IOT设备'},
                  {value: '手机APP', label: '手机APP'},
                  {value: '手机H5', label: '手机H5'},
                  {value: '微信类小程序', label: '微信类小程序'}
            ]
            that.project.target_user.splice(0, that.project.target_user.length)
          }
          if (val == 0 && this.project.is_module == 3) {
            this.targetUser = [
              {value: '政府，如交管局、各地政府等', label: '政府，如交管局、各地政府等'},
              {value: '滴滴正式员工', label: '滴滴正式员工'},
              {value: '滴滴外包员工', label: '滴滴外包员工'},
              {value: '滴滴实习生', label: '滴滴实习生'}
            ]
            that.project.target_user.splice(0, that.project.target_user.length)
          } else if (this.project.is_module == 3) {
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
      },
      'project.is_gateway': {
          handler(val) {
              if (val == 2) {
                  this.accessInternet = [
                    {value: '2', label: '外网通过API网关访问'},
                    {value: '0', label: '外网不能访问，内网通过API网关访问'}
                  ]
              } else if (val == 1) {
                  this.accessInternet = [
                    {value: '3', label: '外网通过Node代理访问'},
                    {value: '0', label: '外网不能访问，内网通过Node代理访问'}
                  ]
              } else if (val == 3) {
                  this.accessInternet = [
                    {value: '1', label: '外网直接访问'},
                    {value: '0', label: '外网不能访问，内网直接访问'}
                  ]
              }
          }
      },
      clickCount(val) {
        this.clickCount = val
      }
    },
    methods: {
      doCreateProject() {

        this.close()

        let postJson = {

          // project: JSON.parse(JSON.stringify(this.project))
          project: {...this.project, ...this.basicProject}
        }
        ajax.post(DORADO_API.createProject, postJson).then(response => {
          const errno = response.errno
          const data = response.data
          if (errno === 0) {
            this.$notify({
              title: '创建安全评估项目',
              message: '创建成功',
              type: 'success'
            })
            if (data.workflow_type == 1) {
              window.location.href = '/sdl/dorado/baseline/ProjectWorkflow?projectId=' + data.sdl_project_id
            } else {
              window.location.href = '/sdl/dorado/ProjectWorkflow?projectId=' + data.sdl_project_id
            }
          } else {
            this.$notify({
              title: '创建安全评估项目',
              message: '创建失败',
              type: 'error'
            })
            window.location.href = '/sdl/dorado'
          }
        })
      },
      close() {
        this.$emit('close')
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
      validate(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.flag = 1
          } else {
            this.flag = 0
            console.log('error submit!!');
            return false;
          }
        });
        return true
      },
      submitForm(formName) {
        let that = this

        // if (!this.validate('project_basic')) { return false; }
        let arr = this.validateTargetUser()
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (that.flag === 1) {
              if (that.clickCount == 0) {
                that.clickCount = 1
                that.doCreateProject()
                setTimeout(function() {
                  that.clickCount = 0
                }, 0);
              } else if (that.clickCount === 1) {
                console.log('点击次数过多，稍后再试')
              }
            } else {
              that.project.target_user = arr
            }
          } else {
            console.log('error submit!!');
            that.project.target_user = arr
            return false;
          }
        });
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
      },
      childByBasicInfo: function(val, flag) {
          this.basicProject = val
          this.flag = flag
      },
      queryNewUser() {
        ajax.post(DORADO_API.queryNewUser, {}).then(res => {
          if (res.data.count <= 5) {
            this.isDisabled = false
          } else {
            this.isDisabled = true
          }
        })
      }
    }
  })
</script>

<style lang="less" scoped>
  .createProjectDialog {
    overflow: hidden;
    width: 860px;
  }

  .el-input {
    width: 320px;
  }

  .el-select {
    width: 320px;
  }

  .dialog-footer {
    float: right;
  }

  .createProject-button {
    width: 100px;
    height: 32px;
    padding: 0;
    font-size: 13px;
  }
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
    position: absolute;
    left: 20px;
    font-family: 'element-icons';
    content: "";
    font-size: 12px;
    font-weight: bold;
    -webkit-font-smoothing: antialiased;
  }
  .el-checkbox {
    font-size: 13px !important;
    &__label {
          font-size: 13px !important;
    }
  }
  .el-select{
    line-height: 33px !important;
  }
  .el-select-dropdown__item span{
    line-height: 33px !important;
  }
  .createProject-btn {
    font-size: 13px;
    height: 32px;
    width: 100px;
    padding: 0;
    border: none;
  }

  .createProjectDialog-input {
    margin-bottom: 13px;
    font-size: 13px;
  }

  .dropdown {
    width: 300px;
    height: 300px;
    margin-left: -350px;
    margin-top: 8px;

  }

  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #606266 !important;
  }

  .icon-help {
    font-size: 14px;
  }

</style>
<style lang="less">
#createProjectDialog {
  .el-select-dropdown__item{
    line-height: 33px !important;
  }
  .el-select-dropdown__item span{
    line-height: 33px !important;
  }
  .el-form--label-top .el-form-item__label{
    padding: 0;
  }
  .createProjectDialog-label{
    font-weight: bold;
    margin-bottom: 10px;
    span{
      color: #FF0000;
    }
  }
  .createProjectDialog-display{
    display: flex;
  }
  .createProjectDialog-important-input{
    width: 420px;
  }
  .createProjectDialog-important-input1{
    width: 860px;
  }
  .app-color--info{
    cursor: pointer;
  }
  .mySelect{
    .el-select-dropdown__item{
      width: 320px;
    }
  }
  .myOption{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 320px !important;
  }
}
.el-checkbox__label {
    display: inline-block;
    padding-left: 10px;
    line-height: 19px;
    font-size: 13px !important;
  }
  .is-dark.el-tooltip__popper{
  max-width: 440px !important;
  .tooltip-button{
    float: right;
    height: 27px;
      font-size: 12px;
      width: 60px;
      padding: 0px;
      text-align: center;
      background: white;
      border-radius: 4px;
      -webkit-font-smoothing: antialiased;
      cursor: pointer;
  }
}
.el-form-item.is-required .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    font-size: 20px;
    position: relative;
    top: 6px;
    /* margin-right: 4px; */
  }
    .el-form-item.is-required .el-form-item__label:after {
    content: '';
    color: #f56c6c;
    font-size: 15px;
    /* margin-right: 4px; */
    }

.el-select-group__title{
  color: red;
}
.el-select-dropdown__wrap {
    max-height: 380px;
}
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  transition: opacity .5s;
}
 .bounce-leave-active {
  opacity: 0;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
