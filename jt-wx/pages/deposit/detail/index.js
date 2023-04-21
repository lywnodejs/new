// pages/loans/deposit/index.js
const app = getApp()
const fetch = app.require('utils/fetch.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:null,
    productId:'',
    isOpenServices:false,
    showOpenServices:false,
    checkuseridcar:false,
    checkuseridcar2:false,
    mustTocheck:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({productId}) {
    this.setData({
      productId:productId
    })
    this.fetch(productId);
  },
  onClose() {
    if(this.data.mustTocheck){
      return
    }
    this.setData({checkuseridcar: false,checkuseridcar2:false, isShow2: false})
  },
  onDefine() {
    this.onClose()
    if(!this.openData){
      wx.showToast({
        title: '未获取到当前身份信息',
        icon: 'none',
        duration: 3000,
      })
      return
    }
    return wx.navigateTo({
      url: `/pages/apply/idcertificate/index?type=1`
    })
  },
  async toApply(){
      const buttonCode  = this.data.info.button.code || ''
      const resultData = await fetch('bank.api.read.personal.unifiedverifyreadservice.unifiedverify', {
        buttonCode, //buttonCode 0=查看额度 1=立即申请额度 2=立即提现 5=立即申请 6=转入 7=转出 8=交易明细 9=去开
      })
      if(resultData.code === -60){
        this.setData({
          showOpenServices:true,
        })
        return
      }
      if (resultData.code === 0) {
        wx.navigateTo({
          url: '/packageB/pages/apply/index?productId=' + this.data.productId + '&valueDate=' + this.data.info.valueDate + '&expiryDate=' + this.data.info.expiryDate
        })
        return
      }
      //需要身份认证
      if (resultData.code === -90000) {
        this.openData = resultData.data
        let desc = resultData.desc
        this.setData({checkuseridcar: true, desc})
        return
      }
  
       //需要身份认证强制
       if (resultData.code === -80000) {
        this.openData = resultData.data
        let desc = resultData.desc
        this.setData({checkuseridcar2: true, desc})
        return
      }
  
      //您是我行关联用户，暂不能申请该产品
      if (resultData.code === -80001) {
        // delete resultData.desc
        let desc = resultData.desc
        this.setData({isShow2: true, desc})
      }
  
      if(resultData.code === -80003){
        wx.showToast({
          title: resultData.desc,
          icon: "none",
          duration:3500
        });
      }
    // }
  },
  toOpenServer(){
    this.onCloseServer();
    wx.navigateTo({
      url: '/packageB/pages/detail/index',
    })
  },
  onCloseServer(){
    this.setData({
      showOpenServices:false
    })
  },


  async fetch(productId,isLoading=true) {
    let params ={
      productId
    }
    try {
      const {code, data} = await fetch('bank.api.read.homepageproductsservice.depositproductdetail', params,{isLoading})
      if (code === 0) {
          this.setData({
            info:data
          })
      }
    } catch (error) {
      console.log(error)
    }
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