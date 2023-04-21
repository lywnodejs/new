<template>
  <view class="order-details">
    <!-- 给header上与data上加on为退款订单-->
   
  </view>
</template>

<script>
  import OrderGoods from "@/components/OrderGoods";
  import {
    orderDetail
  } from "@/api/order";
  import Payment from "@/components/Payment";
  import {
    isWeixin,
    copyClipboard
  } from "@/utils";
  import {
    mapGetters
  } from "vuex";
  import {
    cancelOrderHandle,
    takeOrderHandle,
    delOrderHandle,
    payOrderHandle,
  } from "@/libs/order";
  // import { wechatEvevt } from "@/libs/wechat";

  const NAME = "OrderDetails";

  export default {
    name: NAME,
    components: {
      OrderGoods,
      Payment,
    },
    data: function () {
      return {
        offlinePayStatus: 2,
        orderTypeName: "普通订单",
        orderTypeNameStatus: true,
        offlineStatus: true,
        id: "",
        orderInfo: {
          _status: {},
        },
        status: {},
        pay: false,
        payType: ["yue", "weixin"],
        from: this.$deviceType,
        system_store: {},
        mapKay: "",
        mapShow: false,
        isIntegral: false
      };
    },
    computed: {
      refundOrder() {
        return this.orderInfo.refund_status > 0;
      },
      ...mapGetters(["userInfo"]),
    },
    onShow() {
      this.id = this.$yroute.query.id;
      this.getDetail();
    },
    mounted: function () {
      this.id = this.$yroute.query.id;
      // this.getDetail();
    },
    methods: {
      copyClipboard,
      goGoodsReturn(orderInfo) {
        this.$yrouter.push({
          path: "/pages/order/GoodsReturn/index",
          query: {
            id: orderInfo.orderId,
          },
        });
      },
      goGroupRule(orderInfo) {
        this.$yrouter.push({
          path: "/pages/activity/GroupRule/index",
          query: {
            id: orderInfo.pinkId,
          },
        });
      },
      //拨打电话
      telPhone(phoneNumber) {
        uni.makePhoneCall({
          phoneNumber: phoneNumber,
          fail() {
            console.log("取消拨打");
          }
        });
      },
      showChang: function (data) {
        // 这里判断是不是微信小程序
        this.$yrouter.push({
          path: "/pages/map/index",
          query: data,
        });
        // if (isWeixin()) {
        //   let config = {
        //     latitude: this.system_store.latitude,
        //     longitude: this.system_store.longitude,
        //     name: this.system_store.name,
        //     address: this.system_store.address
        //   };
        // } else {
        //   if (!this.mapKey)
        //     uni.showToast({
        //       title: "暂无法使用查看地图，请配置您的腾讯地图key",
        //       icon: "none",
        //       duration: 2000
        //     });
        //   return;
        //   this.mapShow = true;
        // }
      },
      goBack() {
        if (this.name === "MyOrder") {
          this.$yrouter.back();
          return;
        } else {
          console.log(this);
          this.$yrouter.replace({
            path: "/pages/order/MyOrder/index",
          });
          return;
        }
      },
      cancelOrder() {
        cancelOrderHandle(this.orderInfo.orderId)
          .then(() => {
            setTimeout(() => this.goBack(), 300);
          })
          .catch(() => {
            this.getDetail();
          });
      },
      takeOrder() {
        takeOrderHandle(this.orderInfo.orderId).finally(() => {
          this.getDetail();
        });
      },
      delOrder() {
        delOrderHandle(this.orderInfo.orderId).then(() => {
          setTimeout(() => this.goBack(), 300);
        });
      },
      setOfflinePayStatus: function (status) {
        var that = this;
        that.offlinePayStatus = status;
        if (status === 1 && that.orderTypeNameStatus === true) {
          that.payType.push("offline");
        }
      },
      getOrderStatus: function () {
        let orderInfo = this.orderInfo || {},
          _status = orderInfo._status || {
            _type: 0
          },
          status = {};
        let type = parseInt(_status._type),
          delivery_type = orderInfo.deliveryType,
          seckill_id = orderInfo.seckillId ? parseInt(orderInfo.seckillId) : 0,
          bargain_id = orderInfo.bargainId ? parseInt(orderInfo.bargainId) : 0,
          combination_id = orderInfo.combinationId ?
          parseInt(orderInfo.combinationId) :
          0;
        status = {
          type: type,
          class_status: 0,
        };
        if (type == 1 && combination_id > 0) {
          status.type = 6;
          status.class_status = 1;
        } //查看拼团
        if (type == 2 && delivery_type == "express") status.class_status = 2; //查看物流
        if (type == 2) status.class_status = 3; //确认收货
        if (type == 4 || type === 0) status.class_status = 4; //删除订单
        if (
          !seckill_id &&
          !bargain_id &&
          !combination_id &&
          (type == 3 || type == 4)
        )
          status.class_status = 5; //再次购买
        if (type == 9) {
          //线下付款
          status.class_status = 0;
          this.offlineStatus = false;
        }
        this.status = status;
      },
      getDetail() {
        const id = this.id;
        if (!id) {
          uni.showToast({
            title: "订单不存在",
            icon: "none",
            duration: 2000,
          });
          return;
        }
        orderDetail(id)
          .then((res) => {
            this.orderInfo = res.data;
            this.getOrderStatus();
            if (this.orderInfo.combinationId > 0) {
              this.orderTypeName = "拼团订单";
              this.orderTypeNameStatus = false;
            } else if (this.orderInfo.bargainId > 0) {
              this.orderTypeName = "砍价订单";
              this.orderTypeNameStatus = false;
            } else if (this.orderInfo.seckillId > 0) {
              this.orderTypeName = "秒杀订单";
              this.orderTypeNameStatus = false;
            }
            this.isIntegral = res.data.payType == 'integral'
            if (this.isIntegral) {
              this.orderTypeName = "积分兑换订单";
              this.orderTypeNameStatus = false;
            }

            this.system_store = res.data.systemStore || {};
            this.mapKey = res.data.mapKay;
            this.setOfflinePayStatus(this.orderInfo.offlinePayStatus);
          })
          .catch((err) => {
            uni.showToast({
              title: err.response.data.msg,
              icon: "none",
              duration: 2000,
            });
          });
      },
      async toPay(type) {
        var that = this;
        console.log(type, "支付方式");
        await payOrderHandle(this.orderInfo.orderId, type, that.from);
        that.getDetail();
      },
    },
  };
</script>

<style scoped lang="less">
</style>
