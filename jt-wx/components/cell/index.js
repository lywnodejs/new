// components/cell/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    icon: String,
    title: String,
    tips: String,
    line: {
      type: Boolean,
      value: true
    },
    height: {
      type: Number,
      value: 64
    },
    color: {
      type: String,
      value: "#000000"
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

  },

  /**
   * Component methods
   */
  methods: {
    onTap(e) {
      this.triggerEvent('click', this.data.data)
    }
  }
})
