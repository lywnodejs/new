<template>
  <div id="admin-video-course-list">

    <div class="title">所有课程包</div>
    <el-table
        :data="tableData"
        v-loading>
        <el-table-column
          prop="course_id"
          label="课程ID"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          label="课程包标题"
          align="center"
          width="100">
          <template slot-scope="scope">
              <span>{{scope.row.course_title}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          width="180">
          <template slot-scope="scope">
              <span>{{scope.row.create_time}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="video_title"
          label="视频名称"
          align="center">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="200">
          <template slot-scope="scope">
              <el-button type="text" @click="createTask(scope.row.course_id)">创建任务</el-button>
              <el-button type="text" @click="exportMember(scope.row.course_id)">人员导出</el-button>
              <el-button type="text" @click="deleteCourse(scope.row.course_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    <create-task-dialog :dialogVisible='importDialogVisible' :videoId='videoId' @getTaskDialog='getTaskDialog'></create-task-dialog>
    <export-member-dialog :dialogVisible='exportDialogVisible' :videoId='videoId' @getExportDialog='getExportDialog'></export-member-dialog>
  </div>
</template>
<script>
import {connect} from '@/lib'
import createTaskDialog from '../dialog/createTaskDialog'
import exportMemberDialog from '../dialog/exportMemberDialog'
export default connect(() => {
    return {
    }
  }, {
      delPackageCourse: 'admin_video/delPackageCourse',
    uploadVideoMooc: 'dolphin_mooc/uploadVideoMooc',
    importVideoMemberList: 'dolphin_mooc/importVideoMemberList',
    createMoocTask: 'dolphin_mooc/createMoocTask',
    exportMemberList: 'dolphin_mooc/exportMemberList',
    getCourseAllList: 'dolphin_mooc/getCourseAllList'
  })({
    data() {
      return {
        course_id: this.$route.query['course_id'],
        tableData: [],
        courseData: [],
        importDialogVisible: false,
        exportDialogVisible: false,
        videoId: null,
        formData: {
            author: '',
            title: ''
        }
      }
    },
    components: {exportMemberDialog, createTaskDialog},
    created() {
        this.getVideo()
    },
    methods: {
        getVideo() {
            this.getCourseAllList().then(res => {
                this.tableData = res
            })
        },
        createTask: function(id) {
            this.videoId = id
            this.importDialogVisible = true
        },
        exportMember: function(id) {
            this.videoId = id
            this.exportDialogVisible = true
        },
        getTaskDialog(val) {
            this.importDialogVisible = val
        },
        getExportDialog(val) {
            this.exportDialogVisible = val
        },
        deleteCourse(id) {
            this.delPackageCourse({course_id: Number(id)}).then(res => {
                this.getVideo()
            })
        }
    }
})
</script>
<style lang="less">
  #admin-video-course-list {
    margin: auto;
    width: 100%;
    height: 100%;
    background: white;
    box-sizing: border-box;
    .title {
        color: #333333;
        font-size: 14px;
        display: inline-block;
        line-height: 48px;
        margin-top: 20px;
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

