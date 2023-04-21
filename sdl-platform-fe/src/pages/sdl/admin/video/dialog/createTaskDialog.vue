<template>
       <el-dialog title="创建视频观看任务"
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
        <el-form-item label="人员名单">
          <el-upload
            action="/api/dolphin/mooc/member/importList"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="successUpload"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传txt/excl文件，以最新上传为准</div>
        </el-upload>
        </el-form-item>
        <el-form-item label="完成时间">
            <!-- <el-date-picker
            、  class="inputWidth"
                v-model="finsh_time"
                type="datetime"
                placeholder="选择日期时间">
            </el-date-picker> -->
            <el-date-picker
                class="inputWidth"
                v-model="finsh_time"
                type="datetime"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
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
    createMoocTask: 'dolphin_mooc/createMoocTask'
})({
  props: ['dialogVisible', 'videoId'],
  data() {
    return {
      checkDialogVisible: null,
      id: this.videoId,
      url: null,
      finsh_time: '',
      fileList: []
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
        this.$emit('getTaskDialog', this.checkDialogVisible)
    },
    videoId(val) {
        this.id = val
    }
  },
  methods: {
      handlePreview() {},
      handleRemove() {},
      beforeRemove() {},
      handleExceed() {},
      successUpload(file, fileList) {
          this.url = file.data.download_url
      },
      updateInfo() {
          let param = {
              download_url: this.url,
              course_id: this.id,
              except_finish_time: this.finsh_time
          }
          this.createMoocTask(param).then(res => {
              console.log(res)
              this.checkDialogVisible = false
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
