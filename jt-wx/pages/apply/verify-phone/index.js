// pages/apply/verify-phone/index.js
const fetch = require("../../../utils/fetch.js");
Page({

  data: {
    isAttrCompleted: false,
    attribute: {},
    showCodePopup: false,
    isCodeError: false,
    isCountdown: false,
  },


  onLoad: function (options) {
    try {
      const res = wx.getSystemInfoSync();
      let attribute = JSON.parse(options.attrJson);
      attribute.validate = {
        errMsg: '请输入正确的手机号',
        jsExpression: '^1[3-9]\\d{9}$'
      }
      attribute.tips = '请输入正确的手机号'
      let isAttrCompleted = attribute.completed
      this.setData({
        platform: res.platform,
        attribute: attribute,
        isAttrCompleted,
      });
    } catch (e) {}
  },




  onShow: function () {

  },

  onClickLeft: function () {
    wx.navigateBack();
  },


  onValueChange: function ({
    detail: {
      id,
      value,
      completed,
    }
  }) {
    this.data.attribute.value = value;
    this.setData({
      isAttrCompleted: completed,
      attribute: this.data.attribute,
    })
  },


  onSubmit() {
    this.sendCode()
  },

  async checkCode({
    detail: verifyCode
  }) {
    let attribute = this.data.attribute
    const {
      code,
    } = await fetch(
      "bank.api.write.personal.userattrpersonalwriteservice.checkverifycode", {
        id: attribute.id,
        attrType: attribute.attrType,
        mobilePhone: attribute.value,
        batch: attribute.batch,
        productId: attribute.productId,
        verifyCode
      }
    );
    if (code == 0) {
      wx.navigateBack();
    } else if (code == -10) {
      this.setData({
        isCodeError: true
      });
    } else {
      wx.navigateBack();
    }
  },

  async sendCode() {
    let attribute = this.data.attribute
    const {
      code,
      data
    } = await fetch(
      "bank.api.write.personal.userattrpersonalwriteservice.sendverifycode", {
        id: attribute.id,
        attrType: attribute.attrType,
        mobilePhone: attribute.value,
        batch: attribute.batch,
        productId: attribute.productId,
      }
    );

    if (code == 0) {
      this.setData({
        showCodePopup: true,
        isCountdown: true
      });
    }
  }


})