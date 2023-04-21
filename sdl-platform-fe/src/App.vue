<template>
  <div v-if="isRouter" class="app-container" :class="[theme, fullScreen ? null : 'min']">
    <!-- <div class="app-container__header">
      <div class="app-container__header__nav">
        <app-header></app-header>
      </div>
    </div> -->
    <!-- <div style="height:500px;width:100%;background:white;">123</div>
    <div style="height:500px;width:100%;background:white;">123</div> -->
    <!-- <keep-alive> -->
      <router-view class="routerView"></router-view>
    <!-- </keep-alive> -->
  </div>
</template>
<script>
  import {connect} from '@/lib'
  import appLogo from '@/components/logo'
  import appSide from '@/components/side'
  import appHeader from '@/components/header'

  export default connect(() => {
    return {
      theme: 'theme',
      fullScreen: 'fullScreen',
      user: 'user/user'
    }
  }, {
  })({
    name: 'app-container',
    data() {
      return {
        isRouter: true
      }
    },
    components: {
      appLogo,
      appSide,
      appHeader
    },

    provide() {
      return {
        reload: this.reload,
        addWaterMark: this.addWaterMark
      }
    },
    mounted() {
      window.taotieCommandQueue = window.taotieCommandQueue || [];
      window.taotieCommandQueue.push({command: 'setCookieSystemNameForTaotie', parameter: 'SDL'});
      window.taotieCommandQueue = window.taotieCommandQueue || [];
      window.taotieCommandQueue.push({command: 'setCookieUserNameForTaotie', parameter: this.user.username});
    },
    methods: {
      reload() {
        this.isRouter = false
        let that = this
        this.$nextTick(() => {
          that.isRouter = true
        })
        that.isRouter = true
      }
    }
  })
</script>
<style lang="less">
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

