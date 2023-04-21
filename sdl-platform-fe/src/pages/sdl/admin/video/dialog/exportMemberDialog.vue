<template>
       <el-dialog title="导出人员名单" 
            id="create-video-task-dialog" 
            :visible.sync="checkDialogVisible" 
            width="440px">
       <el-form :inline="true" label-width="80px" label-position="left" >
        <el-form-item label="课程包ID">
          <el-input class="inputWidth"
                    v-model="id"
                    disabled
                    placeholder="请输入项目名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select class="inputWidth"
                  v-model="dept_t1_id"
                  filterable
                  clearable
                  placeholder="请选择一级部门">
                    <el-option
                    v-for="item in deptList"
                    :key="item.dept_id"
                    :label="item.dept_name"
                    :value="item.dept_id">
                    </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否完成观看">
            <el-select v-model="is_finish" placeholder="请选择" class="inputWidth">
                <el-option
                v-for="item in isFinish"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="octopus-diaolog-button" @click="checkDialogVisible = false">取消</el-button>
        <el-button class="octopus-diaolog-btn" type="primary" @click="exportInfo()">导出</el-button>
      </span>
    </el-dialog>
</template>

<script>

// import * as CONSTANTS from '@/commons/dorado'
import { connect } from '@/lib'
import XLSX from 'xlsx'

export default connect(() => {
  return {
  }
}, {
    exportMemberList: 'dolphin_mooc/exportMemberList',
    getDeptList: 'ocean_department/getDeptList'
})({
  props: ['dialogVisible', 'videoId'],
  data() {
    return {
      deptList: [],
      checkDialogVisible: null,
      id: this.videoId,
      dept_t1_id: null,
      is_finish: 0,
      isFinish: [{label: '未完成视频观看', value: 0}, {value: 1, label: '完成视频观看'}]
    }
  },
  created() {
    this.getDeptList().then(data => {
      this.deptList = data.dept_list
    })
  },
  mounted() {
  },
  watch: {
    dialogVisible(val) {
        this.checkDialogVisible = val
    },
    checkDialogVisible(val) {
        this.$emit('getExportDialog', this.checkDialogVisible)
    },
    videoId(val) {
        this.id = val
    }
  },
  methods: {
      exportInfo() {
          let param = {
              course_id: this.id,
              is_finish: this.is_finish,
              dept_t1_id: this.dept_t1_id
          }
          this.exportMemberList(param).then(res => {
              this.checkDialogVisible = false
              let filename = '人员信息.xlsx';
              let data = [res]
              let wsName = 'Sheet1';
              let wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data);
              XLSX.utils.book_append_sheet(wb, ws, wsName);
              XLSX.writeFile(wb, filename);
          })
      }
  }
})
</script>
<style lang="less">
#create-video-task-dialog{
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