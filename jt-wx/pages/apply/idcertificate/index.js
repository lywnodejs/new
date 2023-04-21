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
    attrs:[],
    type:0,
    bizType:null,
    redirect:''
  },


  onLoad: async function (options) {
    if(options.bizType){
      this.setData({
        bizType:options.bizType
      })
    }
    if (options.redirect) {
      let redirect = decodeURIComponent(options.redirect);
      this.setData({
        redirect
      })
    }
    try {
      const res = wx.getSystemInfoSync();
      this.setData({
        platform: res.platform,
        productId: options.productId,
        parentId: options.parentId,
        type:options.type ? options.type : 0,
        parentType: options.parentType,
        batch: options.batch !== "undefined" && options.batch !== undefined && options.batch !== null ? options.batch : null,
      });
    } catch (e) {
      console.log(e,2222);
    }
    // console.log(this.data);
    const url = this.data.type ==1? 'bank.api.read.personal.portalpersonalreadservice.openeleaccmaterialinfo': 'bank.api.read.personal.portalpersonalreadservice.materialinfo'
    const {
      code,
      data
    } = await fetch(
      url, {
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

      let idAttrs = attrs.filter(attr => {
        return attr.attrType === 'idCardFrontOcr' || attr.attrType === 'idCardBackOcr'
      })
      let liveAttr = attrs.find(attr => attr.attrType === 'livenessOcr')
      let allValidAttr = attrs.filter(attr => {
        return attr.attrType === 'idCardFrontOcr' || attr.attrType === 'idCardBackOcr' || attr.attrType === 'livenessOcr'
      })
      this.setData({
        cateInfo: data,
        initCompleted: data.completed,
        editFlag: data.editFlag,
        isAllAttrCompleted: data.completed,
        idAttrs,
        liveAttr,
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
      idAttrs:this.data.idAttrs,
      liveAttr:this.data.liveAttr,
      isAllAttrCompleted: !hasUncompletedAttr
    })
    if(!hasUncompletedAttr && !this.data.initCompleted){
      if(this.data.bizType){
        this.getauthToken()
        return 
      }
      this.jump()
    }
 
  },
  async getauthToken(){
    let {
      code,
      data
    } = await fetch(
      "bank.api.write.standard.userpersonwriteservice.getauthtoken", {
        isLoading:true,
        params:{
          bizType:this.data.bizType
        }
      }
    );
    if(code===0){
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
  },

  _saveAttrs({
    saveType
  }) { 

  }


})