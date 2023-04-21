<template>
       <el-dialog title="创建课程包"
            id="create-video-task-dialog"
            :visible.sync="checkDialogVisible"
            width="440px">
       <el-form :inline="true" label-width="80px" label-position="left" >
        <el-form-item label="课程包名称">
          <el-input class="inputWidth"
                    v-model="form.course_title"
                    placeholder="请输入项目名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="视频">
            <el-select v-model="form.video_id" multiple placeholder="请选择" class="inputWidth">
                <el-option
                    v-for="item in videoList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="上传封面">
          <el-upload
            action="/api/dolphin/mooc/course/package/cover"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="successUpload"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :name='"course_cover"'
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传png/jpeg文件，以最新上传为准</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="octopus-diaolog-button" @click="checkDialogVisible = false">取消</el-button>
        <el-button class="octopus-diaolog-btn" type="primary" @click="createCourse()">创建</el-button>
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
    getVideoList: 'dolphin_mooc/getVideoList',
    exportMemberList: 'dolphin_mooc/exportMemberList',
    createPackageCourse: 'admin_video/createPackageCourse'
})({
  props: ['dialogVisible', 'videoId'],
  data() {
    return {
        form: {
            course_title: '',
            video_id: [],
            course_cover: null
        },
      checkDialogVisible: null,
      videoList: [],
      fileList: []
    }
  },
  created() {
      this.getVideoList().then(res => {
          this.videoList = res
      })
  },
  mounted() {
  },
  watch: {
    dialogVisible(val) {
        this.checkDialogVisible = val
    },
    checkDialogVisible(val) {
        this.$emit('getCourseDialog', this.checkDialogVisible)
    }
  },
  methods: {
      createCourse() {
          let form = _.cloneDeepWith(this.form)
          form.video_id = form.video_id.join(',')
          this.createPackageCourse(form).then(res => {
              this.checkDialogVisible = false
          })
      },
      handlePreview() {},
      handleRemove() {},
      beforeRemove() {},
      handleExceed() {},
      successUpload(file, fileList) {
          this.form.course_cover = file.data.video_cover_url
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
