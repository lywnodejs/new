// components/header/index.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * Component properties
   */
  properties: {
    multipleSlots: {
      type: Boolean,
      value: true
    },
    isright:{
      type:Boolean,
      value:true
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
    onClick(){
      this.triggerEvent('onClick')
    }
  }
})
