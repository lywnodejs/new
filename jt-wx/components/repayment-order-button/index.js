// components/repayment-button/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    isHighlighted: {
      type: Boolean,
      value: true
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
    onClick(e) {
      this.triggerEvent('onClick')
    }
  }
})
