//app.js
import {
  locate,
  WXLogin,
  getSystemInfo
} from 'utils/wx-api'
import fetch from 'utils/fetch'
const Verify = require('/verify_mpsdk/main')
var tiny = require('./components/pwd/tiny/tiny.js');
var Rsa = require("./components/pwd/lib/rsa.js");
var pwdGlobalData = require("./components/pwd/utils/conf.js").globalData;


!function(){
  var PageTmp = Page;
  Page = function (pageConfig) {
    // 设置全局默认分享
    pageConfig = Object.assign({
      onShareAppMessage:function () {
        return {
          title:'九商金融',
          path:'/pages/index/index',
          imageUrl:'/image/shaer_banner.png',
        };
      }
    }, pageConfig);
 
    PageTmp(pageConfig);
  };
}();

App({
  
  require: function ($uri) {
    return require($uri)
  },
  onLaunch: async function () {
     // 初始化慧眼实名核身组件
    Verify.init()

    const accountInfo = wx.getAccountInfoSync()
    // console.log(accountInfo)
    this.version = accountInfo.version || '1.0.0'

    try {
      const location = await locate()
      console.log(location, '------------------------------') 
      getSystemInfo()
    } catch (error) {
      console.log(error)
    }

    // this.initRsa();
    this.getConfig();
  },
  
  login: async function ({
    encryptedData,
    iv,
    redirect,
    delta
  }) {
    let wxLoginCode = wx.getStorageSync('wxLoginCode') || undefined
    if (!wxLoginCode) {
      const res = await WXLogin()
      console.log('again wx login: ',res, '--------------------')
      if (!res.code) {
        return wx.showToast({
          icon: 'none',
          title: '登录失败！' + res.errMsg,
        })
      }
      wxLoginCode = res.code
    }
   
    const params = {
      loginType: 'wechat',
      wxEncryptedData: encryptedData,
      wxLoginCode,
      iv
    }
    this.loginHandler({params, delta, redirect})  
  },
  async loginHandler({params, delta, redirect, callback}) {
    try {
      const inviteFromId = wx.getStorageSync('inviteFromId') || undefined
      if (inviteFromId) {
        params.inviteFromId = inviteFromId
      }
      const inviteFromType = wx.getStorageSync('inviteFromType') || undefined
      if (inviteFromType != null && inviteFromType != undefined) {
        params.inviteFromType = inviteFromType
      }
      const {
        code,
        data
      } = await fetch('bank.api.write.standard.userpersonwriteservice.loginorregister', params)

      if (code === 0) {
        this.setSessionId(data.sessionId)
        if (inviteFromId) {
          wx.removeStorageSync('inviteFromId')
        }
       
        callback && callback(code)

        if (redirect) {
          return wx.switchTab({
            url: redirect,
          })
        }
        // wx.navigateBack({
        //   delta,
        // })
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        callback && callback(code)
      }
    } catch (error) {
      console.log(error)
    }
  },
  getSessionId() {
    if (this.sessionId) return this.sessionId
    this.sessionId = wx.getStorageSync('sessionId') || ''
    return this.sessionId
  },
  setSessionId(sessionId) {
    this.sessionId = sessionId
    wx.setStorageSync('sessionId', this.sessionId)
  },
  getChannel() {
    if (this.channel) return this.channel
    const channel = wx.getStorageSync('channel')
    this.channel = channel === 'undefined' ? '' : channel
    return this.channel
  },
  setChannel(channel) {
    this.channel = channel
    wx.setStorageSync('channel', this.channel)
  },

  getBrokerCode() {
    if (this.brokerCode) return this.brokerCode
    const brokerCode = wx.getStorageSync('brokerCode')
    this.brokerCode = brokerCode === 'undefined' ? '' : brokerCode
    return this.brokerCode
  },
  setBrokerCode(brokerCode) {
    this.brokerCode = brokerCode
    wx.setStorageSync('brokerCode', this.brokerCode)
  },

  getOrgId() {
    if (this.orgId) return this.orgId
    const orgId = wx.getStorageSync('orgId')
    this.orgId = orgId === 'undefined' ? '' : orgId
    return this.orgId
  },
  setOrgId(orgId) {
    this.orgId = orgId
    wx.setStorageSync('orgId', this.orgId)
  },
  //初始化rsa加密对象
  initRsa:function(){
    var passrsa = new Rsa();
    passrsa.setPublic(pwdGlobalData.passpublicRsa,pwdGlobalData.passhexPublic);
    pwdGlobalData.passrsa = passrsa;
  },

  async getConfig(){
    fetch('bank.api.read.basereadservice.configs', {isLoading: false}).then(res => {
      if (res.code === 0) {
        // console.log(res);
        res.data.SM24publickey = res.data.eccX + res.data.eccY;
        this.SMConfig= res.data
      }
    })
    
  },

  tiny:tiny,
  SMConfig:{}, //加密数据
  globalData: {
    areas:[],//缓存地址数据
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
  }
})

Array.prototype.flat = function () {
  return this.reduce((acc, val) => acc.concat(val), [])
}