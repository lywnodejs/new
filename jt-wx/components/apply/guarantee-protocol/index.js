// components/apply/guarantee-protocol/index.js
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
      let index = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: `/pages/apply/protocol/index?index=${index}`
      });
    },
  }
})
