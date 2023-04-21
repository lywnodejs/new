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
    length: {
      type: Number,
      value: 4
    },
    isError: {
      type: Boolean,
      value: false
    },
    img: {
      type: String,
      value: ''
    }
  },

  observers: {
    'img': function(value) {
      setTimeout(() => {
        this.setData({focus: !!value})
        // console.log(!!value, 'focus............................')
      }, 200) 
    }
  },

  /**
   * Component initial data
   */
  data: {
    focus: false,
    height: 0
  },

  /**
   * Component methods
   */
  methods: {
    onHeight ({detail: height}) {
      console.log(height, '----------------')
      this.setData({height: height/2})
    },

    onClose() {
      this.setData({show: false})
    },

    onRefresh() {
      this.triggerEvent('onRefresh')
    },
  
    onComplete ({detail: value}) {
      this.triggerEvent('onComplete', value)
    }
  }
})
