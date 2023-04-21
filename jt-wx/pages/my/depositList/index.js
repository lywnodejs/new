const app = getApp();
const fetch = app.require("utils/fetch");
Page({

  /**
   * 页面的初始数据
   */
  data: {
        sumTimeDeposit:'',
        sumIncome:'',
        products:[],
        triggered:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.fetch()
  },

  async fetch() {
    try {
      const {
        code,
        data,
      } = await fetch("bank.api.read.homepageproductsservice.depositproductorder");
      if (code === 0) {
        let { sumTimeDeposit, sumIncome,products} = data
        this._freshing = false;
        this.setData({
          sumTimeDeposit,
          sumIncome,
          products,
          triggered:false
        })
      }
    } catch (error) {
      this._freshing = false;
      this.setData({
        triggered:false
      })
      console.log(error);
    }
  },
  // 下啦刷新
    onRefresh() {
      if (this._freshing) return;
      this._freshing = true;
      this.fetch(false);
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