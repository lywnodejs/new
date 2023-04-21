<template>
       <el-dialog id="add-baseline-dialog"
                title="添加基线"
               :visible.sync="dialogFormVisible"
                width="460px">
      
      <el-form :inline="true" label-width="100px" label-position="left" >
        
        
        <el-form-item label="项目ID">
          <el-input class="inputWidth"
                    v-model="param.sdl_project_id"
                    disabled
                    placeholder="请输入项目名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="基线编号">
          <!-- <el-input class="inputWidth"
                    v-model="param.baseline_no"
                    placeholder="请输入基线编号"
                    clearable></el-input> -->
           <el-select class="inputWidth"
            v-model="param.baseline_no"
            placeholder="请输入基线编号">
            <el-option
              v-for="item in baseline"
              :key="item.baseline_no"
              :disabled='isDisabled(item.baseline_no)'
              :label="item.baseline_no + ': ' +item.baseline_name"
              :value="item.baseline_no">
            </el-option>
          </el-select>
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
    user: 'user/user',
      baselineReqList: 'baseline_requirement/baselineReqList'
  }
}, {
    addOutputBaseline: 'baseline_requirement/addOutputBaseline',
    listAllBaseline: 'baseline_requirement/listAllBaseline',
    baselineNewCTR: 'baseline_requirement/baselineNewCTR'
})({
  props: ['dialogVisible'],
  data() {
    return {
        dialogFormVisible: null,
        param: {
          sdl_project_id: parseInt(this.$route.query['projectId']),
          baseline_no: ''
        },
        baseline: []
    }
  },
  created() {
      this.getListAll()
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
          let queryParam = {
            CTR_data: {
              sdl_project_id: parseInt(this.$route.query['projectId']),
              username: this.user.username,
              baseline_no: this.param.baseline_no
            },
            function_name: 'add_baseline'
          }
          this.addOutputBaseline(this.param).then(res => {
            this.baselineNewCTR(queryParam).then(res => {
              this.param.baseline_no = ''
            })
            this.$parent.fetchData()
          })
          this.dialogFormVisible = false
      },
      getListAll() {
          this.listAllBaseline({}).then(res => {
              this.baseline = res.baseline_list
          })
      },
      isDisabled(val) {
          for (let i = 0; i < this.baselineReqList.length; i++) {
            if (this.baselineReqList[i].baseline_no == val) {
                return true
            }
          }
      }
  }
})
</script>
<style lang="less">
#add-baseline-dialog{
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