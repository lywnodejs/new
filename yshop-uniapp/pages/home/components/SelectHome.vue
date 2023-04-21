<template>
  <u-popup
    v-model="showSelectHome"
    mode="top"
  >
    <view class="index_selectHome">
      <view
        class="index_selectHome-item"
        v-for="(item, index) in userMyhome"
        @click="selectHome(item, index)"
      >
        <view class="index_selectHome-item-title">
          <text>{{ item.name }}</text>
          <text class="index_selectHome-item-info">
            {{ item.mergerName || "" }}
          </text>
        </view>
        <text
          class="index_selectHome-item-edit"
          @click.stop="editMyhome(item)"
        >编辑</text>
      </view>

      <view
        class="index_selectHome-newHome"
        @click="addHome()"
      >
        + 添加我的家
      </view>
    </view>
  </u-popup>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "selectHome",
  data: function () {
    return {
      showSelectHome: false,
    };
  },
  computed: {
    ...mapState({
      userMyhome: "userMyhome",
    }),
  },
  methods: {
    ...mapActions(["resetActiveHome"]),
    ...mapMutations(["setactiveHome"]),
    //添加我的家
    addHome () {
      this.$yrouter.push("/pages/home/addHome/index");
    },
    selectHome (item, index) {
      this.setactiveHome(item);
      this.resetActiveHome();
      this.openModal(false);
    },
    editMyhome (item) {
      this.$yrouter.push({
        path: '/pages/home/addHome/index',
        query: {
          id: item.id
        }
      })
    },
    openModal (bool) {
      this.showSelectHome = bool;
    },
  },
};
</script>
<style scoped lang="scss">
.index_selectHome {
  // max-height: 400rpx;
  // overflow-y: scroll;
  padding: 10rpx 0 10rpx 20rpx;
  padding-bottom: 100rpx;
  &-item {
    display: flex;
    padding: 5px 0;
    justify-content: center;
    font-size: 40rpx;
    border-bottom: 1px solid #e1dfdf;
    &-title {
      width: 100%;
    }
    &-info {
      width: 80%;
      display: block;
      font-size: 30rpx;
      font-weight: 400;
      color: $user-theme_font_color_info;
    }
    &-edit {
      width: 20%;
      display: flex;
      align-items: center;
      text-align: right;
      padding-right: 20rpx;
      font-size: 36rpx;
      color: $user-theme_font_color_info;
    }
  }
  &-newHome {
    position: absolute;
    bottom: 0;
    left: 20rpx;
    width: 100%;
    background-color: #ffffff;
    padding: 20rpx 0;
    font-size: 36rpx;
    font-weight: 400;
    color: $user-theme_font_color_info;
  }
}
</style>