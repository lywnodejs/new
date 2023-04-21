<template>
    <div id="dolphin-mooc-mycourse">
        <div class="course-title">待学习课程包</div>
      <el-row class="mooc-box" :gutter="20">
        <el-col :span="6" v-for="(item, index) in videoList" :key='index'>
            <el-card :body-style="{padding: '0px'}" shadow="hover" @click.native="getVideo(item.course_id, item.course_title)" class="video-box">
            <img :src="item.course_cover ? item.course_cover : '../../../../../assets/mooc.jpg'" class="image">
            <div class="video-box-title">
                <span>{{item.course_title}}</span>
                <!-- <div class="bottom clearfix">
                <time class="time">{{ item.create_time }}</time>
                <el-button type="text" class="button" @click="getVideo(item.id)">观看</el-button>
                </div> -->
            </div>
            </el-card>
        </el-col>
      </el-row>
    </div>
</template>
<script>
import { connect } from '@/lib'

export default connect(() => {
  return {
  }
}, {
  getVideoList: 'dolphin_mooc/getVideoList',
  getVideoPlay: 'dolphin_mooc/getVideoPlay',
  getVideoUnfinished: 'dolphin_mooc/getVideoUnfinished',
  uploadVideoMooc: 'dolphin_mooc/uploadVideoMooc',
  finishVideoMooc: 'dolphin_mooc/finishVideoMooc',
  importVideoMemberList: 'dolphin_mooc/importVideoMemberList',
  createMoocTask: 'dolphin_mooc/createMoocTask',
  exportMemberList: 'dolphin_mooc/exportMemberList'
})({
    data() {
        return {
            value: '',
            videoList: []
        }
    },
    mounted() {
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData: function() {
            this.getVideoUnfinished().then(res => {
                this.videoList = res
            })
        },
        getVideo(id, title) {
            window.open(`/sdl/dolphin/mooc/video/detail?course_id=${id}&course_title=${title}`)
        }
    }
})
</script>
<style lang="less">
.el-card{
    width: 260px;
    margin: 0 auto;
    margin-bottom: 40px;
}
#dolphin-mooc-mycourse {
    margin: auto;
    box-sizing: border-box;
    .course-title{
        font-size: 20px;
        margin-bottom: 25px;
        font-family: "微软雅黑","苹方",sans-serif;
        color: #333;
    }
    .mooc-box{
        min-width: 1190px;
        margin: 0 auto;
        .video-box{
            img{
                cursor: pointer;
                width: 100%;
                height: 140px;
            }
            &-title{
                cursor: pointer;
                padding:8px 14px;
            }
            &-title:hover{
                color: orange;
            }
        }
    }
    .grid-content {
        .box{
            width: 250px;
            height: 140px;
            img{
                width: 250px;
                height: 140px;
            }
        }
    }
}
</style>