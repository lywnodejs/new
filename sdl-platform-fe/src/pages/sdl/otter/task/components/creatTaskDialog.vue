<template>
    <el-dialog :title="title" 
            id="otter-task-createTask-dialog" 
            :visible.sync="dialogVisible" 
            width="440px">
       <el-form :inline="true" label-width="80px" label-position="left" >
            <el-form-item label="创建人">
                <app-employee v-model="queryParam.creator" class="inputWidth"></app-employee>
                <!-- <el-input class="inputWidth"
                            v-model="queryParam.creator"
                            placeholder="请输入creator"
                            clearable></el-input> -->
            </el-form-item>
            <el-form-item label="Git路径">
                <el-input class="inputWidth"
                            v-model="queryParam.git_url"
                            placeholder="请输入git_url"
                            clearable></el-input>
            </el-form-item>
            <el-form-item label="Git分支">
                <el-input class="inputWidth"
                            v-model="queryParam.git_branch"
                            placeholder="请输入Git分支"
                            clearable></el-input>
            </el-form-item>
            <el-form-item label="Git相对地址">
                <el-input class="inputWidth"
                            v-model="queryParam.git_relative_path"
                            placeholder="请输入Git相对地址"
                            clearable></el-input>
            </el-form-item>
            <el-form-item label="Git版本号">
                <el-input class="inputWidth"
                            v-model="queryParam.git_version"
                            placeholder="请输入Git版本号"
                            clearable></el-input>
            </el-form-item>
            
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="octopus-diaolog-button" @click="dialogVisible = false">取消</el-button>
        <el-button class="octopus-diaolog-btn" type="primary" @click="updateInfo()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
    createTask: 'otter/createTask'
})({
  props: ['visible', 'data'],
  data() {
    return {
      dialogVisible: null,
      scopeRow: this.data,
      queryParam: {
          creator: null,
          git_url: '',
          git_branch: '',
          git_relative_path: '',
          git_version: '',
          status: 2
      },
      title: '新建白盒检测任务',
      loading: false,
      options: []
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    visible(val) {
        this.dialogVisible = val
    },
    dialogVisible(val) {
        this.$emit('dialog', this.dialogVisible)
    }
  },
  methods: {
    updateInfo() {
        this.createTask(this.queryParam).then(res => {
            this.dialogVisible = false

            // this.$emit('updateData', {domain_id: res.domain_id, git_url: res.git_url_new})
            this.$parent.fetchData()
        })
    }
  }
})
</script>
<style lang="less">
#otter-task-createTask-dialog{
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