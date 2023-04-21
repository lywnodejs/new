<template>
  <el-menu
    class="sidebar"
    mode="vertical"
    default-active="1"
    text-color="#bfcbd9"
    active-background-color= #F9F9F9
    active-text-color="#FC9153">
    <router-link to="/sdl/dorado">
      <el-menu-item index="1" style="margin-top: 20px;">
        我的项目
      </el-menu-item>
    </router-link>
    <router-link to="/sdl/ratel/TaskManagement">
      <el-menu-item index="2" >
      任务管理
      </el-menu-item>
    </router-link>
    <router-link to="/sdl/ratel/VulnerabilityManagement">
      <el-menu-item index="3" >
      漏洞管理
      </el-menu-item>
    </router-link>
    <router-link to="/sdl/ratel/workordermanagement">
      <el-menu-item index="4" >
      工单管理
      </el-menu-item>
    </router-link>
    <router-link to="/sdl/ratel/manualaudit">
      <el-menu-item index="5" >
      人工审计
      </el-menu-item>
    </router-link>
    <router-link to="/sdl/ratel/pocmanagement">
      <el-menu-item index="6" >
      插件管理
      </el-menu-item>
    </router-link>
    <router-link to="/sdl/ratel/assetmanagement">
      <el-menu-item index="7" >
      资产管理
      </el-menu-item>
    </router-link>
  </el-menu>
</template>
<script>
  export default {
    name: 'side-bar',
    data() {
      return {
        doradoMenu: false,
        ratelMenu: false
      }
    },

    created() {

      //  this.showSideBar(this.$route)
    },

    watch: {
      $route(to, from) {
        this.showSideBar(to)
      }
    },

    methods: {
      showSideBar(route) {
        if (route) {
          console.log(route)
        }
      }
    }
  }
</script>
<style>
  .sidebar {
    width: 199px;
    height: 100%;
    min-height: 800px;
  }
  .router-link-active {
      text-decoration: none;
  }
  a {
    text-decoration: none;
  }
</style>
