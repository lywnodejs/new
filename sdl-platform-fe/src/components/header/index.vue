<template>
  <nav class="header-nav" :class="'/' != activePath ? 'blueBg':'whiteBg'">
    <div class="app-logo" @click="changePath" v-if="'/'==activePath">
      <img src="../../assets/logoBlack.png" />
    </div>
    <div class="app-logo" @click="changePath" v-if="'/'!=activePath">
      <img src="../../assets/logoWhite.png" />
    </div>
    <!-- <div class="header-nav__apps">
      <router-link to="" @click.native="changePath">
        <div class="header-nav__apps__app" :class="'/' == activePath ? 'header-nav__apps__app--active' : null">
          首页
        </div>
      </router-link>
      <router-link v-for="app in apps" :to="app.url" :key="app.url" @click.native="changeRouter(app.url)">
        <div class="header-nav__apps__app" :class="slicePath(app.url) == activePath ? 'header-nav__apps__app--active' : null">
          {{app.name}}
        </div>
      </router-link>
    </div> -->
    <header-menu></header-menu>
    <ul class="header-nav__bar">
      <helpBook class="header-nav__bar__oper"></helpBook>
      <appMessage class="header-nav__bar__oper"></appMessage>
      <img class="user-avatar" src="./../../../static/head.png">
      <!-- <img v-if="!avatarExist" class="user-avatar" :src="avatarPath"> -->
      <!-- <img v-if="avatarExist" class="user-avatar" :src="avatarPath"> -->
      <el-dropdown class="right-menu-item" trigger="click">
        <span class="el-dropdown-link">
          <!-- {{user.username_zh}} -->
          {{handleUserName(user.username_zh)}}
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <router-link to="" @click.native="changePath">
            <el-dropdown-item style="width:60px; text-align:center;">
              首页
            </el-dropdown-item>
          </router-link>
          <a @click="logout">
            <el-dropdown-item divided style="width:60px; text-align:center;">
              <a>退出</a>
            </el-dropdown-item>
          </a>
        </el-dropdown-menu>
      </el-dropdown>
    </ul>
  </nav>
</template>
<script>
import {connect} from '@/lib'
import appMessage from '@/components/message'
import headerMenu from '@/components/headerMenu'
import helpBook from '@/components/helpBook'
import { slicePath } from 'utils'

export default connect(() => {
  return {
    apps: 'user/apps',
    user: 'user/user'
  }
}, ['updateLang', 'updateTheme'])({
  name: 'app-header',
  data() {
    return {
      isFold: true,
      isShowMessage: false,
      activePath: '',
      messages: [{
        id: 1,
        content: 'SDL平台V1.0版(安全评估、知识培训)上线',
        date: '2018-09-30 10:00:00',
        url: 'http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=163616033'
      },
      {
        id: 2,
        content: '黑盒扫描用户手册',
        date: '2018-12-17 10:00:00',
        url: 'http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=146620959'
      },
      {
        id: 3,
        content: '白盒检测用户手册',
        date: '2018-12-17 10:00:00',
        url: 'http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=180475681'
      }],
      alerts: []
    }
  },
  inject: ['reload', 'addWaterMark'],
  watch: {
    $route(val) {
      this.activePath = slicePath(val.path, 2)
    }
  },
  components: {
    appMessage, helpBook, headerMenu
  },

  created() {
    this.activePath = slicePath(this.$route.path, 2)
  },
  methods: {
    bounceUrl(url) {
        window.open(url)
    },
    handlerLogo() {
      this.reload()
    },
    changePath() {
      this.reload()
      window.location.href = '/'

      // this.$router.push('/')
    },
    changeRouter(url) {
      window.location.href = '/' + url
      this.addWaterMark()
    },
    fold() {
      this.isFold = true
    },
    toggleFold() {
      this.isFold = !this.isFold
    },
    setLocale() {
      let local = 'zh'
      if (this.$i18n.locale == 'zh') {
        this.$i18n.locale = 'en'
      } else {
        this.$i18n.locale = 'zh'
      }
      local = this.$i18n.locale
      this.updateLang(local)
    },
    showMessage() {
      this.isShowMessage = !this.isShowMessage
    },
    showUser() {
      this.$ajax.get('user/info').then(({data}) => {
        this.$message.success(data.username)
      })
    },
    logout() {

      // ajax.get(API.ssoLogout).then((res) => {
      //   location.href = res.data.url

      //   // + '?app_id=' + res.data.app_id + '&jumpto=' + res.data.jumpto
      // })
    },
    slicePath(path) {
      return slicePath(path, 2)
    },

    handleUserName(userName) {
      let un = userName.substring(0, 10) + '...'
      return userName.length > 10 ? un : userName
    }
  }
})
</script>
<style lang="less">
  .header-nav {
    display: flex;
    height: 60px;
    align-items: center;
    // border-bottom: 1px solid #e2e2e2 !important;
    // box-sizing: border-box;
    // box-shadow: 0 2px 3px 0 rgba(0,0,0,.1);
    &.whiteBg {
      background-color: white;
      .app-logo {
        background-color: white;
      }
      .iconfont.icon-message{
        font-size: 17px;
      }
      .iconfont.icon-message .text{
        font-weight: 200;
        font-family: PingFangSC-Regular;
        -webkit-font-smoothing: antialiased;
        font-size: 13px;
        position: relative;
        top: -2px;
      }
      .iconfont.icon-helpBook{
        font-size: 17px;
      }
      .iconfont.icon-helpBook   .text{
        font-weight: 200;
        font-family: PingFangSC-Regular;
        -webkit-font-smoothing: antialiased;
        font-size: 13px;
        position: relative;
        top: -2px;
      }
    }
    &.blueBg {
      // background-color: #061D3F;
      background-color: #081031;
      .header-nav__apps__app {
        // color: #8DA5C9;
        // color: #a9b8ce;
        color:#FFFFFF;
        opacity: 0.7;
        &:hover {
          color: #fff;
          opacity: 1;
        }
      }
      .app-logo {
        // background-color: #061D3F;
        background-color: #081031;
        color: fff;
      }
      .header-nav__apps__app--active {
        color: #fff;
        border-bottom: 1.5pt solid #fff;
        font-size: 15px;
        opacity: 1;
      }
      .right-menu-item {
        color: #fff;
      }
      .el-icon-bell:before{
        color: #8DA5C9;
      }
      .el-icon-bell:hover:before{
        color: white;
      }
      .el-icon-caret-bottom:before {
        color: #8DA5C9;
      }

      .iconfont.icon-message{
        font-size: 17px;
        color: white !important;
        opacity: 0.7;
      }
      .iconfont.icon-helpBook{
        font-size: 17px;
        color: white !important;
        opacity: 0.7;
      }
      .iconfont.icon-helpBook .text{
        color: white !important;
        font-weight: 200;
        font-family: PingFangSC-Regular;
        -webkit-font-smoothing: antialiased;
        font-size: 13px;
        position: relative;
        top: -2px;
      }
      .iconfont.icon-message .text{
        color: white !important;
        font-weight: 200;
        font-family: PingFangSC-Regular;
        -webkit-font-smoothing: antialiased;
        font-size: 13px;
        position: relative;
        top: -2px;
      }
      .iconfont:hover{
        opacity: 1;
      }
    }
    .app-logo {
      width: 130pt;
      // width: 260px;
      // height: 65px;
      color: gray;
      font-size: 18px;
      // padding: 4.5pt 24.2pt 4.5pt 24pt;
      white-space: nowrap;
      cursor: pointer;
      img {
        width: 140px;
        height: 36px;
        margin-left: 4px;
        vertical-align: middle;
        cursor: pointer;
      }
    }
    // &__apps {
    //   flex: 1;
    //   display: flex;
    //   margin-left: 16pt;
    //   &__app {
    //     padding-top: 22px;
    //     margin-right: 24pt;
    //     font-size: 14px;
    //     line-height: 14px;
    //     font-family:PingFangSC-Regular;
    //     // font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    //     -webkit-font-smoothing: antialiased;
    //     // line-height: 72px;
    //     // border-bottom: 2px solid white;
    //     padding-bottom: 22px;
    //     &--active {
    //       color: #fc9153;
    //       border-bottom: 1.5pt solid #fc9153;
    //       font-size: 15px;
    //     }
    //   }
    // }
    &__bar {
      padding-right: 20px;
      margin-top: 4px;
      .user-avatar{
        border-radius: 100%;
        width: 26px;
        height: 26px;
        // float: right;
        margin-right: 8px;
        // margin-top: 10px
      }
      .right-menu-item{
        position: relative;
        top: -5pt;
        cursor: pointer;
        font-size: 14px;
        color: #666666;
        font-family:PingFangSC-Regular;
        -webkit-font-smoothing: antialiased;
      }
      &__oper {
        // padding: 0 15px;
        vertical-align: top;
        display: inline-block;
        // margin-right: 10px;
        cursor: pointer;
        margin-top: 3px;
        margin-right: 20px;
        position: relative;
        font-size: 18px;
        // font-weight: bold;
        // top: 8px;
        &:last-child {
          padding-right: 0px;
        }
        &__search {
          input {
            transition: width .3s;
            width: 0px;
            &.expand {
              width: 200px;
            }
          }
        }
        a {
          color: #000;
        }
      }
    }
  }
  .el-tooltip__popper.is-light{
    border: 1px solid gray;
    color: gray;
  }
  // .whiteBg {
  //   background-color: white;
  //   .header-nav__apps__app--active {
  //     color: #666666;
  //     border-bottom: 1.5pt solid #fc9153;
  //     font-size: 9pt;
  //   }
  // }
  // .blueBg {
  //   background-color: #061D3F;
  //   color: #8DA5C9;
  // }
</style>

