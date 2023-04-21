// pages/login/captcha/index.js
const app = getApp()
const fetch = app.require('utils/fetch')

Page({
  /**
   * Page initial data
   */
  data: {
    phone: '',
    isCountdown: false,
    isError: false,
    focus: false,
    verifyError: false,
    img: '',
    redirect: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      phone: options.phone,
      redirect: options.redirect,
      isCountdown: true,
      focus: true
    })
    wx.showToast({
      icon: 'none',
      title: options.message,
    })
  },

  onComplete({detail: verifyCode}) {
    // console.log(verifyCode, this.data.phone)
    const params = {
      mobilePhone: this.data.phone.replace(/\s/g, ''),
      loginType: 'verify_code',
      reqSrc:'3',
      verifyCode
    }
    app.loginHandler({
      params, delta:3, 
      redirect: this.data.redirect, 
      callback: (code) => {
        if (code !== 0) {
          this.setData({isError: true})
        }
      }
    })
  },

  onSend(e) {
    this.send()
  },
  
  async send(captchaCode) {
    if (captchaCode === '    '){
      return this.setData({verifyError: true})
    }
    try {
      const {code, data, desc} = await fetch('bank.api.write.standard.userpersonwriteservice.sendverifycode', {
        params: {
          mobilePhone: this.data.phone.replace(/\s/g, ''),
          captchaCode,
          bizType: 'login'
        },
        isLoading: false
      })
      
      //弹出图形验证码输入
      if (code === -10) {
       return this.setData({img: data.captchaCode, focus: false, verifyError: !!captchaCode})
      }

      //图形验证码输入错误
      if (code === -11) {
        return this.setData({verifyError: true})
      }

      this.setData({isCountdown: true, focus: true, img: ''})
      wx.showToast({
        icon: 'none',
        title: '验证码已发送',
      })
      
    } catch (error) {
      console.log(error)
    }
  },

  onVerify({detail: value}) {
    // console.log(value)
    this.send(value)
  }
})