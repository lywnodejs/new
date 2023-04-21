// components/apply/item-view/supply-view/index.js
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
      let attribute = this.data.attribute;
      let query = `parentId=${attribute.id}&parentType=${attribute.attrType}&productId=${attribute.productId}&batch=${attribute.batch}`;
      wx.navigateTo({
        url: `/pages/apply/material/index?${query}`
      });
    }
  }
})
