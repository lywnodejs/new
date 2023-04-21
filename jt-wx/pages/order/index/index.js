// pages/order/index/index.js
import fetch from '../../../utils/fetch'
const app = getApp()
let isOne = true
Page({

  /**
   * Page initial data
   */
  data: {
    titles: ["待还款", "全部"],
    active: 1,
    triggered: false,
    list: [[],[]],
    summaryRepayInfo: {}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if (app.globalData.active !== undefined) {
      this.setData({active: app.globalData.active})
      delete app.globalData.active
    }
    this.fetch()
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    if (!getApp().getSessionId()) {
      return
    }
    if (!isOne) {
      if (app.globalData.active !== undefined) {
        this.setData({active: app.globalData.active})
        delete app.globalData.active
      }
      this.fetch(false)
    }
    isOne = false
  },

  onTabItemTap(item) {
    //console.log('tab change', item)
    if (!getApp().getSessionId() && !isOne) {
      this.fetch(false)
    } 
  },

  async fetch(isLoading = true) {
    const index = this.data.active === 0 ? 1 : 0 //queryType = 0是全部，queryType = 1是待还款
    // console.log('index', index)
    try {
      const {code, data} = await fetch('bank.api.read.personal.loanorderpersonalreadservice.orderlist', {
        params: {
          queryType: index
        },
        isLoading
      })

      if (code === 0) {
        const list = [...this.data.list]
        if (index === 1) {
          this.setData({
            summaryRepayInfo: data.summaryRepayInfo
          })
        }

        list[index] = data.orderInfos
        this.setData({list})
      }
      
      if (code === -8) {
        this.setData({list: [[],[]]})
      }

      this.setData({triggered: false})
      this._freshing = false
    } catch (error) {
      console.log(error)
    }
  },

  onChange(event) {
    const index = event.target.dataset.index
    if (index === this.active) return
    this.setData({active: index})
    
    this.fetch(false)
  },

  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    this.fetch(false)
  },

  onRestore(e) {
    console.log('onRestore:', e)
  },

  onAbort(e) {
    console.log('onAbort', e)
  },
})