// pages/account/index/index.js
const {require} = getApp()
const fetch = require('utils/fetch')
Page({

  /**
   * Page initial data
   * status 0 没电子帐户 1 有电子帐户
   */
  data: {
    isShow: false,
    isEmpty: false,
    triggered: false,
    bindCardVOList: {},
    popShow:false,
    isError:false,
    isForget:false,
    homeSecEleAccVO: {},
    errorText:'',
    deleteItem:null,
    passwordNumErr:false,
    maxCardAmount:0,
    goOpenButton:{},
    showOpenServices:false,
    passworddesc:''
  },

  toOpenServer(){
    this.onCloseServer();
    wx.navigateTo({
      url: '/packageB/pages/detail/index',
    })
  },
  onCloseServer(){
    this.setData({
      showOpenServices:false,
      passwordNumErr:false
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },
  toPassword(){
    this.setData({
      passwordNumErr:false
    })
    wx.navigateTo({
      url: '/packageB/pages/password/forget/index',
    })
  },
  toChangePassword(){
    wx.navigateTo({
      url: '/packageB/pages/password/change/index',
    })
  },

 async getCode({detail}){
    // 这里获取到密文
    try {
      let params = {
        id:this.data.deleteItem.id,
        password: '111111',  //detail,
      }
      const {code, desc} = await fetch('bank.api.read.personal.seceleaccpersonalreadservice.deletebankcard',{params,isLoading:false})
      // this.fetch()
      if(code ===-70000){
        this.setData({
          popShow:false,
          passwordNumErr:true,
          passworddesc:desc
        })
      }
      if(code ===-11){
        this.setData({
          isError:true,
          errorText:desc,
          isForget:true
        })
        return
      }
      if(code===0){
        wx.showToast({
          title: "删除成功",
          icon: "none"
        });
        this.setData({
          popShow:false,
        })
      }else{
        this.setData({
          popShow:false,
        })
        wx.showToast({
          title: desc,
          icon: "none"
        });
        
      }
    } catch (error) {
      console.log(error)
    }
  },
  deleteCard(e){
    let deleteItem = e.currentTarget.dataset.item;
    this.setData({
      deleteItem,
      popShow:true
    })
  },
  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.fetch()
  },

  async fetch (isLoading = true) {
    try {
      const {code, data} = await fetch('bank.api.read.personal.seceleaccpersonalreadservice.elecaccountinfo', {isLoading})
      let state = {triggered: false}
      if (code === 0) {
        state = {...state, ...data, isEmpty: data.status === 0}
      }
      this.setData(state)
      this._freshing = false
    } catch (error) {
      console.log(error)
    }
  },

  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    this.fetch(false)
  },

  onRestore(e) {
    console.log('onRestore:', e)
  },

  onAbort(e) {
    console.log('onAbort', e)
  },

  onClick({currentTarget: {dataset: {url}}}) {
    wx.navigateTo({
      url,
    })
  },

  async onOpen() {
    console.log(this.data);
    const {code, data} = await fetch('bank.api.read.personal.unifiedverifyreadservice.unifiedverify', {
      buttonCode: this.data.goOpenButton.code
    })
    if(code === -60){
      this.setData({
        showOpenServices:true,
      })
      return
    }
    //需要身份认证
    if (code === -80000) {
      delete data.desc
      this.openData = data
      return this.setData({isShow: true})
    } 
   
    wx.navigateTo({
      url: '/packageB/pages/form/index',
    })
  },
   
  onClose() {
    this.setData({isShow: false})
  },

  onDefine() {
    this.onClose()
    const {productId, parentId, parentType} = this.openData
    return wx.navigateTo({
      url: `/pages/apply/idcertificate/index?productId=${productId}&type=1&bizType=open_account&parentId=${parentId}&parentType=${parentType}&redirect=/packageB/pages/form/index`,
    })
    // return wx.navigateTo({
    //   url: `/pages/apply/idcertificate/index?type=1&bizType=open_account&redirect=/packageB/pages/form/index`,
    // })
  }
})