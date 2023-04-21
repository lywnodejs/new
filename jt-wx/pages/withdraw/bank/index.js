const fetch = require("../../../utils/fetch.js");
Page({
  data: {
    list: [],
    allList: [],
    type: 1,
  },
  search: function (e) {
    let value = e.detail;
    let list = this.data.allList.filter((v) => {
      return v.bankName.indexOf(value) > -1;
    });
    if(value == ''){
      list = this.data.allList
    }
    this.setData({ list });
  },
  selectBank: function (e) {
    if (this.data.type == 0 || this.data.type == 2) {//2开通电子账户,换绑卡页面跳转过来
      return;
    }
    let index = e.currentTarget.dataset.index,
      pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let item = this.data.allList[index];
   
    item.bankName = item.bankName;
    item.bankShortName = item.cardNo;
    prevPage.setData({
      selectBank: item,
    });
    wx.navigateBack();
  },
  onLoad: async function ({ type,bindType }) {
    console.log(type,bindType)
    const { code, data } = await fetch(
      "bank.api.read.personal.seceleaccpersonalreadservice.querysupportlist",
      { params: {bindType:bindType == 3 ?'0':'1' }}
    );
    if (code === 0) {
      this.setData({
        list: data.supporList || [],
        allList: data.supporList || [],
        type,
      });
    }
  },
});
