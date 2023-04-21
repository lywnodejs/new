<template>
    <div class="header-nav__apps">
      <router-link to="/">
        <div class="header-nav__apps__app" :class="'/' == activePath ? 'header-nav__apps__app--active' : null">
          首页
        </div>
      </router-link>
      <div  v-for="app in apps" :key="app.url">
          <router-link :to="app.url" >
          <div class="header-nav__apps__app"  @click="changeRouter(app.url)"
                :class="slicePath(app.url) == activePath ? 'header-nav__apps__app--active' : null"
                @mouseenter="slectStyle(app)" @mouseleave="slectCancel">{{app.name}}

          </div>
      </router-link>
            <transition name="fade" mode="out-in">
                    <div class="header-nav__apps__expand" v-show="isDisplay(app)"  @mouseenter="slectStyle(app)" @mouseleave="slectCancel">
                        <ul v-for="menu in appMenus(app.url)" :key="menu.id" class="header-nav__apps__dropdown">
                            <li class="padding" @mouseenter="slectSubStyle(menu)" @mouseleave="slectSubCancel"
                                v-if="menu.menus && menu.menus.length > 0 && isExistMenu(menu.menus)" >
                                {{menu.name}}<i class="el-icon-arrow-right myIcon"></i>
                                <transition name="fade" mode="out-in">
                                    <div class="subItem"  v-show="isSubDisplay(menu)" >
                                        <ul class="subDropdown" v-for="item in menu.menus" :key="item.id">
                                            <li class="padding" @click.stop="redirectUrl(item)" >{{item.name}}</li>
                                        </ul>
                                    </div>
                                </transition>
                            </li>
                            <li class="padding" v-else @click.stop="redirectUrl(menu)" >{{menu.name}}</li>
                        </ul>
                    </div>
                </transition>
      </div>

    </div>
    <!-- <el-dropdown class='header-nav__popover'  :visible-arrow='false'>
          <div  class="header-nav__apps__app" :class="slicePath(app.url) == activePath ? 'header-nav__apps__app--active' : null">
            {{app.name}}
          </div>
          <el-dropdown-menu slot="dropdown" class="header-nav__popover__dropdown">
            <el-dropdown-item  v-for="menu in appMenus(app.url)" :key="menu.id"><span @click="redirectUrl(menu)">{{menu.name}}</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <!-- <el-popover popper-class="header-nav__popover"
          placement="top-start"
          :offset='-10'
          title=""
          :visible-arrow='false'
          width="120"
          trigger="hover"
          content="">
          <ul v-for="menu in appMenus(app.url)" :key="menu.id" class="header-nav__popover__dropdown">
            <ul v-if="menu.menus && menu.menus.length > 0 && isExistMenu(menu.menus)">
              <li>{{menu.name}}</li>
              <ul v-for="item in menu.menus" :key="item.id">
                <li  @click="redirectUrl(item)">{{item.name}}</li>
              </ul>
            </ul>
            <li v-else @click="redirectUrl(menu)">{{menu.name}}</li>
          </ul>
          <div  slot="reference" class="header-nav__apps__app" :class="slicePath(app.url) == activePath ? 'header-nav__apps__app--active' : null">
            {{app.name}}
          </div>
        </el-popover> -->
</template>
<script>
import {connect} from '@/lib'
import appMessage from '@/components/message'
import helpBook from '@/components/helpBook'
import { slicePath } from 'utils'
import ajax from '@/plugin/ajax'

export default connect(() => {
  return {
    apps: 'user/apps',
    menus: 'user/menus',
    menu: 'user/getMenusByApp'
  }
}, ['updateLang', 'updateTheme'])({
  name: 'app-header',
  data() {
    return {
      isFold: true,
      isShowMessage: false,
      activePath: '',
      avatarExist: false,
      avatarPath: '',
      alerts: [],
      activeIndex: [],
      display: false,
      subDisplay: {}
    }
  },
  inject: ['reload'],
  watch: {
    $route(val) {
      this.activePath = slicePath(val.path, 2)
    }
  },
  components: {
    appMessage, helpBook
  },
  mounted() {

    // this.addWaterMark()
  },
  created() {

    // this.addWaterMark()
    this.activePath = slicePath(this.$route.path, 2)
    this.getAvatar()
  },
  methods: {
    changeRouter(url) {

      // window.open(window.location.origin + url);

      // window.location.href = url

      this.$router.push(url)

      // this.addWaterMark()
    },
    slicePath(path) {
      return slicePath(path, 2)
    },
    getAvatar() {
      this.avatarExist = false;
      ajax.get('/common/avatar').then(response => {
        if (response.data.link != null) {
          this.avatarExist = true;
          this.avatarPath = response.data.link;
        } else {
          this.avatarExist = false;

          // this.avatarPath = 'https://img-hxy021.didistatic.com/static/iportal/userphoto/yUtEU/12823ef7e408b4a24944d6d20bb202ee.jpg'
        }
      })
    },
    changePath() {
      this.reload()
      window.location.href = '/'

      // this.$router.push('/')
    },
    slectStyle(app) {
        this.display = app
    },
    slectSubStyle(menu) {
        this.subDisplay = menu
    },
    slectCancel() {
        this.display = ''
    },
    slectSubCancel() {
        this.subDisplay = ''
    },
    appMenus(url) {
      const app = slicePath(url, 2)
      return this.menu(app)
    },
    redirectUrl(menu) {

        // console.log(menu.url)
      if (menu && menu.url && menu.url !== '#') {
        this.$router.push(menu.url)

        // this.addWaterMark()
        this.subDisplay = ''
        this.display = ''
      }
    },
    isExistMenu(menus) {
      let isExistMenu = false
      if (menus && _.isArray(menus)) {
        menus.forEach(menu => {
          if (menu.isMenu) {
            isExistMenu = true
          }
        })
      }
      return isExistMenu
    },
    isDisplay(app) {
        if (this.display.name === app.name) {
            return true
        }
        return false
    },
    isSubDisplay(menu) {
        if (this.subDisplay.name === menu.name) {
            return true
        }
        return false
    },
    handleSelect(key, keyPath) {
        console.log(key, keyPath);
    }
  }
})
</script>
<style lang="less">
  .header-nav {
    display: flex;
    height: 60px;
    align-items: center;
    &__apps {
      flex: 1;
      display: flex;
      margin-left: 16pt;
      position: relative;
      &__app {
        padding-top: 22px;
        margin-right: 24pt;
        font-size: 14px;
        line-height: 14px;
        font-family:PingFangSC-Regular;
        // font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        -webkit-font-smoothing: antialiased;
        // line-height: 72px;
        // border-bottom: 2px solid white;
        padding-bottom: 22px;
        &--active {
          color: #fc9153;
          border-bottom: 1.5pt solid #fc9153;
          font-size: 15px;
        }
      }
      &__expand {
        cursor: pointer;
        font-size: 12px;
        width: 130px;
        border: 1px solid black;
        background: white;
        color: black;
        position: absolute;
        top: 55px;
        margin-left: -13px;
        z-index: 1000;
        border-radius: 4px;
        border: 1px solid #ebeef5;
        z-index: 2000;
        color: #606266;
        font-size: 14px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        word-break: break-all;
        .padding{
            font: normal 12px 'Microsoft YaHei', '微软雅黑', arial, helvetica, sans-serif;
            padding: 12px;
        }
      }
      &__dropdown{
        //   padding: 12px;
        //   box-sizing: border-box;
        font: normal 12px 'Microsoft YaHei', '微软雅黑', arial, helvetica, sans-serif;
          position: relative;
          .subItem{
            width: 130px;
            border: 1px solid black;
            background: white;
            color: black;
            position: absolute;
            left: 128px;
            top: -1px;
            z-index: 1000;
            border-radius: 4px;
            border: 1px solid #ebeef5;
            z-index: 2000;
            color: #606266;
            text-align: justify;
            font-size: 14px;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            word-break: break-all;
            .subDropdown{
                .padding{
                    padding: 12px;
                }
            }
            .subDropdown:hover{
                background: #fff7f2;
                color: #fc9153;
            }
          }
          .myIcon{
              float: right;
              font-size: 13px;
              position: relative;
              top: 2px;
          }
      }
      &__dropdown:hover{
          background: #fff7f2;
          color: #fc9153;
      }
    }
  }
//   .v-enter，
// 　　　　　.v-leave-to {
//             opacity: 0;
//         }

//         .v-enter-active,
// 　　　　　.v-leave-active {
//             transition: all 0.5s linear;
//     }
    .fade-enter-active, .fade-leave-active{
    transition: all 0.5s ease
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }
</style>

