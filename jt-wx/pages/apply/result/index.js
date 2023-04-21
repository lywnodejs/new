// pages/apply/result/index.js
Page({
  /**
   * Page initial data
   */
  data: {
    platform: "ios",
  },
  navLeftClick: function () {
    wx.switchTab({url: '/pages/index/index'})
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    try {
      const res = wx.getSystemInfoSync();
      this.setData({ platform: res.platform });
    } catch (e) {}
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {},

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {},

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {},

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {},

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {},

  /**
   * Called when user click on the top right corner to share
   */
});
