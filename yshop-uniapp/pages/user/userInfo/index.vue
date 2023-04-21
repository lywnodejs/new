<template>
  <view class="userinfo">
    <view class="userinfo_header">
      <view class="userinfo_header-item">
        <view class="left">头像</view>
        <view class="right">
          <u-upload
            ref="uUpload"
            :action="uploadUrl"
            :header='uploadHeader'
            :file-list="fileList"
            :multiple='false'
            :show-upload-list='false'
            :max-count="1"
            image-mode='scaleToFill'
            :custom-btn='true'
            :before-upload='beforeUpload'
            @on-change='finallyUpload'
            @on-success='successUpload'
          >
            <view
              slot="addBtn"
              class="slot-btn"
            >
              <image
                :src="avatar"
                mode="widthFix"
              ></image>
            </view>
          </u-upload>
          <text class="user_header_right-icon iconfont">&#xe608;</text>
        </view>
      </view>
      <view
        class="userinfo_header-item"
        @click="editName()"
      >
        <view class="left">名称</view>
        <view class="right">
          <text>{{nickname || '输入你的称呼'}}</text>
          <text class="user_header_right-icon iconfont">&#xe608;</text>
        </view>
      </view>
      <view
        class="userinfo_header-item"
        @click="editjianshao()"
      >
        <view class="left">自我介绍</view>
        <view class="right">
          <text>{{mark || '请输入自我介绍'}}</text>
          <text class="user_header_right-icon iconfont">&#xe608;</text>
        </view>
      </view>
    </view>

    <view class="userinfo_gouwoquan">
      <view class="gouwoquan_header">
        <text class="title">狗窝圈</text>
        <text class="user_header_right-icon iconfont">&#xe620;</text>
      </view>
      <view class="gouwoquan_nodata">
        还没有发表内容，你可以点击右上角➕号新建图文，记录装修/工作日常，让客户更了解自己
      </view>
      <view class="items">
        <view class="item">
          <image
            src="../../../static/test.png"
            mode="widthFix"
          ></image>
          <text>分享最近的一个案例，个人非常喜欢！</text>
        </view>
      </view>
    </view>

    <u-modal
      v-model="showName"
      title="名称"
      :negative-top='340'
      :async-close="true"
      :show-cancel-button='true'
      @confirm="save()"
    >
      <view class="slot-content">
        <view class="editname">
          <u-input
            type="text"
            v-model="nickname"
            placeholder="请输入你的称呼"
          />
        </view>
      </view>
    </u-modal>
    <u-modal
      v-model="showMark"
      :negative-top='40'
      title="自我介绍"
      :async-close="true"
      :show-cancel-button='true'
      @confirm="save()"
    >
      <view class="slot-content">
        <view class="editname">
          <u-input
            type="text"
            v-model="mark"
            placeholder="请输入你的称呼"
          />
        </view>
      </view>
    </u-modal>

  </view>
</template>

<script>
import { mapGetters } from "vuex";
import { VUE_APP_API_URL } from "@/config";
import { setUserInfo } from '@/api/user.js';
import cookie from "@/utils/store/cookie";
const token = cookie.get('login_status');
export default {
  name: "userInfo",
  data: function () {
    return {
      showName: false,
      showMark: false,
      nickname: '',
      mark: '',
      avatar: '',
      fileList: [],
      uploadUrl: VUE_APP_API_URL + '/api/qiNiuContent',
      uploadHeader: {
        Authorization: "Bearer " + token
      }
    }
  },
  computed: mapGetters(["userInfo"]),
  created () {
    this.$store.dispatch("getUser", true).then(res => {
      this.nickname = res.nickname;
      this.mark = res.mark;
      this.avatar = res.avatar;
    })
  },
  methods: {
    editName () {
      this.showName = true;
    },
    editjianshao () {
      this.showMark = true;
    },
    beforeUpload () {
      uni.showLoading({
        title: '上传中'
      })
    },
    successUpload (data) {
      if (data && Array.isArray(data.data) && data.data.length !== 0) {
        this.avatar = data.data[0];
        this.$refs.uUpload.remove(0);
        this.fileList = [];

        this.save()
      }
    },
    finallyUpload () {
      uni.hideLoading()
    },
    save () {
      let params = {
        nickname: this.nickname,
        avatar: this.avatar,
        mark: this.mark
      }
      setUserInfo(params).then(res => {
        if (res.status !== 200) {
          uni.showToast({
            title: res.msg,
            icon: "ok",
            duration: 2000,
          });
        }
      }).catch(err => {
        uni.showToast({
          title: err.msg,
          icon: "error",
          duration: 2000,
        });
      }).finally(() => {
        this.showName = false;
        this.showMark = false;
      })
    }
  }
};
</script>

<style scoped lang="scss">
.userinfo {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  &_header {
    width: 96%;
    height: auto;
    background-color: #ffffff;
    border-radius: 4px;
    margin: 0 auto;
    padding: 0 20rpx;
    &-item {
      width: 100%;
      height: 60rpx;
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: space-between;
      border-bottom: 1px solid $user-border-bottom-color;
      padding: 50rpx 0;
      &:nth-last-of-type(1) {
        border: none;
      }
      .left {
        font-size: 30rpx;
      }
      .right {
        display: flex;
        align-items: center;
        text {
          color: $user-theme_font_color_info;
          margin-right: 10rpx;
          font-size: 30rpx;
        }
        image {
          width: 60rpx;
          float: left;
          margin-right: 10rpx;
        }
      }
    }
  }
  .editname {
    width: 90%;
    margin: 20rpx auto;
    height: 80rpx;
    font-size: 30rpx;
    color: #000000;
  }
}
.userinfo_gouwoquan {
  width: 96%;
  background-color: #ffffff;
  margin: 30rpx auto 0;
  border-radius: 4px;
  .gouwoquan_header {
    padding: 20rpx 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-weight: 800;
    }
  }
  .items {
    width: 96%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item {
      width: 48%;
      margin-bottom: 20rpx;
      image {
        width: 100%;
      }
      text {
        width: 100%;
        font-size: 28rpx;
      }
    }
  }
}
.gouwoquan_nodata {
  width: 70%;
  padding: 40rpx;
  font-size: 26rpx;
  margin: 0 auto;
  text-align: center;
  color: $user-theme_font_color_info;
}
</style>