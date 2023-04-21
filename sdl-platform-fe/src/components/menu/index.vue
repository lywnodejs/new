<template>
  <div class="app-menu">
    
    <el-menu
      :collapseTransition="false"
      :collapse="!fullScreen"
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      unique-opened>
      <template v-for="menu in appMenus" v-if="menu.isMenu">
        <!-- 判断menu是否包含子菜单 -->
        <el-submenu :index="menu.id + ''" v-if="menu.menus && menu.menus.length > 0 && isExistMenu(menu.menus)" :key="menu.id">
          <template slot="title">
            <i v-if="menu.icon" class="app-menu__icon iconfont" :class="'icon-' + menu.icon"></i>
            <span class="app-menu__title" slot="title">&nbsp;{{ menu.name }}</span>
          </template>
          <el-menu-item v-for="submenu in menu.menus" v-if="submenu.isMenu" :key="submenu.id" :index="submenu.id + ''" @click="redirectUrl(submenu)">
            <i v-if="submenu.icon" class="app-menu__icon iconfont" :class="'icon-' + submenu.icon"></i>
            <span class="app-menu__title" slot="title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ submenu.name }}</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item :index="menu.id + ''"  @click="redirectUrl(menu)" :key="menu.id" v-else>
          <!-- <i v-if="menu.icon" class="app-menu__icon iconfont" :class="'icon-' + menu.icon"></i> -->
          <!-- <i v-if="menu.icon" :class="menu.icon" ></i>
          <i  v-else-if="!menu.icon" class="app-menu__title el-icon-tickets"></i>z -->
          <!-- <i  class="icon iconfont icon-pending"></i> -->
          <i v-if="menu.icon" class="myIcon icon iconfont" :class='"icon-" + menu.icon'></i>
          <span class="app-menu__title" slot="title">&nbsp;{{ menu.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { connect } from '@/lib'
import { slicePath } from 'utils'

export default connect(() => {
  return {
    fullScreen: 'fullScreen',
    theme: 'theme',
    menu: 'user/getMenusByApp'
  }
})({
	data() {
		return {
			isCollapse: false, // 菜单的展开或收起
      activeIndex: '' // 当前激活的菜单
		}
  },

  watch: {
    fullScreen() {
      this.setActiveMenu()
    },
    $route(val) {
      this.setActiveMenu(val.path)
    }
  },

  computed: {
    menuTheme() {
      if (this.theme === 'orange') {
        return {
          bg: '#3c3d45',
          color: '#666666'
        }
      }
      return {
        bg: null,
        color: null
      }
    },
    appMenus() {
      const app = slicePath(this.$route.path, 2)
      return this.menu(app)
    }
  },

  methods: {

    /**
     * 判断子菜单中是否包含有菜单
     */
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

    /**
     * 菜单跳转
     */
    redirectUrl(menu) {
      if (menu && menu.url && menu.url !== '#') {
        this.$router.push(menu.url)
      }
    },

    /**
     * 设置当前激活菜单
     */
    setActiveMenu(path) {
      this.activeIndex = ''
      let menuPath = path || this.$route.path
      this.cycleMenu(this.appMenus, menuPath)
    },

    cycleMenu(menus, menuPath) {
      menus.forEach(item => {
        if (_.isArray(item.menus) && item.menus.length > 0 && this.isExistMenu(item.menus)) {
          this.cycleMenu(item.menus, menuPath)
        } else {
          if (menuPath.includes(item.url) && item.isMenu) {
            this.activeIndex = item.id + ''
          }
        }
      })
    }
  },

  mounted() {

    this.setActiveMenu()
  }
})
</script>

<style lang="less">
// .el-submenu__title{
  // margin-top: 10px;
  // background: rgb(255, 247, 242) !important;
  // color: #FC9153;
  // background: rgba(252,145,83,0.08) !important;
// }
.myIcon{
  font-size: 20px;
}
.app-menu {
  .el-menu-item {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0;
    height: 50px;
    line-height: 50px;
    // &--active {
    //     background: rgb(255, 247, 242) !important;
    // }
  }
  // .el-menu-item:active {
  //   // color: black;
  //   background: rgb(255, 247, 242) !important;
  // }
  &__icon {
    font-size: 14px;
    color: #fff;
    // margin-right: 10px;
  }
}
.el-menu--popup {
  // padding:0 !important;
  border-radius: 2px;
  width: 120px;
  // .el-submenu {
  //   width: 100px;
  //   .el-submenu__title {
  //     padding: 0;
  //     width: 150px;
  //   }
  // }
  .el-menu-item {
    padding-left: 5px !important;
    line-height: 50px;
    height: 50px;
    width: 120px;
    font-size: 12.5px;
  }
}
.el-tooltip__popper.is-dark{
  .el-menu__title {
    -webkit-font-smoothing: antialiased;
  }
}
</style>

