<template>
  <view class="addService">
    <view class="title">
      <text>标题</text>
      <input
        type="text"
        v-model="title"
        placeholder="请输入标题"
      />
    </view>
    <view class="guige">
      <view class="guige_title">
        规格
      </view>
      <view
        class="guige_content"
        v-for="(item,index) in guigeList"
      >
        <u-upload
          :multiple='false'
          :action="uploadUrl"
          :show-upload-list='true'
          :header='uploadHeader'
          :max-count="1"
          :before-upload='beforeUpload'
          :show-progress='false'
          @on-success='(data)=>{successUpload(data,index)}'
        >
        </u-upload>
        <view class="right">
          <input
            type="text"
            v-model="item.skuName"
            placeholder="规格名称"
          />
          <view style="margin-top: 44rpx;">
            <input
              style="width:160rpx;float: left;"
              type="number"
              v-model="item.price"
              placeholder="价格"
            />
            <text>元/㎡</text>
          </view>
        </view>
        <u-button
          size="mini"
          type='error'
          v-show="index!==0"
          @click="removeMore(index)"
        >
          删除
        </u-button>
      </view>
      <u-button
        style="margin-left:10rpx"
        size="mini"
        type='primary'
        v-show="showAddMore"
        @click="addMore()"
      >
        添加更多
      </u-button>
    </view>
    <view class="html">
      <jinEdit
        placeholder="点击编辑图文介绍，可以点击按钮添加图片/视频"
        @editOk="editOk"
        :uploadFileUrl="uploadUrl"
        :header='uploadHeader'
      ></jinEdit>
    </view>
  </view>
</template>
<script>
import { VUE_APP_API_URL } from "@/config";
import { mapGetters, mapMutations } from 'vuex'
import jinEdit from '../../components/jin-edit/jin-edit.vue';
import cookie from "@/utils/store/cookie";
const token = cookie.get('login_status');
export default {
  name: 'addService',
  computed: mapGetters(["userInfo"]),
  data: function () {
    return {
      uploadUrl: VUE_APP_API_URL + '/api/qiNiuContent',
      guigeList: [{
        specPic: '',
        skuName: '',
        price: ''
      }],
      showAddMore: true,
      uploadHeader: {
        Authorization: "Bearer " + token
      },
      content: '',
      title: '',
    }
  },
  components: {
    jinEdit
  },
  onShow () {
    uni.setNavigationBarTitle({
      title: this.$yrouter.currentRoute.query.name
    });
  },
  methods: {
    ...mapMutations(['addServiceData']),
    // 点击发布
    editOk (res) {
      if (res.html !== 0) {
        let html = res.html.split('<')
        let copyHtml = '';
        html.map((item, index) => {
          if (item.indexOf('视频') !== -1) {
            let txt = ''
            copyHtml += '<video src="' + item.split('视频-')[1]
            return item = txt;
          } else {
            if (item !== '') {
              copyHtml += '<' + item
            }

          }
        })
        this.content = copyHtml;
      }
      let guigeList = this.guigeList[this.guigeList.length - 1];
      if (!guigeList.skuName || !guigeList.price || !guigeList.specPic || this.content === '<p style="text-align: center;"><br></p>' || this.title === "") {
        uni.showToast({
          icon: 'none',
          title: '输入完整后再保存',

        })
        return;
      }
      this.guigeList.map(item => {
        item.serviceId = this.$yrouter.currentRoute.query.goodsId;
      })
      let params = {
        title: this.title,
        workerId: this.userInfo.uid,
        content: this.content,
        goodsId: this.$yrouter.currentRoute.query.goodsId,
        cateId: this.$yrouter.currentRoute.query.cateId,
        yxWorkerServicesSpecs: this.guigeList
      }
      this.addServiceData(params)
      this.$yrouter.push({
        path: '/pages/services/selectCity'
      })

    },
    addMore () {
      let test = this.guigeList[this.guigeList.length - 1];
      if (!test.skuName || !test.price || !test.specPic) {
        uni.showToast({
          icon: 'none',
          title: '上一个输入完整后再添加更多',

        })
        return;
      }
      this.guigeList.push({
        specPic: '',
        skuName: '',
        price: ''
      })
      if (this.guigeList.length == 5) {
        this.showAddMore = false;
      }
    },
    removeMore (index) {
      this.guigeList.splice(index, 1);
    },
    beforeUpload () {
      uni.showLoading({
        title: '上传中'
      })
    },
    finallyUpload () {
      uni.hideLoading()
    },
    successUpload (data, index) {
      if (data && Array.isArray(data.data) && data.data.length !== 0) {
        this.guigeList[index].specPic = data.data[0]
      }
      console.log(this.guigeList);
    },
  }
}
</script>
<style lang="scss" scoped>
.addService {
  width: 96%;
  height: 80rpx;
  margin: 0 auto;
  border-bottom: 1px solid #e1dee3;
  .title {
    width: 100%;
    height: 80rpx;
    font-size: 34rpx;
    display: flex;
    align-items: center;
    input {
      font-size: 30rpx;
      margin-left: 30rpx;
    }
  }
  .guige {
    width: 100%;
    height: auto;
    .guige_title {
      font-size: 34rpx;
      margin-top: 18rpx;
    }
    .guige_content {
      display: flex;
      margin-top: 20rpx;
      margin-bottom: 30rpx;
    }
  }
  .right {
    width: calc(100% - 140rpx);
    margin-left: 30rpx;
    padding-top: 40rpx;
  }
  .slot-btn {
    width: 140rpx;
    height: 140rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    background-color: $user-theme_font_backage_info;
    text-align: center;
    border-radius: 4px;
    overflow: hidden;
    padding: 10rpx;
    box-sizing: border-box;
    color: $user-theme_font_color_info;
    font-size: 26rpx;
  }
  .html {
    border-top: 1px solid #e1dee3;
    margin-top: 30rpx;
  }
  .uploadImg {
    position: absolute;
  }
}
</style>