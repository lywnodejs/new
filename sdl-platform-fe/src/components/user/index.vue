<template>
  <div class="app-user app-minor-light-bg" :class="!fullScreen ? 'app-user--min' : null">
    <div class="app-user__info">
      <img class="app-user__info__avatar" src="http://home.didichuxing.com/didifile/avatar/zhangdijasper.jpg" v-err-src="'http://home.didichuxing.com/images/DDtx150.png'">
    </div>
    <div class="app-user__statistics"  v-if="fullScreen">
      <h4>
        {{user.realname}}
      </h4>
    </div>
  </div>
</template>

<script>
import { connect } from '@/lib'
export default connect(() => {
  return {
    fullScreen: 'fullScreen',
    user: 'user/user'
  }
})({
  name: 'app-user'
})
</script>

<style lang="less">
  .app-user {
    overflow: hidden;
    &__info {
      padding: 15px 0;
      text-align: center;
      &__avatar {
        width: 80px;
        height: 80px;
        border-radius: 100%;
        vertical-align: middle
      }
    }
    &__statistics {
      text-align: center;
      h4 {
        margin: 15px 0;
      }
    }
    &--min {
      .app-user__info__avatar {
        width: 50px;
        height: 50px;
      }
    }
  }
</style>
