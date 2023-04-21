// components/resend/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    isDoing: {
      type: Boolean,
      value: true
    },
    icon: {
      type: Boolean,
      value: true
    },
    againText: {
      type: String,
      value: '重新发送'
    }
  },

  /**
   * Component initial data
   */
  data: {
    disabled: false,
    text: "获取验证码"
  },

  observers: {
    'isDoing': function(value) {
       if (value) {
        this.count = 60
        this.setData({disabled: true})
        if (this.timer){
          clearTimeout(this.timer)
        }
        this.countdown()
       }
    }
  },

  /**
   * Component methods
   */
  methods: {
    countdown () {
      const count = --this.count
      if (count > 0) {
        this.setData({text: `${count}s后重新发送`})
        this.timer = setTimeout(() => {
          this.countdown()
        }, 1000)
      } else {
        clearTimeout(this.timer)
        console.log(this.data)
        this.setData({disabled: false, text: this.data.againText})
      }
    },

    onClick () {
      this.triggerEvent('onSend')
    }
  }
})
