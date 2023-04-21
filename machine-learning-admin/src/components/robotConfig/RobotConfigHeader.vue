<template>

  <div>
    <el-row class="container">

      <el-col :span="24" class="header">
      <el-col class="logo" :style="{width:asideWidth}">
        <el-col :span="24" class="leftChildSysName">
          <i class="el-icon-menu"></i> 机器人配置平台
        </el-col>
      </el-col>
      <el-col :span="11" class="menu" >
        <el-menu :default-active="activeIndex"
                 class="el-menu-demo"
                 mode="horizontal"
                 @select="handleSelect"
                 background-color = "#131821"
                 text-color="#fff"
                 active-text-color= '#1890FF'
                 style="border:none"
        >
          <el-menu-item index="/myrobot">我的机器人</el-menu-item>
          <el-menu-item index="/mytask">意图管理</el-menu-item>
          <el-menu-item index="/wordslotmanagement">词槽管理</el-menu-item>
          <el-menu-item index="/anwermanagement">答案配置</el-menu-item>
          <el-menu-item v-if="!isshowQaexamine" index="/datastatistics">数据统计</el-menu-item>
          <el-button v-if="isshowQaexamine" type="text" class="qaexamine" @click="toQaExamine">问答审核</el-button>
        </el-menu>
      </el-col>
        <!--right-->
        <el-col class="userinfo" style="width: 400px;height: 60px">
          <el-button v-if="isShowTakeEffectBtns||isShowCurrentTakeEffectBtns" type="primary"   @click="takeEffectTest" size="mini" style="margin-top: 15px">生效测试</el-button>
          <el-button v-if="isShowTakeEffectBtns||isShowCurrentTakeEffectBtns" type="success"   @click="takeEffectProduction" size="mini" style="margin-top: 15px">发布线上</el-button>
           <el-dropdown trigger="hover" style="width: 200px;height: 60px;float: right;background: #131821;">
            <div>
             <span class="el-dropdown-link userinfo-inner">{{userName}}</span>
             <img :src="sysUserAvatar"/>
            </div>
             <el-dropdown-menu slot="dropdown">
           <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
           </el-dropdown-menu>
           </el-dropdown>

        </el-col>

    </el-col>

    </el-row>
    <el-dialog  custom-class="loadingDialog" :close-on-click-modal="false" :visible.sync="loadingDialogFormVisible"   width="40%">
      <el-row  style="width: 100%;height: 126px" type="flex" justify="center">
        <el-col class="loadingClass" style="width: 126px;height: 126px;font-size: 50px"
                v-loading="loading"
                element-loading-spinner="el-icon-loading"
        >
          <!--<el-progress type="circle"  :percentage="progressValue"></el-progress>-->
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <span>{{loadingmessage}}</span>
      </el-row>
    </el-dialog>
    <el-dialog  custom-class="customDialog" :close-on-click-modal="false" :visible.sync="dialogFormVisible"  width="70%"  >
      <div >
        <div style="text-align: center">
          <img class="robotImage"  style="width: 48px; height: 48px; border-radius:50%;" :src="url"/>
          <span style="display: block;line-height: 20px;font-size: 12px;color:#7F8FA4">机器人ID: {{robotId}}</span>

        </div>
        <iframe  :src="testUrl" height="500" width="100%"></iframe>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  import {SetCookie,getJoinCookie,delCookie,getCurrentPreViewHost,getxiaoEformHost} from '../../utils/commonUtil';
  import {robotcacheService,robotConfigService} from '../../service/index';

  export default {

    name: 'RobotConfigHeader',
    props:['isShowTakeEffectBtns'],//二级路由下不显示顶部生效按钮
    data () {
      return {
        activeIndex:'/myrobot',
        userName: '超级管理员', //用户名
        sysUserAvatar: require('../../assets/images/defaultExpert-210.png'), //头像
        asideWidth:'250px',
        isShowCurrentTakeEffectBtns:false,//是否显示顶部生效按钮
        dialogFormVisible:false,
        loadingDialogFormVisible:false,
        isTestingTakesEffect:true,
        robotData:{},
        robotId:'',
        url: require('../../assets/images/robotLogo.png'),
        testUrl:'',
        confUserName:'',
        robotName:'',
        loading:false,
        progressValue:0,
        progressTime:{},
        loadingmessage:'',
        isshowQaexamine:false,//是否显示问答审核
      }
    },
    mounted: function ()  {
      if(!sessionStorage.userName){
      } else
        this.userName = sessionStorage.userName ? sessionStorage.userName : '';
    },
    methods: {
      /*************************接口相关的方法***************************************/
      //立即生效(刷缓存接口)
      async robotCache(params) {
        this.loading = true
        let result = await robotConfigService.dialogueCache(params);
        this.loadingDialogFormVisible = false
        if (result.message.code == 0) {
          let target = this;

            if (target.isTestingTakesEffect) {
              setTimeout(function () {
              let host = getCurrentPreViewHost()
              target.confUserName = getJoinCookie('userName')
              target.testUrl = host + '?appKey='+target.confUserName+'&robotId='+target.robotId+'&preview=test'
              target.dialogFormVisible = true
              target.loading = false
              }, 1000);
            }

          if (!target.isTestingTakesEffect){
            this.$message({
              showClose: true,
              message: '已生效',
              type: 'success'
            });
          }
        } else {
          this.loading = false
          this.$message({
            showClose: true,
            message: '请求超时',
            type: 'error'
          });
        }

      },

      /*************************交互相关的方法**************************************/
      //跳转到小e后台
      toQaExamine(){
          let xiaoEUrl =  getxiaoEformHost();
          let token = {}
          token.userName = getJoinCookie('userName')
          token.ps = getJoinCookie('passWord')

          let singleUrl =  window.encodeURIComponent(JSON.stringify(token))
          singleUrl = window.btoa(singleUrl)
          // let decryStr = window.atob(singleUrl); // 解码
          // decryStr=  window.decodeURIComponent(decryStr);
          let newPageUrl = xiaoEUrl + '?token='+singleUrl
          window.open(newPageUrl, '_blank');
      },
      handleSelect(key, keyPath) {

        if (key == '/mytask'){
          //跳转到标注平台的我的任务需要传对话参数
          this.$router.push({path: `${key}`,query: {
              taskType:'DIALOGUE',
            }});
        }else {
          this.$router.push({path: `${key}`});
        }

      },
      //生效测试
      takeEffectTest(){
        this.isTestingTakesEffect = true
        this.loadingDialogFormVisible = true //loading 显示
        this.loadingmessage = '正在发布测试,请耐心等待.....'

        let params = {}
        params.confUserId = getJoinCookie('userId')
        params.preview = 'test'
        params.robotId = this.robotData.id
        this.robotCache(params)
      },
      //发布线上
      takeEffectProduction(){
        this.isTestingTakesEffect = false
        this.loadingDialogFormVisible = true //loading 显示
        this.loadingmessage = '正在发布生产,请耐心等待.....'
        let params = {}
        params.confUserId = getJoinCookie('userId')
        params.preview = 'production'
        params.robotId = this.robotData.id
        this.robotCache(params)
      },

      //退出系统
      logout: function () {
        let _this = this;
        this.$confirm('确认退出吗?', '提示', {}).then(() => {
          // sessionStorage.removeItem('activeIndex');
          delCookie('userId')
          _this.$router.push({path:'/login',query:{taskType:'dialogue'}})
        }).catch(() => { })
      },

    },

    created: function () {

      if(this.$router.history.current.path==='/skillhome'||
         this.$router.history.current.path=== '/homequestion'||
         this.$router.history.current.path=== '/homequestioncategory' ){
        //机器人下级显示顶部生效按钮因为生效按钮目前只针对单个机器人
        this.isShowCurrentTakeEffectBtns = true
        this.activeIndex = '/myrobot'
      }else {
        this.isShowCurrentTakeEffectBtns = false
         //为解决点击浏览器刷新导航栏状态bug 才加了这些判断(后续看看有没有更好的方法解决)
         if(this.$router.history.current.path ==='/wordslotmanagement'||
           this.$router.history.current.path === '/anwermanagement'||
           this.$router.history.current.path ==='/mytask'||
           this.$router.history.current.path ==='/myrobot'||
           this.$router.history.current.path==='/datastatistics'){
           this.activeIndex = this.$router.history.current.path
         }else if(this.$router.history.current.path==='/tacticsmanagement'||
           this.$router.history.current.path==='/skillmanagerment'||
           this.$router.history.current.path==='/addtactics'||
           this.$router.history.current.path==='/knowledgemanagement'||
           this.$router.history.current.path==='/qamanagent'||
           this.$router.history.current.path==='/addqapair'||
           this.$router.history.current.path==='/'){
           this.activeIndex = '/myrobot'
         }else {
           this.activeIndex = '/mytask'
         }
      }

      // if(getJoinCookie('userId')!='1'){
      //   this.userName='管理员'
      // }
      if(getJoinCookie('userName')){
        this.userName=getJoinCookie('userName')
        if(this.userName === 'appHtyw'){
            this.isshowQaexamine = true
        }else {
            this.isshowQaexamine = false
        }

      }
      if(getJoinCookie('userId')=='1'){
        this.userName='超级管理员'
      }
      this.robotData= JSON.parse(sessionStorage.getItem("robotObj"));
      if(this.robotData){
        this.robotId = this.robotData.id
        this.robotName = this.robotData.name
      }
      //取出本地存储的inex
      // if(JSON.parse(sessionStorage.getItem("activeIndex"))){
      //   this.activeIndex= JSON.parse(sessionStorage.getItem("activeIndex")).index;
      // }

    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .el-header {
    height: 60px;
    line-height: 60px;
    background:#131821;
    color: #fff;
    padding: 0;
  }
  .customDialog >div:nth-child(2){
    padding: 0px 30px;
  }
</style>
<style scoped>
  .logo {
    border-right:1px solid rgba(238, 241, 146, 0.3) !important;
  }
  .leftChildSysName {
    font-size: 16px;
    text-align: center;
    padding-top: 2px;
    /*font-weight: bold;*/
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
  .container .header .logo {
    height: 80px;
    font-size: 18px;
    font-family: 'Hiragino Sans GB';
    padding-left: 20px;
    padding-right: 20px;
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

  .container .header .userinfo {
    float: right;
  }

  .container .header .userinfo .userinfo-inner {
    cursor: pointer;
    color: #fff;
    -webkit-line-clamp:1;
    max-width: 150px;
    max-height: 60px;
    display: -webkit-box;
    display: -moz-box;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    position: absolute;
    top: 0px;
    right: 70px;
    text-align: right;

  }

  /*.container .header .userinfo .userinfo-inner img {*/
    /*width: 40px;*/
    /*height: 40px;*/
    /*border-radius: 20px;*/
    /*margin: 10px 0px 10px 10px;*/
    /*float: right;*/
  /*}*/
  .container .header .userinfo img {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 10px 0px 10px 10px;
    position: absolute;
    top: 0px;
    right: 20px;
  }

  iframe{
    border-width: 0px;
  }
  .qaexamine{
    color: white;
    margin-left: 15px;
    font-weight: normal;
  }



</style>

