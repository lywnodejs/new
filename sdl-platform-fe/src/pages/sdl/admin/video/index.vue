<template>
  <div id="admin-video">
    <!-- <el-upload
        class="upload-demo"
        drag
        action="http://sdl.xiaojukeji.com/api/dolphin/mooc/video/upload"
        :on-success="successUpload"
        :on-remove="onRemoveUpload"
        :data="formData"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将视频拖到此处，或<em>点击上传视频</em>
        <div class="el-upload__tip" slot="tip">目前只支持上传m3u8和ts格式的视屏接口</div>
        
        </div>
    </el-upload>
    <div class="file-info">
            <el-input v-model="formData.author" placeholder="请输入作者" style="width: 150px" clearable></el-input>
            <el-input v-model="formData.title" placeholder="视频名称" clearable style="width: 150px" ></el-input>
    </div> -->
    <el-button class="create-course-button" @click="addVideo">上传视频</el-button>
    <el-button class="create-course-button" @click="addCourse">创建课程包</el-button>
    <course-list></course-list>
    <video-list ref="videoList"></video-list>
    <create-course-dialog  :dialogVisible='dialogVisible' @getCourseDialog='getCourseDialog'></create-course-dialog>
    <create-video-dialog :dialogVisible='addVideoDialog' @addVideo='getVideoDialog'></create-video-dialog>
  </div>
</template>
<script>
import {connect} from '@/lib'
import videoList from './components/videoList'
import courseList from './components/courseList'
import createCourseDialog from './dialog/createCourse'
import createVideoDialog from './dialog/createVideoDialog'
export default connect(() => {
    return {
    }
  }, {
    uploadVideoMooc: 'dolphin_mooc/uploadVideoMooc'
  })({
    data() {
      return {
        dialogVisible: false,
        videoId: null,
        formData: {
            author: '',
            title: ''
        },
        addVideoDialog: false
      }
    },
    components: { videoList, courseList, createCourseDialog, createVideoDialog },
    created() {
    },
    methods: {
        getVideo() {
        },
        getCourseId() {
        },
        successUpload(file, fileList) {
            this.fileArr.forEach((item, index) => {
                item.progressFlag = false
                if (item.status == 'success') {
                    item.successFlag = true
                } else {
                    item.successFlag = false
                }
            })
            this.$videoList.getVideo()
        },
        onRemoveUpload() {},
        uploadVideo: function() {
        },
        importMember: function() {},
        addCourse() {
          this.dialogVisible = true
        },
        getCourseDialog(val) {
          this.dialogVisible = val
        },
        addVideo() {
          this.addVideoDialog = true
        },
        getVideoDialog(val) {
          this.addVideoDialog = val
        }
    }
})
</script>
<style lang="less">
  #admin-video {
    margin: auto;
    width: 100%;
    height: 100%;
    background: white;
    box-sizing: border-box;
    .create-course-button{
      height: 32px;
      width: 100px;
      padding: 0px;
      text-align: center;
      background: #fc9153;
      border-radius: 4px;
      border: none;
      color: white;
      font-size: 12px;;
      -webkit-font-smoothing: antialiased;
      float: right;
      margin-right: 20px;
    }
    .file-info{
        position: relative;
        top: -70px;
        left: 20px;
    }
    .upload-demo{
        width: 100%;
        height: 220px;
        display: inline-block;
        margin-bottom: 20px; 
        // margin-right: 30px;
        .el-upload {
            width: 100%;
            height: 220px;
        }
        .el-upload-dragger{
            width: 100%;
            height: 220px;
        }
        .el-upload-dragger:hover{
            background: #fff7f2;
            // background: rgba(32, 159, 255, 0.06)
        }
        .el-upload-list{
            // position: relative;
            margin-top: -220px;
            margin-left: 20px;
        }
        .el-upload-list__item{
            width: 360px;;
        }
        .el-upload-dragger .el-icon-upload {
            font-size: 67px;
            color: #c0c4cc;
            margin: 55px 0 16px;
            line-height: 50px;
        }
    }
  }
</style>

