<!--首页&策略列表页-->
<template>
  <el-container>
    <el-header style="padding: 0">
      <app-header v-if="!showRobotHeader"></app-header>
      <robotHeader v-if="showRobotHeader"></robotHeader>
    </el-header>
    <el-container>
      <el-aside width="250px">
        <el-menu :default-active="this.$route.query.index"
                 class="el-menu-vertical-demo"
                 background-color="#273142"
                 text-color="#7F8FA4"
                 active-text-color="#FFFFFF" >
          <div style="text-align: center;display: block;height: 105px">
            <span style="font-size: 16px;display: block;padding-top:30px;color: #7F8FA4;">{{MTitle}}</span>
            <span style="font-size: 12px;display: block;padding-top:10px;color: #7F8FA4;">任务ID：{{MId}}</span>
          </div>
          <el-submenu index="1">
            <template slot="title">
              <!--<i class="el-icon-star-on"></i>-->
              <img v-if="this.$route.query.index=='labelmanage'||this.$route.query.index=='corpusmaintenance'"
                   src="../../static/images/navmenu-ylbz-select.png" style="margin: 0 10px">
              <img v-else src="../../static/images/navmenu-ylbz.png" style="margin: 0 10px">
              <span>语料标注</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="labelcategory" @click="goPage('/labelcategory','labelcategory')">
                <img v-if="this.$route.query.index=='labelcategory'" src="../../static/images/navmenu-current.png" style="margin: 0 10px">
                <span v-else style="margin: 0 14px"/>
                标签类别管理
              </el-menu-item>
              <el-menu-item index="corpusmaintenance" @click="goPage('/corpusmaintenance','corpusmaintenance')">
                <img v-if="this.$route.query.index=='corpusmaintenance'" src="../../static/images/navmenu-current.png" style="margin: 0 10px">
                <span v-else style="margin: 0 14px"/>
                语料集管理
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <!--<i class="el-icon-s-custom"></i>-->
              <img v-if="this.$route.query.index=='trainsetting'||this.$route.query.index=='trainresult'||this.$route.query.index=='verificationresult'"
                   src="../../static/images/navmenu-mxxl-select.png" style="margin: 0 10px">
              <img v-else src="../../static/images/navmenu-mxxl.png" style="margin: 0 10px">
              <span>模型训练</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="trainsetting" @click="goPage('/trainsetting','trainsetting')">
                <img v-if="this.$route.query.index=='trainsetting'" src="../../static/images/navmenu-current.png" style="margin: 0 10px">
                <span v-else style="margin: 0 14px"/>
                训练设置
              </el-menu-item>
              <el-menu-item index="trainresult" @click="goPage('/trainresult','trainresult')">
                <img v-if="this.$route.query.index=='trainresult'" src="../../static/images/navmenu-current.png" style="margin: 0 10px">
                <span v-else style="margin: 0 14px"/>
                训练结果
              </el-menu-item>
              <el-menu-item index="verificationresult" @click="goPage('/verificationresult','verificationresult')">
                <img v-if="this.$route.query.index=='verificationresult'" src="../../static/images/navmenu-current.png" style="margin: 0 10px">
                <span v-else style="margin: 0 14px"/>
                验证结果
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <!--<i class="el-icon-s-data"></i>-->
              <img v-if="this.$route.query.index=='testsetting'||this.$route.query.index=='testresult'"
                   src="../../static/images/navmenu-mxcs-select.png" style="margin: 0 10px">
              <img v-else src="../../static/images/navmenu-mxcs.png" style="margin: 0 10px">
              <span>模型测试</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="testsetting" @click="goPage('/testsetting','testsetting')">
                <img v-if="this.$route.query.index=='testsetting'" src="../../static/images/navmenu-current.png" style="margin: 0 10px">
                <span v-else style="margin: 0 14px"/>
                测试设置
              </el-menu-item>
              <el-menu-item index="testresult" @click="goPage('/testresult','testresult')">
                <img v-if="this.$route.query.index=='testresult'" src="../../static/images/navmenu-current.png" style="margin: 0 10px">
                <span v-else style="margin: 0 14px"/>
                测试结果
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <!--<i class="el-icon-s-comment"></i>-->
              <img v-if="this.$route.query.index=='previewsetting'||this.$route.query.index=='previewresult'"
                   src="../../static/images/navmenu-mxyc-select.png" style="margin: 0 10px">
              <img v-else src="../../static/images/navmenu-mxyc.png" style="margin: 0 10px">
              <span>模型预测</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="previewsetting" @click="goPage('/previewsetting','previewsetting')">
                <img v-if="this.$route.query.index=='previewsetting'" src="../../static/images/navmenu-current.png" style="margin: 0 10px">
                <span v-else style="margin: 0 14px"/>
                预测设置
              </el-menu-item>
              <el-menu-item index="previewresult" @click="goPage('/previewresult','previewresult')">
                <img v-if="this.$route.query.index=='previewresult'" src="../../static/images/navmenu-current.png" style="margin: 0 10px">
                <span v-else style="margin: 0 14px"/>
                预测结果
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <!--<i class="el-icon-help"></i>-->
              <img v-if="this.$route.query.index=='modelmanage'"
                   src="../../static/images/navmenu-mxgl-select.png" style="margin: 0 10px">
              <img v-else src="../../static/images/navmenu-mxgl.png" style="margin: 0 10px">
              <span>模型管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="modelmanage" @click="goPage('/modelmanage','modelmanage')">
                <img v-if="this.$route.query.index=='modelmanage'" src="../../static/images/navmenu-current.png" style="margin: 0 10px">
                <span v-else style="margin: 0 14px"/>
                模型管理
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main style="padding: 0">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  import appHeader from '../components/AppHeader'
  import robotHeader from '../components/robotConfig/RobotConfigHeader';
  import {mapActions, mapState} from 'vuex';
  export default {
    name: 'home',
    data() {
      return {
        active:'',
        MTitle:'',
        MId:'',
        editableTabsValue2: '',
        isCollapse: false,
        defaultActive: '',
        msg: '',
        asideWidth: '',
        showRobotHeader:false,
      }
    },
    components: {
      appHeader,
      robotHeader
    },
    methods: {
      ...mapActions([
        'setParameter'
      ]),
      goPage(page,index) {
        ////TRAIN-训练,VERIFY-验证,TEST-测试,PREDICTION-预
        this.$router.push({path: page,query: {
            index:index,
          }});
      },
    },
    mounted: function () {

    },
    created: function () {
      if(JSON.parse(sessionStorage.getItem("taskInfo"))){
        this.taskInfo= JSON.parse(sessionStorage.getItem("taskInfo"));
        this.MTitle=this.taskInfo.name;
        this.MId=this.taskInfo.taskId;
        if (this.$route.query.index) {
          this.active=this.$route.query.index
        }
        let appTarget =process.env.PROJ_NAME;
        if (appTarget === 'dialogue'){
          //机器人对话平台需要展示自己的导航
          this.showRobotHeader = true
        }
      }else {
        this.$router.push({path: '/login'})
      }
    }
  }
</script>
<style>
  .el-main{
    padding: 0!important;
    background-color: #EFF3F6;
  }
  .el-menu{
    border-right: none;
  }

  .el-menu-item-group__title{
    display: none;
  }
  .el-header {
    height: 60px;
    line-height: 60px;
    background-color: #000;
    color: #fff;
    padding: 0;
  }
  .el-container{
    min-height: 100%;
  }
  /*.el-menu-item,.el-submenu__title {*/
    /*!*border-bottom: 1px solid #313D4F!important;*!*/
  /*}*/
  .el-menu-item:hover{
    background:transparent!important;
  }
  aside .el-menu-item.is-active{
    background:transparent!important;
  }
  .el-menu,.el-menu-item .is-active{
    min-height: 100%;
  }
  .el-submenu__title:hover{
    background: none!important;
  }
  /*.el-submenu .el-menu-item {*/
     /*padding: 0 20px !important;*/
  /*}*/
</style>
<style scoped>
  .my-submenu {
    /*padding-left:  20px;*/
    /*background-color: #273142;*/
  }
  .my-menu-item-group{
    /*background-color: #273142;*/
    /*padding:0 30px;*/
  }
  .el-menu-vertical-demo >>>  .el-menu-item{
    border-bottom: 1px solid #313D4F!important;
  }
  .el-menu-vertical-demo >>>  .el-submenu__title{
    border-bottom: 1px solid #313D4F!important;
  }
</style>
