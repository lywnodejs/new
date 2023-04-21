//index.js
//获取应用实例
const app = getApp()
const fetch = app.require('utils/fetch.js')
Page({
  data: {
    platform: "ios",
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    list:[],
    listOne:null,
    triggered:false,
    login:false
  },

  todetail({detail}){
    if (!this.data.login) {
      return wx.navigateTo({
        url: '/pages/login/index/index?redirect=/pages/deposit/index/index'
      })
    }
    wx.navigateTo({
      url: '/pages/deposit/detail/index?productId=' + detail.productId
    })
  },
  toDepositDetail(){
    this.todetail({detail:this.data.listOne})
  },
  async fetch(isLoading=true) {
    try {
      const {code, data} = await fetch('bank.api.read.homepageproductsservice.homedepositproducts', {isLoading})
      // console.log(data)
      if (code === 0) {
        data.depositProducts.map(item=>{
          item.yearRate = item.yearRate.split('%')[0]
        })
        this.setData({
          login:data.login,
          list:data.depositProducts,
          listOne:data.depositProducts? data.depositProducts[0] :null
        })
      }
      this.setData({triggered: false})
      this._freshing = false;
    } catch (error) {
      this.setData({triggered: false})
      this._freshing = false;
      console.log(error)
    }
  },

  onLoad: function (options) {
    console.log(options);
    this.fetch();
    try {
      const res = wx.getSystemInfoSync();
      this.setData({
        platform: res.platform
      });
      console.log(res, "----------------------------");
    } catch (e) {
      // Do something when catch error
      console.log(e);
    }
  },
  onShow(options){
    this.fetch(false);
  },

  onRefresh() {
    if (this._freshing) return;
    this._freshing = true;
    this.fetch(false);
  },
})