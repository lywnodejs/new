<template>
  <view class="services">
    <view class="services_header">
      <image
        src="../../static/icon/logo-gray.png"
        mode="widthFix"
      ></image>
    </view>
    <view class="title">
      狗窝装修，致力于让装修更简单更便宜，同时也给装修行业的从业者们提供一个施展抱负的绝佳平台！如果你是设计师、装修材料供应商或者拥有一技之长的装修工人，在这里你可以直接面向业主客户提供服务并获取收入，得到客户的好评，进而让更多的客户找你合作。
    </view>
    <view class="title2">职责：</view>
    <view class="content">1、根据自己入驻的服务项目为客户提供相应服务</view>
    <view class="content">2、认同并遵守平台的各项管理规定</view>
    <view class="title2">收益：</view>
    <view class="content">1、项目完成并得到客户确认后，你将立即得到相应的回款（除去平台的佣金）</view>
    <view class="title2">申请条件：</view>
    <view class="content">1、完成实名认证</view>
    <view class="content">2、开通服务项目需要交纳保证金（保证金可退）</view>
    <view class="addservice">
      <u-button
        type="primary"
        plain
        @click="addService()"
      >添加服务项目</u-button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'services',
  methods: {
    addService () {
      this.$yrouter.push({
        path: '/pages/services/selectService'
      });
    }
  }
}
</script>

<style lang="scss">
.services {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  .services_header {
    image {
      width: 160rpx;
    }
    width: 160rpx;
    margin: 0 auto;
    padding-top: 40rpx;
  }
  .title {
    width: 90%;
    margin: 30rpx auto;
    font-size: 26rpx;
    color: $user-theme_font_color_info;
  }
  .title2 {
    width: 90%;
    margin: 30rpx auto 0;
    font-size: 26rpx;
    color: $user-theme_font_color_info;
  }
  .content {
    width: 90%;
    margin: 0 auto;
    font-size: 26rpx;
    color: $user-theme_font_color_info;
  }
  .addservice {
    width: 90%;
    margin: 30rpx auto;
  }
}
</style>