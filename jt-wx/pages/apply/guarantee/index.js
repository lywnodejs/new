// pages/apply/guarantee/index.js
const fetch = require("../../../utils/fetch.js");
Page({

  data: {
    platform: "ios",
    showDeleteDialog: false,
  },

  onLoad: function (options) {
    try {
      const res = wx.getSystemInfoSync();
      this.setData({
        platform: res.platform,
        productId: options.productId,
        parentId: options.parentId,
        parentType: options.parentType,
        batch: options.batch !== "undefined" && options.batch !== undefined && options.batch !== null ? options.batch : null,
      });
    } catch (e) {}
  },


  onShow: function () {
    this._getAttrs()
  },

  async _getAttrs() {
    const {
      code,
      data
    } = await fetch(
      "bank.api.read.personal.portalpersonalreadservice.specialmaterialinfo", {
        productId: this.data.productId,
        parentId: this.data.parentId,
        parentType: this.data.parentType,
        batch: this.data.batch,
      }
    );
    if (code == 0) {
      let batch = this.data.batch;
      if (data.batch !== null && data.batch !== undefined && data.batch !== '') {
        batch = data.batch
      }
      let title = this._getTitle(data)
      this.setData({
        cateInfo: data,
        batch,
        title
      })
    }
  },

  onClickLeft: function () {
    wx.navigateBack();
  },

  _getTitle(cateInfo) {
    if (cateInfo.attrGroups !== undefined && cateInfo.attrGroups !== null && cateInfo.attrGroups.length > 0) {
      return `${cateInfo.name}(${cateInfo.attrGroups.length})`
    } else {
      return cateInfo.name
    }
  },

  onAdd(e) {
    let cateInfo = this.data.cateInfo;
    let query = `parentId=${cateInfo.id}&parentType=${cateInfo.type}&productId=${this.data.productId}&batch=${cateInfo.batch}`;
    let url = '/pages/apply/guarantee/edit/index'
    wx.navigateTo({
      url: `${url}?${query}`
    });
  },

  onClick({
    detail,
    target: {
      dataset: {
        attrgroup
      }
    }
  }) {
    if (detail === 'right') {
      this.setData({
        showDeleteDialog: true,
        attrgroup
      })
    } else {
      let cateInfo = this.data.cateInfo;
      let query = `parentId=${cateInfo.id}&parentType=${cateInfo.type}&productId=${this.data.productId}&batch=${attrgroup.batch}`;
      let url = '/pages/apply/guarantee/edit/index'
      wx.navigateTo({
        url: `${url}?${query}`
      });
    }
  },

  onCancel() {
    this.setData({
      showDeleteDialog: false,
    })
  },

  async onConfirm() {
    this.setData({
      showDeleteDialog: false,
    })
    const {
      code,
      data
    } = await fetch(
      "bank.api.read.personal.portalpersonalreadservice.deletespecialmaterial", {
        productId: this.data.productId,
        parentId: this.data.parentId,
        parentType: this.data.parentType,
        batch: this.data.attrgroup.batch,
      }
    );
    this.setData({
      attrgroup: null
    })
    if (code == 0) {
      this._getAttrs()
    }
  },

})