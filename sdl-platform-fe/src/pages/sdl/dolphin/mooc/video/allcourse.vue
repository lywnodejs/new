<template>
    <div id="dolphin-mooc-allcourse">
        <div class="course-title">所有视频</div>
      <el-row class="mooc-box" :gutter="20" v-for="(element, i) in videoList" :key='i'>
        <el-row v-show="element.length != 0"><span>&nbsp;&nbsp;&nbsp;第{{i + 1}}章</span></el-row>
        <el-col :span="6" v-for="(item, index) in element" :key='index'>
            <el-card :body-style="{padding: '0px'}" shadow="hover" @click.native="getVideo(item.id)" class="video-box">
              <div v-if="item.is_finish" class="video-box--mast--wrap">
                <div v-if="item.is_task" class="video-box--task">
                </div>
                <p class="video-box--task--content">{{ $t('必修') }}</p>
                <img :src="item.video_cover ? item.video_cover : '../../../../../assets/mooc.jpg'" class="image">
                <div class="video-box--mast--content"></div>
              </div>
              <div v-else class="video-box--wrap">
                <div v-if="item.is_task" class="video-box--task">
                </div>
                  <p v-if="item.is_task" class="video-box--task--content">{{ $t('必修') }}</p>
                <img :src="item.video_cover ? item.video_cover : '../../../../../assets/mooc.jpg'" class="image">
              </div>
              <div class="video-box-title" :class="item.is_finish ? 'video-box-title--finish' : ''">
                  <span>{{item.title}}</span>
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
  importVideoMemberList: 'dolphin_mooc/importVideoMemberList',
  createMoocTask: 'dolphin_mooc/createMoocTask',
  exportMemberList: 'dolphin_mooc/exportMemberList',
  getCourseList: 'dolphin_mooc/getCourseList'
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
            this.getVideoList().then(res => {
                let temp1 = [], temp2 = [], temp3 = []
                for (let i = 0; i < res.length; i++) {
                    if (res[i].video_chapter.split('.')[0] === '1') {
                        temp1.push(res[i])
                    } else if (res[i].video_chapter.split('.')[0] === '2') {
                        temp2.push(res[i])
                    } else {
                        temp3.push(res[i])
                    }
                }
                this.videoList = [temp1, temp2, temp3]
                for (let i = 0; i < this.videoList.length; i++) {
                    this.videoList[i].sort((a, b) => {
                        return Number(a.video_chapter) - Number(b.video_chapter)
                    })
                }
            })
        },
        getVideo(id) {
            window.open('/sdl/dolphin/mooc/video/play?video_id=' + id)
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
#dolphin-mooc-allcourse {
    margin: auto;
    box-sizing: border-box;
    .course-title{
        font-size: 20px;
        font-weight: 100;
        margin-bottom: 15px;
    }
    .mooc-box{
        min-width: 1190px;
        margin: 0 auto;
        .video-box{
            img{
              display: block;
                cursor: pointer;
                width: 100%;
                height: 140px;
            }
            &-title{
                cursor: pointer;
                padding:8px 14px;

                &--finish {
                  color: rgba(0, 0, 0, .4);
                }
            }
            &-title:hover{
                color: orange;
            }

          &--mast--content {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(0, 0, 0, .3);
          }

          &--mast--wrap {
            height: 100%;
            width: 100%;
            position: relative;
          }

          &--wrap {
            position: relative;
          }

          &--task {
            width: 0;
            height: 0;
            border-left: 50px solid transparent;
            border-top: 50px solid #F3AC3C;
            position: absolute;
            right: 0;
            z-index: 2;

            &--content {
              position: absolute;
              right: 2px;
              top: 5px;
              transform: rotate(45deg);
              color: #fff;
              z-index: 3;
            }
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
