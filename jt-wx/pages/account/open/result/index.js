// pages/account/open/result/index.js
const fetch = require("../../../../utils/fetch.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: -1,
    cardNo: '',
    bankInfo: {},
    msg: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      cardNo: options.cardNo,
      msg: options.msg || '系统繁忙，请稍后重试'
    })
    if (options.type == 1) {
      this.fetch()
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

  },

  async fetch() {
    const { code, data } = await fetch(
      "bank.api.read.personal.seceleaccpersonalreadservice.openseceleaccsuccess"
    )
    if (code === 0) {
      this.setData({bankInfo: data})
    }
  },

  onReopen(e) {
    wx.navigateBack({
      delta: 1,
    })
  },

  onComplete(e) {
    wx.navigateBack({
      delta: 2,
    })
  },
  
  onNav() {
    if (this.data.type == 1) {
      return this.onComplete()
    }

    if (this.data.type == 0) {
      this.onReopen()
    }
  }
})
