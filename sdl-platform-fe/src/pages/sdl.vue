<template>
  <div class="app-wrap">
  <div class="app-container__header">
    <div class="app-container__header__nav">
      <app-header>
      </app-header>
    </div>
  </div>
  <div class="app-container-manage">
    <div class="app-container__side" v-if="sideShow">
      <div class="app-container__side__menu" >
        <app-side>
          <app-menu></app-menu>
        </app-side>
      </div>
    </div>
    <div class="app-container__main">
      <div class="app-container__main__crumbs" v-show="!searchPage && !chartPage">
        <app-crumbs></app-crumbs>
      </div>
      <div class="app-container__main__content" v-if="!searchPage && !chartPage">
        <div class="app-container__main__content__wrap">
          <router-view></router-view>
          <!-- <div class="box">
            <div class="footer"></div>
          </div> -->
          <el-tooltip placement="top" content="返回顶部">
            <back-to-top transitionName="fade" :visibilityHeight="300" :backPosition="50"></back-to-top>
          </el-tooltip>
        </div>
      </div>
      <router-view v-if='searchPage || chartPage'></router-view>


      <!-- <div class="footer"></div> -->
      <!-- <div class="app-float-window">
      </div> -->
      <!-- <el-container style="background: #F9F9F9;">
        <el-main >
          <el-tooltip placement="top" content="返回顶部">
            <back-to-top transitionName="fade" :visibilityHeight="300" :backPosition="50"></back-to-top>
          </el-tooltip>
        </el-main>
      </el-container> -->
    </div>
  </div>
  </div>
</template>
<script>
  import appSide from '@/components/side'
  import appCrumbs from '@/components/crumbs'
  import appMenu from '@/components/menu'
  import headerMenu from '@/components/headerMenu'
  import backToTop from '@/components/backToTop'
  import {connect} from '@/lib'
  import appHeader from '@/components/header'

  export default connect(() => {
    return {
      user: 'user/user'
    }
  })({
    name: 'app-manage',
    data() {
      return {
        searchPage: false,
        chartPage: false,
        sideShow: true
      }
    },
    components: {
      appSide,
      appCrumbs,
      appMenu,
      backToTop,
      appHeader,
      headerMenu
    },
    watch: {
      $route(val) {
        this.searchPage = false
        this.chartPage = false
        if (val.path == '/sdl/dolphin/solution' || val.path == '/sdl/dolphin/vulnerability') {
          this.searchPage = true
        }
        if (val.path == '/sdl/dorado/dataPresentation' ||
            val.path == '/sdl/octopus/statistic' ||
            this.$route.path == '/sdl/ocean/global' ||
            this.$route.path == '/sdl/ocean/department' ||
            this.$route.path == '/sdl/ocean/intra/baseline' ||
            this.$route.path == '/sdl/ocean/intra/fatbird' ||
            this.$route.path == '/sdl/ocean/intra/report' ||
            this.$route.path == '/sdl/devsecops' ||
            this.$route.path == '/sdl/devsecops/code/scan') {
          this.chartPage = true
        }
        if (this.$route.path == '/sdl/devsecops' || this.$route.path == '/sdl/devsecops/code/scan') {
          this.sideShow = false
        } else {
          this.sideShow = true
        }
      }
    },
    created() {
      this.searchPage = false
      this.chartPage = false
        if (this.$route.path == '/sdl/dolphin/solution' || this.$route.path == '/sdl/dolphin/vulnerability') {
          this.searchPage = true
        }
        if (this.$route.path == '/sdl/dorado/dataPresentation' ||
            this.$route.path == '/sdl/octopus/statistic' ||
            this.$route.path == '/sdl/ocean/global' ||
            this.$route.path == '/sdl/ocean/department' ||
            this.$route.path == '/sdl/ocean/intra/baseline' ||
            this.$route.path == '/sdl/ocean/intra/fatbird' ||
            this.$route.path == '/sdl/ocean/intra/report' ||
            this.$route.path == '/sdl/devsecops' ||
            this.$route.path == '/sdl/devsecops/code/scan') {
          this.chartPage = true
        }
        if (this.$route.path == '/sdl/devsecops' || this.$route.path == '/sdl/devsecops/code/scan') {
          this.sideShow = false
        } else {
          this.sideShow = true
        }
    }

  // mounted() {
    //   waterMark({
    //     systemId: '1848',
    //     imgWidthDis: 100,
    //     imgHeightDis: 100,
    //     textStyle: 'rgba(0,0,0,0.05)',
    //     userId: this.user.username,
    //     containerEl: document.querySelector('.app-container')
    //   })
    // }
  })
</script>
<style lang="less">
.app-container__header {
    height: 60.5px;
    /* margin-top: -30pt; */
    display: flex;
    border-bottom: #eeeeee solid;
}
  .app-container-manage {
    // height: 100%;
    overflow: hidden;
    // padding-bottom: 40px;
    width: 100%;
    position: absolute;
    top: 60px;
    bottom: 0pt;
    left: 0pt;
  }
  .app-container__main__crumbs {
    // margin: 16pt 16pt 0 16pt;
    // background-color: #fff;
  }
  .app-container__main__content {
    // margin: 0pt 16pt;
    // padding: 0pt 16pt 16pt 16pt;
  }
  .box {
    position: relative;
    .footer {
      height: 20px;
      background-color: #f2f2f2;
      width: 100%;
      position: absolute;
      bottom: 0;
      margin-left: -10px;
      margin-right: -20px;
    }
  }
  .app-float-window {
    width: 100%;
    background: rgba(255, 255, 255, .8);
    position: absolute;
    top: 50px;
    z-index: 99;
  }
  @media screen and (max-device-width: 1280px) {
    .app-container__header {
      width: 100%;
      height: 60px;
    }
    .sdl-home {
      width: 100%;
    }
  }

  @media screen and (min-width: 1066px) and (max-width: 1280px) {
    body {
      width: 100%;
    }
    .sdl-home {
      width: 100%;
    }
  }

  @media screen and (min-width: 1090px) and (max-width: 1280px) {
    .app-container__header {
      width: 1280px;
    }
    .sdl-footer {
      width: 100%;
    }
  }

  @media screen and (min-width: 100px) and (max-width: 1090px) {
    .app-container__header {
      width: 1280px;
    }
    .sdl-footer {
      width: 100%;
      .pic {
        display: none;
      }
    }
  }
</style>

