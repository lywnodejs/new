// components/repayment-cell/index.js
import moment from 'moment'
const app = getApp()
const fetch = app.require('utils/fetch.js')
Component({
  /**
   * Component properties
   */
  properties: {
    order: {
      type: Object,
      value: {}
    }
  },
  /**
   * Component initial data
   */
  data: {
     checkuseridcar:false,
        mustTocheck:false
  },

  /**
   * Component methods
   */
  methods: {
    async onClick(e) {
      const orderId = this.data.order.orderId
      const {
        code,data,desc
      } = await fetch('bank.api.read.personal.repaymentreadservice.repaymentcheck', {
        orderId
      })
      let repaymentType = 1;
      if (this.data.order.status == 8 &&
        this.data.order.tinyStatus == -1) {
        repaymentType = 6;
      }
      if (code === 0) {
        wx.navigateTo({
          url: `/pages/repayment/index/index?orderId=${orderId}&repaymentType=${repaymentType}`,
        })
      }
        // 异常弹窗提示
        if(code == -90000){
          this.setData({checkuseridcar: true, desc,mustTocheck:false})
        }
    },

    onClose() {
      if(this.data.mustTocheck){
        return
      }
      this.setData({checkuseridcar: false})
    },
    onDefine() {
      this.setData({checkuseridcar: false, })
      return wx.navigateTo({
        url: `/pages/apply/idcertificate/index?type=1`
      })
    },

    onDetail(e) {
      wx.navigateTo({
        url: '/pages/repayment/bill/index?orderId=' + this.data.order.orderId,
      })
    }
  }
})