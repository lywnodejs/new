// pages/my/index/index.js
const app = getApp();
const fetch = app.require("utils/fetch");
const util = app.require('utils/util');
const targets = {
  setting: "/pages/my/settings/index",
  coupon: "/pages/my/ticket/index",
  account: "/packageB/pages/account/index/index",
  officalAccount: "/pages/my/official/index",
  messageCenter:'/pages/my/messageCenter/index',
  secureCenter:'/pages/my/secureCenter/index',
  share:'/pages/share/index',
};
Page({
  /**
   * Page initial data
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    triggered: false,
    login: false,
    phone: "",
    verified: 0,
    cell: [],
    platform: "ios",
    clickCheckType:1,
    isShowNotify:false,
    myAssets:null
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
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
  toAccount(){
    if (!this.data.login){
      return this.onLogin();
    }
    wx.navigateTo({
      url: '/packageB/pages/account/index/index',
    })
  },
  toDeposit(){
    if (!this.data.login){
      return this.onLogin();
    }
    wx.navigateTo({
      url: '/pages/my/depositList/index',
    })
  },
  toLoans(){
    if (!this.data.login){
      return this.onLogin();
    }
    wx.navigateTo({
      url: '/pages/order/index/index',
    })
  },
  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.fetch(false);
  },

  async fetch(isLoading = true) {
    try {
      const {
        code,
        data,
      } = await fetch("bank.api.read.homepageproductsservice.homeusercenter", {
        isLoading,
      });
      let state = {
        triggered: false
      };
      if (code === 0) {
        // 存储手机号
        wx.setStorageSync('customerPhone', data.customerPhone)
        state = {
          ...state,
          ...data
        };
        if(data.login){
          this.setData({
            clickCheckType:0
          })
        }else{
          this.setData({
            clickCheckType:1
          })
        }
        if (data.userName) {
          state.phone = data.userName.replace(
            /(\d{3})\d{4}(\d{4})/,
            "$1****$2"
          );
        }
      }
      this.setData(state);
      this._freshing = false;
    } catch (error) {
      console.log(error);
    }
  },

  clickCheck(){
    if (!this.data.login){
      return this.onLogin();
    }
      this.setData({
        clickCheckType:this.data.clickCheckType===0 ? 1 : 0
      })
  },
  onNotifyShow(){
    this.setData({
      isShowNotify:true
    })
  },
  onNotifyClose(){
    this.setData({
      isShowNotify:false
    })
  },
  toRepayment(){
    wx.navigateTo({
      url: '/pages/repayment/bill/index',
    })
  },

  onRefresh() {
    if (this._freshing) return;
    this._freshing = true;
    this.fetch(false);
  },

  onRestore(e) {
    // console.log('onRestore:', e)
  },

  onLogin() {
    wx.navigateTo({
      url: "/pages/login/index/index?redirect=/pages/my/index/index",
    });
  },

  onInfo() {
    if (!this.data.login) {
      return this.onLogin();
    }
  },

  onClick({
    detail: {
      targetType,
      targetUrl,
      needLogin,
      tips
    }
  }) {
    if (!this.data.login && needLogin === 1) {
      return this.onLogin();
    }
    if(targetUrl ==='customerPhone'){
      wx.makePhoneCall({
        phoneNumber:tips
      })
      return 
    }
    
    if (targets[targetUrl]) {
      if(targetUrl==='setting'){
        wx.setStorageSync('settings', this.data.settings)
      }
      return wx.navigateTo({
        url: targets[targetUrl] +'?verified='+this.data.verified,
      });
    }

    if (targetType === "html" && !!targetUrl) {
      if (this.data.login) {
        targetUrl = this.concatSession(targetUrl)
      }
      if(targetUrl.indexOf("tominiProgram") != -1){//跳转到全员分销小程序
        const uri = util.parseUri(targetUrl)
        wx.navigateToMiniProgram({
          appId: uri.queryKey.appid,
          path: `${uri.path}?loanMpOrgId=${uri.queryKey.loanMpOrgId}`,
          envVersion: 'trial',
          success(res) {
          }
        })
      } else {
        wx.navigateTo({
          url: `/pages/web/index?url=${encodeURIComponent(targetUrl)}`,
        });
      }
    }
  },


  concatSession(url){
    if(url.indexOf('?') < 0){//没有参数
      return `${url}?sessionId=${getApp().getSessionId()}`
    } else {
      return `${url}&sessionId=${getApp().getSessionId()}`
    }
  }
});