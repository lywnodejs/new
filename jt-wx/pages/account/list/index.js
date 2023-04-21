// pages/account/list/index.js
import fetch from '../../../utils/fetch'
Page({

  /**
   * Page initial data
   */
  data: {
    triggered: false,
    list: [],
    queryTimes: ["全部时间"],
    show: false,
    index: 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.fetch()
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

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  async fetch() {
    try {
      const key = this.data.queryTimes[this.data.index]
      const queryDate = key === "全部时间" ? "" : key
      const {code, data: {list, queryTimes}} = await fetch('bank.api.read.personal.seceleaccpersonalreadservice.transferdetail', {queryDate})
      if (code === 0) {
        this.setData({list, queryTimes: ["全部时间", ...queryTimes]})
      }
      this.setData({triggered: false})
      this._freshing = false
    } catch (error) {
      console.log(error)  
      this.setData({triggered: false})
      this._freshing = false
    }
  },
  
  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    this.fetch()
  },

  onAbort(e) {
    this.setData({triggered: false})
    this._freshing = false
  },

  onSelect({currentTarget: {dataset: {index}}}) {
    this.setData({index})
    this.onClose()
    this.fetch()
  },

  onClose() {
    this.setData({show: !this.data.show})
  }
})