<script>
import Vue from "vue";
// #ifdef H5
// var VConsole = require("@/utils/vconsole.min.js");
//  #endif
export default {
  created () {
    // this.setAppInfo();
  },
  methods: {
    // 获取系统栏高度
    async setAppInfo () {
      let that = this;
      return new Promise((resolve, reject) => {
        uni.getSystemInfo({
          success: function (e) {
            Vue.prototype.StatusBar = e.statusBarHeight;
            // #ifdef H5
            Vue.prototype.CustomBar = e.statusBarHeight + 45;
            // #endif

            // #ifdef APP-PLUS
            if (e.platform == "android") {
              Vue.prototype.CustomBar = e.statusBarHeight + 50;
            } else {
              Vue.prototype.CustomBar = e.statusBarHeight + 45;
            }
            // #endif

            // #ifdef MP-WEIXIN
            let custom = wx.getMenuButtonBoundingClientRect();
            Vue.prototype.Custom = custom;
            Vue.prototype.CustomBar =
              custom.bottom + custom.top - e.statusBarHeight;
            // #endif
          },
        });
      });
    },
  },
};
</script>


<style lang="scss">
/*每个页面公共css */
@import "uview-ui/index.scss";
@import "./assets/css/style.scss";
@font-face {
  font-family: "iconfont"; /* project id 2393921 */
  src: url("//at.alicdn.com/t/font_2393921_sgnd1d5etw.eot");
  src: url("//at.alicdn.com/t/font_2393921_sgnd1d5etw.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_2393921_sgnd1d5etw.woff2") format("woff2"),
    url("//at.alicdn.com/t/font_2393921_sgnd1d5etw.woff") format("woff"),
    url("//at.alicdn.com/t/font_2393921_sgnd1d5etw.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_2393921_sgnd1d5etw.svg#iconfont") format("svg");
}
.iconfont {
  font-family: "iconfont" !important;
}
</style>
