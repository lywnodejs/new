// pages/withdraw/face/index.js
const app = getApp()
const fetch = app.require('utils/fetch')
Page({

  data: {
    bizType:null,
    productId:''
  },

  onLoad: function (options) {
    if(options.productId){
      let productId = options.productId; 
      this.setData({
        productId
      })
    }
    if (options.redirect) {
      let redirect = decodeURIComponent(options.redirect);
      this.setData({
        redirect
      })
    }
    if(options.bizType){
      this.setData({
        bizType:options.bizType
      })
    }
    this.fetch()
  },


  async fetch() {
    try {
      const {
        code,
        data
      } = await fetch('bank.api.write.standard.userattributewriteservice.getfaceattr', {
        productId: this.data.productId
      })
      if (code === 0) {
        this.setData({info: data})
      }
    } catch (error) {
      console.log(error)
    }
  },

  async takePhoto() {
    let {
      code,
      data
    } = await fetch(
      "bank.api.write.personal.facepersonalservice.wxfacebiztoken", {
        attrId: this.data.info.attrId,
        productId:this.data.info.productId,
        batch:this.data.info.batch,
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
    let attribute = this.data.info;
    let {
      code,
      desc
    } = await fetch(
      "bank.api.write.personal.facepersonalservice.wxfaceresult", {
        bizToken,
        attrId: attribute.attrId,
        batch: attribute.batch,
        parentId: attribute.parentId,
        parentType: attribute.parentType,
        productId: attribute.productId,
      }
    );
    if (code == 0) {
      if(this.data.bizType){
        return this.getauthToken()
      }


      if (this.data.redirect) {
        wx.redirectTo({
          url: this.data.redirect,
        })
      } else {
        this.triggerEvent('result',true)
        const eventChannel = this.getOpenerEventChannel()
			  eventChannel.emit('result', {data: true});
        wx.navigateBack()
      } 
    } else {
      wx.showModal({
        title: "提示",
        content: desc,
        showCancel: false
      })
    }
  },
  async getauthToken(){
    let {
      code,
      desc,
      data
    } = await fetch(
      "bank.api.write.standard.userpersonwriteservice.getauthtoken", {
        bizType:this.data.bizType
      }
    );
    if(code===0){
      console.log('!!!!-------',data)
      wx.setStorageSync('authToken', data);
      if (this.data.redirect) {
        wx.redirectTo({
          url: this.data.redirect,
        })
      } else {
        this.triggerEvent('result',true)
        const eventChannel = this.getOpenerEventChannel()
			  eventChannel.emit('result', {data: true});
        wx.navigateBack()
      } 
    }
  }
})