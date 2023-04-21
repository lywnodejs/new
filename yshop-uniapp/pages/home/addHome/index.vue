<template>
  <view class="addHome">
    <view class="addHome_info">基本信息</view>
    <view class="addHome_form">
      <view class="addHome_form_item">
        <view class="addHome_form_item-left">名称</view>
        <view class="addHome_form_item-right">
          <input
            v-model="formData.name"
            type="text"
            placeholder="输入我的家的名称"
            maxlength="15"
          />
        </view>
      </view>
      <view class="addHome_form_item">
        <view class="addHome_form_item-left">建筑面积</view>
        <view
          class="addHome_form_item-right"
          style="display: flex"
        >
          <input
            v-model="formData.roomArea"
            type="number"
            placeholder="输入面积"
            maxlength="15"
          />
          <text style="margin-left: 10rpx">㎡</text>
        </view>
      </view>

      <view class="addHome_form_item">
        <view class="addHome_form_item-left">类型</view>
        <view class="addHome_form_item-right">
          <picker
            @change="roomTypeChange"
            range-key="name"
            :range="array"
          >
            <view
              style="color: rgb(109, 109, 109)"
              v-show="formData.roomType === ''"
            >
              <text>选择房屋类型 <text class="iconfont">&#xe608;</text></text>
            </view>
            <view
              v-show="formData.roomType !== ''"
              class="uni-input"
            >
              {{ array[formData.roomType].name }}
            </view>
          </picker>
        </view>
      </view>

      <view
        class="addHome_form_item"
        style="border-bottom: none"
      >
        <view class="addHome_form_item-left">位置</view>
        <view
          class="addHome_form_item-right"
          @click="toPageMap()"
        >
          <view style="color: rgb(109, 109, 109); width: 550rpx">
            <text
              v-if="formData.villageName !== null"
              class="addHome_form_item-right-info"
            >{{ formData.villageName }}</text>
            <text v-else>选择小区<text class="iconfont">&#xe608;</text></text>
          </view>
        </view>
      </view>
      <view class="addHome_form_item_info">
        <textarea
          v-model="formData.mergerName"
          :auto-height="true"
          placeholder="输入详细地址，如24栋1单元72号"
        />
      </view>
    </view>
    <view class="addHome_info">其他</view>
    <view class="addHome_form">
      <view class="addHome_form_item">
        <view class="addHome_form_item-left">最喜欢的风格</view>
        <view class="addHome_form_item-right">
          <picker
            @change="roomStyleChange"
            :value="fomrdata.roomStyle"
            :range="RoomStyle"
          >
            <view
              style="color: rgb(109, 109, 109)"
              v-show="formData.roomStyle === ''"
            >
              <text>选择风格 <text class="iconfont">&#xe608;</text></text>
            </view>
            <view
              v-show="formData.roomStyle !== ''"
              class="uni-input"
            >
              {{ formData.roomStyle }}
            </view>
          </picker>
        </view>
      </view>

      <view class="addHome_form_item">
        <view class="addHome_form_item-left">预算</view>
        <view class="addHome_form_item-right">
          <picker
            @change="budgetChange"
            :value="fomrdata.budget"
            :range="RoomBudget"
          >
            <view
              style="color: rgb(109, 109, 109)"
              v-show="formData.budget === ''"
            >
              <text>选择预算 <text class="iconfont">&#xe608;</text></text>
            </view>
            <view
              v-show="formData.budget !== ''"
              class="uni-input"
            >
              {{ formData.budget }}
            </view>
          </picker>
        </view>
      </view>
    </view>

    <view class="addHome_infoTxt">
      请放心填写，我们将全力保证您的信息安全，除您选择的服务人员外，您的信息不会透漏给其它任何人、第三方装修公司以及材料供应商
    </view>

    <button
      type="default"
      class="addHome_form_submit"
      @click="saveHome()"
    >
      保存
    </button>
    <button
      v-if="homeData!==null"
      type="warn"
      @click="deleteHome()"
      class="addHome_form_submitDelete"
    >
      删除
    </button>

  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getLocation } from "@/utils/index";
import { addUserMyHome, editUserMyHome, deleteUserMyHome } from "@/api/store";
import { RoomType, RoomStyle, RoomBudget } from "@/api/constant";
const chooseLocation = requirePlugin("chooseLocation"); // map插件对象

export default {
  computed: {
    ...mapState(["userInfo", 'userMyhome']),
  },
  data () {
    return {
      formData: {
        name: "", // 名称
        roomArea: "", //面积
        roomType: "", // 类型
        roomStyle: "", // 风格
        budget: "", // 预算
        area: null,
        villageName: null, // 小区名称
        mergerName: null, // 详细地址
        province: null,
        city: null,
        lat: null,
        lng: null,
      },
      array: RoomType,
      RoomStyle: RoomStyle,
      RoomBudget: RoomBudget,
      show: true,
      homeData: null,//编辑的当前家数据
    };
  },
  onShow () {
    if (this.$yrouter.currentRoute.query.id !== undefined) {
      this.homeData = this.userMyhome.find(item => {
        return item.id === Number(this.$yrouter.currentRoute.query.id)
      })
      console.log(this.homeData)
      uni.setNavigationBarTitle({
        title: '编辑-' + this.homeData.name
      });
      this.formData = {
        ...this.homeData
      }
    }
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    if (location) {
      this.formData.villageName = location.name; // 小区名称
      this.formData.province = location.province; // 省份
      this.formData.city = location.city; // 市
      this.formData.area = location.district; // 区县
      this.formData.lat = location.latitude; // 经度
      this.formData.lng = location.longitude; // 纬度
    }
  },
  onUnload () {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null);
  },
  methods: {
    ...mapActions(["setuserMyhome"]),
    toPageMap () {
      getLocation(function (locationData) {
        const key = "FKABZ-WKFCX-4ML4D-TH5QK-C2KTH-MFBIQ"; //使用在腾讯位置服务申请的key
        const referer = "狗窝装修"; //调用插件的app的名称
        const location = JSON.stringify({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        });
        const category = "小区";
        wx.navigateTo({
          url:
            "plugin://chooseLocation/index?key=" +
            key +
            "&referer=" +
            referer +
            "&location=" +
            location +
            "&category=" +
            category,
        });
      });
    },
    roomTypeChange (e) {
      this.formData.roomType = Number(e.detail.value);
    },
    roomStyleChange (e) {
      this.formData.roomStyle = this.RoomStyle[Number(e.detail.value)];
    },
    budgetChange (e) {
      this.formData.budget = this.RoomBudget[Number(e.detail.value)];
    },
    saveHome () {
      uni.showLoading({
        title: '保存中'
      })
      let params = {
        ...this.formData,
        uid: this.userInfo.uid,
      };
      if (this.homeData !== null) {
        editUserMyHome(params).then(res => {
          if (res.status === 200) {
            uni.showToast({
              title: "操作成功!",
              icon: "ok",
              duration: 2000,
            });
            this.setuserMyhome(); //更新我的家
            this.$yrouter.switchTab("/pages/home/index");
          } else {
            uni.showToast({
              title: res.msg,
              icon: "error",
              duration: 2000,
            });
          }
        }).finally(() => {
          uni.hideLoading();
        })
        return
      }
      addUserMyHome(params).then((res) => {
        if (res.status === 200) {
          uni.showToast({
            title: "操作成功!",
            icon: "ok",
            duration: 2000,
          });
          this.setuserMyhome(); //更新我的家
          this.$yrouter.switchTab("/pages/home/index");
        } else {
          uni.showToast({
            title: res.msg,
            icon: "error",
            duration: 2000,
          });
        }
      }).finally(() => {
        uni.hideLoading();
      })
    },
    // 删除我的家
    deleteHome () {
      uni.showModal({
        title: '确认删除？',
        content: '删除后不可恢复！',
        confirmText: '确定',
        success: () => {
          let params = {
            id: this.homeData.id
          }
          deleteUserMyHome(params).then(res => {
            if (res.state === 200) {
              uni.showToast({
                title: "操作成功!",
                icon: "ok",
                duration: 2000,
              });
              this.setuserMyhome(); //更新我的家
              this.$yrouter.switchTab("/pages/home/index");
            }
          })
        }
      })
    }
  },
};
</script>

<style scoped lang="scss">
.addHome {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background-color: #f2f2f2;
  &_info {
    padding-left: 30rpx;
    line-height: 80rpx;
    width: 100%;
    height: 80rpx;
    color: #82848a;
    font-size: 32rpx;
  }
  &_form {
    width: 100%;
    background: #ffffff;
    padding-left: 30rpx;
    &_item {
      box-sizing: border-box;
      border-bottom: 1px solid $user-theme_font_backage_info;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 100rpx;
      font-size: 36rpx;
      text-align: right;
      &-left {
        white-space: nowrap;
      }
      &-right {
        display: bol;
        margin-right: 30rpx;
        &-info {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          float: right;
          white-space: nowrap;
        }
      }
    }
    &_item_info {
      text-align: left;
      font-size: 36rpx;
      padding-top: 20rpx;
      padding-bottom: 20rpx;
      margin-bottom: 20rpx;
    }
  }
  &_infoTxt {
    font-size: 30rpx;
    padding: 20rpx;
    color: $user-theme_font_color_info;
  }
  &_form_submit {
    width: 90%;
    font-size: 36rpx;
    margin: 0 auto;
    color: #ffffff;
    background-color: $user-theme_color;
  }
  &_form_submitDelete {
    width: 90%;
    margin: 20px auto;
  }
}
</style>
