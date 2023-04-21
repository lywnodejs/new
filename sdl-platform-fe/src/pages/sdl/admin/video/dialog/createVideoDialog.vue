<template>
       <el-dialog title="创建视频观看任务"
            id="create-video-dialog"
            :visible.sync="checkDialogVisible"
            width="440px">
       <el-form :inline="true" label-width="80px" label-position="left" >
        <el-form-item label="作者">
            <el-input class="inputWidth" v-model="formData.author" placeholder="请输入作者" clearable></el-input>
        </el-form-item>
        <el-form-item label="视频名称">
            <el-input  class="inputWidth" v-model="formData.title" placeholder="视频名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属视频章节">
            <el-select v-model="formData.video_chapter" placeholder="请选择" class="inputWidth">
                <el-option
                v-for="item in chapters"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="上传视频">
            <el-upload
                ref="file"
                action="/api/dolphin/mooc/video/upload"
                :on-success="successUpload"
                :data="formData"
                multiple
                :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">目前只支持上传m3u8和ts格式的视屏接口</div>
            </el-upload>
        </el-form-item>
        <el-form-item label="上传封面">
          <el-upload
            ref='courseCover'
            action="/api/dolphin/mooc/video/cover/upload"
            :on-success="successUpload1"
            :name='"video_cover"'
            :file-list="pictureList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传png/jepg文件，以最新上传为准</div>
        </el-upload>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="octopus-diaolog-button" @click="checkDialogVisible = false">取消</el-button>
        <el-button class="octopus-diaolog-btn" type="primary" @click="uploadVideo()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>

// import * as CONSTANTS from '@/commons/dorado'
import { connect } from '@/lib'
import ajax from '@/plugin/ajax'
export default connect(() => {
  return {
  }
}, {
    uploadVideoMooc: 'dolphin_mooc/uploadVideoMooc'
})({
  props: ['dialogVisible', 'videoId'],
  data() {
    return {
      checkDialogVisible: null,
      id: this.videoId,
      url: null,
      finsh_time: '',
      fileList: [],
      pictureList: [],
      fileForm: new FormData(),
      formData: {
        author: '',
        title: '',
        video_cover: '',
        video_chapter: '',
        video_gift_url: ''
      },
      picture: '',
      file: '',
      chapters: [{value: 1, label: 1}, {value: 2, label: 2}, {value: 3, label: 3}, {value: 4, label: 4}]
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
        this.$emit('addVideo', this.checkDialogVisible)
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

    //   successUpload(file, fileList) {
    //       this.url = file.data.download_url
    //   },
      updateInfo() {
      },
      successUpload(file, fileList) {
        this.formData.video_gift_url = file.data.download_url_list.join(',')
        this.fileList.push(file.data.download_url_list.join(','))
      },
      successUpload1(file, fileList) {
        this.formData.video_cover = file.data.video_cover_url
      },
      onRemoveUpload() {},
      uploadVideo: function() {

        //   let fileForm = new FormData()
        //   let that = this
        //   fileForm.append('author', that.formData.author);
        //   fileForm.append('title', that.formData.title);
        //   fileForm.append('course_cover', that.picture);
        //   fileForm.append('file', that.file);
        //   console.log(fileForm.get('author'))
            let queryparam = _.cloneDeepWith(this.formData)
            queryparam.video_gift_url = this.fileList.join(',')
          ajax.post('/dolphin/mooc/video/create', queryparam).then(res => {
          })
          this.checkDialogVisible = false

        //   this.uploadVideoMooc(this.formData)
      },
      uploadPicture(param) {
        let fileObj = param.file;
        this.fileForm.append('course_cover', fileObj);
        let form = new FormData()
        form.append('video_cover', fileObj);

        // ajax.post('/dolphin/mooc/video/cover/upload', form).then(res => {
        // })
        const xhr = new XMLHttpRequest();
        const action = '/api/dolphin/mooc/video/cover/upload';

        if (xhr.upload) {
            xhr.upload.onprogress = function progress(e) {
            if (e.total > 0) {
                e.percent = e.loaded / e.total * 100;
            }

            // option.onProgress(e);
            };
        }

        xhr.open('post', action, true);
        xhr.send(form);
      },
      uploadFile(param) {
          console.log(param)
        let fileObj = param.file;
        this.file = fileObj
        this.fileForm.append('file', fileObj);
        let form = new FormData()
        form.append('file', fileObj);
        this.formData.file = form
      }
  }
})
</script>
<style lang="less">
#create-video-dialog{
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
