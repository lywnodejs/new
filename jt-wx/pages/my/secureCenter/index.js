// pages/my/secureCenter/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verified:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      verified:options.verified
    })
  },
  toDetail(){
    // return wx.navigateTo({
    //   url: `/pages/withdraw/face/index?bizType=open_transaction&redirect=${encodeURIComponent('/packageB/pages/detail/index')}`,
    // })
      if( this.data.verified!=1){
      wx.showToast({
        title: '请先进行实名认证',
        icon:'none'
      })
      return 
    }
    wx.navigateTo({
      url: '/packageB/pages/detail/index',
    })
  },
  toIdCancel(){
    if( this.data.verified!=1){
      wx.showToast({
        title: '请先进行实名认证',
        icon:'none'
      })
      return 
    }
    wx.navigateTo({
      url: '/pages/my/secureCenter/idCancel/index',
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