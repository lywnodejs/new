// components/apply/item-view/ocr-view/index.js
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
      let url = '/pages/apply/idcertificate/index'
      wx.navigateTo({
        url: `${url}?${query}`
      });
    },
  }
})
