// pages/apply/index/index.js
const fetch = require("../../../utils/fetch.js");
import {
  getLocation
} from "../../../utils/wx-api";

const app = getApp()
Page({

  options: {
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },

  data: {
    productId: '',
    productInfo: {},
    protocols:[],
    _term: 0,
    isWrite:false,
    _amount: 0,
    isAmountCorrect: true,
    isAllAttrCompleted: false,
    isSelected: false,
    showInput:true
  },

  onLoad: async function (options) {
    this.setData({ productId: options.productId });
    try {
      getLocation();
    } catch (e) {
      this.setData({ showLocationTips: true });
    }
  },

  onShow: async function () {
    const {
      code,
      data
    } = await fetch(
      "bank.api.read.personal.portalpersonalreadservice.productinfo", {
        productId: this.data.productId,
      }
    );
    if (code == 0) {
      app.globalData.phone = data.userPhone
      this.setData({
        productInfo: data,
        _term: data.maxLoanTerm,
        _amount: data.maxAmount,
        isAllAttrCompleted: !this._hasUncompletedAttr(data),
        isSelected: this._initProtocolSelected(data)
      });
    }
  },
  // 产品介绍跳转
  toproduct(){
    if(!this.data.productInfo.productDetailUrl){
      wx.showToast({
        title: '未获取到产品介绍相关地址',
        icon: 'none'
      })
      return
    }
    console.log(`/pages/web/index?url=${this.data.productInfo.productDetailUrl}`)
    let url = this.data.productInfo.productDetailUrl
    wx.navigateTo({
      url:`/pages/web/index?url=${encodeURIComponent(url)}`,
    })
  },
  onShowChange({detail}) {
    console.log(detail);
    let show = true;
    if (detail) {
      show = false;
    }
    this.setData({
      showInput:show
    })
  },

  onTermChange: function ({
    detail
  }) {
    this.setData({
      _term: detail,
    });
  },

  onAmountChange: function ({
    detail
  }) {
    this.setData({
      _amount: detail,
      isAmountCorrect: this._isAmountCorrect(detail),
    });
  },

  _isAmountCorrect(amount) {
    let isAmountCorrect = amount !== "" && amount >= this.data.productInfo.minAmount && amount <= this.data.productInfo.maxAmount;
    return isAmountCorrect;
  },

  _hasUncompletedAttr(data) {
    let hasUncompletedAttr = !!(data.attrCats
      .reduce((preValue, cValue) => {
        return [...preValue, ...cValue.subCats];
      }, [])
      .find((v) => v.mustFill == 1 && !v.completed));
    return hasUncompletedAttr;
  },

  _initProtocolSelected(data) {
    let initSelected = false;
    if (data.protocols === null || data.protocols === undefined || data.protocols.length == 0) {
      initSelected = true;
    }
    return initSelected;
  },

  changeSelect: function ({
    detail
  }) {
    this.setData({
      isSelected:detail
    })
  },

  onApply: async function () {
    if (!this.data.isSelected) {
      return wx.showToast({
        title: `请勾选协议`,
        icon: "none",
      });
    }
    if(!this.data.isWrite){
      wx.navigateTo({
        url: '/pages/write/index',
        events:{
        someSend:(data)=>{
            this.apply();
            this.setData({
                isWrite:true,
                isSelect:true,
                popShow:true
            })
          }
        }
      })
      return
    }
    this.apply();
  },



  apply: async function () {
    let {
      code,
      desc
    } = await fetch(
      "bank.api.write.loanapplywriteservice.loanapply", {
        "loanTerm": this.data._term,
        "loanAmount": this.data._amount,
        'productId': this.data.productId,
        'agreementSelected': 1
      }
    );
    if (code == 0) {
      wx.redirectTo({
        url: "/pages/apply/result/index",
      });
      return
    } 
    //10013 请先完成....
    if (code != 0 && code != -9 && code != 10013) {
      this.setData({
        showErrorPopup: true,
        errContent: desc,
      });
      return
    }
  },
  
 

});