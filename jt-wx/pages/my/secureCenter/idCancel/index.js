// pages/my/secureCenter/idCancel/index.js
const fetch = require("../../../../utils/fetch.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:  function (options) {
    this.fetch()
  },
  async fetch (isLoading = true) {
    try {
      const {code, data} = await fetch('bank.api.read.personal.seceleaccpersonalreadservice.elecaccountinfo', {isLoading})
      let state = {triggered: false}
      if (code === 0) {
        console.log(code);
        this.setData({
          isEmpty:data.status === 1
        })
      }
    } catch (error) {
      console.log(error)
    }
  },
  toCard(){
    wx.navigateTo({
      url: '/pages/my/secureCenter/idCancel/detail/index',
    })
  },
  toCard2(){
    wx.navigateTo({
      url: '/pages/my/secureCenter/idCancel/cloneId/index',
    })
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