<template>
  <view class="selectCity">
    <view class="headerC">
      <view class="title2">说明：</view>
      <view class="content">1、请确保你选择的位置能提供服务，如果你选择的服务范围与实际不符，导致客户投诉的，平台会有 <text>相应处罚</text></view>
      <view class="content">2、开通服务项目需要进行实名认证和缴纳保证金，如果您还没有完成实名认证并缴纳保证金，服务默认为<text>关闭状态</text>，你可以随后完成实名认证/缴纳保证金后在【个人中心】-【我的服务项目】中开启相应服务项目，立即接单开始赚钱</view>
    </view>
    <view
      class="select"
      v-if="showtrees"
    >
      <cityTree
        :searchIf="false"
        :trees='trees'
        :props='cityprops'
        :isCheck='true'
        v-slot:default="{item}"
        @sendValue='gettreeVal'
      >
        <view class="content-item">
          <view style="margin-left:20rpx;">{{item.n}}</view>
        </view>
      </cityTree>
    </view>
  </view>
</template>
<script>
import cityTree from '../../components/cityTree'
import { getCity } from '@/api/store'
import { addService } from '@/api/activity';
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'selectCity',
  components: {
    cityTree
  },
  computed: {
    ...mapState(['serviceData'])
  },
  created () {
    uni.showLoading();
    getCity().then(res => {
      uni.hideLoading();
      function city (data) {
        data.map(item => {
          item.id = item.cityId;
          if (item.c.length !== 0) {
            city(item.c)
          }
        })
      }
      city(res.data)
      this.trees = res.data;
      this.showtrees = true
      console.log(this.serviceData);
    })
  },
  data: function () {
    return {
      showtrees: false,
      trees: [],
      cityprops: {
        label: 'n',
        children: 'c',
        multiple: true,
      }
    }
  },
  methods: {
    ...mapMutations(['addServiceData']),
    gettreeVal (data, type) {
      if (type === 'back') {
        let params = {
          ...this.serviceData,
          areaCode: data[0].areaCode,
          cityId: data[0].cityId,
          name: data[0].n,
          mergerName: data[0].mergerName
        }
        uni.showLoading();
        addService(params).then(res => {
          uni.hideLoading();
          if (res.status === 200) {
            this.addServiceData(null);
            this.$yrouter.push({
              path: 'pages/user/myOrder/ordering'
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="scss">
page {
  overflow: hidden;
}
.selectCity {
  overflow: hidden;
  .headerC {
    width: 100%;
    height: 300rpx;
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
      text {
        color: $user-theme_color;
        font-weight: 800;
      }
    }
  }

  .select {
    width: 100%;
    margin-top: 30rpx;
  }
}
</style>