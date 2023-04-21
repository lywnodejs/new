// components/quota-card/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    data: {
      type: Object,
      value: {status: 0}
    }
  },

  /**
   * Component methods
   */
  methods: {
    onClick() {
      this.triggerEvent('apply', this.data.data)
    }
  }
})
