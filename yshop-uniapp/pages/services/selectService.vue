<template>
  <div>
    <div class="index">
      <!-- 已有家 -->
      <div class="index_main">
        <u-time-line>
          <u-time-line-item
            v-for="(item, index) in category"
            node-top="10"
          >
            <template v-slot:node>
              <div class="index_main-index">
                {{ index + 1 }}
              </div>
            </template>
            <template v-slot:content>
              <div>
                <div class="index_main-order-line"></div>
                <div
                  v-show="category.length === index + 1"
                  class="index_main-order-line-black"
                ></div>
                <div class="index_main-order-title">{{ item.cateName }}</div>
                <div class="index_main-order-main">
                  <div
                    hover-class='hoverClass'
                    class="index_main-order-main-item"
                    v-for="(itemB, indexB) in item.children"
                    @click="clickItem(index,indexB)"
                  >
                    {{ itemB.cateName }}
                  </div>
                </div>
              </div>
            </template>
          </u-time-line-item>
        </u-time-line>
      </div>
    </div>

  </div>
</template>
<script>
import _ from "lodash";
import { mapMutations } from 'vuex';
import {
  getNologinCategory
} from '@/api/store.js'
export default {
  name: "Index",
  data: function () {
    return {
      step: 1,
      category: []
    };
  },
  created () {
    getNologinCategory().then((res) => {
      if (res && res.data) {
        const category = res.data.sort((a, b) => {
          return a.steps - b.steps
        })
        this.category = category
      }
    })
  },
  mounted () { },
  methods: {
    ...mapMutations(['addServiceData']),
    clickItem (item, itemB) {
      this.$yrouter.push({
        path: '/pages/services/addservice',
        query: {
          cateId: this.category[item].id,
          goodsId: this.category[item].children[itemB].id,
          name: this.category[item].children[itemB].cateName
        }
      });
    }
  },
};
</script>
<style scoped lang="scss">
.index {
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
}
</style>