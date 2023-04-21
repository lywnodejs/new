<template>
       <el-dialog id="group-task-dialog"
                title="编辑"
               :visible.sync="dialogFormVisible"
                width="490px">
      
      <el-form :inline="true" label-width="100px" label-position="left" >
        
        
        <el-form-item label="任务ID:">
          <el-input class="inputWidth"
                    disabled
                    v-model="param.octopus_group_task_id"
                    placeholder="请输入任务ID"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="项目ID:" >
          <el-select class="inputWidth"
                     v-model="param.octopus_group_project_id"
                     filterable
                     clearable
                     placeholder="请选择任务类型">
            <el-option
              v-for="item in groupProject"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="修复人:">
            <app-employee  class="inputWidth" v-model="param.username"></app-employee>
        </el-form-item>
        
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="octopus-diaolog-button" @click="dialogFormVisible = false">取消</el-button>
        <el-button class="octopus-diaolog-btn" type="primary" @click="updateProject()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { connect } from '@/lib'
import department1 from './department'

export default connect(() => {
  return {
  }
}, {
    updateGroupTask: 'octopus_group/updateGroupTask',
    getAllProjectGroup: 'octopus_group/getAllProjectGroup'
})({
  props: ['dialogVisible', 'scopeRow'],
  data() {
    return {
        dialogFormVisible: null,
        data: null,
        groupProject: [],
        param: {
            octopus_group_task_id: this.scopeRow.octopus_group_task_id,
            octopus_group_project_id: null,
            username: ''
        },
        group_project_type: null
    }
  },
  created() {
  },
  components: {department1},
  mounted() {
  },
  watch: {
    dialogVisible(val) {
        this.dialogFormVisible = val
    },
    scopeRow(val) {
        this.data = val
        this.param.octopus_group_task_id = val.octopus_group_task_id
        this.param.octopus_group_project_id = val.octopus_group_project_id
        if (val.source === 1) {
            this.group_project_type = val.source
        } else {
            this.group_project_type = 0
        }
        this.getAllProject()
    },
    dialogFormVisible(val) {
        this.$emit('groupTaskDialog', this.dialogFormVisible)
    }
  },
  methods: {
      getAllProject(val) {
        this.getAllProjectGroup({group_project_type: this.group_project_type}).then(res => {
            this.groupProject = []
            let arr = res.data
            arr.forEach(element => {
                this.groupProject.push({label: element.group_project_name, value: element.octopus_group_project_id})
            });
        })
      },
      updateProject() {
          this.updateGroupTask(this.param).then(res => {
              this.$parent.fetchData()
              this.dialogFormVisible = false
          })
      }
  }
})
</script>
<style lang="less">
#group-task-dialog{
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