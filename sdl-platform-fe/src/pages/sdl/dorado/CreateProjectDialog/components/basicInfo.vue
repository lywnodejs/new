<template>
  <div id="basic-info">
    <span class="createProjectDialog-label">基本信息</span>
    <el-form :model="basicProject" label-width="100px" :rules='basicRules' ref="project_basic" label-position="left" >
      <div class="createProjectDialog-display">
        <el-form-item class="createProjectDialog-input" prop="project_name" label="项目名称" >
        <el-input @change="infoChange"
          v-model="basicProject.project_name"
          placeholder="请输入项目名称"
          clearable
          auto-complete="off">
        </el-input>
      </el-form-item>
      <el-form-item class="createProjectDialog-input"  style="margin-left:20px;">
        <label slot="label">
          Odin模块
          <el-popover
            class="popoverContent"
            placement="right"
            width="200"
            trigger="hover"
            content="如果已申请odin准入，请选择该项目包含的所有odin模块">
            <span slot="reference" class="app-color--info"><i class="iconfont icon-help"></i></span>
          </el-popover>
        </label>
        <el-select
          clearable
          multiple
          v-model="basicProject.odin"
          filterable
          placeholder="请选择Odin模块">
          <el-option
            v-for="(item, index) in unbindOdin"
            :key="index"
            :label="item.label"
            :value="item.value">
            <el-checkbox v-model="basicProject.odin"
            :key="index*2"
            :label="item.value"
            :value="item.value"
            @change='valueChange(item, basicProject.odin)'>{{item.label}}</el-checkbox>
          </el-option>
        </el-select>
        </el-form-item>
      </div>
      <div class="createProjectDialog-display">
        <el-form-item class="createProjectDialog-input" label="RD负责人">
        <el-select
          v-model="basicProject.rd_leader"
          placeholder="请输入邮箱前缀选取"
          filterable
          remote
          clearable
          reserve-keyword
          :multiple="false"
          :remote-method="handleGetRD">
          <el-option
            v-for="(item, index) in rds"
            :key="index"
            :label="item.name + ' (' + item.email + ')'"
            :value="item.account">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="createProjectDialog-input" label="PM负责人"  style="margin-left:20px;">
        <el-select
          v-model="basicProject.pm_leader"
          placeholder="请输入邮箱前缀选取"
          filterable
          remote
          clearable
          reserve-keyword
          :multiple="false"
          :remote-method="handleGetPM">
          <el-option
            v-for="(item, index) in pms"
            :key="index"
            :label="item.name +' (' + item.email + ')' "
            :value="item.account">
          </el-option>
        </el-select>
      </el-form-item>
      </div>
      <div class="createProjectDialog-display mySelect">
        <el-form-item class="createProjectDialog-input " prop="project_type" label="项目类型">
        <el-select class="" @change="infoChange"
          v-model="basicProject.project_type"
          filterable
          placeholder="请选择项目类型">
          <el-option class="myOption"
            v-for="(item, index) in projectType"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="createProjectDialog-input" prop="project_property" label="项目属性"  style="margin-left:20px;">
        <app-permission>
          <el-select @change="infoChange"
            v-model="basicProject.project_property" filterable placeholder="请选择项目属性">
            <el-option
              v-for="(item,index) in SDLProjectProperty"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select   @change="infoChange"
          v-model="basicProject.project_property" filterable placeholder="请选择项目属性">
            <el-option
              v-for="(item, index) in RDProjectProperty"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </app-permission>
      </el-form-item>
      </div>
      <div class="createProjectDialog-display">
        <el-form-item class="createProjectDialog-input" prop="publish_time" label="上线时间">
        <el-date-picker @change="infoChange"
          type="date"
          v-model="basicProject.publish_time"
          placeholder="请选择上线时间"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="createProjectDialog-input" prop="language" label="主要开发语言"  style="margin-left:20px;">
        <el-select @change="infoChange"
          v-model="basicProject.language"
          filterable
          placeholder="请选择主要开发语言">
          <el-option
            v-for="(item,index) in language"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      </div>

      <el-form-item class="createProjectDialog-input" label="备注">
        <el-input
          type="textarea"
          v-model="basicProject.description"
          auto-complete="off"
          placeholder="请输入备注">
        </el-input>
      </el-form-item>
      <div class="createProjectDialog-display">
        <el-form-item class="createProjectDialog-input" style="margin-bottom: 0" label="是否外包开发" prop="is_offshore">
          <el-radio-group @change="infoChange"
              v-model="basicProject.is_offshore" style="width:320px;">
            <el-radio class="label" label=1>是</el-radio>
            <el-radio class="label" label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="createProjectDialog-input" label="是否外采系统" prop="is_purchase" style="margin-left:20px;">
          <el-radio-group @change="infoChange"
          v-model="basicProject.is_purchase">
            <el-radio class="label" label=1>是</el-radio>
            <el-radio class="label" label=0>否</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import * as CONSTANTS from '@/commons/dorado'
import ajax from '@/plugin/ajax'
import * as DORADO_API from '@/commons/api/dorado'
import * as COMMON_API from '@/commons/api/common'

export default {
    data() {
        return {
            language: CONSTANTS.language,
            targetUser: CONSTANTS.targetUser1,
            verifyTargetUser: CONSTANTS.targetUser,
            serviceInvoker: CONSTANTS.serviceInvoker1,
            dataLevel: CONSTANTS.dataLevel,
            projectType: CONSTANTS.projectType,
            RDProjectProperty: CONSTANTS.RDProjectProperty,
            SDLProjectProperty: CONSTANTS.SDLProjectProperty,
            basicProject: {
                is_iteration: 0,
                project_name: '',
                pm_leader: '',
                rd_leader: '',
                project_type: '',
                project_property: '',
                publish_time: '',
                language: '',
                is_offshore: '',
                is_purchase: '',
                description: '',
                odin: [],
                source: this.getQueryString('source') == 'odin' ? 1 : this.getQueryString('source') == 'oe' ? 2 : 0,
                source_odin_id: parseInt(this.getQueryString('odinId')),
                source_oe_git_info: {
                  git_url: this.getQueryString('git_url'),
                  git_branch: this.getQueryString('git_branch'),
                  git_relative_path: this.getQueryString('git_relative_path')
                }
            },
            basicRules: {
                project_name: [{required: true, message: ' ', trigger: 'change'}],
                project_type: [{required: true, message: ' ', trigger: 'change'}],
                project_property: [{required: true, message: ' ', trigger: 'change'}],
                publish_time: [{required: true, message: ' ', trigger: 'change'}],
                language: [{required: true, message: ' ', trigger: 'change'}],
                is_offshore: [{required: true, message: '请选择', trigger: 'change'}],
                is_purchase: [{required: true, message: '请选择', trigger: 'change'}]
            },
            pms: [],
            rds: [],
            unbindOdin: [],
            odin: '',
            flag: 1
        }
    },
    created() {
      this.searchOdinInfo()
    },
    methods: {
      valueChange(item, array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i] == item.value) {
            array.splice(i, 1)
            return
          }
        }
        array.push(item.value)
      },
      searchOdinInfo(val) {
        let param = {
          source_odin_id: this.getQueryString('odinId')
        }
        ajax.post(DORADO_API.getUnbindOdin, param).then(response => {
          const errno = response.errno
          if (errno === 0) {
            this.unbindOdin = response.data
          } else {
            this.$notify({
              title: '创建安全评估项目',
              message: '创建失败',
              type: 'error'
            })
          }
        })
      },
      getQueryString(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        let r = window.location.search.substr(1).match(reg);
        let context = '';
        if (r != null) {
          context = r[2];
        }
        reg = null
        r = null
        return context == null || context == '' || context == 'undefined' ? '' : context
      },
      handleGetRD(query) {
        let postJson = {
          account: query
        }
        ajax.get(COMMON_API.queryEmployee, postJson).then(res => {
          this.rds = res.data
        })

        // this.empSearchList(query)
      },
      handleGetPM(query) {
        let postJson = {
          account: query
        }
        ajax.get(COMMON_API.queryEmployee, postJson).then(res => {
          this.pms = res.data
        })
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
        infoChange() {
            this.validate('project_basic')
        this.$emit('childByBasicInfo', this.basicProject, this.flag)
      }
    }
}
</script>

<style lang="less" scoped>

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
