// pages/apply/contact/index.js
const fetch = require("../../../utils/fetch.js");
const attrBehavior = require('../attr-behavior/index')
const jumpBehavior = require('../jump-behavior/index')
Page({
  behaviors: [attrBehavior,jumpBehavior],
  data: {
    showStay: false,
    platform: "ios",
    initCompleted: true,
    isAllAttrCompleted: false,
    attrGroups: [],
    allContactAttrs: []
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
    this._getAttrs();
  },

  _getAttrs: async function () {
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
      data.attrGroups.forEach(attrGroup => {
        let selectedIndex = attrGroup.attrs.findIndex(
          (v) => v.completed
        );
        attrGroup.selectedIndex = selectedIndex;
      })
      let batch = this.data.batch;
      if (data.batch !== null && data.batch !== undefined && data.batch !== '') {
        batch = data.batch
      }

      let allContactAttrs = this._getAllContactAttrs(data.attrGroups);
      this.setData({
        cateInfo: data,
        initCompleted: data.completed,
        editFlag: data.editFlag,
        isAllAttrCompleted: data.completed,
        attrGroups: data.attrGroups,
        allContactAttrs,
        batch
      })
    }
  },

  onValueChange: function ({
    detail: {
      value,
      id,
      selectedIndex,
      completed,
      groupIndex,
    }
  }) {
    console.log('联系人页面收到联系人变化事件', `selectedIndex:${selectedIndex}`, `groupIndex:${groupIndex}`, `value:${value}`, `completed:${completed}`)
    let attrGroups = this.data.attrGroups;
    let curGroup = attrGroups[groupIndex]
    let curAttr = curGroup.attrs[selectedIndex];
    curGroup.selectedIndex = selectedIndex;
    curAttr.value = value;
    curAttr.completed = completed;
    this.setData({
      isAllAttrCompleted: this._isAllAttrCompleted(attrGroups)
    })
  },



  onHide: function () {
    this._saveAttrs({
      saveType: 'temp'
    });
  },

  onSubmit: function (type) {
    console.log('保存联系人', type)
    this._saveAttrs({
      saveType: 'all'
    });
  },

  async _saveAttrs({
    saveType
  }) { //temp,all
    let attrParams = [];
    this.data.allContactAttrs.forEach(attr => {
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


  _getAllContactAttrs(attrGroups) {
    let allContactAttrs = attrGroups.reduce((preValue, curValue) => {
      curValue.attrs.forEach(item => {
        item.productId = this.data.productId;
      })
      return [...preValue, ...curValue.attrs]
    }, []);
    return allContactAttrs
  },

  _isAllAttrCompleted(attrGroups) { //只判断当前所显示的属性是否全部完成
    for (const i in attrGroups) {
      let attrGroup = attrGroups[i]
      if (attrGroup.selectedIndex === -1 || !attrGroup.attrs[attrGroup.selectedIndex].completed) {
        return false;
      }
    }
    return true;
  },

});