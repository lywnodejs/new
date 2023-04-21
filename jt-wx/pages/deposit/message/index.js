// pages/deposit/message/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    valueDate:'',
    expiryDate:'',
    eleCardNo:'',
    moneyVal:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options['valueDate'] || !options['expiryDate'] || !options['eleCardNo'] || !options['moneyVal']){
      wx.showToast({
        title: '未获取到购买相关信息',
        icon: 'none'
      })
      this.doneBack()
      return
    }
    this.setData({
      valueDate:options['valueDate'],
      expiryDate:options['expiryDate'],
      eleCardNo:options['eleCardNo'],
      moneyVal:options['moneyVal']
    })
  },
  // 完成返回跳转
  doneBack(){
    wx.navigateBack({
      delta: 2,
    })
  },
  // 我的存款列表页跳转
  toOrder(){
    wx.navigateTo({
      url: '/pages/my/depositList/index',
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