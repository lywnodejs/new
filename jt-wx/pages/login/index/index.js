// pages/login/index/index.js
const app = getApp()
const fetch = app.require('utils/fetch')
import {
  WXLogin,
} from '../../../utils/wx-api'
Page({
  /**
   * Page initial data
   */
  data: {
    isSelected: false,
    redirect: '',
    protocol: [],
    isLock: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(options)
    if (options.redirect) {
      this.setData({redirect: options.redirect})
    }
    fetch('bank.api.read.basereadservice.configs', {isLoading: false}).then(res => {
      if (res.code === 0) {
        this.setData({protocol: res.data.registeredProtocol})
      }
    })
    
  },

  onShow: function () {
    this.login()
  },

  onProtocol() {
    this.setData({isSelected: !this.data.isSelected})
  },

  onClick({target: {dataset: {url}}}) {
    console.log(url)
    wx.navigateTo({
      url: `/pages/web/index?url=${url}`,
    })
  },
  async login() {
    const res = await WXLogin()
    console.log("wx login: ", res, '--------------------')
    if (!res.code) {
      return wx.showToast({
        icon: 'none',
        title: '登录失败！' + res.errMsg,
      })
    }
    wx.setStorageSync('wxLoginCode', res.code)
  },
  async getPhoneNumber({detail: {errMsg, iv, encryptedData}}) {
    // console.log(errMsg)
    // console.log(iv)
    // console.log(encryptedData)
    if (iv === undefined && encryptedData === undefined) {
      return
    }
    app.login({encryptedData, iv, redirect: this.data.redirect, delta: 1})
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

  onLogin() {
    if (this.data.isLock) return

    this.lock()

    if (!this.data.isSelected) {
      return wx.showToast({
        icon: 'none',
        title: '请先同意并勾选协议',
      })
    }
    wx.navigateTo({
      url: `/pages/login/phone/index?redirect=${this.data.redirect}`,
    })
  }
})