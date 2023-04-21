// pages/apply/protocol/index.js
Page({

  data: {
    richText:''
  },

  onLoad: function (options) {
    let index = options.index;
    let pages = getCurrentPages();
    let prePage = pages[pages.length-2]
    let protocol = prePage.data.productInfo.protocols[index];
    this.setData({
      richText:protocol.content
    });
    wx.setNavigationBarTitle({
      title: protocol.name,
    })
  },

})