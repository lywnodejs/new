<template>
  <view class="lottie-bg">
    <view id="lottie">
      <image
        src="../../static/icon/logo-blue.png"
        rel="preload"
        mode="widthFix"
        style="width: 100%"
      />
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import cookie from "@/utils/store/cookie";
import { login } from "@/utils";

export default {
  name: "Loading",
  data () {
    return {};
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  created () {
    if (this.$store.getters.token) {
      // 如果token存在，直接进行进页面
      this.toLaunch();
      return;
    }
    this.getCategory().then(() => {
      this.$yrouter.switchTab({
        path: "/pages/shop/GoodsClass/index",
      });
    })

    // this.$yrouter.switchTab({
    //   path: "/pages/home/index",
    // });
    // console.log("进行登录操作");
    // login().finally(() => {
    //   this.$yrouter.switchTab({
    //     path: "/pages/shop/GoodsClass/index",
    //   });
    // });
  },
  methods: {
    ...mapActions(["changeAuthorization", "setUserInfo", "getUser", "setuserMyhome", 'getCategory']),
    toLaunch () {
      this.changeAuthorization(false);
      // let redirect = cookie.get("redirect").replace(/\ /g, "");
      // if (redirect && redirect.indexOf("/pages") != -1) {
      //   this.$yrouter.replace({
      //     path: "/pages" + redirect.split("/pages")[1],
      //   });
      //   cookie.remove("redirect");
      // } else {
      this.getUser().then(() => {
        this.setuserMyhome().then(() => {
          this.$yrouter.switchTab({
            path: "/pages/shop/GoodsClass/index",
          });
        })
      })

      // }
    },
  },
};
</script>

<style scoped lang="less">
.lottie-bg {
  position: fixed;
  left: 0;
  top: 0;
  background-color: #fff;
  width: 100%;
  height: 100%;
  z-index: 999;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
}

#lottie {
  width: 35%;
  display: block;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  margin: auto;
}
</style>
