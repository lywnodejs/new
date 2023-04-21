// components/apply/item-view/verify-code-view/index.js
Component({

  properties: {
    attribute: {
      type: Object,
      value: {}
    },
  },


  data: {

  },


  methods: {
    onClick(e) {
      wx.navigateTo({
        url: `/pages/apply/verify-phone/index?attrJson=${JSON.stringify(this.data.attribute)}`
      });
    }
  }
})