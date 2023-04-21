// components/checkbox/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    // 默认协议样式， true电子帐户选择样式
    normal: {
      type: Boolean,
      value: true
    },
    isSelected: {
      type: Boolean,
      value: false
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
    onSelect() {
      const isSelected = !this.data.isSelected
      this.setData({isSelected: isSelected})
      this.triggerEvent('onSelect', isSelected)
    }
  }
})
