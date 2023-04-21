<template>
  <view>
    <view
      class="index"
      v-if="userMyhome.length !== 0"
    >
      <!-- 已有家 -->
      <view class="index_header">
        <SelectHome ref="selectHome" />
        <text @click="selectHome()">{{ activeHome.name }}</text>
        <text class="iconfont index_header-icon">&#xe65a;</text>
        <text class="index_header-info">
          {{ activeHome.mergerName || "" }}
        </text>
      </view>

      <view class="index_main">
        <u-time-line>
          <u-time-line-item
            v-for="(item, index) in category"
            node-top="10"
          >
            <template v-slot:node>
              <view
                class="index_main-index"
                :class="item.isDefault ? 'active' : ''"
              >
                {{ index + 1 }}
              </view>
            </template>
            <template v-slot:content>
              <view>
                <view
                  class="index_main-order-line"
                  :class="item.isDefault ? 'cative' : ''"
                ></view>
                <view
                  v-show="category.length === index + 1"
                  class="index_main-order-line-black"
                ></view>
                <view class="index_main-order-title">{{ item.cateName }}</view>
                <view class="index_main-order-main">
                  <view
                    :class="
                      itemB.isDefault
                        ? 'index_main-order-main-item active'
                        : 'index_main-order-main-item'
                    "
                    v-for="(itemB, indexB) in item.children"
                  >
                    {{ itemB.cateName }}
                  </view>
                  <!-- <view class="index_main-order-main-item active">
                  设计师3333
                </view>
                <view class="index_main-order-main-item active-ok">
                  设计师3333
                  <image
                    class="active-ok-img"
                    src="../../../static/icon/icon-ok.png"
                  ></image>
                </view>
                <view class="index_main-order-main-item active-gengduo">
                  设计师
                  <image
                    class="active-ok-img"
                    src="../../../static/icon/icon-gengduo.png"
                  ></image>
                </view> -->
                </view>
              </view>
            </template>
          </u-time-line-item>
        </u-time-line>
      </view>

      <view
        class="index_footer"
        v-if="UserMyhomeMyhomeDetail"
      >
        <view class="index_footer-describe">
          小区负责人（
          <text class="index_footer-describe-mini">有问题可以电话联系</text>
          ）
        </view>
        <view class="index_footer-info">
          <view class="index_footer-info-left">
            <!-- <u-avatar
            :src="require('../../../assets//images/user-head.png')"
            mode="square"
          ></u-avatar> -->
          </view>
          <view class="index_footer-info-right">
            <text class="index_footer-info-right-name">岳云鹏</text>
            <text class="index_footer-info-right-phone">13934060127</text>
            <view class="index_footer-info-right-describe">
              这里是描述这里是描述这里是描述这里是描述这里是描述这里是描述这里是描述这里是描述这里是描述这里是描述
            </view>
          </view>
        </view>
      </view>

      <view
        class="index_footer"
        v-else="UserMyhomeMyhomeDetail"
      >
        <view class="index_footer-describe">
          <text class="index_footer-describe_nodata">房屋所在位置暂无小区负责人</text>
          <text class="index_footer-describe_nodataT">申请加入，获取收益</text>
        </view>
      </view>
    </view>
    <view
      class="index_else"
      v-else
    >
      <text>您还没有添加</text>
      <u-button
        type="primary"
        class="index_else-btn"
        @click="addHome()"
      >
        <text class="iconfont">&#xe620;</text>
        添加我的家
      </u-button>
    </view>
  </view>
</template>
<script>
import { mapState, mapActions } from "vuex";
import _ from "lodash";
import SelectHome from "./components/SelectHome";
import { userVillageInfo, UserMyhomeMyhomeDetail } from "@/api/store";
export default {
  name: "Index",
  components: {
    SelectHome,
  },
  data: function () {
    return {
      step: 1,
    };
  },
  computed: {
    ...mapState({
      category: "allCategory",
      userMyhome: "userMyhome",
      activeHome: "activeHome",
      UserMyhomeMyhomeDetail: "UserMyhomeMyhomeDetail", // 小区负责人
    }),
  },
  onHide () {
    try {
      this.$refs["selectHome"].openModal(false);
    } catch (e) {
      //TODO handle the exception
    }
  },
  // created () {
  //   this.setuserMyhome();
  // },
  mounted () { },
  methods: {
    // ...mapActions(["setuserMyhome"]),
    //去往添加我的家
    addHome () {
      this.$yrouter.push("/pages/home/addHome/index");
    },
    selectHome () {
      this.$refs["selectHome"].openModal(true);
    },
  },
};
</script>
<style scoped lang="scss">
.index {
  padding-top: 120rpx;
  // padding-bottom: 160rpx;
  &_header {
    position: fixed;
    top: 0;
    z-index: 10;
    padding: 10rpx 0 10rpx 20rpx;
    background-color: #ffffff;
    width: 100%;
    font-size: 38rpx;
    font-weight: bold;
    color: $user-theme_color;
    // box-shadow: 10px 1px 6px #ccccccba;
    // line-height: 90rpx;
    &-addUserHome {
      font-size: 40rpx;
      line-height: 100rpx;
    }
    &-icon {
      margin-left: 10rpx;
    }
    &-info {
      display: block;
      font-size: 30rpx;
      font-weight: 400;
      color: $user-theme_font_color_info;
    }
  }
  &_main {
    width: 94%;
    margin: 0 auto;
    &-index {
      width: 16px;
      height: 16px;
      display: flex;
      justify-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 1px solid $user-theme_font_color_info;
      // line-height: 10px;
      color: $user-theme_font_color_info;
      font-size: 10px;
      &.active {
        color: $user-theme_color;
        border: 1px solid $user-theme_color;
      }
    }
    &-order-line {
      position: absolute;
      top: 20rpx;
      left: -40rpx;
      width: 1px;
      background-color: $user-theme_color;
      &.cative {
        height: 140%;
      }
      &-black {
        position: absolute;
        top: 20rpx;
        left: -40rpx;
        width: 1px;
        background-color: #ffffff;
        height: 110%;
      }
    }

    &-order-title {
      font-size: 34rpx;
      color: $user-theme_font_color_info;
    }
    &-order-main {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      &-item {
        margin: 10rpx 20rpx 10rpx 0;
        padding: 8rpx 20rpx;
        background: $user-theme_font_backage_info;
        border-radius: 40rpx;
        color: $user-theme_font_color_info;
        font-size: 30rpx;
        position: relative;
        &.active {
          color: $user-theme_color;
          background-color: rgba(213, 241, 255, 0.345);
          border: 1px solid $user-theme_color;
        }
        &.active-ok {
          color: $user-theme_color;
          background-color: rgba(213, 241, 255, 0.345);
          border: 1px solid $user-theme_color;
          .active-ok-img {
            width: 34rpx;
            height: 34rpx;
            position: absolute;
            top: -14rpx;
            right: -14rpx;
          }
        }
        &.active-gengduo {
          .active-ok-img {
            width: 34rpx;
            height: 34rpx;
            position: absolute;
            top: -14rpx;
            right: -14rpx;
          }
        }
      }
    }
  }
  &_footer {
    padding-left: 20rpx;
    background-color: #ffffff;
    border-top: 1px solid $user-theme_font_color_info;
    width: 100%;
    height: auto;
    &-describe {
      font-size: 14px;
      &-mini {
        font-size: 12px;
      }
      &_nodata {
        display: block;
        padding: 10px 0;
        width: 100%;
        font-size: 14px;
        color: #333333;
        text-align: center;
      }
      &_nodataT {
        display: block;
        width: 100%;
        padding-bottom: 10px;
        text-align: center;
        color: $user-theme_color;
        font-size: 14px;
      }
    }
    &-info {
      display: flex;
      padding-top: 10rpx;
      &-left {
        // width: 170rpx;
      }
      &-right {
        margin-top: -8rpx;
        &-name {
          margin-left: 20rpx;
          font-size: 14px;
        }
        &-phone {
          margin-left: 16rpx;
          font-size: 14px;
          color: $user-theme_color;
        }
        &-describe {
          margin-left: 10px;
          padding-right: 10rpx;
          color: $user-theme_font_color_info;
        }
      }
    }
  }
  &_else {
    width: 80%;
    margin: 0 auto;
    text-align: center;
    padding-top: 45%;
    &-btn {
      margin: 0 auto;
    }
  }
}
</style>