// components/apply/item-view/live-view/index.js
const fetch = require("../../../../utils/fetch.js");
Component({

  properties: {
    attribute: {
      type: Object,
      value: {}
    },

  },






  methods: {
    onTap(e) {

      wx.chooseImage({
        count: 1,
        sourceType: ["camera"],
        success: async (result) => {
          const base64file = wx.getFileSystemManager().readFileSync(result.tempFilePaths[0], 'base64')
          let attribute = this.data.attribute;
          let {
            code,
            data,
            desc
          } = await fetch(
            "bank.api.write.personal.facepersonalservice.ocrbusilicense", {
              image64: base64file,
              attrId: attribute.id,
              batch: attribute.batch,
              parentId: attribute.parentId,
              parentType: attribute.parentType,
              productId: attribute.productId,
            }
          );

          if (code == 0) {
            let attrId = attribute.id;
            this.triggerEvent('valuechange', {
              id: attrId,
              completed: true,
            });
            wx.showToast({
              icon: 'none',
              title: desc,
            })
          } else {
            this.setData({
              errorTip: desc,
              showErrorTip: true
            })
          }
        },
        fail: (res) => {
          console.log(res);
        },
      });
    },

   
  }
})