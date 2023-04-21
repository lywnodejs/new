<template>
  <view class="productSort">
    <scroll-view
      class="productSort_header"
      scroll-x="true"
      :show-scrollbar="false"
    >
      <text
        v-for="item in categoryList"
        :class="item.isDefault? 'productSort_header-item active' : 'productSort_header-item' "
      > {{item.cateName}} </text>
    </scroll-view>
    <view class="productSort_main">
      <scroll-view
        class="productSort_main_scroll"
        lower-threshold="100"
        scroll-Y="true"
        @scrolltolower="scrollEvent"
      >
        <view
          class="productSort_main_scroll_item"
          v-for="item in 20"
        >
          <view class="productSort_main_scroll_item-left">
            <image
              src="../../../static/icon/dang.png"
              mode="widthFix"
            ></image>
          </view>
          <view class="productSort_main_scroll_item-right">
            <text class="productSort_main_scroll_item-right-name">设计师</text>
            <text class="productSort_main_scroll_item-right-info">专业家装独立设计师，全程服务，上千客户好评千客户好评千客户好评千客户好评！</text>
            <text class="productSort_main_scroll_item-right-evaluate">“专业家装独立设计师，很好沟通，选他她没</text>
            <view class="productSort_main_scroll_item-right-footer">
              <u-rate
                :count="5"
                v-model="con"
                inactive-color="#cccccc"
                active-color="#f8d94e"
              ></u-rate>
              <view class="productSort_main_scroll_item-right-footer-username">
                欧阳娜娜
                <image
                  src="../../../static/icon-class-hot.png"
                  mode="widthFix"
                ></image>
              </view>
            </view>
          </view>
        </view>
        <view class="productSort_main-download">
          <u-loadmore
            :status="status"
            :icon-type="iconType"
            :load-text="loadText"
          />
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
import { getCategory } from "@/api/store";
import { mapState, mapActions } from "vuex";
export default {
  name: "GoodsClass",
  data: function () {
    return {
      con: 2,
      status: 'loadmore',
      iconType: 'circle',
      categoryList: [],
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了'
      }
    };
  },
  computed: {
    ...mapState({
      category: "allCategory",
      activeHome: "activeHome",
    })
  },
  created () {
    // this.setuserMyhome();
    // this.$store.dispatch('getCategory')
  },
  mounted: function () {
    let arr = [];
    Array.isArray(this.category) && this.category.map(item => {
      if (item.children.length !== 0) {
        item.children.map(itemB => {
          arr.push(itemB);
        })
      }
    })
    this.categoryList = arr;
  },
  methods: {
    ...mapActions(["setuserMyhome"]),
    scrollEvent () {
      console.log(111)
    },
    goGoodsList (child) {
      this.$yrouter.push({
        path: "/pages/shop/GoodsList/index",
        query: { id: child.id, title: child.cateName },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.productSort {
  height: 100%;
  &_header {
    width: auto;
    height: 80rpx;
    padding: 10rpx 0 0 0;
    white-space: nowrap;
    &-item:nth-of-type(1) {
      margin-left: 20rpx;
    }
    &-item {
      display: inline-block;
      padding: 8rpx 20rpx;
      background: $user-theme_font_backage_info;
      border-radius: 40rpx;
      color: $user-theme_font_color_info;
      font-size: 32rpx;
      margin-right: 20rpx;
      &.active {
        background-color: rgba(213, 241, 255, 0.345);
        border: 1px solid $user-theme_color;
        color: $user-theme_color;
      }
    }
  }
  &_main {
    width: 100%;
    // height: calc(100vh - 100rpx);
    &_scroll {
      width: 100%;
      height: calc(100vh - 110rpx);
      &_item {
        display: flex;
        margin-bottom: 20rpx;
        &-left {
          width: 200rpx;
          image {
            width: 200rpx;
          }
        }
        &-right {
          width: calc(100vw - 220rpx);
          &-name {
            width: auto;
            display: inline-block;
            padding: 2rpx 14rpx;
            color: #ffffff;
            font-size: 24rpx;
            background-color: $user-theme_color;
            border-radius: 20rpx;
          }
          &-info {
            font-size: 30rpx;
          }
          &-evaluate {
            color: $user-theme_font_color_info;
            font-size: 26rpx;
            display: block;
          }
          &-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            &-username {
              float: right;
              font-size: 30rpx;
              display: flex;
              align-items: center;
              image {
                width: 30rpx;
                // float: right;
                margin: 0 20rpx 0 10rpx;
              }
            }
          }
        }
      }
    }
    &-download {
      width: 100%;
      height: 80rpx;
    }
  }
}
</style>
