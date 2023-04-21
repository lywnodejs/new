// components/apply/item-view/id-back-view/index.js
const fetch = require("../../../../utils/fetch.js");
Component({
  properties: {
    attribute: {
      type: Object,
      value: {}
    },
    idAttrs: {
      type: Array,
      value: []
    },
  },


  data: {
    showErrorTip: false,
    errorTip: '',
  },


  methods: {
    onTap(e) {
      let frontAttr = this.data.idAttrs.find(item => item.attrType === 'idCardFrontOcr')
      if (frontAttr !== undefined && frontAttr !== null && !frontAttr.completed) {
        wx.showToast({
          title: '请先拍摄您的身份证人像面',
          icon: 'none'
        })
        return
      }
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
            "bank.api.write.personal.facepersonalservice.ocr", {
              idCardBackBase64: base64file,
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