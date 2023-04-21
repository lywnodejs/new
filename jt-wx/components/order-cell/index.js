// components/order-cell/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    data: {
      type: Object,
      value: {}
    }
  },

  /**
   * Component initial data
   * 订单状态 1=待审核 4=审核通过 5=审核失败 6=待放款 7=放款失败 8=待还款 9=逾期 10=已结清
   */
  data: {
    color: {
      1: '#FC8100',
      4: '#0081FF',
      5: '#F65348',
      6: '#FC8100',
      7: '#F65348',
    }
  },

  /**
   * Component methods
   */
  methods: {

  }
})
