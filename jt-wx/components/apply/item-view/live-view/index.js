// components/apply/item-view/live-view/index.js
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
    faceSuccess: true,
  },


  methods: {
    async onTap(e) {
      console.log('活体检测')
      let idAttr = this.data.idAttrs.find(item => !item.completed)
      if (idAttr !== undefined && idAttr !== null) {
        wx.showToast({
          title: `请先拍摄您的身份证${idAttr.attrType === 'idCardFrontOcr' ? '人像面':'国徽面' }`,
          icon: 'none'
        })
        return
      }
      let {
        code,
        data
      } = await fetch(
        "bank.api.write.personal.facepersonalservice.wxfacebiztoken", {
          attrId: this.data.attribute.id,
          productId:this.data.attribute.productId,
          batch:this.data.attribute.batch,
        }
      );

      if (code == 0) {
        wx.startVerify({
          data: {
            token: data
          },
          success: (res) => { // 验证成功后触发
            // res 包含验证成功的token, 这里需要加500ms延时，防止iOS下不执行后面的逻辑
            setTimeout(async () => {
              console.log(res)
              this.onVerifySuccess(res.BizToken)
            }, 500);
          },
          fail: (err) => { // 验证失败时触发
            setTimeout(() => {
              wx.showModal({
                title: "提示",
                content: err.ErrorMsg,
                showCancel: false
              })
            }, 500);
          }
        });
      }
    },

    async onVerifySuccess(bizToken) {

      let attribute = this.data.attribute;
      let attrId = attribute.id;
      let {
        code,
        desc
      } = await fetch(
        "bank.api.write.personal.facepersonalservice.wxfaceresult", {
          bizToken,
          attrId,
          batch: attribute.batch,
          parentId: attribute.parentId,
          parentType: attribute.parentType,
          productId: attribute.productId,
        }
      );
      if (code == 0) {
        console.log('认证成功')
        this.triggerEvent('valuechange', {
          id: attrId,
          completed: true,
        });
      } else {
        wx.showModal({
          title: "提示",
          content: '认证失败，请重新认证',
          showCancel: false
        })
      }
    },
  }
})