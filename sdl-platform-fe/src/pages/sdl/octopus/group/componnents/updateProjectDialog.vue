<template>
       <el-dialog id="octopus-group-update-project-dialog"
                title="编辑项目"
               :visible.sync="updateDialogFormVisible"
                width="490px">
      
      <el-form :inline="true" label-width="100px" label-position="left" >
        
        <el-form-item label="项目ID">
          <el-input class="inputWidth"
                    v-model="scopeRow.octopus_group_project_id"
                    disabled
                    placeholder="请输入项目名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input class="inputWidth"
                    v-model="scopeRow.group_project_name"
                    placeholder="请输入项目名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="项目类型">
            <el-select class="inputWidth"
                     v-model="scopeRow.group_project_type"
                     filterable
                     clearable
                     placeholder="请输入项目类型">
            <el-option
              v-for="item in projectType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Git仓库">
              <div v-for="(item, index) in gitArray" :key="index">
                  <el-input class="inputWidth"
                            :class="index==0?'':'mutileInput'"
                            v-model="item.value"
                            placeholder="请输入git路径"
                            clearable>
                  </el-input>
                <i v-if="gitArray.length==index+1" class="myIcon el-icon-circle-plus-outline"
                  @click=addProperty(1)></i>
                <i v-if="gitArray.length>index+1" class="myIcon el-icon-remove-outline"
                  @click=subProperty(1,index)></i>
              </div>
        </el-form-item>
        <!-- <el-form-item label="项目成员">
            <app-employee  class="inputWidth" v-model="scopeRow.follower_list" multiple></app-employee>
        </el-form-item> -->
        <el-form-item label="创建时间">
          <el-input class="inputWidth"
                    v-model="scopeRow.create_time"
                    disabled
                    placeholder="请输入项目名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="更新时间">
          <el-input class="inputWidth"
                    v-model="scopeRow.update_time"
                    disabled
                    placeholder="请输入项目名称"
                    clearable></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="octopus-diaolog-button" @click="updateDialogFormVisible = false">取消</el-button>
        <el-button class="octopus-diaolog-btn" type="primary" @click="updateProject()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
    updateGroupProject: 'octopus_group/updateGroupProject'
})({
  props: ['updateDialogVisible', 'projectContext'],
  data() {
    return {
        updateDialogFormVisible: null,
        projectType: [{value: 1, label: '团队项目'}, {value: 0, label: '默认项目'}],
        scopeRow: {},
        gitArray: [{value: 'git@git.xiaojukeji.com:'}],
        param: {
            group_project_name: '',
            git_url: [],
            follower_list: []
        }
    }
  },
  created() {
  },
  mounted() {
  },
  watch: {
    updateDialogVisible(val) {
        this.updateDialogFormVisible = val
    },
    updateDialogFormVisible(val) {
        this.$emit('updateProjectDialog', this.updateDialogFormVisible)
    },
    projectContext(val) {
        this.scopeRow = val
        if (val.git_url != '') {
            this.gitArray = []
            let temp = val.git_url.split(',')
            temp.forEach(element => {
                this.gitArray.push({value: element})
            });
        } else {
            this.gitArray = [{value: 'git@git.xiaojukeji.com:'}]
        }
    }
  },
  methods: {
      updateProject() {
          let temp = []
          for (let i = 0; i < this.gitArray.length; i++) {
              if (this.gitArray[i].value !== 'git@git.xiaojukeji.com:' && this.gitArray[i].value !== '') {
                  temp.push(this.gitArray[i].value)
              } else {
                  temp = []
              }
          }
          this.scopeRow.git_url = temp
          this.updateGroupProject(this.scopeRow).then(res => {
              this.$parent.fetchData()
              this.updateDialogFormVisible = false
          })
      },
      addProperty(type) {
        if (type === 1) {
          this.gitArray.push({value: 'git@git.xiaojukeji.com:'})
        } else if (type === 2) {
          this.gitArray.push({value: 'git@git.xiaojukeji.com:'})
        }
      },
      subProperty(type, index) {
        if (type === 1) {
          this.gitArray.splice(index, 1)
        } else if (type === 2) {
          this.gitArray.splice(index, 1)
        }
      }
  }
})
</script>
<style lang="less">
#octopus-group-update-project-dialog{
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