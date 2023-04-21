<template>
  <div class="app-link">
    <a v-if="hrefUrl" target="_blank" :href="hrefUrl || null">
      <i v-if="isShowIcon" class="iconfont" :class="iconClass"></i>
      <slot></slot>
    </a>
  </div>
</template>

<script>
export default {
  props: {

    // 连接类型git wiki card(跳转到桔子堆用户信息)
    type: {
      type: String,
      default: 'card'
    },

    // 类型为git或者wiki时传url
    url: String,

    /**
     * 类型为card时传emial
     *
     */
    email: String,

    isShowIcon: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    hrefUrl: function() {
      if (this.type === 'card') {
        let name = this.email ? this.email.substr(0, this.email.indexOf('@')) : ''
        return `http://home.didichuxing.com/person.html#/${name}/1`
      }
      return this.url
    },

    iconClass: function() {
      let classIcon = 'icon-user-circle'
      switch (this.type) {
        case 'git':
          classIcon = 'icon-git'
          break
        case 'wiki':
          classIcon = 'icon-WIKI'
          break
        default:
          classIcon = 'icon-user-circle'
      }
      return classIcon
    }
  }
}
</script>

<style lang="less">
  .app-link {
    display: inline;

    a {
      margin-right: 10px;

      :hover {
        cursor: pointer;
      }
    }

  }
</style>

