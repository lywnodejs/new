// pages/apply/uploadfile/video-preview/index.js
Page({


  data: {
    videoUrl: ''
  },


  onLoad: function ({
    url
  }) {
    let videoUrl = decodeURIComponent(url)
    console.log('视频预览', videoUrl)
    this.setData({
      videoUrl
    })
  },

  onClose() {
    wx.navigateBack()
  },


  onReady: function () {

  },


  onShow: function () {

  },


  onHide: function () {

  },


  onUnload: function () {

  },




})