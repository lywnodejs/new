<template>
  <div class="app-crumbs">

    <el-breadcrumb separator="/" separator-class="el-icon-arrow-right" class="app-crumbs-content">
      <div class="syn"></div>
      <template v-for="crumb in crumbs" class="crumbsContent">
        <!-- <el-breadcrumb-item :to="{ path: '/sdl/dorado' }" :key="crumb.index">我的项目</el-breadcrumb-item>
        <el-breadcrumb-item :key="crumb.index">{{$route.params['projectId']}}</el-breadcrumb-item> -->
        <el-breadcrumb-item v-if="crumb.name" :to="isExistMenu(crumb.menu) ? { path: crumb.path} : null" :key="crumb.path">{{crumb.name}}</el-breadcrumb-item>
        <!-- <el-breadcrumb-item :key="crumb.index">{{crumb}}</el-breadcrumb-item> -->
      </template>
      <!-- <template class="content">
        <el-breadcrumb-item :to="{ path: '/sdl/dorado' }">我的项目</el-breadcrumb-item>
        <el-breadcrumb-item >{{$route.params['projectId']}}</el-breadcrumb-item>
      </template> -->
    </el-breadcrumb>
    <div class="app-crumbs-btn">
      <el-button v-if='pathUrl=="/sdl/dorado"' @click="openCreateProjectDialog" class="create-btn" >
        <font class="font">新建安全评估</font>
      </el-button>
    </div>
    <div class="project-hint" v-if='pathUrl=="/sdl/dorado/baseline/ProjectWorkflow"'>
      <span><i>1. A/B类项目预计2-3个工作日完成，C/D类项目预计1-2个工作日完成；</i></span>&nbsp;&nbsp;&nbsp;
      <span><i>2. 未完成评估的项目上线或开放外网，需要T2管理者邮件同意。</i></span>
    </div>
  </div>
</template>
<script>
import { connect } from '@/lib'
import { splitPath, slicePath } from 'utils'
import CreateProject from '@/pages/sdl/dorado/CreateProjectDialog'
import dialog from '@/utils/dialog'

import bus from '@/routes/eventBus'
import ajax from '@/plugin/ajax'
import * as API from '@/commons/api/dorado'

export default connect(() => {
  return {
   menus: 'user/menus'
  }
})({
  name: 'app-crumbs',
  data() {
    return {
      crumbs: [],
      pathUrl: '',
      projectName: ''
    }
  },
  watch: {
    '$route'(to, from) {
      this.parseURL(to.path)

      // console.log(this.$route.path)
      this.pathUrl = this.$route.path.split('?')[0]

      // if (!this.$route.query['projectId']) {
      //   this.crumbs = ['安全评估', '我的项目']
      // } else {
      //   this.fetchData()
      // }
    }
  },
  methods: {
    fetchData() {
      ajax.post(API.getProjectDetail, {sdl_project_id: this.$route.query['projectId']}).then(response => {
            const errno = response.errno
            const errmsg = response.errmsg
            if (errno === 0) {
              this.projectName = response.data.project_name
              this.crumbs = ['安全评估', '我的项目', this.projectName]
            } else {
              this.$notify({
                title: '失败',
                message: errmsg,
                type: 'error'
              })
            }
          })
    },
    parseURL(url) {
      const urls = splitPath(url)
      const crumbs = []

      bus.$on('changeTitle', name => {
        this.crumbs = ['安全评估', '我的项目', name]
      })
      for (let i = 1; i < urls.length; i++) {
        const path = slicePath(urls, i + 1)
        const menu = _.find(this.menus, { url: path })
        crumbs.push({
          path,
          name: menu ? menu.name : undefined,
          menu: menu
        })
      }

      this.crumbs = crumbs
    },

    /**
     * 判断当前菜单是否可点击
     * 如果当前菜单下有子菜单，则该面包屑不能点击
     * 默认返回true，可以进行点击
     */
    isExistMenu(menus) {
      let isExistMenu = true
      if (menus && menus.pid != 0 && _.isArray(menus.menus)) {
        menus.menus.forEach(menu => {
          if (menu.isMenu && menu.pid != 0) {
            isExistMenu = false
          }
        })
      }
      return isExistMenu
    },
    openCreateProjectDialog() {
        dialog({
              title: '新建安全评估',
              component: CreateProject,
              width: '900px'

              // close: () => {
              //   this.fetchData()
              // }
          })
      }
  },
  created() {
    this.parseURL(this.$route.path)
    this.pathUrl = this.$route.path

    // if (!this.$route.query['projectId']) {
    //   if (this.pathUrl == '/sdl/ratel') {
    //     this.crumbs = ['APP检测']
    //   } else {
    //     this.crumbs = ['安全评估', '我的项目']
    //   }
    // } else if (this.$route.query['projectId']) {
    //   this.fetchData()
    // }
  }
})
</script>
<style lang="less">
  .app-crumbs{
    // position: relative;
    // margin-top: 46pt;
    // margin-top: 12px;
    display: flex;
    justify-content: center;
    border-radius: 4px;
    .app-crumbs-content{
      flex: 1;
      line-height: 44px;
      .syn{
        float: left;
        border-left: 2px solid #FC9153;
        height: 14px;
        margin-left: 18px;
        margin-right: 5px;
        margin-top: 15px;
        line-height: 50px;
      }
      .crumbsContent{
        box-sizing: border-box;
        padding: 10px;
        display: inline-block;
        margin-left: 10px;
      }
    }
    .app-crumbs-btn{
      flex: 1;
      text-align: right;
      margin-right: 25px;
      .create-btn{
        border: 1px solid #FC9153;
        border-radius: 4px;
        margin-top: -12px;
        height: 30px;
        width: 70pt;
        padding:5px;
        // font-size: 14px;
        .font{
          font-size: 12px;
          color: #FC9153;
          // font-weight: 400;
          -webkit-font-smoothing: antialiased;
          line-height: 10pt;
        }
      }
    }
  }
  .project-hint {
    position: absolute;
    z-index: 10;
    top: 24px;
    color: red;
    i{
      // font-style: normal !important;
    }
  }
</style>

