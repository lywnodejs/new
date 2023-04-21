const fetch = require("../../../utils/fetch");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:{},
    moneyVal:'',
    expectRedeemAmount:'',
    verification:'',
    errorText:'',
    popShow:false,
    passwordNumErr:false,
    isError:false,
    isForget:false,
    passworddesc:''
  },
  // 手机验证码
  getValue(e){
      this.setData({
        verification:e.detail.value
      })
  },
  ok(){
    // 确定时校验验证码
    // wx.navigateTo({
    //   url: '/pages/deposit/redeemfail/index',
    // })
    this.setData({
      popShow:true
    })
  },
  // 数字键盘密码
  getCode({detail}){
    console.log(detail)
    // 这里获取到密文
    let thas = this;
    // setTimeout(function(){
    //   //错误提示
    //   thas.setData({
    //     isError:true,
    //     isForget:true,
    //     errorText:'错误信息'
    //   })
    // },3000)
    this.toRedemption()
  },
  // 提前赎回接口
  async toRedemption(){
    let { orderId } = this.data.order
    let {
      code,
      data
    } = await fetch("bank.api.write.standard.depositproductwriteservice.depositredemption",{
      userPwd:'111111',
      orderId,
      verifyCode:this.data.verification
    });
    if (code === 0) {
      wx.navigateTo({
        url: '/pages/deposit/redeemfail/index',
      })
    }
    this.setData({
      popShow:false
    })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
        order:options
     })
     this.calculatedAmount()
  },
  // 计算当前赎回金额的方法
  async calculatedAmount(){
    let { orderId } = this.data.order
    let {
      code,
      data
    } = await fetch("bank.api.read.homepageproductsservice.getrevenueamount",{
      orderId,
    });
    if (code === 0) {
      this.setData({
        expectRedeemAmount: data
      });
    }
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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