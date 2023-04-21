// pages/my/secureCenter/idCancel/detail/index.js
const fetch = require("../../../../../utils/fetch.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowNotify: false,
    isShowNotify2: false,
    idCard: '',
    goOpenButton: {
      code:1
    },
    list:[]
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
        data
      } = await fetch('bank.api.read.personal.seceleaccpersonalreadservice.elecaccountinfo', {
        isLoading
      })
      if (code === 0) {
        this.setData({
          idCard: data.homeSecEleAccVO.eleCardNo
        })
      }
    } catch (error) {
      console.log(error)
    }
  },
  open() {
    this.deleteaccountcheck()
    
  },
  onNotifyClose() {
    this.setData({
      isShowNotify: false
    })
  },
  onOk() {
    wx.navigateTo({
      url: `/pages/withdraw/face/index?bizType=delete_account`,
      events:{
        result:(data)=>{
          this.electronicaccountlogoff()
        }
      }
    })
    
  },
  async electronicaccountlogoff(){
    const {
      code,
      data,
      desc
    } = await fetch('bank.api.read.personal.seceleaccpersonalreadservice.electronicaccountlogoff',{isLoading:true,params:{
      authToken:wx.getStorageSync('authToken')
    }})
    if(code===0){
      wx.showToast({
        title: desc,
        icon:'none'
      })
      wx.navigateBack({
        delta: 1,
      })
    }else{
      wx.showToast({
        title: desc,
        icon:'none'
      })
    }
  }, 

  async deleteaccountcheck(){
    const {
      code,
      data,
      desc
    } = await fetch('bank.api.read.personal.seceleaccpersonalreadservice.deleteaccountcheck', {})
    if(code===0){
      if(data.checkItemList){
        let isOk = true;
        data.checkItemList.map(item=>{
          if(item.itemStatus===0){
            isOk = false
          }
        })
        if(isOk ===false){
          this.setData({
            list:data.checkItemList,
            isShowNotify2:true
          })
        }else{
          this.setData({
            isShowNotify:true
          })
        } 
      }else{
        this.setData({
          isShowNotify:true
        })
      }
    }else{
      wx.showToast({
        title: desc,
        icon:'none'
      })
    }
  },
  clons() {
    this.setData({
      isShowNotify2: false
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