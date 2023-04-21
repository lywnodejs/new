//index.js
//获取应用实例
const app = getApp()
const fetch = app.require('utils/fetch.js')
Page({
  data: {
    loadingShow:false,
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    choiceProducts:[], // 专属推荐
    banners:[], //banner
    hotLoans:[], // 热门贷款
    choiceDeposits:[], // 精选理财
    platform: "ios",
    triggered:false,
    login:false,
    appplyProduct:{},
    isShowNotify:'',
    isShow2:false,
    isShow3:false,
    informationShow:false,
    informationInfo:null,
    showOpenServices:false,
    notifyDesc:'',
    desc:'',
    datas:[{
      type:1
    },{
      type:2
    },{
      type:1
    }],
    wealth:[1,1,1],
    checkuseridcar:false,
    checkuseridcar2:false,
    mustTocheck:false
  },

  async fetch(isLoading=true) {
    try {
      const {code, data} = await fetch('bank.api.read.homepageproductsservice.homeproductlist', {isLoading})
      // console.log(data)
      if (code === 0) {
             
        Array.isArray(data.choiceDeposits) && data.choiceDeposits.map(item=>{
          item.yearRate = item.yearRate.split('%')[0]
        })
        this.getnewestmessage()
        this.setData({
          banners:data.banners || [],
          choiceDeposits:data.choiceDeposits || [],
          choiceProducts:data.choiceProducts || [],
          hotLoans:data.hotLoans || [],
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
  async getnewestmessage(){
    try {
      const {code, data} = await fetch('bank.api.read.messagelogreadservice.getnewestmessage', {isLoading:false})
      if (code === 0) {
        if(data.messageId){
          this.setData({
            informationInfo:data,
            informationShow: true
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  },
// 存款跳转,
  toDepositDetail(e,id){
    if (!this.data.login) {
      return wx.navigateTo({
        url: '/pages/login/index/index?redirect=/pages/index/index'
      })
    }
    let productId = e.currentTarget ? e.currentTarget.dataset.productid : id;
    wx.navigateTo({
      url: '/pages/deposit/detail/index?productId=' + productId
    })
  },
  toDeposit(){
    wx.switchTab({
      url: '/pages/deposit/index/index',
    })
  },
  toLoans(){
    wx.switchTab({
      url: '/pages/loans/index',
    })
  },  
  

  onLoad: function (options) {
    this.fetch();
    this.getnewestmessage();
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

  
  onNoClose(){
    this.setData({
      isShow3:false
    })
  },
  onOkClose(){
    this.setData({
      isShow3:false
    })
  },
  // 供子组件调用的方法2
  headerClick({detail}){
    if(detail.type == '1'){
        this.toDepositDetail(false,detail.productId)
    }else {
      this.onApply({detail})
    }
  },

  onApply:function({detail}) {
    const {productId, button: {code: buttonCode, enable,tips}, loop, status} = detail

    if (!enable) {
      return
    }

    if (!this.data.login) {
      return wx.navigateTo({
        url: '/pages/login/index/index?redirect=/pages/index/index'
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
    const {productId, parentId, parentType} = this.openData
    return wx.navigateTo({
      url: `/pages/apply/idcertificate/index?productId=${productId}&type=1&parentId=${parentId}&parentType=${parentType}&redirect=/pages/index/index`,
    })
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
          url: `/pages/withdraw/face/index?bizType=loan_withdraw&productId=${productId}&redirect=${encodeURIComponent(withdrawUrl)}`,
        })
      }
      return wx.navigateTo({
        url: `/pages/apply/index/index?productId=${productId}`,
      })
    }
    //需要身份认证
    if (code === -90000) {
      this.openData = data
      this.setData({checkuseridcar: true, desc})
      return
    }

     //需要身份认证强制
     if (code === -80000) {
      this.openData = data
      this.setData({checkuseridcar2: true, desc})
      return
    }

    //您是我行关联用户，暂不能申请该产品
    if (code === -80001) {
      delete resultData.desc
      this.setData({isShow2: true, desc})
    }

    if(code === -80003){
      wx.showToast({
        title: desc,
        icon: "none",
        duration:3500
      });
    }
  },
  onNotifyClose(){
    this.setData({ isShowNotify: false })
    this.jumpCheck()
  },
 async onclickRead(){
   console.log(this.data.informationInfo)
    try {
      const {code} = await fetch('bank.api.write.messagelogwriteservice.changemessagestatus', {messageId:this.data.informationInfo.messageId})
      if (code === 0) {
        this.setData({ informationShow: false })
      }
    } catch (error) {
      console.log(error)
    }
  },

  onRefresh() {
    if (this._freshing) return;
    this._freshing = true;
    this.fetch(false);
  },

  onClick({detail: {needLogin, targetType, targetUrl}}) {
    if (!this.data.login && needLogin === 1) {
      return wx.navigateTo({
        url: "/pages/login/index/index?redirect=/pages/index/index",
      });
    }
    if (targetType === "html" && !!targetUrl) {
      wx.navigateTo({
        url: `/pages/web/index?url=${encodeURIComponent(targetUrl)}`,
      });
    }
  }
})