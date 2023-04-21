// pages/account/card/index.js
import fetch from '../../../utils/fetch'
Page({

  /**
   * Page initial data
   */
  data: {
    img: '',
    focus: false,
    verifyError: false,
    isCodeError: false,
    show: false,
    isCountdown: false,
    bankInfo: {},
    placeholder: '请输入本人的银行卡',
    userInfo: {},
    isSelect: false, // 协议是否勾选
    protocolList: null,
    bindType:3,
    isgodown:false // 银行卡号是否正确
  },


  onLoad: async function (options) {
    if(options.bindType){
      this.setData({
        bindType:Number(options.bindType)
      })
    }
    let params = {
      bindType: this.data.bindType,
      application:'3'
    }
    try {
      const {code, data} = await fetch('bank.api.read.personal.loanbindreadservice.getbindcardinfo',params)
      if (code === 0) {
        this.setData({
          userInfo: data,
          protocolList : data.protocols,
          isSelect : data.protocols==null ? true :false
        })
        console.log(this.data.isSelect);
      }
    } catch (error) {
      console.log(error)
    }
  },

  onComplete({detail: value}) {
    this.applyHandler(value)
  },

  onBankInfo({detail}) {
    this.data.bankInfo = detail
    this.setData({
      isgodown:true
    })
  },

  onSend() {
    // this.getCode()
    this.applyHandler()
  },

  async onSubmit () {
    if (!this.data.bankInfo || !this.data.bankInfo.bankCardNo) {
     return wx.showToast({
        title: '请输入银行卡号',
        icon: 'none'
      })
    }

     if (this.data.bankInfo.bankCardNo.length < 16) {
       return wx.showToast({
         title: '银行卡长度不正确',
         icon: 'none'
       })
     }

     if (!this.data.isSelect) {
      return wx.showToast({
        title: "请勾选协议",
        icon: "none"
      });
    }

    this.applyHandler()
  },

  applyHandler: async function (verifyCode) {
    let { reservedMobile, cardNo: eleCardNo } = this.data.userInfo;
    let { bankCardNo, bankCode, bankName } = this.data.bankInfo;
    let url = this.data.bindType ===3? 'bank.api.read.personal.seceleaccpersonalreadservice.addbankcard': 'bank.api.read.personal.loanbindreadservice.confirmbindloancard';
    let params = {
      //  bankCardNo,
      verifyCode,
      mobilePhone:reservedMobile,
      bizType: 'bind_card'
    }
    if(this.data.bindType ===3){
      params.cardNo = bankCardNo;
    }else{
      params.bankCardNo = bankCardNo
    }
    this.data.bindType !==3 ? params.bindType = this.data.bindType : null;
    let { code } = await fetch(
      url,
      params
    )
    if(code===1){
      this.setData({ show: true , isCountdown: true});
      return 
    }
    if (code === 0) {
      this.setData({ show: false , isCountdown: false});
      wx.showToast({
        title: '绑定银行卡成功',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    }else if(code === -9){
      return this.setData({
        isCodeError: true
      })
    }
  },

  changeSelect: function ({
    detail
  }) {
    this.setData({
      isSelect:detail
    })
  },

  onShowChange: function ({
    detail
  }) {
    let placeholder = '请输入本人的银行卡';
    if (detail) {
      placeholder = ''
    }
    this.setData({
      placeholder
    })
  },
})