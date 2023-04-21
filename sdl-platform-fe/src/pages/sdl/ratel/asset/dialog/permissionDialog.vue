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
        <el-form-item label="声明的权限">
          <el-input class="inputWidth"
                    v-model="queryParam.permission_declare"
                    placeholder="请输入声明的权限"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="权限分类">
          <el-input class="inputWidth"
                    v-model="queryParam.permission_name_zh"
                    placeholder="权限分类"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="敏感等级">
          <el-select class="inputWidth"
          v-model="queryParam.permission_level"
          placeholder="请选择"
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
        <el-form-item label="权限描述">
          <el-input class="inputWidth"
                    v-model="queryParam.permission_description"
                    placeholder="请输入权限描述"
                    clearable></el-input>
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="octopus-diaolog-button" @click="createDialogVisible = false">取消</el-button>
        <el-button v-show="createOrUpdate=='create'" class="octopus-diaolog-btn" type="primary" @click="createInfo()">确定</el-button>
        <el-button v-show="createOrUpdate=='update'" class="octopus-diaolog-btn" type="primary" @click="updateInfo()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>

import * as CONSTANTS from '@/commons/ratel'
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
    createAssetPermission: 'ratel_assets/createAssetPermission',
    updateAssetPermission: 'ratel_assets/updateAssetPermission'
})({
  props: ['dialogFormVisible', 'scopeRows'],
  data() {
    return {
      title: '',
      createDialogVisible: null,
      scopeRow: this.scopeRows,
      queryParam: {
        permission_name_zh: '',
        permission_level: '',
        permission_description: '',
        official_level: ''
      },
      createOrUpdate: null,
      dataLevel: CONSTANTS.dataLevel
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
        if (val == '') {
            this.title = '新增应用权限'
            this.createOrUpdate = 'create'
            this.queryParam = {
                permission_name_zh: '',
                permission_level: '',
                permission_description: '',
                official_level: ''
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
        this.createAssetPermission(this.queryParam).then(res => {
            this.createDialogVisible = false
            this.$parent.fetchData()
        })
    },
    updateInfo() {
        this.updateAssetPermission(this.queryParam).then(res => {
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