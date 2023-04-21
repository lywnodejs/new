// components/loans-card/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loans:{
      type:Array,
      value:[]
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
    onClick(e){
      let item = e.currentTarget.dataset.item
      console.log(item);
      this.triggerEvent('apply', item)

    }
  }
})
