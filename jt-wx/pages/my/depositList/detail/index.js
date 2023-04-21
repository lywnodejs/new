const app = getApp();
const fetch = app.require("utils/fetch");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    orderId:'',
    productId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options['orderId'] || options['orderId'] == 'null') {
      wx.showToast({
        icon: 'none',
        title: '获取详情失败，请重试'
      })
      wx.navigateTo({
        url: '/pages/my/depositList/index'
      })
    } else {
      this.setData({
        orderId:options['orderId'],
        productId:options['productId']
      })
      this.fetch(options)
    }
  },
  toProtocrt(){
     let url =  `/pages/web/index?orderId=${this.data.orderId}&productId=${this.data.order.productId}&type=1`
     let newurl = this.concatSession(url)
     wx.navigateTo({
       url: encodeURIComponent(newurl),
     })
  },

  async fetch(options) {
    try {
      const {
        code,
        data,
      } = await fetch("bank.api.read.homepageproductsservice.depositproductorderdetail", {
        orderId:options.orderId
      });

      if (code === 0) {
        let order = data
       order['depositAmount'] = options['depositAmount']
       order['prospectiveYield'] = options['prospectiveYield']
       order['expireTime'] = options['expireTime']
       order['productName'] = options['productName']
        this.setData({
          order
        })
      }
    } catch (error) {
      console.log(error);
    }
  },

  toAdvance() {
    wx.navigateTo({
      url: `/packageB/pages/redemption/index?depositAmount=${this.data.order.depositAmount}&prospectiveYield=${this.data.order.prospectiveYield}&orderId=${this.data.order.orderId}&productId=${this.data.order.productId}`,
    })
  },
  concatSession(url){
    if(url.indexOf('?') < 0){//没有参数
      return `${url}?sessionId=${getApp().getSessionId()}`
    } else {
      return `${url}&sessionId=${getApp().getSessionId()}`
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})