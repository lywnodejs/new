// pages/my/messageCenter/index.js
const app = getApp();
const fetch = app.require("utils/fetch");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  async getList(isLoading=true){
    try {
      const {
        code,
        data,
      } = await fetch("bank.api.read.messagelogreadservice.usermessagelist", {
        isLoading,
      });
      if (code === 0) {
      this.setData({
        list:data
      });
    }
    } catch (error) {
      console.log(error);
    }
  },
  
  toMessage(e){
    console.log(e.currentTarget.dataset.item)
    wx.setStorage({
      key: "messagedata",
      data: e.currentTarget.dataset.item,
    });
    wx.navigateTo({
      url: '/pages/my/messageCenter/detail/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getList()
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