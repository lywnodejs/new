// components/captcha-input/index.js
Component({
  pageLifetimes: {
    show: function() {
      // 页面被展示
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },
  /**
   * Component properties
   */
  properties: {
    width: {
      type: Number,
      value: 40
    },
    isError: {
      type: Boolean,
      value: false
    },
    focus: {
      type: Boolean,
      value: true
    },
    clean: {
      type: Boolean,
      value: false
    },
    length: {
      type: Number,
      value: 6
    },
    type: {
      type: String,
      value: 'number'
    }
  },

  /**
   * Component initial data
   */
  data: { 
    focusIndex: 0,
    disabled: true,
    captcha: ["|"],
    value: "",
    placeholders: new Array(6),
    error: false
  },

  observers: {
    'length': function(value) {
      this.setData({placeholders: new Array(value)})
    },
    'isError': function(value) {
      this.setData({captcha: ["|"], value: "", error: value, focusIndex: 0})
    },
    'clean': function(value) {
      if (value) {
        this.setData({captcha: ["|"], value: "", focusIndex: 0})
      }
    }
  },

  /**
   * Component methods
   */
  methods: {
    onChange ({detail: {value, cursor, keyCode}}) {
      // console.log(value, '----------++++++++++++++-------------')
      value = value.replace(/\s/g, '')
      
      let captcha = Array.from(value)
      if (captcha.length < this.data.length) {
        captcha.push('|')
      }

      if (captcha.length > this.data.length) {
        captcha = captcha.splice(0, this.data.length)

        this.setData({value: captcha.join('')})
        return {
          value: captcha.join(''),
          cursor: this.data.length
        }
      }

      // console.log(captcha, '----------------')
      this.setData({captcha, focusIndex: value.length, error: false})

      if (value.length === this.data.length) {
        // console.log(value, captcha.join(''), value.length, this.data.length, '==============')
        this.triggerEvent('onComplete', captcha.join(''))
      }
      // console.log(cursor, 'cursor')
    },

    onKeyboard ({detail: {height}}) {
      this.triggerEvent('onHeight', height)
    }
  }
})
