
// components/wealth-item/index.js.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    order:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    todetail() {
      this.triggerEvent('todetail',this.data.order)
    }
  }
})