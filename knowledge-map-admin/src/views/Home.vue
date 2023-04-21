<template>
  <el-container class="tac">
    <el-header>
      <app-header @resultChange="mychangHandle" :msg="msg"></app-header>
    </el-header>
    <el-container>
      <el-aside style="width: 200px;">
        <el-menu
          :default-active="defaultActive"
          unique-opened
          background-color="#232A39"
          active-text-color="#C4D9EA"
          text-color="#FFFFFF"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>词典知识管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/entityType" @click="gotoPage('/entityType')">知识类型</el-menu-item>
              <el-menu-item index="/entityDictionary" @click="gotoPage('/entityDictionary')">词典知识</el-menu-item>
              <el-menu-item index="/entityKnowledge" @click="gotoPage('/entityKnowledge')">NER知识</el-menu-item>
              <!-- <el-menu-item index="/relationContrl" @click="gotoPage('/relationContrl')">实体关系维护</el-menu-item>
              <el-menu-item index="/blacklistContrl" @click="gotoPage('/blacklistContrl')">黑名单管理</el-menu-item>
              <el-menu-item index="/whitelistContrl" @click="gotoPage('/whitelistContrl')">白名单管理</el-menu-item> -->
              <!--<el-menu-item index="/deleteHistoryContrl" @click="gotoPage('/deleteHistoryContrl')">删除历史</el-menu-item>-->
            </el-menu-item-group>
          </el-submenu>
          <!--<el-menu-item index="/entityContrl" @click="gotoPage('/entityContrl')">-->
          <!--<i class="el-icon-location"></i>-->
          <!--<span slot="title">实体关系库</span>-->
          <!--</el-menu-item>-->
          <el-menu-item index="/relationContrl" @click="gotoPage('/relationContrl')">
            <i class="el-icon-document"></i>
            <!--<span slot="title">同义词管理</span>-->
            <span slot="title">实体关系维护</span>
          </el-menu-item>
          <el-menu-item index="/objectKnowledge" @click="gotoPage('/objectKnowledge')">
            <i class="el-icon-document"></i>
            <!--<span slot="title">同义词管理</span>-->
            <span slot="title">对象知识</span>
          </el-menu-item>
          <el-menu-item index="/StructuredKnowledge" @click="gotoPage('/StructuredKnowledge')">
            <i class="el-icon-news"></i>
            <span slot="title">结构化知识</span>
          </el-menu-item>
          <el-menu-item index="/dynamicContrl" @click="gotoPage('/dynamicContrl')">
            <i class="el-icon-document"></i>
            <!--<span slot="title">同义词管理</span>-->
            <span slot="title">动态实体关系维护</span>
          </el-menu-item>
          <el-menu-item index="/blacklistContrl" @click="gotoPage('/blacklistContrl')">
            <i class="el-icon-document"></i>
            <!--<span slot="title">同义词管理</span>-->
            <span slot="title">黑名单</span>
          </el-menu-item>
          <el-menu-item index="/whitelistContrl" @click="gotoPage('/whitelistContrl')">
            <i class="el-icon-document"></i>
            <!--<span slot="title">同义词管理</span>-->
            <span slot="title">白名单</span>
          </el-menu-item>
          <el-menu-item index="/synonymContrl" @click="gotoPage('/synonymContrl')">
            <i class="el-icon-document"></i>
            <!-- <span slot="title">同义词管理</span> -->
            <span slot="title">实体管理</span>
          </el-menu-item>
          <el-menu-item index="/MaintainHot" @click="gotoPage('/MaintainHot')">
            <i class="el-icon-news"></i>
            <span slot="title">热点维护</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="content-container">
        <el-col :span="24">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-col>
      </el-main>
    </el-container>

  </el-container>


</template>

<script>
  import appHeader from '../components/AppHeader'
  export default {
    name: 'home',
    data () {
      return {
        editableTabsValue2: '',
        isCollapse: false,
        defaultActive:'',
        msg:'',
        asideWidth:'',
      }
    },
    components: {
      appHeader
    },
    methods: {
      mychangHandle(msg){
        this.isCollapse==true?this.isCollapse=false:this.isCollapse=true;
        this.isCollapse==true?this.asideWidth='64px':this.asideWidth='200px';
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      gotoPage(page){
        this.defaultActive=page;
        this.$router.push({path:page});
      },
      newpage(){
        this.gotoPage(this.$route.path)
      }


    },
    mounted: function () {
      this.defaultActive = this.$route.path;
    },
    watch: {
      //"$route":"newpage",
    },
    created: function () {

    }
  }
</script>

<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px !important;
    min-height: 400px;
  }
  menu-collapsed{
    width:64px !important;
  }
  .el-menu-item-group{
    background:#232A39;
  }
  .el-main{
    height: calc(100vh - 60px);
    overflow: auto;
  }
  .tac{
    height:100%;
    overflow-y: scroll;
  }
  .el-aside{
    /*flex: 0 0 230px;*/
    /*width: 200px ;*/
  }
  .el-aside{
    background-color: #232A39;
  }
  aside{
    min-height:100%;
  }
  .el-header{
    padding:0;
  }
  .el-aside,.el-aside ul,.el-aside div{
    background:#232A39;
  }
  .el-menu-item:focus {
    background-color:transparent;
  }
  .el-menu-item.is-active{
    /*background:#1A619A !important;*/
    background-image: linear-gradient(to right, #167BC8 , #157CC9) !important;
  }
  .el-menu-item-group{
    overflow-x: hidden;
  }
</style>
