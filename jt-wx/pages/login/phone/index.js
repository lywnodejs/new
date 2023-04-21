// pages/login/phone/index.js
const app = getApp()
const {require, login} = getApp()
const util = require('utils/util')
const fetch = app.require('utils/fetch')

Page({
  /**
   * Page initial data
   */
  data: {
    isDelete: false,
    isDisabled: true,
    phone: '',
    animationData: {},
    isFocus: true,
    redirect: '',
    verifyError: false,
    img: '',
    isLock: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // console.log(options, '-----------------------')
    if (options.redirect) {
      this.setData({redirect: options.redirect})
    }
  },

  getPhoneNumber ({detail: {errMsg, iv, encryptedData}}) {
    if (iv === undefined && encryptedData === undefined) {
      return
    }
    login({encryptedData, iv, redirect: this.data.redirect, delta: 2})
  },

  onChange ({detail: {value}}) {
    if (value.length > 0) {
      this.setData({isDelete: true})
    }
    value = value.replace(/\s/g, '')
    if (value.length > 11) {
      value = value.slice(0, 11)
    }
    let phone = value.length > 3 ? value.replace(/\s/g, '').replace(/(^\d{3}|\d{4}\B)/g,"$1 ") : value
    this.setData({phone, isDisabled: !util.isPhone(phone)})
  },

  onFocus (e) {
    this.setData({
      isFocus: true
    })
  },

  onBlur (e) {
    if (this.data.phone === '') {
      this.setData({
        isFocus: false
      })
    }
  },

  onDelete (e) {
    this.setData({
      phone: '', 
      isDelete: false, 
      isDisabled: true, 
      isFocus: true
    })
  },

  lock() {
    this.setData({isLock: true})
    setTimeout(() => {
      this.setData({isLock: false})
    }, 1000)
  },

  onWXLogin() {
    this.lock()
  },

  onCaptcha (e) {
    if (this.data.isLock) return
    this.lock()
    this.send(undefined)
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
      
      if (code === 0 || code === -12) {
        this.setData({img: ''})
        wx.navigateTo({
          url: `/pages/login/captcha/index?phone=${this.data.phone}&redirect=${this.data.redirect}&message=${code === 0 ? '验证码已发送' : desc}`
        })
      }
      
    } catch (error) {
      console.log(error)
    }
  },

  onVerify({detail: value}) {
    this.send(value)
  }
})