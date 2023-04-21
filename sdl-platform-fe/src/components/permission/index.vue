<script>
import { connect } from '@/lib'

// import ajax from '@/plugin/ajax'
export default connect(() => {
  return {

    permission: 'permission/permission'

    // permission: 1
  }
})({
  name: 'app-permission',
  props: {

    // 读写状态 1:只读，2:读写
    auth: {
      type: [ Number, String ],
      default: 2
    }
  },

  // computed: {
  //   show: function() {
  //     const auth = this.auth
  //     const path = this.$route.path

  //     // 用户数据未加载完之前，默认不显示
  //     if (this.menuMap[path] === undefined) return false

  //     // 路由未配置读写权限，默认显示
  //     if (this.menuMap[path].auth == null) return true

  //     return this.menuMap[path].auth == auth
  //   }
  // },

  render(h) {

    // console.log(h)
    if (this.$slots.default.length >= 5) {

      console.warn('permission组件至多只能包含两个根节点')
      return null
    }

    // ajax.get('/common/page/auth').then(response => {
    //   this.permission = response.data.auth
    // })
    if (this.$slots.default.length === 1) {
      return this.permission == 2 ? (this.$slots.default[0]) : null
    }
    if (this.$slots.default.length === 3) {
      return this.permission == 2 ? (this.$slots.default[0]) : (this.$slots.default[2])
    }
  }
})
</script>
