<template>
       <el-dialog id="octopus-defalut-group-project-dialog"
                title="创建默认项目"
               :visible.sync="dialogFormVisible"
                width="490px">
      
      <el-form :inline="true" label-width="100px" label-position="left" >
        
        
        <el-form-item label="项目名称">
          <el-input class="inputWidth"
                    v-model="param.group_project_name"
                    placeholder="请输入项目名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="部门">
            <app-department1 class="inputWidth" v-model="param.dept_id"></app-department1>
        </el-form-item>
        
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="octopus-diaolog-button" @click="dialogFormVisible = false">取消</el-button>
        <el-button class="octopus-diaolog-btn" type="primary" @click="createProject()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { connect } from '@/lib'
import appDepartment1 from '../../componnents/department'

export default connect(() => {
  return {
  }
}, {
    createDefaultProject: 'octopus_group/createDefaultProject'
})({
  props: ['dialogDefaultVisible'],
  data() {
    return {
        dialogFormVisible: null,
        gitArray: [{value: 'git@git.xiaojukeji.com:'}],
        param: {
            group_project_name: '',
            dept_id: null
        }
    }
  },
  created() {
  },
  mounted() {
  },
  components: {appDepartment1},
  watch: {
    dialogDefaultVisible(val) {
        this.dialogFormVisible = val
    },
    dialogFormVisible(val) {
        this.$emit('projectDefaultDialog', this.dialogFormVisible)
    }
  },
  methods: {
      createProject() {
          this.createDefaultProject(this.param).then(res => {
              this.$parent.fetchData()
              this.dialogFormVisible = false
              this.param = {
                group_project_name: '',
                dept_id: null
              }
          })
      }
  }
})
</script>
<style lang="less">
#octopus-defalut-group-project-dialog{
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

  .octopus-diaolog-btn.search-btn {
    margin-left: 15px;
    width: 95px;
  }

  .inputWidth {
    width: 320px;
  }
  .mutileInput{
      margin-top: 7px;
  }
   .myIcon {
      color: #FC9153;
      font-size: 16px;
      cursor: pointer;
      position: relative;
      top: 0px;
      left: 7px;
    }
    .myIcon:hover {
      top: 1.5px;
    }
}
</style>