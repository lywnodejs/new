// components/tie-card/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    i : {
      type: Boolean,
      value: true
    },
    data: {
      type: Object,
      value: {}
    }
  },

  /**
   * Component initial data
   */
  data: {
    name: '',
    idCard: '',
    phone: '',
    show: false
  },

  /**
   * Component methods
   */
  methods: {
    onTips() {
      // wx.showModal({
      //   showCancel: false,
      //   title: '预留手机号说明',
      //   content: '预留手机号就是你在办理银行卡时留的电话号码。本次绑卡要求预留手机号和注册手机号一致。修改方法如下：\
      //   1，联系银行将预留手机号修改为当前在用的注册手机号。\
      //   2，用银行预留手机号重新注册。',
      //   confirmText: '我知道了',
      //   confirmColor: '#FC8100'
      // })
      this.setData({show: true})
    },
    onClose() {
      this.setData({show: !this.data.show})
    }
  }
})
