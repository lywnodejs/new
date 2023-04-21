// components/captcha-popup/index.js
const util = require('../../utils/util')
Component({
  /**
   * Component properties
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    phone: {
      type: String,
      value: ""
    },
    isError: {
      type: Boolean,
      value: false
    },
    isCountdown: {
      type: Boolean,
      value: false
    }
  },

  observers: {
    'phone': function(value) {
      this.setData({mobile: util.formatPhone(value)})
    },
    'show': function(value) {
      if (value) {
        setTimeout(()=> {
          this.setData({focus: true})
        }, 200)
      }
    }
  },

  /**
   * Component initial data
   */
  data: {
    isCountdown: false,
    mobile: '',
    focus: false,
    height: 0
  },

  /**
   * Component methods
   */
  methods: {
    onHeight ({detail: height}) {
      // console.log(height, '----------------')
      this.setData({height: height/2})
    },

    onClose() {
      this.setData({show: false})
    },

    onSend (e) {
      // this.setData({isCountdown: true})
      this.triggerEvent('onSend')
    },
  
    onComplete ({detail: value}) {
      console.log(value)
      this.triggerEvent('onComplete', value)
    }
  }
})
