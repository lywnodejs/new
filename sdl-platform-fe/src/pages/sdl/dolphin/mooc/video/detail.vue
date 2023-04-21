<template>
    <div id="dolphin-mooc">
      <div class="course-title">{{title}}</div>
      <el-row class="mooc-box" :gutter="20" v-for="(element, i) in videoList" :key='i'>
        <el-row v-show="element.length != 0"><span>&nbsp;&nbsp;&nbsp;第{{i + 1}}章</span></el-row>
        <el-col :span="6" v-for="(item, index) in element" :key='index'>
            <el-card :body-style="{padding: '0px'}" shadow="hover" @click.native="getVideo(item.id)" class="video-box">
            <!-- <img :src="item.video_cover ? item.video_cover : '../../../../../assets/mooc.jpg'" class="image">
            <div class="video-box-title">
                <span>{{item.title}}</span>

            </div> -->
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
  getCourseAllList: 'dolphin_mooc/getCourseAllList',
  getCourseList: 'dolphin_mooc/getCourseList'
})({
    data() {
        return {
            course_id: this.$route.query['course_id'],
            title: this.$route.query['course_title'],
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
            this.getCourseList({course_id: Number(this.course_id)}).then(res => {
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
        getVideo(id, title) {
            window.open(`/sdl/dolphin/mooc/video/play?video_id=${id}&video_title=${title}`)
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
#dolphin-mooc {
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
