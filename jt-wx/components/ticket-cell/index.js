// components/ticket-cell/index.js
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
  observers: {
    'data': function(value) {
      console.log(value)
    }
  },
  /**
   * Component initial data
   */
  data: {
    show: false
  },

  /**
   * Component methods
   */
  methods: {
    onClick() {
      this.setData({show: !this.data.show})
    }
  }
})
