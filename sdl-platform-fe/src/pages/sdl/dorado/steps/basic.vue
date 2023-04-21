<template>

  <div id="basic">
    <div>
      <!-- <h4>基本信息</h4> -->
      <div class="basicTitle">基本信息</div>
      <app-permission>
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          style="float:right;width:96px;"
          class="basicFuncion-btn"
          @click="editable=!editable">
          编辑
        </el-button>
      </app-permission>
    </div>
    <el-form v-if='disabled=editable' :inline="true" label-position="left" label-width="90px" :model="project" style="margin-top:15px;">
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目名称:">
            <el-input
              placeholder="请填写项目名称"
              v-model="project.project_name"
              auto-complete="off"
              :disabled="!editable"
              clearable>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目类型:">
            <el-select
              placeholder="请选择项目类型"
              v-model="project.project_type"
              :disabled="!editable">
              <el-option
                v-for="item in projectType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目属性:">
            <app-permission>
              <el-select
                v-model="project.project_property"
                placeholder="请选择项目属性"
                :disabled="!editable">
                  <el-option
                    v-for="item in SDLProjectProperty"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <el-select
                v-model="project.project_property"
                placeholder="请选择项目属性"
                :disabled="!editable">
                  <el-option
                    v-for="item in RDProjectProperty"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
              </el-option>
            </el-select>
            </app-permission>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="产品线:">
            <el-input
              placeholder="请输入产品线"
              v-model="project.department"
              clearable
              disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="RD负责人:">
            <app-employee v-model="project.rd_leader"></app-employee>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="PM负责人:">
            <app-employee v-model="project.pm_leader" :multiple="false"></app-employee>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="业务用户类型:">
            <el-select placeholder="请选择业务用户类型" v-model="project.target_user" multiple filterable :disabled="!editable">
              <el-option
                v-for="item in targetUser"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务调用方:">
            <el-select placeholder="请选择业务调用方" v-model="project.service_invoker" multiple filterable :disabled="!editable">
              <el-option
                v-for="item in serviceInvoker"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="主要开发语言:">
            <el-select placeholder="请选择主要开发语言" v-model="project.language" filterable :disabled="!editable">
              <el-option
                v-for="item in language"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="上线时间:">
            <el-date-picker
              type="date"
              placeholder="请选择上线时间"
              v-model="project.publish_time"
              :disabled="!editable"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目简介:">
            <el-input
              placeholder="请输入项目简介"
              v-model="project.description"
              clearable
              :disabled="!editable">
            </el-input>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item class="createProjectDialog-input" prop="is_internet" label="提供外网访问">
            <el-select
              placeholder="请选择外网访问方式:"
              v-model="project.is_internet"
              :disabled="!editable">
              <el-option
                v-for="item in accessInternet"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否外包开发:">
            <el-select placeholder="请选择是否为外包人员开发" v-model="project.is_offshore" :disabled="!editable">
              <el-option
                label="是"
                value="1">
              </el-option>
              <el-option
                label="否"
                value="0">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否外采系统:">
            <el-select placeholder="请选择是否为外采系统" v-model="project.is_purchase" :disabled="!editable">
              <el-option
                label="是"
                value="1">
              </el-option>
              <el-option
                label="否"
                value="0">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="安全工程师:">
            <el-select placeholder="请选择负责安全工程师" v-model="project.sdl_engineer" filterable :disabled="!editable">
              <el-option
                v-for="item in engineerOps"
                :key="item.id"
                :label="item.emp_name_zh + ' (' + item.emp_account + ')'"
                :value="item.emp_account">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目分级:">
            <el-select placeholder="请选择项目分级" v-model="project.project_level" filterable :disabled="!editable">
              <el-option
                v-for="item in projectLevel"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="数据分级:">
            <el-select placeholder="请选择数据分级" v-model="project.data_level" filterable :disabled="!editable">
              <el-option
                v-for="item in dataLevel"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item v-show="editable">
            <el-button class="basic-btn" type="warning" round @click="updateProject">确认更新</el-button>
            <el-button class="basic-button" @click="fetchData">取消编辑</el-button>
            <el-button v-if="!isBaselineWorkflow" class="basic-btn" type="warning" round @click="confirmProjectInfo">进入设计评估</el-button>
            <el-button v-if="!isBaselineWorkflow" class="basic-button" @click="skipDesign">跳过设计评估</el-button>
            <el-button v-if="isBaselineWorkflow" class="basic-btn" type="warning" round @click="regenerate">重新生成基线</el-button>
            <el-button v-if="isBaselineWorkflow" class="basic-button" @click="startScan">开始检测</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if='disabled=!editable' class="basicContentDisplay">
      <div class="items">
        <span class="c1">项目名称：</span>
        <span class="c2">{{project.project_name}}</span>
      </div>
      <div class="items">
        <span class="c1">项目类型：</span>
        <span class="c2">{{project.project_type}}</span>
      </div>
      <div class="items">
        <span class="c1">项目属性：</span>
        <span class="c2">{{project.project_property}}</span>
      </div>
      <div class="items">
        <span class="c1">产品线：</span>
        <span class="c2">{{project.department}}</span>
      </div>
      <div class="items">
        <span class="c1">RD负责人：</span>
        <span class="c2">{{project.rd_leader}}</span>
      </div>
      <div class="items">
        <span class="c1">PM负责人：</span>
        <span class="c2">{{project.pm_leader}}</span>
      </div>
      <div class="items">
        <span class="c1">业务用户类型：</span>
        <app-permission>
          <span class="c2">
              <el-tooltip v-if="isErrorTargetUser" effect="dark" content="请SDL工程师确认飘红字段是否填错、如填错请需要重新生成基线" placement="top">
                <span  style="color: red;"><i class="el-icon-warning"></i>{{project.target_user.join(' ')}}</span>
              </el-tooltip>
              <span class="c2" v-else>{{project.target_user.join(' ')}}</span>
          </span>
          <span class="c2">{{project.target_user.join(' ')}}</span>
        </app-permission>
      </div>
      <div class="items">
        <span class="c1">业务调用方：</span>
        <app-permission>
          <span class="c2">
              <el-tooltip v-if="isErrorServiceInvoker" effect="dark" content="请SDL工程师确认飘红字段是否填错、如填错请需要重新生成基线" placement="top">
                <span  style="color: red;"><i class="el-icon-warning"></i>{{handleMultiSelectDispaly(project.service_invoker)}}</span>
              </el-tooltip>
              <span class="c2" v-else>{{handleMultiSelectDispaly(project.service_invoker)}}</span>
          </span>
          <span class="c2">{{handleMultiSelectDispaly(project.service_invoker)}}</span>
        </app-permission>
      </div>
      <div class="items">
        <span class="c1">主要开发语言：</span>
        <span class="c2">{{project.language}}</span>
      </div>
      <div class="items">
        <span class="c1">上线时间：</span>
        <span class="c2">{{handleTime(project.publish_time)}}</span>
      </div>
      <div class="items">
        <span class="c1">创建时间：</span>
        <span class="c2">{{project.create_time}}</span>
      </div>
      <div class="items">
        <span class="c1">提供外网访问：</span>
        <app-permission>
          <span class="c2">
              <el-tooltip v-if="isErrorInternet" effect="dark" content="请SDL工程师确认飘红字段是否填错、如填错请需要重新生成基线" placement="top">
                <span  style="color: red;"><i class="el-icon-warning"></i>{{handleAccessInternetDispaly(project.is_internet)}}</span>
              </el-tooltip>
              <span class="c2" v-else>{{handleAccessInternetDispaly(project.is_internet)}}</span>
          </span>
          <span class="c2">{{handleAccessInternetDispaly(project.is_internet)}}</span>
        </app-permission>
      </div>
      <div class="items">
        <span class="c1">是否外包开发：</span>
        <span class="c2">{{handleTrueOrFalseDispaly(project.is_offshore)}}</span>
      </div>
      <div class="items">
        <span class="c1">是否有网关或node代理</span>
        <span class="c2">{{ handleGateway(project.is_gateway) }}</span>
      </div>
      <div class="items">
        <span class="c1">是否外采系统：</span>
        <span class="c2">{{handleTrueOrFalseDispaly(project.is_purchase)}}</span>
      </div>
      <div class="items">
        <span class="c1">安全工程师：</span>
        <span class="c2">{{project.sdl_engineer}}</span>
      </div>
      <div class="items">
        <span class="c1">数据分级：</span>
        <span class="c2">{{project.data_level}}</span>
      </div>
      <div class="items">
        <span class="c1">项目分级：</span>
        <span class="c2">{{project.project_level}}</span>
      </div>
      <div class="items">
        <span class="c1">Odin链接</span>
        <span class="c2">
          <a v-for="odin in odins" :key="odin.odinName" :href="odin.odinHref" target="_blank">
            {{odin.odinName}}
          </a>
        </span>
      </div>
      <div class="items">
        <span class="c1">提测人</span>
        <span class="c2">{{project.creator_zh}}</span>
      </div>
      <div class="items">
        <span class="c1">项目简介：</span>
        <span class="c2">{{project.description}}</span>
      </div>
      <div class="items">
        <span class="c1">来源：</span>
        <span class="c2">{{judgeSource(project.source)}}</span>
      </div>

    </div>
  </div>
</template>

<script>
  import ajax from '@/plugin/ajax'
  import * as API from '@/commons/api/dorado'
  import * as CONSTANTS from '@/commons/dorado'
  import {connect} from '@/lib'
  import { getSdlSecurityBp } from '@/commons/api/admin'

  export default connect(() => {
    return {
      user: 'user/user'
    }
  }, {
    baselineNewCTR: 'baseline_requirement/baselineNewCTR'
  })({
    name: 'basic',
    data() {
      return {
        language: CONSTANTS.language,
        engineer: CONSTANTS.engineer,
        targetUser: CONSTANTS.targetUser,
        serviceInvoker: CONSTANTS.serviceInvoker,
        dataLevel: CONSTANTS.dataLevel,
        projectLevel: CONSTANTS.projectLevel,
        projectType: CONSTANTS.projectType,
        SDLProjectProperty: CONSTANTS.SDLProjectProperty,
        RDProjectProperty: CONSTANTS.RDProjectProperty,
        framework: CONSTANTS.framework,
        accessInternet: CONSTANTS.accessInternet,
        source: CONSTANTS.source,
        editable: false,
        odins: [],
        project: {
          sdl_project_id: '',
          project_name: '',
          pm_leader: '',
          rd_leader: '',
          project_type: undefined,
          project_property: undefined,
          department: '',
          publish_time: '',
          language: 0,
          target_user: [],
          service_invoker: [],
          is_internet: '',
          is_offshore: '',
          is_purchase: '',
          description: '',
          sdl_engineer: undefined,
          project_level: undefined,
          data_level: undefined,
          is_skip_design: false
        },
        isErrorTargetUser: false,
        isErrorServiceInvoker: false,
        isErrorInternet: false,
        remark: '',

        engineerOps: []
      }
    },
    props: {
      isBaselineWorkflow: {
        default: false
      },
      currentStatus: null
    },
    created() {
      this.project.sdl_project_id = this.$route.query['projectId']
      this.fetchData()
      this.getBindOdinWorkflow()
      this.getSdlSecurityBpList() // 获取sdl信息安全工程师
    },
    watch: {
      currentStatus(val) {
        this.currentStatus = val
        if (this.currentStatus < 3) {
          this.editable = true
        }
      }
    },
    methods: {

      getSdlSecurityBpList() {
        ajax.get(getSdlSecurityBp, {
          limit: 200,
          page: 1
        }).then(res => {
          this.engineerOps = res.data.data
        }).catch(() => {
          this.engineerOps = []
        })
      },

      fetchData() {
        let postJson = {
          sdl_project_id: this.project.sdl_project_id
        }
        ajax.post(API.getProjectDetail, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.project = response.data
            this.$emit('enginner', response.data.sdl_engineer)
            if (this.project.is_skip_design) {
              this.project.is_skip_design = true
            } else {
              this.project.is_skip_design = false
            }
            this.handleIsError(this.project.target_user, this.project.service_invoker, this.project.is_internet)
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
        })
        this.editable = false
      },
      handleIsError(targetUser, serviceInvoker, internet) {
        this.isErrorServiceInvoker = false
        this.isErrorInternet = false
        if (serviceInvoker.join(',').indexOf('外网服务') >= 0) {
          if (internet == 0) {
            this.isErrorServiceInvoker = true
            this.isErrorInternet = true
          }
          if (targetUser.join(',').indexOf('个人用户') >= 0) {
            this.isErrorTargetUser = true
            this.isErrorServiceInvoker = true
          }
        }
        if (serviceInvoker.join(',').indexOf('内网访问') >= 0) {
          if (internet != 0) {
            this.isErrorServiceInvoker = true
            this.isErrorInternet = true
          }
        }
        if (internet == 0 && (targetUser.join(',').indexOf('合作伙伴') >= 0 || targetUser.join(',').indexOf('个人用户') >= 0)) {
          this.isErrorInternet = true
          this.isErrorTargetUser = true
        }
      },
      getBindOdinWorkflow() {
        let postJson = {
          sdl_project_id: this.project.sdl_project_id
        }

        ajax.post(API.getBindOdin, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.odins = response.data
          } else {
            this.$notify({
              title: '获取绑定odin失败',
              message: errmsg,
              type: 'error'
            })
          }
        })
      },
      judgeSource(type) {
        for (let i = 0; i < this.source.length; i++) {
          if (type === this.source[i].value) {
            return this.source[i].label
          }
        }
      },
      updateProject() {
        let postJson = {
          project: this.project
        }
        ajax.post(API.updateProject, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.project = response.data

            this.$notify({
              title: '信息修改成功',
              message: errmsg,
              type: 'success'
            })
          } else {
          }
          this.fetchData()
        })
      },
      judgeUpdateProject() {
        if (this.currentStatus == 107) {
          let postJson = {
            project: this.project
          }
          ajax.post(API.updateProject, postJson).then(response => {
            const errno = response.errno

            // const errmsg = response.errmsg
            if (errno === 0) {
              this.project = response.data

              // this.$notify({
              //   title: '信息修改成功',
              //   message: errmsg,
              //   type: 'success'
              // })
              this.$message('基本信息更新成功，已完成项目不能重新生成基线');
            }
            this.fetchData()
          })
        } else {
          this.updateProject()
        }
      },
      skipDesign() {
        let postJson = {
          sdl_project_id: this.project.sdl_project_id
        }
        ajax.post(API.skipDesign, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '成功',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.$parent.getWorkFlow()
        })
        this.editable = false
      },
      confirmProjectInfo() {
        let postJson = {
          sdl_project_id: this.project.sdl_project_id
        }
        ajax.post(API.confirmProjectInfo, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '成功',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.$parent.getWorkFlow()
        })
        this.editable = false
      },
      handleAccessInternetDispaly(val) {
        let arr = CONSTANTS.accessInternet
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].value == val) return arr[i].label
        }
      },
      handleTrueOrFalseDispaly(val) {
        if (val === '0') {
          val = '否'
        } else {
          val = '是'
        }
        return val
      },
      handleMultiSelectDispaly(val) {
        return val.join(' ')
      },
      handleGateway(id) {
        let label = ''
        CONSTANTS.isGateway.forEach(item => {
          if (id == item.value) {
            label = item.label
          }
        })
        return label
      },
      handleTime(t) {
        let temp = t.split(' ')
        return temp[0]
      },
      async regenerate() {

        if (this.currentStatus === 107) {
          this.$message('已完成项目不能重新生成基线');
          return
        }
        if (this.currentStatus !== 102) {
          this.$message(`请在'SDL复核基线确认结果'阶段重新生成基线`);
          return
        }
        return await this.$prompt('', '请输入重新生成基线原因', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: this.remark,
          inputType: 'textarea',
          customClass: 'remarkBox'
        }).then(res => {
          if (res.value.trim() === '') {
            this.$message({
              message: '输入不能为空，生成失败',
              type: 'warning'
            });
            return
          }
          this.regenerateRequest(res.value)
        }).catch(res => {
          this.$message({
            message: '生成失败',
            type: 'warning'
          });
        })
      },
      regenerateRequest(remark) {
        let postJson = {
          sdl_project_id: this.project.sdl_project_id
        }
        let queryParam = {
          CTR_data: {
            sdl_project_id: parseInt(this.$route.query['projectId']),
            username: this.user.username,
            remark: remark
          },
          function_name: 'rebuild_baseline'
        }
        this.baselineNewCTR(queryParam).then(res => {
        })
        ajax.post(API.regenerateBaseline, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '重新生成基线成功',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
          location.reload()
        })
      },
      startScan() {
        if (this.currentStatus !== 102) {
          this.$message(`请在'SDL复核基线确认结果'阶段完成'开始检测'操作`);
          return
        }
        let postJson = {
          sdl_project_id: this.project.sdl_project_id
        }
        ajax.post(API.immediatelyScanBaseline, postJson).then(response => {
          const errno = response.errno
          const errmsg = response.errmsg
          if (errno === 0) {
            this.$notify({
              title: '成功',
              message: errmsg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: '失败',
              message: errmsg,
              type: 'error'
            })
          }
          this.$parent.getWorkFlow()
        })
      }
    }
  })
</script>

<style lang='less' scoped>
  #basic {
    padding-top: 40px;
    -webkit-font-smoothing: antialiased;
    .basicTitle {
      color: #333333;
      font-size: 14px;
      display: inline-block;
      line-height: 28px;
      // height: 60px;
    }
  }
  .el-input {
    min-width: 230px;
  }
  .el-select {
    min-width: 230px;
  }
  .el-form {
    margin-top: 20px;
  }
  .basicFuncion-btn {
    background: white;
    color: #fc9153;
    position: relative;
    // bottom: 30px;
  }
  .basicFuncion-btn:hover {
    background: #fff7f2;
  }
  .basic-btn {
    font-size: 12px;
    margin-top: 15px;
    height: 32px;
    width: 100px;
    text-align: center;
    padding: 0px;
    background: #fc9153;
    border-radius: 4px;
    border: none;
    // font-weight: 100;
  }
  .basic-button {
    font-size: 12px;
    margin-top: 15px;
    width: 100px;
    height: 32px;
    // font-weight: 100;
    color: #fc9153;
    border: 1px solid #fc9153;
    padding: 0px;
  }
  .basicContentDisplay {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    .items {
      padding-top: 10px;
      flex: 1;
      flex-basis: 50%;
      justify-content: center;
      display: flex;
      font-size: 13px;
      // font-family: "Helvetica Neue", "Helvetica", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE\8F6F\96C5\9ED1", "Arial", "sans-serif";
      color: gray;
      .c1 {
        flex: 1;
        text-align: left;
        // padding-left: 20px;
      }
      .c2 {
        flex: 3;
        color: black;
        font-family: PingFang-SC;
      }
    }
    .item {
      padding-top: 10px;
      flex: 1;
      flex-basis: 25%;
      justify-content: center;
      display: flex;
      font-size: 15px;
      font-family: "Helvetica Neue", "Helvetica", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE\8F6F\96C5\9ED1", "Arial", "sans-serif";
      color: gray;
      .c1 {
        flex: 1;
        text-align: left;
        padding-left: 20px;
      }
      .c2 {
        flex: 7;
        color: black;
        font-family: PingFang-SC;
      }
    }
  }
</style>
