
//获取应用实例
const app = getApp()
const fetch = app.require('utils/fetch.js')
let hasRedirectToApply = false//二维码携带产品id的时候是否已经直接跳转到申请页
let productIdInQr
Page({
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    platform: "ios",
    triggered: false,
    homeHead: null, //0=查看额度 1=立即申请额度(无额度) 2=立即提现 3=暂无额度 4=立即申请额度
    orderLists:null,
    moreLoanInfos:[],
    login:false,
    homeProductIntro: {
      targetUrl: ""
    },
    desc: '',
    isShow1: false,
    checkuseridcar2:false,
    isShow2: false,
    isShowNotify:false,
    notifyDesc:'',
    showOpenServices:false,
    appplyProduct:{},//头部立即申请额度的产品
  },
  onLoad: function ({inviteFromId,inviteFromType,scene, hasApply,brokerCode,orgCode }) {//brokerCode,orgCode  从全员分销小程序跳转过来携带的参数
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
    if (inviteFromId) {
      wx.setStorageSync('inviteFromId', inviteFromId)
    }
    if (inviteFromType != null && inviteFromType != undefined) {
      wx.setStorageSync('inviteFromType', inviteFromType)
    }
    if (hasApply && !hasRedirectToApply && !!productIdInQr ) {//从二维码进入没有登录到情况下登录完成后回到首页,直接进入申请页
      hasRedirectToApply = true
      return wx.navigateTo({
        url: `/pages/apply/index/index?productId=${productIdInQr}`
      })
    }
    if (brokerCode) {//经纪人id
      app.setBrokerCode(brokerCode)
    }
    if (orgCode) {//经纪人机构id
      app.setOrgId(orgCode)
    }
    //扫码进入会有scene参数
    // scene = 'channel=TuiLaMenTie&productId=1'
    // scene = 'productId=22'
    if (scene) {
      let str = decodeURIComponent(scene)
      //是字符
      try {
        const params = JSON.parse('{"' + str.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
        if (params.channel) {
          app.setChannel(params.channel)
        }

        if (params.b) {//经纪人id
          app.setBrokerCode(params.b)
        }
        if (params.orgCode) {//经纪人机构id
          app.setOrgId(params.orgCode)
        }

        if (!!params.productId) {
          hasRedirectToApply = false
          productIdInQr = params.productId
        }
      } catch (e) {
        console.log(e)
      }
    }
    this.fetch()
  },
  onShow: function () {
    this.fetch(false)
  },
  onRestore(e) {
    this._freshing = false
  },
  onAbort(e) {
    console.log('onAbort', e)
  },
  onSelect({target:{dataset: {url}}}) {
    if (url === 'order') {
      app.globalData.active = 0
      return wx.navigateTo({
        url: '/pages/order/index/index',
      })
    }
    wx.navigateTo({
      url: `/pages/web/index?url=${encodeURIComponent(url)}`,
    })
    // console.log(url)
  },
  fetch: async function (isLoading = true) {
    try {
      const {code, data} = await fetch('bank.api.read.homepageproductsservice.homeloanproducts', {isLoading})
      // console.log(data)
      if (code === 0) {
        this.setData({
          homeHead:data.homeHead,
          orderLists:data.orderLists || null,
          moreLoanInfos:data.moreLoanInfos || [],
          login:data.login
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

  onJump({detail: {productId}}) {
    wx.navigateTo({
      url: `/pages/apply/index/index?productId=${productId}`
    })
  },
  onHomeApply(){
      this.onApply({detail:this.data.homeHead})
  },

  async onApply({detail}) {
    const {productId, button: {code: buttonCode, enable,tips}, loop, status} = detail

    if (!enable) {
      return
    }

    if (!this.data.login) {
      return wx.navigateTo({
        url: '/pages/login/index/index?redirect=/pages/loans/index'
      })
    }

    if (!buttonCode || !productId) {
      return wx.showToast({
        title: '参数错误',
        icon: 'none'
      })
    }
    this.setData({
      appplyProduct:detail,
    })
    if (tips != undefined && tips != null && tips != 'null' && tips != '') {
      this.setData({
        isShowNotify: true,
        notifyDesc: tips,
      })
    } else {
      this.jumpCheck()
    }
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

  async jumpCheck(){
    const {productId, button: {code: buttonCode, enable,tips}, loop, status} = this.data.appplyProduct
    const resultData = await fetch('bank.api.read.personal.unifiedverifyreadservice.unifiedverify', {
      buttonCode, //buttonCode 0=查看额度 1=立即申请额度 2=立即提现 5=立即申请 6=转入 7=转出 8=交易明细 9=去开通
      productId
    })

    const {code, data, desc} = resultData
    if(code === -60){
      this.setData({
        showOpenServices:true,
      })
      return
    }
    if (code === 0) {
       //循环贷 提现
      if (loop == 1 && status == 2) {
        let withdrawUrl = `/packageB/pages/withdrawIndex/index?productId=${productId}`
        return wx.navigateTo({
          url: `/pages/withdraw/face/index?productId=${productId}&redirect=${encodeURIComponent(withdrawUrl)}`,
        })
      }
      return wx.navigateTo({
        url: `/pages/apply/index/index?productId=${productId}`,
      })
    }

    //需要身份认证
    if (code === -90000) {
      this.openData = data
      this.setData({isShow1: true, desc})
      return
    }

     //需要身份认证强制
     if (code === -80000) {
      this.openData = data
      this.setData({checkuseridcar2: true, desc})
      return
    }
    //需要身份认证
    // if (code === -80000 ) {
    //   this.openData = data
    //   this.setData({isShow1: true, desc})
    //   return
    // }

    //您是我行关联用户，暂不能申请该产品
    if (code === -80001) {
      delete resultData.desc
      this.setData({isShow2: true, desc})
    }
  },

  onNotifyClose(){
    this.setData({ isShowNotify: false })
    this.jumpCheck()
  },

  onClose() {
    this.setData({isShow1: false, isShow2: false,checkuseridcar2:false})
  },

  onDefine() {
    this.onClose()
    const {productId, parentId, parentType} = this.openData
    return wx.navigateTo({
      url: `/pages/apply/idcertificate/index?productId=${productId}&type=1&parentId=${parentId}&parentType=${parentType}&redirect=/pages/index/index`,
    })
  },

  // onClick({detail: {needLogin, targetType, targetUrl}}) {
  //   if (!this.data.login && needLogin === 1) {
  //     return wx.navigateTo({
  //       url: "/pages/login/index/index?redirect=/pages/loans/index",
  //     });
  //   }
  //   if (targetType === "html" && !!targetUrl) {
  //     wx.navigateTo({
  //       url: `/pages/web/index?url=${encodeURIComponent(targetUrl)}`,
  //     });
  //   }
  // },
  onRefresh() {
    if (this._freshing) return;
    this._freshing = true;
    this.fetch(false);
  },
})
