// components/product-cell/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    product: {
      type: Object,
      value: {}
    }
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    onClick() {
      this.triggerEvent('apply', this.data.product)
    },

    onJump() {
      this.triggerEvent('jump', this.data.product)
    }
  }
})
