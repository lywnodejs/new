<template>
  <div>
    <el-row class="container">
      <el-col :span="24" class="header">
        <!--left-->
        <el-col class="logo" :style="{width:asideWidth}">
          <el-col :span="24" v-if="!isCollapse" class="childSysName">
            <i class="el-icon-s-platform"></i> 机器学习管理平台
          </el-col>
        </el-col>
        <el-col :span="10" :xs="4" style="height: 60px;line-height: 60px">
          <el-menu :default-active="activeIndex"
                   text-color="#fff"
                   background-color="#131821"
                   active-text-color="#2A9DF5"
                   class="el-menu-demo"
                   mode="horizontal"
                   @select="handleSelect">
            <el-menu-item index="1" @click="goPage('mytask')" class="menu-item">我的任务</el-menu-item>
            <el-menu-item class="menu-item">帮助中心</el-menu-item>
            <!--<el-menu-item index="2" >帮助中心</el-menu-item>-->
          </el-menu>
        </el-col>
        <!--right-->
        <el-col class="userinfo" style="width: 250px">
          <span style="margin-right: 30px">账户设置</span>
          <el-dropdown trigger="hover">
            <span class="el-dropdown-link userinfo-inner"><img :src="sysUserAvatar"/> {{userName}}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>

      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {SetCookie,getJoinCookie} from '../utils/commonUtil';
  export default {
    name: 'appHeader',
    data () {
      return {
        activeIndex:'1',
        userName: '超级管理员', //用户名
        sysUserAvatar: require('../assets/images/defaultExpert-210.png'), //头像
        asideWidth:'250px',
        isCollapse:false
      }
    },
    mounted: function ()  {
      if(!sessionStorage.userName){
//      this.$router.push('/');
      } else
        this.userName = sessionStorage.userName ? sessionStorage.userName : '';
    },
    methods: {
      handleSelect(key, keyPath) {
        if(key==='2'){
          return false
        }
        console.log(key, keyPath);
      },
      goPage: function (branchNo) {
        this.$router.push({path: `/${branchNo}`});
      },
      //退出系统
      logout: function () {
        let _this = this;
        this.$confirm('确认退出吗?', '提示', {}).then(() => {
          _this.$router.push('/')
        }).catch(() => { })
      },
    /*  collapse(){
        console.log(0)
        this.$emit('resultChange','hehe');
        this.isCollapse==true?this.isCollapse=false:this.isCollapse=true;
        console.log( this.isCollapse);
        this.isCollapse?this.asideWidth='64px':this.asideWidth='200px'
      }*/
    },
    created: function () {
      if(getJoinCookie('userId')!='1'){
        this.userName='管理员'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .el-header {
    height: 60px;
    line-height: 60px;
    background: #000;
    color: #fff;
    padding: 0;
  }

  .el-aside {
    color: #333;
  }
  .el-menu-item:hover{
    background:transparent!important;
  }
 .el-menu-item.is-active{
    background:transparent!important;
  }
</style>
<style scoped>
  .menu-item {
    height: 60px;
    line-height: 60px
  }
  .logo {
    border-right:1px solid rgba(238, 241, 146, 0.3) !important;
  }
  .collapse{
    float:right;
  }
  .container {
    height: 60px;
    line-height: 60px;
    background: #131821;
    color: #fff;
  }
  .container .header {
    height: 60px;
    line-height: 60px;
    background: #131821;
    color: #fff;
  }

  .container .header .userinfo {
    text-align: right;
    padding-right: 35px;
    float: right;
  }

  .container .header .userinfo .userinfo-inner {
    cursor: pointer;
    color: #fff;
  }

  .container .header .userinfo .userinfo-inner img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 10px 0px 10px 10px;
    float: right;
  }

  .container .header .logo {
    height: 80px;
    font-size: 18px;
    font-family: 'Hiragino Sans GB';
    padding-left: 20px;
    padding-right: 20px;
    /*border-color: rgba(238,241,146,0.3);
    border-right-width: 1px;
    border-right-style: solid;*/
  }

  .container .header .logo img {
    width: 40px;
    float: left;
    margin: 10px 10px 10px 18px;
  }

  .container .header .logo .txt {
    color: #fff;
  }

  .container .header .logo-width {
    width: 230px;
  }

  .container .header .logo-collapse-width {
    width: 60px
  }

  .container .header .tools {
    padding: 0px 23px;
    width: 14px;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
  }

  .container .main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    padding: 0 10%;
  }

  .container .main aside {
    flex: 0 0 230px;
    width: 230px;
  }

  .container .main aside .el-menu {
    height: 100%;
  }

  .container .main aside .collapsed {
    width: 60px;
  }

  .container .main aside .collapsed .item {
    position: relative;
  }

  .container .main aside .collapsed .submenu {
    position: absolute;
    top: 0px;
    left: 60px;
    z-index: 99999;
    height: auto;
    display: none;
  }

  .container .main .menu-collapsed {
    flex: 0 0 60px;
    width: 60px;
  }

  .container .main .menu-expanded {
    flex: 0 0 230px;
    width: 230px;
  }

  .container .main .content-container {
    flex: 1;
    overflow-y: scroll;
    padding: 20px;
  }

  .container .main .content-container .breadcrumb-container .breadcrumb-inner {
    float: right;
    margin-bottom: 15px;
  }

  .container .main .content-container .content-wrapper {
    background-color: #fff;
    box-sizing: border-box;
  }

  /*start*/
  .sysName {
    text-align: center;
    /*font-weight: bold;*/
  }

  .childSysName {
    font-size: 16px;
    text-align: left;
    padding-top: 2px;
    /*font-weight: bold;*/
  }
</style>
