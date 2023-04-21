<template>
       <el-dialog :title="title" 
            id="ratel-sdk-create-dialog" 
            :visible.sync="createDialogVisible" 
            width="460px">
       <el-form :inline="true" label-width="100px" label-position="left" >
        
        <el-form-item label="ID" v-show="createOrUpdate=='update'">
          <el-input class="inputWidth"
                    disabled
                    v-model="queryParam.id"
                    placeholder="请输入SDK名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="app版本">
          <el-input class="inputWidth"
                    disabled
                    v-model="queryParam.app_version"
                    placeholder="请输入SDK名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="权限名称">
          <el-input class="inputWidth"
                    v-model="queryParam.permission_name"
                    placeholder="请输入权限名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="权限中文名称">
          <el-input class="inputWidth"
                    v-model="queryParam.permission_name_zh"
                    placeholder="请输入权限名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input class="inputWidth"
                    v-model="queryParam.permission_description"
                    placeholder="请输入权限中文名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="敏感等级">
          <el-select class="inputWidth"
          v-model="queryParam.permission_level"
          placeholder="请输入邮箱前缀选取"
          clearable
          :multiple="false">
          <el-option
            v-for="(item, index) in dataLevel"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="保护级别">
          <el-input class="inputWidth"
                    v-model="queryParam.official_level"
                    placeholder="保护级别"
                    clearable></el-input>
          <!-- <el-select class="inputWidth"
          v-model="queryParam.official_level"
          placeholder="请选择"
          clearable
          :multiple="false">
          <el-option
            v-for="(item, index) in dataLevel"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="inputWidth"
                    v-model="queryParam.permission_remark"
                    type="textarea"
                    placeholder="请输入备注"
                    clearable></el-input>
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

import { connect } from '@/lib'
import * as CONSTANTS from '@/commons/ratel'

export default connect(() => {
  return {
  }
}, {
    updateTaskPermission: 'ratel_assets/updateTaskPermission',
    createTaskPermission: 'ratel_assets/createTaskPermission'
})({
  props: ['dialogFormVisible', 'scopeRows'],
  data() {
    return {
      taskId: parseInt(this.$route.query.ratel_task_id),
      title: '',
      createDialogVisible: null,
      scopeRow: this.scopeRows,
      queryParam: {
        permission_name: '',
        permission_name_zh: '',
        permission_description: '',
        permission_level: '',
        permission_remark: '',
        official_level: ''
      },
      createOrUpdate: null,
      dataLevel: CONSTANTS.dataLevel,
      appType: [{label: 'ios', value: 'ios'}, {label: 'andiord', value: 'andiord'}]
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    dialogFormVisible(val) {
        this.createDialogVisible = val
    },
    createDialogVisible(val) {
        this.$emit('createDialog', this.createDialogVisible)
    },
    scopeRows(val) {
        this.scopeRow = val
        if (typeof val !== 'object') {
            this.title = '新增应用权限'
            this.createOrUpdate = 'create'
            this.queryParam = {
                permission_name: '',
                permission_name_zh: '',
                permission_description: '',
                permission_level: '',
                permission_remark: '',
                official_level: '',
                app_version: val
            }
        } else {
            this.title = '编辑应用权限信息'
            this.createOrUpdate = 'update'
            this.queryParam = this.scopeRow
        }
    }
  },
  methods: {
    createInfo() {
        this.queryParam.ratel_task_id = this.taskId
        this.queryParam.app_version = this.scopeRows
        this.createTaskPermission(this.queryParam).then(res => {
            this.createDialogVisible = false
            this.$parent.fetchData()
        })
    },
    updateInfo() {
        this.queryParam.ratel_task_id = this.taskId
        this.updateTaskPermission(this.queryParam).then(res => {
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