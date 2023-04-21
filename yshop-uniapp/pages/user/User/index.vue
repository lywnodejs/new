<template>
  <view class="user">
    <view v-if="$store.getters.token || userInfo.uid">
      <view class="user_header">
        <view
          style="display: flex; width: 100%;"
          @click="touserInfo()"
        >
          <view class="user_header_left">
            <image
              :src="userInfo.avatar || '../../../static/icon/logo-gray.png'"
              mode="widthFix"
            ></image>
          </view>
          <view class="user_header_right">
            <text class="user_header_right-username">{{
			      userInfo.nickname
			    }}</text>
            <view class="user_header_right-userInfo">
              <image src="../../../static/icon/sfz.png"></image>
              <text class="user_header_right-userInfo-t">保证金未缴纳</text>
            </view>
            <text class="user_header_right-icon iconfont">&#xe608;</text>
          </view>
        </view>

        <view class="user_header_info">
          <view
            class="user_header_info-item"
            @click="toOrder"
          >
            <image
              src="../../../static/icon/dang.png"
              mode="widthFix"
            ></image>
            <text>我的订单</text>
            <text>7个</text>
          </view>
          <view class="user_header_info-item">
            <image
              src="../../../static/icon/qian.png"
              mode="widthFix"
            ></image>
            <text>钱包余额</text>
            <text>{{ userInfo.nowMoney }}</text>
          </view>
          <view class="user_header_info-item">
            <image
              src="../../../static/icon/xing.png"
              mode="widthFix"
            ></image>
            <text>我的评级</text>
            <u-rate
              :count="5"
              v-model="userInfo.starNum"
              inactive-color="#ffffff"
              active-color="#f8d94e"
            ></u-rate>
          </view>
        </view>
      </view>

      <view class="user_main">
        <view class="user_main-items">
          <view
            class="user_main-items-item"
            @click="toOrdering"
          >
            <view class="user_main-items-item_title">{{ userInfo.userType === 1 ? "我的服务项目" : "我的赚钱项目" }}
            </view>
            <view class="user_main-items-item_content">
              待确认订单：<text>0</text> 进行中：<text>3</text>已完成：<text>10</text>
            </view>
            <text class="user_main-items-item-icon iconfont">&#xe608;</text>
          </view>
        </view>

        <view class="user_main-items">

          <view
            class="user_main-items-item"
            @click="toservices"
          >
            <view class="user_main-items-item_title"> 成为服务提供者，立即接单赚钱 </view>
            <view class="user_main-items-item_content">
              直接面向业主接单，收入翻倍！
            </view>
            <text class="user_main-items-item-icon iconfont">&#xe608;</text>
          </view>

          <!-- v-if="userInfo.userType !== 3" -->
          <view class="user_main-items-item">
            <view class="user_main-items-item_title"> 成为城市运行合作方 </view>
            <view class="user_main-items-item_content">
              寻找有实力的合作伙伴，共享2万亿装修市场红利
            </view>
            <text class="user_main-items-item-icon iconfont">&#xe608;</text>
          </view>

          <!-- v-if="userInfo.userType !== 3" -->
          <view class="user_main-items-item">
            <view class="user_main-items-item_title"> 成为小区负责人 </view>
            <view class="user_main-items-item_content">
              火爆区域，先到先得，欢迎加入，收入无上限~
            </view>
            <text class="user_main-items-item-icon iconfont">&#xe608;</text>
          </view>

          <!-- v-if="userInfo.userType === 3" -->
          <view
            class="user_main-items-item"
            @click="toCityManager"
          >
            <view class="user_main-items-item_title"> 城市运行商管理中心 </view>
            <view class="user_main-items-item_content">
              进行中：<text>4</text> 已完成：<text>34</text>小区负责人：<text>100</text>
            </view>
            <text class="user_main-items-item-icon iconfont">&#xe608;</text>
          </view>
          <!-- v-if="userInfo.userType === 4" -->
          <view
            class="user_main-items-item"
            @click="toPrincipal"
          >
            <view class="user_main-items-item_title"> 小区负责人管理后台 </view>
            <view class="user_main-items-item_content">
              进行中：<text>4</text> 已完成：<text>19</text>
            </view>
            <text class="user_main-items-item-icon iconfont">&#xe608;</text>
          </view>
          <view class="user_main-items-item">
            <view class="user_main-items-item_title"> 我的推广 </view>
            <view class="user_main-items-item_content">
              入住服务商：<text>7</text> 成交订单：<text>15</text>
            </view>
            <text class="user_main-items-item-icon iconfont">&#xe608;</text>
          </view>
        </view>

        <view class="user_main-items">
          <view class="user_main-items-item">
            <view
              class="user_main-items-item_title"
              @click="toOut"
            >
              设置
            </view>
            <view class="user_main-items-item_content"> 自定义相关配置 </view>
            <text class="user_main-items-item-icon iconfont">&#xe608;</text>
          </view>

          <view class="user_main-items-item">
            <view class="user_main-items-item_title"> 关于Go_Work 购物 </view>
            <view class="user_main-items-item_content"> 要装修，上狗窝 </view>
            <text class="user_main-items-item-icon iconfont">&#xe608;</text>
          </view>
        </view>
      </view>
    </view>
    <Authorization v-else />
  </view>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import SwitchWindow from "@/components/SwitchWindow";
import Authorization from "@/pages/authorization/index";

const NAME = "User";

export default {
  name: NAME,
  components: {
    SwitchWindow,
    Authorization,
  },
  props: {},
  data: function () {
    return {
      MyMenus: [],
      switchActive: false,
      isWeixin: false,
      con: 2,
    };
  },
  computed: mapGetters(["userInfo"]),
  methods: {
    ...mapMutations(["updateAuthorizationPage"]),
    toOrder () {
      this.$yrouter.push({
        path: "/pages/user/myOrder/index",
      });
    },
    toOrdering () {
      this.$yrouter.push({
        path: "/pages/user/myOrder/ordering",
      });
    },
    toPrincipal () {
      this.$yrouter.push({
        path: "/pages/user/principal/index",
      });
    },
    toCityManager () {
      this.$yrouter.push({
        path: "/pages/user/cityManager/index",
      });
    },
    toOut () {
      this.$yrouter.push({
        path: "/pages/user/system/index",
      });
    },
    touserInfo () {
      this.$yrouter.push({
        path: "/pages/user/userInfo/index",
      });
    },
    toservices () {
      this.$yrouter.push({
        path: "/pages/services/index",
      });
    }
  },
  watch: {},
  onShow () {
    if (this.$store.getters.token) {

      uni.showLoading({
        title: "加载中",
      });
      this.$store.dispatch("getUser", true);
      uni.hideLoading()
    }
  },
  onHide () {
    console.log("离开用户中心");
    // this.updateAuthorizationPage(false);
  },
};
</script>

<style scoped lang="scss">
.user {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  &_header {
    width: 100%;
    height: 400rpx;
    background-color: #ffffff;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    &_left {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100rpx;
      height: 100rpx;
      background-color: #f2f2f2;
      border-radius: 10rpx;
      margin-top: 40rpx;
      margin-left: 30rpx;
      image {
        width: 90%;
      }
    }
    &_right {
      margin-top: 40rpx;
      margin-left: 30rpx;
      &-username {
        font-size: 34rpx;
      }
      &-userInfo {
        display: flex;
        margin-top: 10rpx;
        image {
          width: 50rpx;
          height: 40rpx;
          margin-right: 10rpx;
        }
        &-t {
          padding: 1rpx 10rpx;
          border-radius: 6rpx;
          background-color: #cdcbcf;
          font-size: 26rpx;
          color: #ffffff;
        }
      }
      &-icon {
        position: absolute;
        right: 30rpx;
        top: 70rpx;
        font-size: 40rpx;
        color: $user-theme_font_color_info;
      }
    }
    &_info {
      display: flex;
      justify-content: space-between;
      width: 98%;
      height: 220rpx;
      margin: 0 auto;
      border-radius: 20rpx;
      background-color: $user-theme_color;
      &-item {
        width: 33%;
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        flex-wrap: wrap;
        image {
          width: 80rpx;
          margin-bottom: 20rpx;
        }
        text {
          width: 100%;
          color: #ffffff;
          font-size: 34rpx;
          text-align: center;
        }
      }
    }
  }
  &_main {
    width: 100%;
    background-color: $user-theme_font_backage_info;
    &-items {
      width: 100%;
      margin: 20rpx 0;
      &-item {
        width: 100%;
        height: 150rpx;
        padding: 24rpx;
        background-color: #fff;
        position: relative;
        border-bottom: 1px solid $user-border-bottom-color;
        &:last-child {
          border-bottom: 0;
        }
        &_title {
          font-size: 36rpx;
          line-height: 54rpx;
        }
        &_content {
          font-size: 30rpx;
          line-height: 48rpx;
          color: $user-theme_font_color_info;
        }
        &-icon {
          position: absolute;
          right: 30rpx;
          top: 56rpx;
          font-size: 40rpx;
          color: $user-theme_font_color_info;
        }
      }
    }
  }
}
</style>
