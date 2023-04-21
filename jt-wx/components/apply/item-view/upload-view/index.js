// components/apply/item-view/upload-view/index.js
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
      let url = '/pages/apply/uploadfile/index'
      wx.navigateTo({
        url: `${url}?${query}`
      });
    },
  }
})
