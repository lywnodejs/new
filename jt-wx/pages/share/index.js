// pages/share/index.js
const app = getApp();
const fetch = app.require("utils/fetch");
const renderImg = (data) => {
  const renderData = {
    width: '690rpx',
    height: '978rpx',
    background: '#ffffff',
    views: [
      {
        type: 'image',
        url: '/image/avatar_1.png',
        css: {
          width: '120rpx',
          height: '120rpx',
          position: 'absolute',
          top: '30rpx',
          left: '30rpx'
        }
      },
      {
        type: 'text',
        text: `来自${data.userName}的分享`,
        css: {
          position: 'absolute',
          top: '48rpx',
          left: '180rpx',
          fontSize: '32rpx',
          color: '#333333',
          fontWeight:'500',
          textAlign:'left'
        }
      },
      {
        type: 'text',
        text: '跟我一起加入九商金融吧',
        css: {
          position: 'absolute',
          top: '102rpx',
          left: '180rpx',
          fontSize: '28rpx',
          color: '#999999',
          textAlign:'left'
        }
      },
      {
        type: 'image',
        url: '/image/shaer_banner.png',
        css: {
          width: '630rpx',
          height: '488rpx',
          position: 'absolute',
          top: '187rpx',
          left: '30rpx'
        }
      },
      {
        type: 'text',
        text: '长按识别',
        css: {
          position: 'absolute',
          top: '777rpx',
          left: '30rpx',
          fontSize: '28rpx',
          color: '#666666',
          textAlign:'left'
        }
      },
      {
        type: 'text',
        text: '内藏惊喜的哦～',
        css: {
          position: 'absolute',
          top: '825rpx',
          left: '30rpx',
          fontSize: '28rpx',
          color: '#999999',
          textAlign:'left'
        }
      },
      {
        type: 'image',
        url: '/image/miniPng.jpg',
        css: {
          width: '160rpx',
          height: '160rpx',
          position: 'absolute',
          left: '301rpx',
          bottom: '85rpx'
        }
      },
      {
        type: 'image',
        url: '/image/shaer_01.png',
        css: {
          width: '160rpx',
          height: '160rpx',
          position: 'absolute',
          right: '40rpx',
          bottom: '85rpx'
        }
      },
    ],
  }
  return renderData
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgData:null,
    src:'',
    userName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetch()
  },
  async fetch(isLoading = true) {
    try {
      const {
        code,
        data,
      } = await fetch("bank.api.read.homepageproductsservice.homeusercenter", {
        isLoading,
      });
      if (code === 0) {
        if (data.userName) {
          let phone = data.userName.replace(
            /(\d{3})\d{4}(\d{4})/,
            "$1****$2"
          );
          this.setData({
            userName:phone
          })
        }else{
          this.setData({
            userName:'朋友'
          })
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
  setImage(){
    wx.showLoading({
      title: '生成海报中',
    })
    let data={
      avatar:''
    }
    this.setData({
      imgData:renderImg({userName:this.data.userName || '朋友'})
    })
  },
  onImgOK(e){
    this.setData({
      src: e.detail.path
    });
    wx.hideLoading()
    wx.saveImageToPhotosAlbum({
      filePath: this.data.src,
      success() {
        wx.showToast({
          title: '已保存到本地相册',
        })
      },
      fail({errMsg}){
        console.log(errMsg);
        if(errMsg ==='saveImageToPhotosAlbum:fail cancel' || errMsg ==='saveImageToPhotosAlbum:fail:auth denied' || errMsg ==='saveImageToPhotosAlbum:fail auth deny'){
          wx.showModal({
            title:'提示',
            content: '需要您授权保存相册',
            confirmText: "去设置",
            success: (res) => {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        }
      }
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
  onShareAppMessage: function (res) {
    const imageUrl = '/image/shaer_banner.png' ;
    return {
      title: `来自${this.data.userName}的分享`,
      path: `/pages/index/index`,
      imageUrl: imageUrl,
      success: function (res) {

      },
      fail: function (res) {}
    }
  },
})