<template>
  <div id="ratel-selfService">
    <el-upload
        class="upload-demo"
        drag
        action="/api/ratel/onetime/app/upload"
        :on-success="successUpload"
        :on-remove="onRemoveUpload"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>
        <div class="el-upload__tip" slot="tip">只能上传APK/IPA/ZIP文件，且不超过500MB</div>
        </div>
    </el-upload>
    <transition  name="fade"  v-for="item in fileList" :key="item.name">
        <div class="box-card">
          <el-card class="box-card__item"  shadow="hover">
            <div slot="header" >
                <span>{{item.app_name==''?'--':item.app_name}}</span>
                <el-button type="text" style="float: right; padding: 3px 0" @click="detail(item.app_name, item.ratel_onetime_task_id)">
                  <span v-if="(item.static_status===0 || item.dynamic_status===0) && item.static_status!==1 && item.dynamic_status!==1 && item.static_status!==4 && item.dynamic_status!==4">未检测</span>
                  <span v-if="(item.static_status===1 || item.dynamic_status===1) && item.static_status!==4 && item.dynamic_status!==4">检测中</span>
                    <router-link v-if="item.static_status===4 || item.dynamic_status===4"  style="color: #FC9153;" :to="{ path : '/sdl/ratel/selfService/detail', query: {ratel_onetime_task_id: item.ratel_onetime_task_id}}" target=_blank>
                        详情
                    </router-link>

                </el-button>
            </div>
            <div class="box-card__item__img">
                <!-- <span v-if="judgeType(item.app_url)" ></span> -->
                <img v-if="item.icon_link" class="image" :src="item.icon_link" alt="">
                <img v-else-if="judgeType(item.app_url)" class="image" src="@/assets/android.jpeg" alt="">
                <img v-else class="image" src="@/assets/apple.png" alt="">
            </div>
            <div class="box-card__item__text">
                <!-- <span class="box-card__item__text__appname">{{item.app_name==''?'--':item.app_name}}</span><br> -->
                <span class="box-card__item__text__info">类型：{{item.app_type==''?'--':item.app_type}}</span><br>
                <span class="box-card__item__text__info">包名：{{item.app_package_name==''?'--':item.app_package_name}}</span><br>
                <span class="box-card__item__text__info">上传时间：{{item.task_create_time==''?'--':item.task_create_time.split(' ')[0]}}</span><br>
                <a :href="item.app_url" class="box-card__item__text__href">APP下载地址</a><br>
                <!-- <span>查看详情</span> -->
            </div>
          </el-card>
        </div>
    </transition>
    <i class="placeholder"></i><i class="placeholder"></i><i class="placeholder"></i><i class="placeholder"></i><i class="placeholder"></i><i class="placeholder"></i>
  </div>
</template>
<script>
import {connect} from '@/lib'
export default connect(() => {
    return {
    }
    }, {
        getResultByTaskId: 'ratel_selfService/getResultByTaskId',
        getTaskList: 'ratel_selfService/getTaskList',
        createTask: 'ratel_selfService/createTask',
        uploadAPK: 'ratel_selfService/uploadAPK'
    })({
    data() {
      return {
        fileList: [],
        fileArr: []
      }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            this.getTaskList().then(res => {
                this.fileList = res.ratel_onetime_task_list
            })
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
            this.createTask(file.data).then(res => {
                this.fileList.unshift(res)
            })
        },
        onRemoveUpload() {},
        judgeType(url) {
            let temp = url.split('.')
            if (temp[temp.length - 1] === 'apk') {
                return true
            }
            return false
        },
        detail(name, id) {
            if (name === '') {
                return
            }
            this.getResultByTaskId({ratel_onetime_task_id: id}).then(res => {
                console.log(res)
            })
        }
    }
})
</script>
<style lang="less">
  #ratel-selfService {
    margin: auto;
    width: 100%;
    height: 100%;
    background: white;
    // margin-top: -40px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    flex-flow: row wrap;
    align-content: flex-start;
    justify-content: space-between;
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
    .box-card{
        width: 320px;
        height: 180px !important;
        // display: inline-block;
        margin-bottom: 20px;
        flex-shrink: 1;
        &__item{
            width: 320px;
            height: 180px !important;
            &__img{
                display: inline-block;
                width: 70px;
                height: 70px;
                border-radius: 4px;
                margin-top: 10px;
                float: left;
                .image{
                    width: 70px;
                    height: 70px;
                    border-radius: 8px;
                    overflow: hidden;
                }
            }
            &__text{
                padding-left: 20px;
                // width: 100%;
                overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                &__appname{
                    font-size: 15px;
                }
                &__info{
                    font-size: 12px;
                }
                &__href{
                    width: 100%;
                    color: #fc9153;
                    font-size: 12px;
                    text-decoration: underline;
                }
            }
        }

        .el-card__header {
            padding: 10px 20px;
            border-bottom: 1px solid #e2e2e2;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
        }
        .el-card__body {
            padding: 25px 20px;
        }
    }
    .placeholder{
        width: 320px;
        // height: 180px;
    }
    @media screen and (min-width: 990px) and (max-width: 1230px) {
        .box-card{
            width: 360px;
            height: 180px !important;
            &__item{
                width: 360px;
                height: 180px !important;
            }
        }
    }
    @media screen and (min-width: 970px) and (max-width: 990px) {
        .box-card{
            width: 320px;
            height: 180px !important;
            &__item{
                width: 320px;
                height: 180px !important;
            }
        }
    }
    @media screen and (min-width: 870px) and (max-width: 970px) {
        .box-card{
            width: 300px;
            height: 180px !important;
            &__item{
                width: 300px;
                height: 180px !important;
            }
        }
    }
    @media screen and (min-width: 0px) and (max-width: 870px) {
        .box-card{
            width: 360px;
            height: 180px !important;
            &__item{
                width: 360px;
                height: 180px !important;
            }
        }
    }
    @media screen and (min-width: 1110px) and (max-width: 1920px) {

    }
  }
  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

