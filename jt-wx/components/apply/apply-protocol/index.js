// components/apply/apply-protocol/index.js
Component({

  properties: {
    isSelected: {
      type: Boolean,
      value: false
    },
    protocols: {
      type: Array,
      value: []
    }
  },


  data: {

  },


  methods: {
    changeSelect: function ({
      detail
    }) {
      this.setData({
        isSelected: detail,
      });
    },

    onProtocolClick: function (e) {
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: `/pages/web/index?url=${url}`
      });
    },
  }
})