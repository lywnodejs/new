// pages/my/settings/index.js
const fetch = require("../../../utils/fetch.js");
const targets = {
  'setting': '/pages/my/settings/index',
  'coupon': '/pages/my/ticket/index',
  'account': '/packageB/pages/account/index/index'
}
Page({

  /**
   * Page initial data
   */
  data: {
    settings: [],
    show: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function () {
    // console.log(JSON.parse(settings))
    let settings = wx.getStorageSync('settings')
    console.log(settings);
    if(settings){
      this.setData({settings: settings})
    }
  },

  onShow: function () {

  },

  onExit() {
    this.setData({show: true})
  },

    async onDefine(isLoading = true) {
      try {
        const {
          code,
          data
        } = await fetch('bank.api.write.standard.userpersonwriteservice.logout', {
          isLoading
        })
        if (code === 0) {
          getApp().setSessionId('')
          wx.navigateBack()
          this.onClose()
        }
      } catch (error) {
        console.log(error)
      }
    },
  onClose() {
    this.setData({show: false})
  },

  onClick({detail: {targetType, targetUrl}}) {
    if (targets[targetType]) {
      return wx.navigateTo({
        url: targets[targetType],
      })
    }
    if (targetType === 'html' && !!targetUrl) {
      wx.navigateTo({
        url: `/pages/web/index?url=${targetUrl}`,
      })
    }
  }
})