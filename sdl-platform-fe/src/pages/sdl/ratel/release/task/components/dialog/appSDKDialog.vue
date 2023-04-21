<template>
       <el-dialog :title="title" 
            id="ratel-sdk-create-dialog" 
            :visible.sync="createDialogVisible" 
            width="440px">
       <el-form :inline="true" label-width="80px" label-position="left" >
        
        <el-form-item label="ID" v-show="createOrUpdate=='update'">
          <el-input class="inputWidth"
                    disabled
                    v-model="queryParam.id"
                    placeholder="请输入ID"
                    clearable></el-input>
        </el-form-item>
         <el-form-item label="app版本">
          <el-input class="inputWidth"
                    disabled
                    v-model="queryParam.app_version"
                    placeholder="请输入ID"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="SDK名称">
          <el-input class="inputWidth"
                    v-model="queryParam.sdk_name"
                    placeholder="请输入SDK名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="SDK版本">
          <el-input class="inputWidth"
                    v-model="queryParam.sdk_version"
                    placeholder="请输入SDK版本"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="提交信息">
          <el-input class="inputWidth"
                    v-model="queryParam.sdk_commit_id"
                    placeholder="请输入提交信息"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="SDK Git地址">
          <el-input class="inputWidth"
                    v-model="queryParam.sdk_git_url"
                    placeholder="请输入Git地址"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="SDK Git分支">
          <el-input class="inputWidth"
                    v-model="queryParam.sdk_git_branch"
                    placeholder="请输入SDK Git分支"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="SDK最近提交者">
          <el-input class="inputWidth"
                    v-model="queryParam.sdk_git_last_commit"
                    placeholder="请输入SDK最近提交者"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="SDK_TAG">
          <el-input class="inputWidth"
                    v-model="queryParam.sdk_tag"
                    placeholder="请输入SDK_TAG"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="SDK权限">
          <el-input class="inputWidth"
                    v-model="queryParam.sdk_permission"
                    placeholder="请输入SDK权限"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="SDK描述">
          <el-input class="inputWidth"
                    v-model="queryParam.sdk_description"
                    placeholder="请输入SDK描述"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="SDK类型">
          <el-select class="inputWidth"
            v-model="queryParam.sdk_type"
            placeholder="请选择"
            clearable
            :multiple="false">
            <el-option
              v-for="(item, index) in sdkType"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="octopus-diaolog-button" @click="createDialogVisible = false">取消</el-button>
        <el-button v-show="createOrUpdate=='create'" class="octopus-diaolog-btn" type="primary" @click="createInfo()">确定</el-button>
        <el-button v-show="createOrUpdate=='update'" class="octopus-diaolog-btn" type="primary" @click="updateInfo()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>

// import * as CONSTANTS from '@/commons/dorado'
import { connect } from '@/lib'
import * as CONSTANTS from '@/commons/ratel'

export default connect(() => {
  return {
  }
}, {
    updateTaskSDK: 'ratel_assets/updateTaskSDK',
    createTaskSDK: 'ratel_assets/createTaskSDK'
})({
  data() {
    return {
      title: '',
      taskId: parseInt(this.$route.query.ratel_task_id),
      createDialogVisible: false,
      scopeRow: this.scopeRows,
      queryParam: {
        sdk_name: '',
        app_version: '',
        sdk_version: '',
        sdk_commit_id: '',
        sdk_git_url: '',
        sdk_git_branch: '',
        sdk_git_last_committer: '',
        sdk_tag: '',
        sdk_permission: '',
        sdk_description: '',
        sdk_type: ''
      },
      sdkType: CONSTANTS.sdkType,
      createOrUpdate: null
    }
  },
  props: ['dialog', 'scopeRows'],
  created() {
  },
  mounted() {
  },
  watch: {
    dialog(val) {
      this.createDialogVisible = val
    },
    createDialogVisible(val) {
        this.$emit('createDialog', this.createDialogVisible)
    },
    scopeRows(val) {
        this.scopeRow = val
        if (typeof val !== 'object') {
            this.title = '新增SDK'
            this.createOrUpdate = 'create'
            this.queryParam = {
                sdk_name: '',
                sdk_version: '',
                sdk_commit_id: '',
                sdk_git_url: '',
                sdk_git_branch: '',
                sdk_git_last_committer: '',
                sdk_tag: '',
                sdk_permission: '',
                sdk_description: '',
                is_offsite: 0,
                is_didi: 0,
                app_version: val
            }
        } else {
            this.title = '编辑SDK信息'
            this.createOrUpdate = 'update'
            this.queryParam = this.scopeRow
        }
    }
  },
  methods: {
    createInfo() {
      this.queryParam.ratel_task_id = this.taskId
      this.queryParam.app_version = this.scopeRows
        this.createTaskSDK(this.queryParam).then(res => {
            this.createDialogVisible = false
            this.$parent.fetchData()
        })
    },
    updateInfo() {
        this.updateTaskSDK(this.queryParam).then(res => {
            this.createDialogVisible = false
            this.$parent.fetchData()
        })
    }
  }
})
</script>
<style lang="less">
#ratel-sdk-create-dialog{
    .octopus-diaolog-button {
        width: 80px;
        height: 32px;
        padding: 7px 15px;
        line-height: 10px;
        font-size: 13px;
    }

    .octopus-diaolog-btn {
        background: #FC9153;
        border-radius: 4px;
        width: 80px;
        height: 32px;
        padding: 7px 15px;
        line-height: 10px;
        font-size: 13px;
        border: none;
    }
    .inputWidth{
        width: 320px;
    }
}
</style>