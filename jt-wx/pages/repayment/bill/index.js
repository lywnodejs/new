// pages/order/detail/index.js
import fetch from '../../../utils/fetch'

Page({

  data: {
    titles: ['待还款', '已还记录'],
    index: 0,
    bill: {},
    keys: ['waitRepayInfos', 'repaidInfos'],
    orderId: '',
    productId:'',
    checkuseridcar:false,
    mustTocheck:false
  },


  onLoad: async function (options) {
    const {
      orderId,
    } = options
    this.setData({
      orderId,
    })
  },

  onShow: function () {
    this.fetch()
  },

  async fetch() {
    try {
      const {
        code,
        data
      } = await fetch('bank.api.read.personal.repaymentreadservice.billdetail', {
        orderId: this.data.orderId
      })
      if (code === 0) {
        this.setData({
          bill: data,
          productId:data.productId
        })
      }
    } catch (error) {

    }
  },

  onTab({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    this.setData({
      index
    })
  },

  concatSession(url){
    if(url.indexOf('?') < 0){//没有参数
      return `${url}?sessionId=${getApp().getSessionId()}`
    } else {
      return `${url}&sessionId=${getApp().getSessionId()}`
    }
  },
  onClose() {
    if(this.data.mustTocheck){
      return
    }
    this.setData({checkuseridcar: false})
  },
  onDefine() {
    this.setData({checkuseridcar: false, })
    return wx.navigateTo({
      url: `/pages/apply/idcertificate/index?type=1`
    })
  },

  toAgreement(){
    let targetUrl = this.data.bill.protocolDetailUrl
    targetUrl = `${targetUrl}?orderId=${this.data.orderId}&productId=${this.data.productId}&type=2`
    console.log(this.concatSession(targetUrl));
    wx.navigateTo({
      url: `/pages/web/index?url=${encodeURIComponent(this.concatSession(targetUrl))}`,
    });
    // 协议点击跳转
  },

  async onApply() {
    const {
      code,
      data,
      desc
    } = await fetch('bank.api.read.personal.repaymentreadservice.repaymentcheck', {
      orderId: this.data.orderId
    })
    if (code === 0) {
      wx.navigateTo({
        url: `/pages/repayment/index/index?orderId=${this.data.orderId}&repaymentType=${this.data.bill.orderInfo.repayType}`,
      })
    }
      // 异常弹窗提示
      if(code == -90000){
        this.setData({checkuseridcar: true, desc,mustTocheck:false})
      }
  }
})