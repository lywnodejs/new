// pages/my/ticket/index.js
import fetch from '../../../utils/fetch'

function formatTimestamp( timestamp ) {
  timestamp = timestamp.replace(/\-/g, '/')
    var dateObj = new Date( timestamp );
    var year = dateObj.getYear() + 1900;
    var month = dateObj.getMonth() + 1;
    var theDate = dateObj.getDate();
    var hour = dateObj.getHours();
    var minute = dateObj.getMinutes();
    var second = dateObj.getSeconds();
    return year +"."+ month +"." + theDate + " "+ hour +":"+ minute;    
}
Page({

  /**
   * Page initial data
   */
  data: {
    titles: ["待使用", "已使用", "已失效"],
    active: 0,
    triggered: false,
    list: [[],[],[]]
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
    // console.log('onRestore:', e)
  },

  onAbort(e) {
    // console.log('onAbort', e)
  },

  async fetch(isLoading = true) {
    try {
      const {code, data} = await fetch('com.rongzhijia.ydq.api.dubbo.ksrcb.couponmanagerfacadestub.listcouponbystatus', {
        params: {params: this.data.active}, 
        isLoading
      })
      if (code === 0){
        let list = this.data.list
        data.forEach(v => {
          v.endTimeText = formatTimestamp(v.endTime)
        })
        list[this.data.active] = data
        this.setData({list})
      }

      this.setData({triggered: false})
      this._freshing = false
    } catch (error) {
      this.setData({triggered: false})
      this._freshing = false
    }
  }
})