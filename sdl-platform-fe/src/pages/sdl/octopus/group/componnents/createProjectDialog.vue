<template>
       <el-dialog id="octopus-group-project-dialog"
                title="创建项目"
               :visible.sync="dialogFormVisible"
                width="490px">
      
      <el-form :inline="true" label-width="100px" label-position="left" >
        
        
        <el-form-item label="项目名称">
          <el-input class="inputWidth"
                    v-model="param.group_project_name"
                    placeholder="请输入项目名称"
                    clearable></el-input>
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
        <el-form-item label="项目成员">
            <app-employee  class="inputWidth" v-model="param.follower_list" multiple></app-employee>
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

export default connect(() => {
  return {
  }
}, {
    createGroupProject: 'octopus_group/createGroupProject'
})({
  props: ['dialogVisible'],
  data() {
    return {
        dialogFormVisible: null,
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
    dialogVisible(val) {
        this.dialogFormVisible = val
    },
    dialogFormVisible(val) {
        this.$emit('projectDialog', this.dialogFormVisible)
    }
  },
  methods: {
      createProject() {
          let temp = []
          for (let i = 0; i < this.gitArray.length; i++) {
              if (this.gitArray[i].value !== 'git@git.xiaojukeji.com:' && this.gitArray[i].value !== '') {
                  temp.push(this.gitArray[i].value)
              }
          }
          this.param.git_url = temp
          this.createGroupProject(this.param).then(res => {
              this.$parent.fetchData()
              this.dialogFormVisible = false
              this.param = {
                group_project_name: '',
                git_url: [],
                follower_list: []
              }
              this.gitArray = [{value: 'git@git.xiaojukeji.com:'}]
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
#octopus-group-project-dialog{
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