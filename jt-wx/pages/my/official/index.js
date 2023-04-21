Page({
  /**
   * Page initial data
   */
  data: {
    copyDesc:`<div class="copyDiv">搜索公众号名称【<span class="copySpan">梅州客家村镇银行</span>】</div>`
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
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

  copyGzh:function(){
    wx.setClipboardData({
      data: '梅州客家村镇银行',
      success (res) {
      }
    })
  },

  saveImg: function() {
    let _ = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope:'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
            },
            fail(fail) {
              console.log(fail)
              wx.showModal({
                title: '保存权限授权',
                content: '请允许保存到相册，否则将无法正常使用保存二维码',
                confirmText: "去设置",
                success: async (res) => {
                  wx.openSetting({
                    success (res) {
                      // console.log('res.authSetting', res.authSetting)
                    }
                  })
                }
              })
            }
          })
        } else {
   
          wx.saveImageToPhotosAlbum({
            filePath: '/image/qrcode_for_gh.jpg',
            success: res => {
              wx.showToast({
                title: '保存成功',
                icon: 'none'
              })
            },
            fail: res => {
              console.log('fail')
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
    
  },
});
