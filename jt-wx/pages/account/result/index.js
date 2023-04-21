// pages/account/result/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    success: false,
    type: 'in',
    amount: 0,
    msg: '',
    show:false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const type = options.type || 'in'
    const success = options.success || false
    const amount = options.amount || 0
    const msg = options.msg || '系统繁忙，请稍后再试'
    const show = true
    this.setData({type, success, amount, msg, show})
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  onAgain() {
    wx.redirectTo({
      url: '/packageB/pages/account/transfer/index?type=' + this.data.type,
    })
  },

  onComplete() {
    if (this.data.success) {
      wx.navigateBack()
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }
})