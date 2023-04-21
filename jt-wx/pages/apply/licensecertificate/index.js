// pages/apply/idcertificate/index.js
const fetch = require("../../../utils/fetch.js");
const attrBehavior = require('../attr-behavior/index')
const jumpBehavior = require('../jump-behavior/index')
Page({
  behaviors: [attrBehavior,jumpBehavior],
  data: {
    platform: "ios",
    showStay: false,
    initCompleted: true,
    isAllAttrCompleted: false,
    idAttrs: [],
    attrs:[]
  },


  onLoad: async function (options) {
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

    const {
      code,
      data
    } = await fetch(
      "bank.api.read.personal.portalpersonalreadservice.materialinfo", {
        productId: this.data.productId,
        parentId: this.data.parentId,
        parentType: this.data.parentType,
        batch: this.data.batch,
      }
    );
    if (code == 0) {
      let attrs = data.attrGroups.reduce((preValue, curValue) => {
        curValue.attrs.forEach(item => {
          item.productId = this.data.productId;
          item.parentId = this.data.parentId;
          item.parentType = this.data.parentType;
        })
        return [...preValue, ...curValue.attrs]
      }, [])

  
      let licenseAttr = attrs.find(attr => attr.attrType === 'license')
      let allValidAttr = attrs.filter(attr => {
        return attr.attrType === 'license'
      })
      this.setData({
        cateInfo: data,
        initCompleted: data.completed,
        editFlag: data.editFlag,
        isAllAttrCompleted: data.completed,
        licenseAttr,
        attrs:allValidAttr,
      })
    }
  },





  onValueChange: function ({
    detail: {
      id,
      enumId,
      value,
      completed,
      showValue
    }
  }) {
    console.log(`认证页面收到事件---id:${id}--enumId:${enumId}--value:${value}--completed:${completed}--showValue:${showValue}`)
    let toFindAttrs = this.data.attrs;
    let temp = toFindAttrs.find(v => v.id == id)
    temp.completed = completed
    console.log('onValueChange', id, value, completed, temp)
    let hasUncompletedAttr = this._hasUncompletedAttr(this.data.attrs)
    console.log('全部是否完成', !hasUncompletedAttr)
    this.setData({
      attrs: this.data.attrs,
      licenseAttr:this.data.liveAttr,
      isAllAttrCompleted: !hasUncompletedAttr
    })
    if(!hasUncompletedAttr && !this.data.initCompleted){
      this.jump()
    }
 
  },

  _saveAttrs({
    saveType
  }) { 

  }


})