<template>
       <el-dialog title="编辑任务信息" 
            id="taskInfo-dialog" 
            :visible.sync="checkDialogVisible" 
            width="440px">
       <el-form :inline="true" label-width="80px" label-position="left" >
        
        
        <el-form-item label="项目ID">
          <el-input class="inputWidth"
                    v-model="scopeRow.id"
                    disabled
                    placeholder="请输入项目名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="Git路径">
          <el-input class="inputWidth"
                    v-model="scopeRow.git_url"
                    disabled
                    placeholder="请输入Git路径"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="Git分支">
          <el-input class="inputWidth"
                    v-model="scopeRow.git_branch"
                    placeholder="请输入Git分支"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="相对路径">
          <!-- <el-input class="codeWhite"
                    v-model="whiteEvaluation.git_relative_path"
                    @focus="getRepo"
                    placeholder="代码相对路径以'/'开头，默认为根目录"
                    clearable>
          </el-input> -->
          <el-select class="inputWidth" 
              v-model="scopeRow.git_relative_path" 
              @focus="getRepo"
              placeholder="代码相对路径以'/'开头，默认为根目录">
            <el-option
              v-for="item in repoTree"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="octopus-diaolog-button" @click="checkDialogVisible = false">取消</el-button>
        <el-button class="octopus-diaolog-btn" type="primary" @click="updateInfo()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>

// import * as CONSTANTS from '@/commons/dorado'
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
    editTaskScan: 'problem_list/editTaskScan',
    getRepoTree: 'baseline_requirement/getRepoTree'
})({
  props: ['dialogVisible', 'scopeRow'],
  data() {
    return {
      checkDialogVisible: null,
      scopeRow: this.scopeRow,
      repoTree: []
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    dialogVisible(val) {
        this.checkDialogVisible = val
    },
    checkDialogVisible(val) {
        this.$emit('taskInfoDialog', this.checkDialogVisible)
    },
    scopeRow(val) {
        this.scopeRow = val
    }
  },
  methods: {
    updateInfo() {
        let param = {
            id: this.scopeRow.id,
            git_branch: this.scopeRow.git_branch,
            git_relative_path: this.scopeRow.git_relative_path
        }
        this.editTaskScan(param).then(res => {
            this.checkDialogVisible = false
            this.$parent.fetchData()
        })
    },
    getRepo() {
        let param = {
          git_url: this.scopeRow.git_url,
          git_branch: this.scopeRow.git_branch
        }
        this.getRepoTree(param).then(res => {
          console.log(res)
          this.repoTree = res
        })
    }
  }
})
</script>
<style lang="less">
#taskInfo-dialog{
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