<template>
  <div id="admin-video-list">

    <div class="title">所有视频列表</div>
    <el-table
        :data="tableData"
        v-loading>
        <el-table-column
          prop="video_chapter"
          label="视频章节"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          label="标题"
          align="center"
          width="100">
          <template slot-scope="scope">
              <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="author"
          label="作者"
          width="100"
          align="center">
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
          prop="video_gift_url"
          label="地址"
          align="center">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="80">
          <template slot-scope="scope">
              <el-button type="text" @click="deleteVideo(scope.row.title)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>
<script>
import {connect} from '@/lib'
export default connect(() => {
    return {
    }
  }, {
    getVideoList: 'dolphin_mooc/getVideoList',
    delVideo: 'admin_video/delVideo'
  })({
    data() {
      return {
        tableData: [],
        courseData: [],
        videoId: null,
        formData: {
            author: '',
            title: ''
        }
      }
    },
    created() {
        this.getVideo()
    },
    methods: {
        getVideo() {
            this.getVideoList().then(res => {
                this.tableData = res
                this.tableData.sort((a, b) => {
                    return Number(a.video_chapter) - Number(b.video_chapter)
                })
            })
        },
        deleteVideo(title) {
          this.$confirm('确认删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
            this.delVideo({video_title: title}).then(res => {
              this.getVideo()
            })
          }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
          });
        }
    }
})
</script>
<style lang="less">
  #admin-video-list {
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

