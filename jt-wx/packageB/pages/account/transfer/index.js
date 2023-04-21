// pages/account/transfer/index.js
import fetch from '../../../../utils/fetch'
const {lockButton} = require('../../../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {
    type: "in", // in out
    disabled: true,
    value: "",
    show: false,
    focus: true,
    isError: false,
    isShow:false,
    popShow:false,
    errorText:'',
    iserror: false,
    isForget:false,
    mustTocheck:true,
    arrivalTimerTips:'',
    to:[],
    activeBank:{},
    passwordNumErr:false,
    showOpenServices:false,
    detail:'',
    checkuseridcar:false,
    isOpenServices:true,
    passworddescErr:''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: async function (options) {
    if (options.type) {
      this.setData({type: options.type})
    }
    wx.setNavigationBarTitle({
      title: this.data.type === 'in' ? '转入' : '转出'
    })
    let activeBank = {}
    try {
      const {code, data} = await fetch('bank.api.read.personal.seceleaccpersonalreadservice.transfermoneyinfo', 
      {tradeType: options.type})
      if (code === 0) {
        activeBank = this.data.type === 'in' ? data.from[0] : data.to[0]
        this.setData({...data,activeBank})
      }
      console.log(data)
    } catch (error) {
      console.log(error)
    }

    // this.setData({focus: true})
  },
  // 校验资金交易开启/关闭
  async getOpenServices(){
    try {
      const {code, data,desc} = await fetch('bank.api.read.securitycenterservice.fundservicesisopen')
      if(code===0){
        this.setData({
          isOpenServices:data
        })
      }else{
        wx.showToast({
          title: desc,
          icon:'none'
        })
      }
    } catch (error) {
      console.log(error)
    }
  },
  selectBack(){
    this.setData({
      isShow:true
    })
  },
  onDefine() {
    this.onClose()
    return wx.navigateTo({
      url: `/pages/apply/idcertificate/index?type=1`,
    })
  },
  activeBank(e){
    if(e.currentTarget.dataset.item){
      this.setData({
           activeBank:e.currentTarget.dataset.item
      })
      this.onClose()
    }
  },
  onClose(){
    this.setData({
      isShow:false
    })
  },
  onSubmit(){
    if(!this.data.isOpenServices){
      this.setData({
        showOpenServices:true
      })
      return 
    }
    if(this.data.type == 'in'){
      this.onSend()
    }else{
     this.setData({
      popShow:true
     })
    }
  },
    // 数字键盘密码
    getCode({detail}){
      console.log(detail)
      // 这里获取到密文
      this.setData({
        detail
      })
      // 确定交易密码正确后走转出接口
      this.transferHandler()
    },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
   this.getOpenServices()
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  onFocus() {
    this.setData({focus: true})
  },

  onBlur() {
    this.setData({focus: false})
  },

  onAll() {
    // console.log(typeof this.data.cardAmount, typeof this.data.activeBank.dayLimitAmount, typeof this.data.activeBank.tradLimitAmount)
    // //单笔，单日有限制
    // if (this.data.activeBank.dayLimitAmount !== -1 && this.data.activeBank.tradLimitAmount !== -1) {
    //   this.setData({
    //     value: Math.min(this.data.cardAmount, this.data.activeBank.dayLimitAmount, this.data.activeBank.tradLimitAmount), 
    //     disabled: false
    //   })
    // }

    // //单笔限制
    // if (this.data.activeBank.tradLimitAmount !== -1) {
    //   // console.log(Math.min(this.data.cardAmount, this.data.activeBank.tradLimitAmount))
    //   if (this.data.cardAmount > this.data.activeBank.tradLimitAmount) {
    //     wx.showToast({
    //       title: `转出金额不能超过单笔限额${this.data.activeBank.tradLimitAmount}`,
    //       icon: 'none'
    //     })
    //   }
    //   return this.setData({value: Math.min(this.data.cardAmount, this.data.activeBank.tradLimitAmount), disabled: false})
    // }

    // //单日限制
    // if (this.data.activeBank.dayLimitAmount !== -1) {
    //   if (this.data.cardAmount > this.data.activeBank.dayLimitAmount) {
    //     wx.showToast({
    //       title: `转出金额不能超过单日限额${this.data.activeBank.dayLimitAmount}`,
    //       icon: 'none'
    //     })
    //   }
    //   return this.setData({value: Math.min(this.data.cardAmount, this.data.activeBank.dayLimitAmount), disabled: false})
    // }

    //单笔，单日没有限制
    return this.setData({value: this.data.cardAmount,disabled: false}) 
  },

  onClean() {
    this.setData({focus: true, value: "", disabled: true})
  },

  onChange ({detail: {value, cursor, keyCode}}) {
    let oldValue = value

    this.setData({disabled: value <= 0 })

    if (value === '.') {
      return {
        value: '',
        cursor: 0
      }
    }
    if (/^\d+\.?(\d{1,2})?$/.test(value)) {
      this.data.value = value
      return {
        value,
        cursor
      }
    } else {
      return {
        value: value.slice(0, cursor - 1),
        cursor: cursor - 1
      }
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
      showOpenServices:false,
      passwordNumErr:false
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


  onSend() {
    this.transferHandler()
  },

  onClosebinner() {
    this.setData({checkuseridcar: false, isShow2: false})
  },

  onComplete({detail: value}) {
    this.transferHandler(value)
  },

  async transferHandler(verifyCode) {
    try {
      const {code, desc} = await fetch('bank.api.read.personal.seceleaccpersonalreadservice.transfermoney', this.data.type == 'in'?{
        tradeType: this.data.type,
        amount: this.data.value,
        verifyCode,
        id:this.data.activeBank.id
      }:{
        tradeType: this.data.type,
        amount: this.data.value,
        id:this.data.activeBank.id,
        asePwd:'111111'
      })
          //需要身份认证
      if (code === -80000 ) {
        this.setData({checkuseridcar: true, desc})
        return
      }
      // if(code == -1){
      //   wx.showToast({
      //     title: desc,
      //     icon:'none',
      //     duration:3000
      //   })
      // }
      if(this.data.type == 'in'){
        //0=成功 1=需要弹短信验证码 -10=验证码不正确  其他值为业务异常
          if (code === -10) {
            return this.setData({isError: true})
          }
          if (code === -1 || code === -11) {
            if( desc == '户名与卡号不匹配'){
              wx.showToast({
                title: desc,
                icon: 'none',
                duration: 3000
              })
              this.setData({show: false, isCountdown: false})
              return
            }
            this.setData({show: true, isCountdown: true})
            code === -11 && wx.showToast({
              title: desc,
              icon: 'none'
            })
            return
          }else{
            wx.showToast({
              title: desc,
              icon:'none'
            })
          }

      }else {
        // 转出情况下-11为交易密码错误
        if(code ===-70000){
          this.setData({
            popShow:false,
            passwordNumErr:true,
            passworddescErr:desc
          })
          return
        }
        if(code === -11){
          this.setData({
            isError:true,
            errorText:desc,
            isForget:true
          })
          return
        }
        this.setData({
          popShow:false
        })
        if(code !== 0){
          wx.showToast({
            title: desc,
            icon:'none'
          })
        }
      }
     

      if (code === 0) {
        this.setData({show: false})
        return wx.redirectTo({
          url: `/pages/account/result/index?type=${this.data.type}&amount=${this.data.value}&success=true`,
        })
      } 

      wx.redirectTo({
        url: `/pages/account/result/index?type=${this.data.type}&amount=${this.data.value}&msg=${desc}&success=`,
      })
    
    } catch (error) {
      console.log(error) 
    }
  }
})