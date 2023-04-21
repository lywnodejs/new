// pages/deposit/apply/index.js
const fetch = require('../../../utils/fetch.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    protocolList:[],
    isSelect:true,
    showInput:true,
    moneyVal:'',
    placeholder:'选填（请输入客户经理工号)',
    idCardShow:true,
    isWrite:false,
    popShow:false,
    isError:false,
    isForget:false,
    info:{},
    desc:'',
    showOpenServices:false,
    productId:'',
    jobNumber:'',
    errorText:'',
    passwordNumErr:false,
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
  changeInput({detail:{value}}){
    let moneyVal = value
        .replace(/\s/g, "")
        .replace(/[^\d]/g, "")
        this.setData({
          moneyVal
        })
  },
  goOpen(){
    const {code, data} = fetch('bank.api.read.personal.unifiedverifyreadservice.unifiedverify', {
      //  暂无buffoncode
      buttonCode: this.data.buttonCode
    })
    if(code === -60){
      this.setData({
        showOpenServices:true,
      })
      return
    }
    //需要身份认证
    if (code === -80000) {
      delete data.desc
      this.openData = data
      return this.setData({isShow: true})
    } 
    wx.navigateTo({
      url: '/packageB/pages/form/index',
    })
  },

  onClose() {
    this.setData({isShow: false})
  },

  onDefine() {
    this.onClose()
    const {productId, parentId, parentType} = this.openData
    return wx.navigateTo({
      url: `/pages/apply/idcertificate/index?productId=${productId}&type=1&parentId=${parentId}&parentType=${parentType}&redirect=/packageB/pages/form/index`,
    })
  },

  getProtocol: async function (productId) {
    let {
      code,
      data,
    } = await fetch(
      "bank.api.read.homepageproductsservice.depositproductbuy", {
        productId,
      }
    )
    let isSelect = true,
    protocolList = null;
    let isWrite = false
    if (code == 0 && data != '') {
      isSelect = false
      protocolList = data.protocols;
      this.setData({
        buttonCode :data.goOpenButton && data.goOpenButton?.code
      })
    }

    this.setData({
      idCardShow:data['status'] == '0' ? false : true,
      info:data,
      isSelect,
      isWrite,
      protocolList,
      popShow:false
    })
  },
  goLook(){
    wx.navigateTo({
      url: '/packageB/pages/account/index/index',
    })
  },
  onShowChange({detail}){
    let showInput = true;
    let placeholder = '选填（请输入客户经理工号)'
    if(detail){
      showInput = false;
      placeholder = ''
    }
    this.setData({
      showInput,
      placeholder
    })
  },
  changeSelect: function ({
    detail
  }) {
    this.setData({
      isSelect: detail
    })
  },
  onApply(){
    if(!this.data.isSelect){return}
    if(!this.data.idCardShow){
      return wx.showToast({
        title: "请开通电子账户",
        icon: "none"
      });
    }
    if(!this.data.moneyVal){
      return wx.showToast({
        title: "请输入购买金额",
        icon: "none"
      });
    }
    if(Number(this.data.moneyVal) < Number(this.data.info.amount)){
      return wx.showToast({
        title: "最低买入"+ this.data.info.amount +"元",
        icon: "none"
      });
    }
    if(Number(this.data.info.balance) < Number(this.data.moneyVal)){
      return wx.showToast({
        title: "当前可用余额不足",
        icon: "none"
      });
    }
    if(!this.data.isWrite){
      wx.navigateTo({
        url: '/pages/write/index',
        events:{
        someSend:(data)=>{
            this.setData({
                isWrite:true,
                isSelect:true,
                popShow:true
            })
          }
        }
      })
      return
    }
    this.setData({
      popShow:true
    })
  },
  // 客户经理
  changejobInput(e){
     this.setData({
      jobNumber:e.detail.value
     })
  },

  getCode({detail}){
    // 这里获取到密文
    console.log(detail);
    this.smartdeposit()
  },
 // 存款购买接口
 smartdeposit: async function(){
  let {
    code,
    data,
    desc
  } = await fetch(
    "bank.api.write.standard.depositproductwriteservice.smartdeposit", {
      productId:this.data.productId,
      userPwd:'111111',
      tranAmt:this.data.moneyVal,
      jobNumber:this.data.jobNumber
     }
  )
    if(code == 0){
      wx.navigateTo({
        url: '/pages/deposit/message/index?valueDate=' + this.data.valueDate + '&expiryDate=' + this.data.expiryDate + '&eleCardNo=' + this.data.info.eleCardNo + '&tranAmt=' + this.data.moneyVal,
      })
      return
    }
   // errorText = desc
   if(code ===-70000){
    this.setData({
      popShow:false,
      passwordNumErr:true,
    })
    return
   }
   this.setData({
    popShow:false
  })
 },
 toPassword(){
  this.setData({
    passwordNumErr:false
  })
  wx.navigateTo({
    url: '/packageB/pages/password/forget/index',
  })
},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options['productId']){
      wx.showToast({
        title: '未获取到产品号',
        icon: 'none'
      })
    }
   
    this.setData({
       buttonCode:options['buttonCode'],
       productId:options['productId'],
       valueDate:options['valueDate'],
       expiryDate:options['expiryDate']
    })
    this.getProtocol(options['productId']);

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
    if(!this.data.isWrite){
      this.setData({
        isWrite:false
      })
    }
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