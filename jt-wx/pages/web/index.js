// pages/web/index.js
Page({

  data: {
    url: ''
  },

  onLoad: function (options) {
    console.log(options);
    if (options.url) {
      this.setData({url: decodeURIComponent(options.url)})
      console.log(this.data.url);
    }
  },

  onShareAppMessage: function (options) {
    const webShare = this.data.webShare || {
      title:'客银宝',
      path:'/pages/index/index',
      imageUrl:'/image/logo.png',
    }
    return {
      ...webShare
    }
  },

  onMessage({
    detail: {
      data
    }
  }) {
    if (this._isNotEmptyArray(data)) {
      const webShareMsgs = data.filter(item => {
        return Object.prototype.toString.call(item) === '[object Object]' && item.msgType !== undefined && item.msgType == 'webshare'
      })
      if (this._isNotEmptyArray(webShareMsgs)) {
        const webShare = webShareMsgs[webShareMsgs.length - 1]
        this.setData({
          webShare
        })
      }
    }
  },

  onWebLoad() {

  },

  onWebError() {

  },

  _isNotEmptyArray(data) {
    return data != null && data != undefined && Array.isArray(data) && data.length > 0
  }
})