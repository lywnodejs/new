// pages/account/result/index.js
import fetch from "../../../utils/fetch";

const app = getApp();
Page({

  data: {
    type: 0,
    amount: 0,
    orderNum: "",
    desc: ''
  },

  onLoad: function (options) {
    let { type, amount, orderNum, desc ,repaymentType} = options;
    if (options.type) {
      this.setData({ type, amount, orderNum, desc,repaymentType });
    }
  },

  toAccount: async function () {
    const { code, data } = await fetch(
      "bank.api.read.personal.loanorderpersonalreadservice.orderlist",
      {
        querType: "1",
      }
    );
    if (code == 0 && Array.isArray(data.orderInfos) && data.orderInfos.length > 0) {
      const hasPendingOrders = data.orderInfos.some((item,index,array)=>{
        return item.status == 8 || item.status == 9
      })
      if(hasPendingOrders){
        app.globalData.active = 0;
      }
    
    }
    wx.navigateTo({ url: "/pages/order/index/index" });
  },
  toBack: function () {
    if (this.data.type!=2) {
      wx.switchTab({ url: "/pages/index/index" });
    } else {
      let repaymentType = this.data.repaymentType;
      if(repaymentType == 1){
        repaymentType = 6
      }
      if(repaymentType == 6){
        repaymentType = 1
      }
      wx.redirectTo({
        url: `/pages/repayment/index/index?orderId=${this.data.orderNum}&repaymentType=${repaymentType}`,
      });
    }
  },




 

});
