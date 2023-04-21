// pages/my/secureCenter/detail/index.js
const fetch = require("../../../utils/fetch");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:true,
    popShow:false,
    isopen:'',
    iserror: false,
    isForget:false,
    passwordNumErr:false,
    errorText:'',
    status:0,
    detail:'',
    verifyCode:'',
    passworddesc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.featch()
    this.isElectronic()
  },
// 是否有电子账户
  async isElectronic (isLoading = true) {
    try {
      const {code, data} = await fetch('bank.api.read.personal.seceleaccpersonalreadservice.elecaccountinfo', {isLoading})
      if (code === 0) {
        //status 0： 未开通电子账户  ，1：已开通电子账户
        this.setData({
          state:data.status
        })
      
      }
    } catch (error) {
      console.log(error)
    }
  },
// 校验资金交易开启/关闭
  async featch(){
    try {
      const {code, data} = await fetch('bank.api.read.securitycenterservice.fundservicesisopen')
      if(code===0){
        if(data){
         this.setData({
          disabled:false
         })
        }
        this.setData({
          isopen:data
        })
      }
    } catch (error) {
      console.log(error)
    }
  },

  getValue(e){
    this.setData({
      disabled:e.detail.value.length===6? false : true,
      verifyCode:e.detail.value
    })
  },
  openPop(){
    let that = this
    if(this.data.disabled){return}
    wx.navigateTo({
      url: `/pages/withdraw/face/index?bizType=open_fund_services`,
      events:{
        result({data}){
          console.log(data);
          if(data){
            if(!that.data.isopen){
              if(that.data.state == '0'){
                that.toaccount()
              }
              that.setData({
                popShow:true
              })
              return
            }
            // 此处待补充开启交易管理时直接调接口的函数
            that.fundserviceschange()
          }
        }
      }
    })

  },

    // 数字键盘密码
    getCode({detail}){
      // 这里获取到密文
      this.setData({
        detail
      })
      // let thas = this;
      // setTimeout(function(){
      //   //错误提示
      /
      // },3000)
      // 确定交易密码正确后走关闭交易接口
     this.fundserviceschange()
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onSend() {
    this.fundserviceschange()
  },

  toaccount(){
    wx.showToast({
      title: "请先开通电子账户",
      icon: "none",
      success: (res) => {
        setTimeout(()=>{
          wx.navigateTo({
            url: '/packageB/pages/account/index/index',
          })
        },1500)
      }
    });
    return
  },

  toPassword(){
    this.setData({
      passwordNumErr:false
    })
    wx.navigateTo({
      url: '/packageB/pages/password/forget/index',
    })
  },
  onCloseServer(){
    this.setData({
      passwordNumErr:false
    })
  },
  
   async fundserviceschange(){
     // 校验是否开启电子账户
    if(this.data.status === 0){
       this.toaccount()
    }
     let authToken = wx.getStorageSync('authToken')
    try {
      const {code, data,desc} = await fetch('bank.api.read.securitycenterservice.fundserviceschange',{
        verifyCode:this.data.verifyCode,
        asePwd:'111111',
        authToken
      })
      if(code===0){
        wx.showToast({
          title: "操作成功",
          icon: "none",
          success: (res) => {
            setTimeout(()=>{
              wx.navigateBack()
            },1500)
          }
        });
      }
      if(code ===-70000){
        this.setData({
          popShow:false,
          passwordNumErr:true,
          passworddesc:desc
        })
        return
      }
      if(code===-11){
        this.setData({
          isError:true,
          errorText:desc,
          isForget:true
        })
        return 
      }

      if (code === -1 ) {
        wx.showToast({
          title: desc,
          icon:'none'
        })
        return
      }
    
      if (code === -10) {
        this.setData({show: true, isCountdown: true,isError:true})
        return 
      }
    } catch (error) {
      console.log(error)
    }
   
   },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})