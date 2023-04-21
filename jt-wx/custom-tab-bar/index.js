Component({
  data: {
    selected: 0,
    color: "#D1D0D0",
    selectedColor: "#FF2C43",
    list: [{
      "pagePath": "/pages/index/index",
      "text": "首页",
      "iconPath": "/image/icons/home.png",
      "selectedIconPath": "/image/icons/home_selected.png"
    }, {
      "pagePath": "/pages/order/index/index",
      "text": "订单",
      "iconPath": "/image/icons/order.png",
      "selectedIconPath": "/image/icons/order_selected.png"
    }, {
      "pagePath": "/pages/my/index/index",
      "text": "我的",
      "iconPath": "/image/icons/my.png",
      "selectedIconPath": "/image/icons/my_selected.png"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      // this.setData({
      //   selected: data.index
      // })
    }
  }
})