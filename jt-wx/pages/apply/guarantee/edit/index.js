// pages/apply/guarantee/edit/index.js
const fetch = require("../../../../utils/fetch.js");
const attrBehavior = require('../../attr-behavior/index')
const jumpBehavior = require('../../jump-behavior/index')
Page({
  behaviors: [attrBehavior,jumpBehavior],
  data: {
    platform: "ios",
    showStay: false,
    initCompleted: true,
    isAllAttrCompleted: false,
    attrs: [],
    isSelected: true,
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


  onShow: async function () {
    const {
      code,
      data
    } = await fetch(
      "bank.api.read.personal.portalpersonalreadservice.specialmaterialinvoke", {
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
        })
        return [...preValue, ...curValue.attrs]
      }, [])
      let batch = this.data.batch;
      if (data.batch !== null && data.batch !== undefined && data.batch !== '') {
        batch = data.batch
      }
      this.setData({
        cateInfo: data,
        initCompleted: data.completed,
        editFlag: data.editFlag,
        isAllAttrCompleted: data.completed,
        attrs,
        batch,
        isSelected: this._initProtocolSelected(data)
      })
    }
  },




  onHide: function () {
    this._saveAttrs({
      saveType: 'temp'
    });
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
    console.log(`页面收到事件---id:${id}--enumId:${enumId}--value:${value}--completed:${completed}--showValue:${showValue}`)

    let toFindAttrs = this.data.attrs;
    if (enumId !== undefined) {
      let enumAttr = this.data.attrs.find(v => v.id == enumId)
      toFindAttrs = enumAttr.selectValue.reduce((preValue, curValue) => {
        let childList = []
        if (curValue.childList !== null && curValue.childList !== undefined && curValue.childList.length > 0) {
          childList = curValue.childList;
        }
        return [...preValue, ...childList]
      }, [])
    }

    let temp = toFindAttrs.find(v => v.id == id)
    temp.value = value
    temp.completed = completed
    if (showValue !== undefined && showValue !== null) {
      temp.showValue = showValue
    }
    console.log('onValueChange', id, value, completed, temp)
    let hasUncompletedAttr = this._hasUncompletedAttr(this.data.attrs)
    console.log('全部是否完成', !hasUncompletedAttr)
    this.setData({
      attrs: this.data.attrs,
      isAllAttrCompleted: !hasUncompletedAttr
    })
  },



  onSubmit: function (type) {
    console.log('提交资料', type)
    this._saveAttrs({
      saveType: 'all'
    });
  },

  async _saveAttrs({
    saveType
  }) { //temp,all
    let attrParams = [];
    this.data.attrs.forEach(attr => {
      if (this._attrCanSave(attr)) {
        attrParams.push(this._getParam(attr));
      }
      if (attr.attrType === 'enum' && attr.value !== undefined && attr.value !== null && attr.value !== '') {
        let subAttrs = attr.selectValue.find(selectItem => selectItem.value === attr.value).childList;
        if (subAttrs !== null && subAttrs !== undefined && subAttrs.length > 0) {
          subAttrs.forEach(subAttr => {
            if (this._attrCanSave(subAttr)) {
              attrParams.push(this._getParam(subAttr));
            }
          })
        }
      }
    })

    if (saveType === 'temp' && attrParams.length === 0) {
      return
    }
    const {
      code,
      data,
      desc
    } = await fetch(
      "bank.api.write.personal.userattrpersonalwriteservice.changeuserinfo", {
        params: {
          list: attrParams,
          parentId: this.data.parentId,
          parentType: this.data.parentType,
          productId: this.data.productId,
          batch: this.data.batch,
        },
        isLoading: saveType === 'all'
      },
    );
    console.log(`保存属性返回---code:${code}--desc:${desc}--data:`, data)
    if (code == 0) {
      if (saveType === 'all') {
        this.jump()
      }
    } else {
      let errorMsg = desc;
      if (data !== undefined && data !== null  && data.length > 0) {
        errorMsg = data[0].result;
      }
      wx.showToast({
        icon: 'none',
        title: errorMsg,
      })
    }
  },

  _initProtocolSelected(data) {
    let initSelected = false;
    if (data.protocols === null || data.protocols === undefined || data.protocols.length == 0) {
      initSelected = true;
    } else {
      for (const item of data.protocols) {
        if(item.defaultCheck == 1){
          return true;
        }
      }
    }
    return initSelected;
  },



})